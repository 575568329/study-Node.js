# 最近一次学习记录

**最后更新**:2026-08-05（Day 20 MyBatis 与 Spring 事务协调）

## Day 20 学习记录（2026-08-05）

**主题**：MyBatis 与 Spring 事务协调（ThreadLocal 绑连接 / 嵌套事务 / rollback-only）

### 课前小测（pre-session-review）

7 题：**6 个 Again 全翻盘 + 1 个跨线 Good 🎉**
- Q1 Flex 等分：✅ **翻盘 A→G**（flex:1 basis 0 等分 + flex:auto 保留内容宽度）
- Q2 Node http：✅ **翻盘 A→G**（req 客户端→服务端 + res 服务端→客户端 + req.body 原生没有是 Express 处理）
- Q3 cluster：✅ **翻盘 A→G**（主进程真监听，worker 假监听，主进程分配）
- Q4 事务绑连接：✅ **翻盘 A→G（第 3 次终于过）**（填空"连接"✅，解释"不是同一个连接"✅，第二空应答"不是绑线程"）
- Q5 OGNL 陷阱：✅ **翻盘 A→G**（识别 0 当 false 陷阱 + 解法 `|| age==0` 可行，最优是 Integer 包装类）
- Q6 ResultMap：✅ **翻盘 A→G**（21 条 SQL = 1 + 20，N+1 的 N 对了 + collection 一对多）
- Q7 React Hooks：✅ Good（跨线抽查，依赖调用顺序 + if 导致顺序不一致）

**通过率 7/7**，昨天 6 个 Again 今天全收复。间隔复习起效，盲区清零。

### 学习成果

**Spring + MyBatis 事务协调三要素**：
- **ThreadLocal** — Spring 用它绑定 Connection 到当前线程（线程的"私有柜子"，互不干扰）
- **TransactionSynchronizationManager** — Spring 的资源管理器（存/取 Connection 的核心类）
- **MyBatis 集成** — MyBatis 执行 SQL 前先问 Spring："有事务吗？"，有就从 ThreadLocal 取 Connection

**完整流程**：
1. `@Transactional` 方法开始 → Spring AOP 拦截 → 从连接池拿 Connection → 存到 ThreadLocal → setAutoCommit(false)
2. Mapper 执行 SQL → MyBatis 问 Spring → Spring 从 ThreadLocal 取 → MyBatis 拿到同一个 Connection
3. 方法结束 → Spring AOP 拦截 → commit/rollback → 归还连接 → 清空 ThreadLocal

**嵌套事务（REQUIRED 默认传播行为）**：
- 内层方法检测到 ThreadLocal 里已有 Connection → 不开新事务，直接加入
- 3 条 SQL（外层 2 条 + 内层 1 条）用同一个 Connection
- 只有最外层方法才 commit/rollback，内层不 commit
- 对比自调用失效（Day 14）：跨类调用走代理 ✅，同类内部调用 this.method() 绕过代理 ❌

**异常回滚机制（rollback-only 坑点）**：
- 内层方法抛异常 → Spring 标记事务为 "rollback-only"
- 外层 catch 住异常继续执行 → 最后 Spring 检测到 rollback-only → 强制 rollback → 抛 UnexpectedRollbackException
- 结果：外层 catch 也阻止不了回滚（SQL 1/2/3 全部回滚）
- 设计理念：嵌套事务是整体，任何一部分出错整个都回滚，不允许部分提交
- REQUIRES_NEW 可开独立事务：挂起外层 Connection，开新 Connection → 内层异常只回滚内层，外层可继续提交

**事务传播行为对比**：
- **REQUIRED（默认）**：有事务加入，没事务开新 → 嵌套用同一个 Connection
- **REQUIRES_NEW**：挂起外层，开新事务 → 独立 Connection，内层失败不影响外层
- **SUPPORTS**：有事务加入，没事务非事务执行
- **NOT_SUPPORTED**：挂起外层，非事务执行

### 错题本

**理解检查 2 错误 🔴**
- 错误原文："不是，嵌套的用一个，另外单独执行的用一个"
- 正确：**嵌套事务默认 REQUIRED，3 条 SQL 都用同一个 Connection**
- 误解根源：没意识到内层方法会检测 ThreadLocal 里已有 Connection，直接复用
- 纠正：默认传播行为 REQUIRED = 加入已有事务，不开新事务

### 今日面试题沉淀（4 道）

1. Spring + MyBatis 怎么保证同一个事务内多条 SQL 用同一个 Connection？→ ThreadLocal 绑 Connection 到当前线程，MyBatis 从 ThreadLocal 取
2. 嵌套事务默认行为？→ REQUIRED，内层加入外层事务，用同一个 Connection，只有最外层 commit
3. 内层方法抛异常，外层 catch 住了，事务会回滚吗？→ 会，Spring 标记 rollback-only，外层 catch 也阻止不了，最终抛 UnexpectedRollbackException
4. REQUIRED vs REQUIRES_NEW？→ REQUIRED 共用 Connection（整体成功/失败），REQUIRES_NEW 独立 Connection（内层失败不影响外层）

### 遗留问题 / 下次计划

- 公司代码里找嵌套事务的实际用法（REQUIRED / REQUIRES_NEW 使用场景）
- MyBatis 剩余内容：一级/二级缓存实战、动态 SQL 高级用法
- Java 学习路径后续阶段规划

---

## 上次会话（存档）

**2026-08-04（Day 19 MyBatis 动态 UPDATE + 关联查询）**

---

## 学习内容

### `<set>` 标签（动态 UPDATE）
- 2 个智能行为：自动去掉最后一个逗号 / 条件全空时不加 SET（但会报错）
- 与 `<where>` 对称：`<where>` 去第一个 AND/OR，`<set>` 去最后一个逗号
- 使用场景判断：有可选字段用 `<set>`，全是必填/固定直接 SET

### OGNL 假值陷阱
- `test="status != null"` 传 `status=0` (int) → false
- OGNL 把 0/false/"" 当假值
- 解决：用包装类 Integer/Boolean
- 判空铁律：String 判 `!= null and != ''`，Integer/Boolean 只判 `!= null`

### ResultMap 关联查询
- 嵌套查询（Nested Select）：简单但 N+1 问题（N = 父记录数）
- 嵌套结果（Nested Results）：一条 JOIN SQL，笛卡尔积（10 用户 × 5 订单 = 50 行）
- LEFT JOIN 保留无子记录的父记录，INNER JOIN 过滤
- `<collection>` 一对多，`<association>` 一对一
