# Day 20 · MyBatis 与 Spring 事务协调

> **主题**：ThreadLocal 绑连接 / 嵌套事务 REQUIRED / rollback-only 异常回滚机制
> **日期**：2026-08-05 ｜ **JDK**：Java 8 ｜ **框架**：Spring + MyBatis
> **前置**：Day 14 @Transactional 事务、Day 18 SqlSession 机制

---

## 一、核心问题

Day 14 学了 `@Transactional`，Day 18 学了 MyBatis SqlSession。今天解决一个关键问题：

**`@Transactional` 方法里调了 3 个 Mapper（3 条 SQL），Spring 怎么保证它们用同一个 Connection？**

---

## 二、Spring + MyBatis 事务协调三要素

### 2.1 ThreadLocal（线程本地变量）

```java
// ThreadLocal = 线程的"私有柜子"
ThreadLocal<Connection> holder = new ThreadLocal<>();

// 线程 A
holder.set(connA);  // 存进 A 的柜子
holder.get();       // 从 A 的柜子取 → connA

// 线程 B
holder.set(connB);  // 存进 B 的柜子
holder.get();       // 从 B 的柜子取 → connB

// 两个线程的柜子互不干扰
```

**关键**：同一个线程内，多次 `get()` 取到同一个值。

### 2.2 TransactionSynchronizationManager（Spring 资源管理器）

```java
// Spring 内部核心类
public abstract class TransactionSynchronizationManager {
    // ThreadLocal：存当前事务的资源（Connection/SqlSession）
    private static final ThreadLocal<Map<Object, Object>> resources = 
        new ThreadLocal<>();
    
    // 存连接
    public static void bindResource(Object key, Object value) {
        Map<Object, Object> map = resources.get();
        if (map == null) {
            map = new HashMap<>();
            resources.set(map);
        }
        map.put(key, value);  // key=DataSource, value=Connection
    }
    
    // 取连接
    public static Object getResource(Object key) {
        Map<Object, Object> map = resources.get();
        return map != null ? map.get(key) : null;
    }
}
```

### 2.3 MyBatis 集成

MyBatis 执行 SQL 前先问 Spring："有事务吗？"

```java
// MyBatis 内部逻辑（简化）
Connection conn = TransactionSynchronizationManager.getResource(dataSource);
if (conn == null) {
    // 没事务，从连接池拿新连接
    conn = dataSource.getConnection();
} else {
    // 有事务，复用 Spring 管理的连接
}
```

---

## 三、完整执行流程

```
用户调用 orderService.createOrder(1, 100)
  ↓
【Step 1：开启事务】
Spring AOP @Transactional 切面拦截
  → dataSource.getConnection() → connA
  → connA.setAutoCommit(false)
  → TransactionSynchronizationManager.bindResource(dataSource, connA)
  ↓
【Step 2：执行业务方法】
orderMapper.insertOrder(1, 100)
  → MyBatis 问 Spring：getResource(dataSource)
  → 拿到 connA ✅
  → connA.prepareStatement("INSERT INTO orders ...")
  ↓
accountMapper.updateBalance(1, -100)
  → MyBatis 问 Spring：getResource(dataSource)
  → 拿到 connA ✅（同一个）
  → connA.prepareStatement("UPDATE account ...")
  ↓
orderMapper.insertLog(1, "created")
  → MyBatis 问 Spring：getResource(dataSource)
  → 拿到 connA ✅（还是同一个）
  ↓
【Step 3：提交事务】
方法正常结束
  → Spring AOP 切面
  → connA.commit()
  → connA.close()  // 归还连接到池
  → TransactionSynchronizationManager.unbindResource(dataSource)
```

---

## 四、嵌套事务（REQUIRED）

### 4.1 默认传播行为：REQUIRED

```java
@Service
public class OrderService {
    @Autowired
    private AccountService accountService;
    
    @Transactional
    public void createOrder(Long userId, BigDecimal amount) {
        orderMapper.insertOrder(userId, amount);  // SQL 1
        accountService.updateBalance(userId, -amount);  // 调另一个事务方法
        orderMapper.insertLog(userId, "created");  // SQL 3
    }
}

@Service
public class AccountService {
    @Transactional  // 默认 propagation = REQUIRED
    public void updateBalance(Long userId, BigDecimal amount) {
        accountMapper.updateBalance(userId, amount);  // SQL 2
    }
}
```

**REQUIRED 语义**：
- **有事务** → 加入当前事务（复用同一个 Connection）
- **没事务** → 开启新事务

### 4.2 执行流程

```
外层 createOrder() 开始
  → 拿 connA，存到 ThreadLocal
  → 执行 SQL 1（用 connA）
  ↓
调用 accountService.updateBalance()
  → Spring AOP 拦截内层方法
  → 检查：ThreadLocal 里有事务吗？
  → 有！（外层的 connA 还在）
  → 【不开新事务，复用 connA】✅
  → 执行 SQL 2（用 connA，同一个）
  → 内层方法结束（不 commit，交给外层）
  ↓
外层继续
  → 执行 SQL 3（用 connA）
  → 外层结束 → commit(connA)
```

**关键**：3 条 SQL 都用同一个 Connection。

---

## 五、异常回滚机制（rollback-only 坑点）

### 5.1 场景：内层抛异常，外层 catch 住

```java
@Transactional
public void createOrder() {
    orderMapper.insertOrder();  // SQL 1
    
    try {
        accountService.updateBalance();  // SQL 2，抛异常
    } catch (Exception e) {
        log.error("扣款失败", e);
    }
    
    orderMapper.insertLog();  // SQL 3
}

@Transactional
public void updateBalance() {
    accountMapper.updateBalance();
    throw new RuntimeException("余额不足");
}
```

### 5.2 执行流程

```
外层开启 connA
  → SQL 1 用 connA
  ↓
内层 updateBalance()
  → 复用 connA
  → SQL 2 用 connA
  → throw RuntimeException
  ↓
Spring AOP 拦截到内层异常
  → 【关键】标记事务为 "rollback-only"
  → 继续抛出异常
  ↓
外层 catch 住异常
  → log.error("扣款失败")
  → 继续执行 SQL 3（用 connA，执行了）
  ↓
外层正常结束
  → Spring AOP 准备 commit
  → 检查：事务被标记为 rollback-only
  → ❌ 不 commit，强制 rollback
  → 抛出 UnexpectedRollbackException
```

**结果**：
- SQL 1、SQL 2、SQL 3 **全部回滚**（虽然 SQL 3 执行了，但没提交）
- 外层抛 `UnexpectedRollbackException`（即使你 catch 了内层异常）

### 5.3 为什么外层 catch 了还是回滚？

**Spring 设计理念**：

> **嵌套事务（REQUIRED）是一个整体，只要任何一部分出错，整个事务都应该回滚，不允许部分提交。**

如果允许外层 commit，就会出现：
- SQL 1（订单）提交了
- SQL 2（扣款）失败回滚了
- SQL 3（日志）提交了

→ 数据不一致（订单创建了，但没扣款）

---

## 六、REQUIRED vs REQUIRES_NEW

### 6.1 REQUIRES_NEW（独立事务）

```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void updateBalance(Long userId, BigDecimal amount) {
    accountMapper.updateBalance(userId, amount);
    throw new RuntimeException("余额不足");
}
```

**执行流程**：
```
外层开启 connA
  → SQL 1 用 connA
  ↓
内层 REQUIRES_NEW
  → 挂起 connA（从 ThreadLocal 移除，暂存）
  → 开新事务 connB，存到 ThreadLocal
  → SQL 2 用 connB → 抛异常 → rollback(connB)
  → 恢复 connA 到 ThreadLocal
  ↓
外层 catch 住异常
  → SQL 3 用 connA
  → 外层结束 → commit(connA) ✅
```

**结果**：
- SQL 1、SQL 3 **提交成功** ✅
- SQL 2 **回滚** ✅

### 6.2 对比表

| 维度 | REQUIRED（默认） | REQUIRES_NEW |
|------|-----------------|--------------|
| 内层抛异常 | 整个事务 rollback-only | 只回滚内层，外层可 commit |
| 外层 catch 住 | 外层也会回滚（强制） | 外层可以继续提交 |
| Connection | 同一个 | 两个独立的 |
| 适用场景 | 业务必须整体成功 | 内层失败不影响外层（如日志） |

---

## 七、面试标准答案

> Spring 用 ThreadLocal 绑 Connection 到当前线程，MyBatis 执行 SQL 前从 ThreadLocal 取 Connection，保证同一事务内多条 SQL 用同一个连接。
>
> 嵌套事务默认 REQUIRED，内层加入外层事务，用同一个 Connection，只有最外层 commit。
>
> 内层抛异常时 Spring 标记 rollback-only，外层 catch 也阻止不了回滚，最终抛 UnexpectedRollbackException。REQUIRES_NEW 可开独立事务，内层失败不影响外层。

---

## 🤖 AI 时代视角

**被 AI 贬值**：
- `@Transactional` 注解写法
- 传播行为枚举查询

**AI 时代更值钱**：
- **ThreadLocal 原理理解**：为什么线程 A 取不到线程 B 的 Connection
- **rollback-only 判断**：为什么外层 catch 了还回滚
- **传播行为选型**：REQUIRED vs REQUIRES_NEW 的业务取舍
- **Debug 能力**："UnexpectedRollbackException 怎么排查"

**学在刀刃上**：
- 注解语法忘了问 AI
- ThreadLocal 机制 / rollback-only 坑点 → 面试必问，AI 替代不了

---

## 关联

- [[Day14-Spring事务-Transactional]] — @Transactional 基础、回滚规则、自调用失效
- [[Day18-MyBatis缓存机制]] — SqlSession 机制，今天的 Connection 协调基于此
- [[Day19-MyBatis动态UPDATE与关联查询]] — OGNL / ResultMap，今天的嵌套事务在关联查询里常遇到

## 下次

- 公司代码里找嵌套事务的实际用法
- MyBatis 剩余高级用法（批量操作 / 拦截器）
- 进入下一阶段（微服务 Dubbo / Spring Boot）
