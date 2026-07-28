# Day 14 - Spring 事务 @Transactional

**日期**：2026-07-28
**主题**：Week 4 Spring 进阶（声明式事务）
**⚠️ 状态**：验证 SOLO 单点(2/5)，多个 Again。核心缺口=AOP 代理机制没打通，下次需重学。

---

## 一、@Transactional 本质 = AOP 事务切面

手写事务的样板代码（Node.js 类比）：

```javascript
await conn.beginTransaction();   // 样板
try {
  await conn.query('UPDATE ... balance - 100');   // 业务
  await conn.query('UPDATE ... balance + 100');   // 业务
  await conn.commit();           // 样板
} catch (e) {
  await conn.rollback();         // 样板
}
```

Spring 用一个注解抽走所有样板：

```java
@Transactional
public void transfer(Long from, Long to, BigDecimal amount) {
    accountDao.decrease(from, amount);   // 只剩业务
    accountDao.increase(to, amount);
}
```

**背后是一个 @Around 切面**（TransactionInterceptor）：

```java
@Around("@annotation(Transactional)")
public Object invoke(ProceedingJoinPoint pjp) throws Throwable {
    开启事务();
    try {
        Object result = pjp.proceed();   // 执行业务
        提交事务();
        return result;
    } catch (RuntimeException e) {
        回滚事务();
        throw e;
    }
}
```

> **核心认知**：@Transactional 不是魔法，就是 Day13 学的 AOP。

---

## 二、回滚规则（面试高频坑）

| 异常类型 | 举例 | 默认回滚 |
|----------|------|:---:|
| RuntimeException | NPE、自定义 extends RuntimeException | ✅ |
| Error | OutOfMemoryError | ✅ |
| **Checked Exception** | IOException、SQLException | ❌ **不回滚** |

**为什么这么设计**：
- Unchecked（RuntimeException）= 非预期编程错误 → 回滚
- Checked = 可预期、可恢复的业务异常 → Spring 假设你自己处理，不回滚

**让所有异常都回滚**：
```java
@Transactional(rollbackFor = Exception.class)
```

---

## 三、三大事务失效场景

### ① 自调用失效（核心，与 AOP 自调用同根因）

```java
public void createOrder() {       // 无 @Transactional
    this.saveOrder();             // ❌ this 指向原始对象，绕过代理 → 事务不生效
}
@Transactional
public void saveOrder() { ... }
```

**原因**：Spring 容器存的是**代理对象**，`this` 是**原始对象**。`this.method()` 绕过代理 → 事务切面没触发。

**修法**：
```java
// 方案1：注入自己（拿到代理）
@Autowired private OrderService self;
self.saveOrder();

// 方案2：抽到独立 Bean（最常用）
@Autowired private OrderTxService txService;
txService.saveOrder();

// 方案3：AopContext
((OrderService) AopContext.currentProxy()).saveOrder();
```

### ② Checked 异常不回滚
见第二节，用 `rollbackFor = Exception.class`。

### ③ 异常被 catch 吞掉（公司代码印证）

```java
@Transactional(rollbackFor = Exception.class)
public int cleanupLogs(Date time) {
    try {
        int count = mapper.deleteBeforeTime(time);
        return count;
    } catch (Exception e) {
        logger.error("清理失败", e);
        throw new RuntimeException("清理失败", e);  // ← 必须 rethrow！
    }
}
```

**如果 catch 里只 log 不 throw**：异常被吞 → 切面以为成功 → commit → 该回滚的没回滚。

---

## 四、传播行为（Propagation）

方法 B 遇到"外面已有事务 A"时怎么办：

| 传播行为 | 外面有事务 | 通俗 |
|----------|-----------|------|
| **REQUIRED**（默认） | 加入当前事务 | 有就蹭，没有就建 |
| **REQUIRES_NEW** | 挂起当前，新建独立事务 | 无论如何自己开一个 |
| NESTED | 嵌套子事务（savepoint） | 设存档点 |

**REQUIRED vs REQUIRES_NEW 本质**：是不是同一个事务。
- REQUIRED：共用外层事务 → 外层回滚它必回滚（同生共死）
- REQUIRES_NEW：独立事务 → 互不影响

**场景**：
| 需求 | 传播行为 |
|------|----------|
| 扣库存失败 → 下单全回滚 | REQUIRED（默认） |
| 日志/短信保留，不受主流程失败影响 | REQUIRES_NEW |

---

## 五、@Service vs @Autowired

| | @Service | @Autowired |
|---|---|---|
| 贴在 | 类 | 字段/构造器/setter |
| 作用 | 登记 Bean（**存**） | 注入依赖（**取**） |
| 类比 | 入库 | 领货 |

`@Service` 是 `@Component` 家族之一（Controller/Service/Repository/Component 都是登记 Bean，语义分层）。

---

## 六、错题本

### 🔴 事务自调用（漏答，滑到 @After Advice）— 迁移失败
- 遇到事务题答成 AOP Advice → AOP 和事务没连起来
- 根因：Day13 AOP 代理机制没吃透

### 🔴 传播行为（先答错 @After）— 迁移失败
- 同上根因

### 回滚规则缺设计动机
- 记住"Checked 不回滚"，不知道为什么

---

## 七、下次学习计划（重学 AOP 代理）
**开半天专讲"代理对象 vs this"主线，小步子**：
1. 容器存代理对象，不存原始对象（画图）
2. 为什么 this.method() 绕过代理
3. 收口：AOP 自调用 = 事务自调用 = 同一个坑

地基稳后重验事务 Q3/Q4。
