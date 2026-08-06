# 最近一次学习记录

**最后更新**:2026-08-06（Day 21 Dubbo RPC 微服务入门 + 公司代码精读）

## Day 21 学习记录（2026-08-06）

**主题**：Dubbo RPC 原理（RPC vs HTTP / 三角关系 / 公司 XML 配置精读 / 重试与幂等）

### 课前小测（pre-session-review）

7 题：2 个 Good + 3 个 Hard + 1 个 Again + 1 个预测试
- Q1 React Hooks：⚠️ H（"Hook 不能在 if 里"规则对，但底层"数组按调用顺序存状态"没说）
- Q2 Maven 路径映射：✅ **翻盘 A→G**（`~/.m2/repository/mysql/mysql-connector-java/8.0.33/mysql-connector-java-8.0.33.jar` 全对，历史错 5+ 次终于稳）
- Q3 `<set>` + OGNL：⚠️ H（识别 age=0 被当 false，但没说修法是 Integer 包装类）
- Q4 WebSocket/SSE：⚠️ H（选型对 + Nginx 配置对，但生产 3 件事只答 1，漏自动重连/心跳保活）
- Q5 worker_threads：❌ A（"每个请求走一个连接"混淆线程/连接，"主进程监听分配"描述成了 cluster）
- Q6 宏任务 vs 微任务：✅ G（fs.readFile 宏任务 + Promise.then 微任务 + "微任务只有 then/nextTick 其他都宏任务"口诀对）
- Q7 Dubbo 预测试：✅ 直觉对（"内部走 RPC 不用 HTTP 握手"）

### 学习成果

**RPC 本质**：
- 目标：像调本地方法一样调远程服务（`userService.getUserById(1L)` 代码和本地一样）
- 底层：动态代理藏网络细节（和 MyBatis "没里子"同套路）→ 序列化方法名+参数 → Netty TCP 长连接 → 远程执行 → 结果序列化返回
- 序列化用 Hessian2/Protobuf（二进制紧凑），不是 JSON

**RPC vs HTTP**：
- 协议：二进制 vs 文本；连接：长连接 vs 短连接
- 服务发现：注册中心自动 vs 手动配 IP；负载均衡：框架内置 vs Nginx
- 场景：对内微服务 vs 对外前端/第三方

**Dubbo 三角关系**：
- Provider 注册（启动写 IP+Port 到 ZK）、Consumer 订阅（启动查地址缓存本地）、Registry（Zookeeper）
- ⚠️ 关键：ZK 只在**启动订阅 + 地址变化推送**时参与，**业务调用不查 ZK**（本地缓存地址 + 长连接），否则 ZK 成瓶颈

**公司代码精读（XML 配置，非注解）**：
- 公司 Spring 3.2.6 + 老 Dubbo（code.alibabatech.com）用 XML，不是 @Reference/@Service
- 四个标签分层：application（身份）/ registry（注册中心）/ consumer（消费默认）/ reference（引用具体服务）
- reference 覆盖 consumer（类似 CSS 优先级）：全局 timeout=3000，登录 reference 单独 6000
- 提供方：protocol 定端口 + service+ref 发布（interface 对外暴露，ref 指向本地 Spring Bean，职责分离）
- file="...registry.cache" 本地缓存文件 → ZK 挂了也能用缓存地址继续调用（印证"业务调用不查 ZK"）
- 多注册中心：主 ZK + 英语引擎 ZK + 语文引擎 ZK，AI 引擎 timeout=30000（算法计算慢）

**重试与幂等（🔴 重点）**：
- 公司全局 retries="0"（关重试），原因：重试导致重复执行，非幂等接口出事
- 幂等 = 同一操作执行 1 次和 N 次结果一样
- 查询接口幂等可重试；写接口（createOrder/扣款/发短信）非幂等，重试会重复执行（用户点一次产生 2 个订单）
- 公司有大量写操作（SendMessageService/SupplementalFeeService）→ 关重试是保守安全策略
- 连接 Day 8 Node 事务"rollback+throw 铁律"：写操作出错要让上层知道，不偷偷重试掩盖

**负载均衡 + 集群容错**：
- 负载均衡决定打哪台（默认 Random，还有 RoundRobin/LeastActive/ConsistentHash）
- 一台挂了两层保护：① ZK 心跳超时删节点推送新列表 ② Failover 容错重试其他机器
- 公司关了 retries，主要靠 ZK 推送 + 业务层处理

### 错题本

**错题 1：worker_threads 混淆线程/连接 🔴**
- 错误原文："相当于还是每个请求走了一个连接"
- 正确：是**线程**不是连接。每请求 new Worker → 线程数远超 CPU 核心 → 上下文切换开销 > 计算收益
- 正确方案：Worker 线程池（预建固定数=CPU 核心数，借出/归还，同 DB 连接池模式）
- 归类：概念混淆（线程 vs 连接，又一次术语混淆）

**错题 2：worker_threads 描述成 cluster 🔴**
- 错误原文："主进程监听端口，主进程负责一个内容处理，其他交给 worker，按核分配"
- 正确：这描述的是 **cluster 多进程**。worker_threads 是线程池，不是主进程分发 socket
- cluster = 多进程并发扩展（跑完整服务）；worker_threads = 线程级 CPU 密集计算

**错题 3：重试与幂等只答表层 🔴**
- 错误原文："避免长时间等待，错误直接暴露不重连"
- 正确：核心是**重试导致重复执行**，非幂等写接口会重复扣款/重复发短信
- 归类：盲区（幂等概念此前没接触）

### 今日面试题沉淀（4 道）

1. RPC 和 HTTP 区别？→ 二进制 vs 文本、长连接 vs 短连接、注册中心自动发现 vs 手配、对内 vs 对外
2. Dubbo 调用时 Zookeeper 参与吗？→ 不参与。ZK 只在启动订阅+地址变化推送时用，业务调用走本地缓存地址+长连接
3. 为什么写接口不能随便重试？→ 非幂等，重试会重复执行（重复下单/扣款/发短信），公司全局 retries=0
4. Dubbo 一台机器挂了怎么办？→ ① ZK 心跳删节点推送新列表 ② Failover 重试其他机器

### 遗留问题 / 下次计划

- 找 Controller 看怎么用注入的 Dubbo 服务（真实调用链）
- Zookeeper 注册中心原理深入
- 分布式事务（跨服务事务一致性，RPC 无法共享 Connection）
- 🔴 worker_threads 08-07 复查（线程 vs 连接、线程池 vs cluster）
- 🔴 React Hooks 08-08 复查（底层数组存状态机制）

---

## 上次会话（存档）

**2026-08-05（Day 20 MyBatis 与 Spring 事务协调）**

### Spring + MyBatis 事务协调三要素
- ThreadLocal 绑 Connection 到当前线程
- TransactionSynchronizationManager 存/取 Connection
- MyBatis 执行 SQL 前问 Spring："有事务吗？"

### 嵌套事务 REQUIRED
- 内层加入外层事务，用同一个 Connection，只有最外层 commit

### rollback-only 机制
- 内层异常标记 rollback-only，外层 catch 也阻止不了回滚，抛 UnexpectedRollbackException
- REQUIRES_NEW 可独立事务，内层失败不影响外层
