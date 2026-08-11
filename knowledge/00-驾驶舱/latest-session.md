# 最近一次学习记录

**最后更新**:2026-08-11（React 复习线 ⑤ useReducer / 自定义 Hook）

## 2026-08-11 学习记录（React 复习线 ⑤）

**主题**：useReducer / 自定义 Hook

### 课前小测（7 题）

距上次学习 5 天，队列几乎全部逾期。7 题：2 个预测试 + 3 个红标盲区 + 2 个抽查。

- Q1 useReducer 预测试：⬜ 全忘（预测试不扣分，正是今日新内容起点）
- Q2 自定义 Hook：❌ A（**真盲区**，两问全缺：不知道不共享 state、`use` 前缀给 lint 识别没答到位）
- Q3 worker_threads：⚠️ H（cluster 对比翻盘 A→H，但**线程池修法还是没说对** —— 又一次"记住错因没记住正解"）
- Q4 OGNL 假值陷阱：⚠️ H（诊断对，但**两处都改没形成条件反射**：Java 侧改 Integer + XML 侧删 `!= ''`）
- Q5 Dubbo 重试幂等：✅ **G（H→G 翻盘）**，抓到"重复写入"根因，幂等手段（幂等键/唯一索引/状态机）是新知识补上
- Q6 React Hooks 闭包：⚠️ H（根因对，但三处偏差：① 现象说错"没变化"实际是"卡在 1"；② 函数式更新写法错 `setCount(()=>{count+1})` 没接参数 + 没 return；③ "私有变量"应说"快照"）
- Q7 Dubbo 三角关系：⚠️ H（结论对但机制说不清：ZK 只在启动订阅+地址变化推送时参与，单次调用走本地缓存+长连接，没说清）

### 学习成果

**自定义 Hook（A→G 翻盘）**：

核心打通 3 点：
1. **复用的是逻辑，不是数据** — 每次调用产生独立 state（state 存在调用它的组件的 Fiber 节点上，不在 Hook 函数里）
2. **用闭包类比记住**：`const a = makeCounter(); const b = makeCounter()` → 两份独立 count，自定义 Hook 同理
3. **`use` 前缀给 ESLint 识别** — 检查"不能在 if 里调用"、"依赖数组完整性"，叫 `getUserData()` 就失效

**生产坑预告**：同一个 `useUserData()` 在 5 个组件里调 → 发 5 次请求（不共享）。这是 TanStack Query（⑨ 站）存在的理由。

**useReducer（从"全忘"到能写出来）**：

从痛点切入，先看散落的 7 个 useState 必漏的场景，再看 useReducer 怎么解。

核心打通 5 点：
1. **痛点是"一个动作动多个 state"** — 提交成功要清 6 个字段，散着写必漏；收进 reducer 的 `SUBMIT_SUCCESS: return initialState` 一行搞定，加 100 个字段也不会漏
2. **数据流**：`dispatch(动作) → React 调 reducer(旧state, 动作) → reducer 返回新state → React 用新state 重渲染`
3. **reducer 必须是纯函数 + 造新对象** — 改旧对象引用不变 → React 认为没变 → 不重渲染（和 ③ 站"不可变铁律"同根）
4. **switch 判断 `action.type`**（不是 `state.type`）— Q-I 手写时犯了这个错，现场纠正
5. **适用场景判断口诀**："一个用户动作要动几个 state？超过两个，就该考虑 useReducer"

**三个必须知道的点**：
- reducer 不能发请求、不能读 `Date.now()`（纯函数）
- `dispatch` 引用永远稳定 → 可以安心进依赖数组，部分绕开闭包陷阱
- 别滥用（`isModalOpen` 写成 reducer 是过度设计）

### 错题本

**错题 1：自定义 Hook 共享 state 误解 🔴**
- 错误原文："3，共用函数会互相影响"
- 正确：`<A/>` 和 `<B/>` 各调 `useCounter()`，点 A 三次，B 显示 0（互不影响）
- 根因：state 存在各组件的 Fiber 节点上，不在 Hook 函数里
- 挂钩：和闭包一样，`const a = makeCounter(); const b = makeCounter()` → 两份独立 count
- 归类：Vue 迁移惯性（Vue 的 `useUserStore()` 确实到处拿同一份，React 自定义 Hook 不是）

**错题 2：worker_threads 修法还是没说对 🔴**
- 第 2 问答："根据接口类型分配，该主进程的主进程执行，该 worker 的 worker 执行"
- 正确：**线程池** — 预先创建固定数量（≈ CPU 核心数）的 Worker，请求来了借一个，用完归还
- 这是 08-01 错题本里就写了的正解，今天还是没提 → **复盘只记错因不记正解**
- 挂钩：worker 池 = DB 连接池的线程版（都是"贵东西预建好，借出归还"）

**错题 3：OGNL 假值陷阱"两处都改"没形成反射 🔴**
- 答："定义为 Integer，或者在 XML 的 if 里把 0 的情况排除"
- 正确：**两处一起改** — Java 侧 `int` → `Integer`（否则默认值 0 判不出"没传"）+ XML 侧删掉 `age != ''`（数值类型只判 `!= null`）
- "把 0 排除"说反了，0 本来就被错误排除了，要做的是让 0 能进去
- 归类：连续三次 H/A，知道诊断不知道修法

**错题 4：React Hooks 闭包陷阱细节偏差 🔴**
- 现象说错："没有变化" → 正确：0→1 后卡住（第一次 `setCount(0+1)` 触发更新，之后 `setCount(1)` React 检测值没变不再重渲染）
- 函数式更新写法错：`setCount(()=>{count+1})` → 正确：`setCount(prev => prev + 1)`（从 React 手里拿最新值，不碰闭包变量）
- 术语偏差："成为了 useEffect 的私有变量" → 正确：**那次渲染的快照被闭包捕获**

**错题 5：useReducer 手写时 switch 判断写错 🔴**
- Q-I 手写时写成 `switch (state.type)` → 正确：`switch (action.type)`
- 后果：所有 case 不匹配 → 返回 `undefined` → React 报错 "Reducer must return a value"
- 归类：刚学新语法时肌肉记忆还没形成，做两个 reducer 就不会再错

### 今日面试题沉淀（3 道）

1. 自定义 Hook 在多个组件里调用，state 共享吗？→ 不共享。state 存在调用它的组件的 Fiber 节点上，每次调用产生独立 state。想共享数据用 Context/Zustand
2. 什么时候用 useReducer？→ 判断口诀：一个用户动作要动几个 state？超过两个就该考虑。典型场景：表单（多字段联动）、购物车（商品列表+总价+状态）
3. reducer 为什么必须造新对象？→ React 靠比引用判断变没变，改旧对象引用不变 → React 认为没变 → 不重渲染（和 useState 的"不可变铁律"同根）

### 遗留问题 / 下次计划

- ⑥ 受控 vs 非受控、虚拟DOM、Fiber（点到唤醒，不钻源码）
- 或跳到 ⑨ TanStack Query（服务端状态独占，2026 主流）
- 或继续 Java 线 Day 22（Zookeeper 注册中心原理 + Controller 里 Dubbo 真实调用链）
- 🔴 worker_threads 08-12 复查（线程池正解）
- 🔴 OGNL 假值 08-13 复查（两处都改条件反射）
- 🔴 React Hooks 闭包 08-13 复查（函数式更新写法）

---

## 上次会话（存档）

**2026-08-06（Day 21 Dubbo RPC 微服务入门 + 公司代码精读）**

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
