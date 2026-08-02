# 最近会话

**最后更新**:2026-08-02（复习线：Node 事件循环深化 - setTimeout/setImmediate 确定性）

## 2026-08-02 会话记录（前端复习线）

**主题**：Node 事件循环深化 - setTimeout/setImmediate 确定性规则

### 课前小测（7 题，4 个到期 + 3 个核心复查）

**宏微任务分类 ✅**：6 个任务正确分类（`nextTick`/`Promise.then` 是微，其他全宏）

**事件循环排序 ❌→✅**：
- 答案错误：`1 10 8 9 2 3 5 6 7 4`（正确：`1 10 8 9 2 7 3 5 6 4`）
- 两个理解漏洞：
  1. 以为 I/O 完成阻塞 setImmediate（实际：顶层 setImmediate 第一轮 check 就跑，不等 I/O）
  2. 不知注册位置决定 setTimeout/setImmediate 顺序
- **核心规则终于打通**：顶层注册看运气（1ms 阈值），I/O 回调里 setImmediate 必赢（poll→check 同轮）
- A→G（D 4.8→4.5，S 延 8 天 08-10）

**JWT 主动失效 ✅**：密钥轮换 + 状态管理 → Good

**CORS 预检 ✅**：OPTIONS 确认连接、避免浏览器拦截响应 → Good

**异步错误处理 ✅**：await 拉回同步 → Good

**数据库事务 ❌**：
- 答案只说"没回滚"（表层）
- **核心缺失：事务绑连接**（`pool.query` 每次可能拿不同连接，事务包不住）
- G→A（S 砍 1 天 08-03）

**BFC ❌**：
- 答对 4 点（定义/margin 合并/高度塌陷/触发方式）
- **缺失**：与浮动元素重叠、`display:flow-root` 专用触发、Flex 是 FFC 不是 BFC
- G→A（S 砍 1 天 08-03）

### 学习成果

**setTimeout vs setImmediate 确定性规则**（核心打通）：

| 场景 | 顺序 | 原因 |
|---|---|---|
| 顶层注册 | 不固定 | 取决于事件循环启动时 setTimeout 是否已到 1ms 阈值 |
| I/O 回调里注册 | setImmediate 必胜 | poll→check 同轮，setTimeout 要下轮 timers |
| 顶层 timer vs I/O 回调 | timer 通常先 | I/O 要等磁盘（ms 级），timer 第一轮就进队列 |

**口诀**：**顶层看运气，I/O 里 setImmediate 赢，I/O 回调等磁盘**

**注册位置决定论**（最关键的理解）：
- 关键不是"有没有 I/O"，是"在哪注册的"
- 顶层 setTimeout/setImmediate 和 I/O 回调是**两批任务**
- I/O 回调要等磁盘完成才进队列（ms 级），顶层 timer 脚本执行完就进队列（微秒级）

**验证代码**：
```js
const fs = require('node:fs')

setTimeout(() => console.log('A'), 0)
setImmediate(() => console.log('B'))

fs.readFile(__filename, () => {
  console.log('C')
  setTimeout(() => console.log('D'), 0)
  setImmediate(() => console.log('E'))
  process.nextTick(() => console.log('F'))
})

// 输出：A/B 顺序不固定，但都在 C 前面
// C 之后固定：F（微任务）→ E（check 阶段）→ D（下轮 timers）
```

**数据库事务绑连接**（补讲）：
```js
// ❌ 错误：pool.query 每次可能拿不同连接
await pool.query('BEGIN')
await pool.query('UPDATE ...', [1])  // 可能在连接 B
await pool.query('COMMIT')           // 可能在连接 C

// ✅ 正确：先捞连接，全程用它
const conn = await pool.getConnection()
try {
  await conn.beginTransaction()
  const [r1] = await conn.query('UPDATE ... WHERE id = ? AND balance >= 100', [1])
  if (r1.affectedRows === 0) throw new Error('余额不足')
  const [r2] = await conn.query('UPDATE ... WHERE id = ?', [2])
  if (r2.affectedRows === 0) throw new Error('账户不存在')
  await conn.commit()
} catch (err) {
  await conn.rollback()
  throw err
} finally {
  conn.release()
}
```

**两个要点**：
1. **同一个 conn 贯穿 begin/query/commit/rollback**
2. **查不到要自己抛**（`affectedRows === 0` 不报错，得检查）

**BFC 完整触发条件**（补讲）：
- 标准 BFC：`overflow` 非 visible / `float` 非 none / `position: absolute/fixed` / `display: inline-block/table-cell/flow-root`
- **`display: flow-root`** 是专门为"只要 BFC 不要副作用"设计的
- `display: flex` 严格说创建的是 **FFC**（flex formatting context），不是 BFC

### 错题本

🔴 **事件循环排序理解漏洞**（已攻克）：
- 误以为 I/O 存在会改变 setTimeout/setImmediate 顺序
- 正确：**注册位置决定论** > I/O 存在论
- 顶层注册的 timer 和 I/O 回调是两批任务，不互相等待

🔴 **数据库事务绑连接**（08-03 复查）：
- 反复只答到"没回滚"，漏掉核心：`pool.query` 每次可能不同连接
- Spring `@Transactional` 把连接绑 ThreadLocal，所以看起来"不用管连接"
- Node 没这层魔法，得手动 `getConnection()` 贯穿始终

🔴 **BFC 触发条件不完整**（08-03 复查）：
- 忘记 `display: flow-root` 专用方案
- 混淆 BFC 和 FFC（Flex 不是 BFC）

### 复习线进度

**Node.js**：⏳ 11/？（事件循环 ✅、模块化 ✅、Stream ✅、中间件 ✅、JWT ✅、CORS ✅、异步错误 ✅、数据库 ✅、原生 http ✅、cluster ✅、**事件循环深化 ✅**）
**下一主题**：SSE 流式响应 / worker_threads / Express 深入

### 明日复查（08-03）

- 🔴 数据库事务绑连接（S=1）
- 🔴 BFC 触发条件（S=1，重点 `flow-root`）
- `flex: 1` = `flex-grow:1` + `flex-shrink:1` + **`flex-basis:0%`**
- 等分关键在 `basis: 0%`：先归零初始宽度，整个容器都变"剩余空间"，再 1:1:1 分
- 对比 `flex: auto`（`1 1 auto`）：先按内容撑开，只分多出来的空间 → **不等分**

### 🤖 AI 时代视角

- **AI 能做**：data/end 收集样板、cluster 样板、PM2 配置、curl 命令
- **AI 替代不了**：
  - 判断"这东西能不能放内存"（单机正常、多进程数据乱，AI 不会提醒）
  - 排查中文乱码根因（**AI 生成的 `body += chunk` 恰恰是错的**）
  - 决策进程数、`cluster`(I/O) vs `worker_threads`(CPU) 选型
  - 协议层 bug 成因（漏 `end()` / 两次 `end()` / `writeHead` 时序）

### 今日面试题沉淀（3 道）

1. `express.json()` 里面做了什么？→ 监听 data/end 收流 + Buffer.concat + JSON.parse + 挂 req.body + 失败返 400
2. Node 单线程怎么利用多核？→ cluster 起 N 进程，主进程 listen 并 IPC 分发 socket，**worker 不共享内存所以状态外置 Redis**
3. 为什么不能 `body += chunk`？→ 中文 UTF-8 占 3 字节，切在 chunk 边界前半截解码成乱码

### 遗留 / 下次计划

- 🔴 **08-02 必测宏任务/微任务边界**（新 KP，Again，第 4 次变体）
- 08-04 确认 Maven 路径映射（第 6 次，稳了就放长线）
- 08-05 Flex 含义/等分原理复查
- Node 复习线剩余候选：`res` 流式响应（大文件下载/SSE）、`worker_threads` CPU 密集、Express 深入

---

## 上次会话（存档）

**最后更新**:2026-07-31（Day 17 MyBatis 动态 SQL + 安全）

## Day 17 学习记录（2026-07-31）

**主题**：MyBatis 动态 SQL（`<if>`/`<where>`/`<choose>`）+ `#{}` vs `${}`（SQL 注入防御）

### 课前小测（pre-session-review）

3 题（精准打击高优先级盲区）：
- Q1 Maven 路径映射：⚠️ **第 4 次错，但接近了**（框架全对：groupId每个点一层+artifactId层+version层+文件名格式，但 artifactId 截断 `mysql-connector-java` → `mysql-connector`）→ H，明天（08-01）必测
- Q2 Promise 手写思路：✅ 核心全对（状态机/回调队列/链式调用/值穿透）→ A→G
- Q3 MyBatis vs AOP 代理：❌ 答偏到用途，漏了"有里子/没里子"核心 → A

### 学习成果

**动态 SQL 三大标签（条件查询场景）**：

**`<if>` 条件拼接**：
- `test` 判空：`name != null and name != ''`（两个条件都要，空字符串 `""` 不是 `null`）
- 条件成立拼进去，不成立跳过

**`<where>` 智能 WHERE**：
- 去掉 `WHERE 1=1` hack
- 自动去掉**第一个** AND（只管开头，不管中间）
- 所有 `<if>` 都不成立 → 不加 `WHERE`（查全部合法）

**`<choose>`/`<when>`/`<otherwise>`**：
- XML 版 `if-else if-else`
- 第一个 `<when>` 成立就执行，后面全跳过
- 都不成立 → 走 `<otherwise>` 默认

**核心理解**：这些不是 SQL 关键字，是 MyBatis 发明的"XML 拼 SQL 工具"，最终生成标准 SQL。

**`#{}` vs `${}`（安全红线）**：

**`#{}` 预编译占位符**（默认用这个）：
- 生成：`WHERE name = ?`（占位符）
- **SQL 结构固定，参数只能是值**（不能变成代码）→ 防注入

**`${}` 字符串拼接**（危险，极少用）：
- 生成：`WHERE name = '${name}'`（参数直接拼进 SQL）
- 黑客注入：`name = "' OR '1'='1"` → SQL：`WHERE name = '' OR '1'='1'`（查出所有用户）
- 更危险：`name = "'; DELETE FROM user; --"` → 删库
- **只用于表名/列名**（SQL 语法不支持 `ORDER BY ?`）

**白名单校验**：
- `${}` 用于表名/列名时，**必须白名单**验证：`Arrays.asList("id", "name").contains(column)`
- 否则仍有注入风险

**公司代码实战**：发现 `LIMIT ${...}` 历史遗留注入风险，更安全写法是 Java 里算好 offset，XML 用 `#{}`。

### 错题本

**错题 1：Maven 路径映射（第 4 次）⚠️**
- 错误：`~/.m2/repository/com/mysql/mysql-connector/...`（artifactId 截断丢了 `-java`）
- 正确：`~/.m2/repository/com/mysql/mysql-connector-java/8.0.28/mysql-connector-java-8.0.28.jar`
- **进步**：框架全对，只是 artifactId 没完整拷贝
- **根因**：路径映射是字面映射，一个字母都不能动
- 08-01 必测

**错题 2：MyBatis vs AOP 代理** → 答偏到用途，正确是"AOP 代理有里子（包装真实 Bean）；MyBatis 代理没里子（接口无实现）"

**错题 3：`<where>` 去 AND 时机** → 只去开头的 AND，不去中间的

### 今日面试题沉淀（3 道）

1. `#{}` vs `${}`？→ `#{}` 预编译防注入（默认），`${}` 字符串拼接有风险（表名/列名且必须白名单）
2. 为什么 `#{}` 能防 SQL 注入？→ 预编译让 SQL 结构固定，参数只能是值，不能变成代码
3. `<where>` 标签做什么？→ 智能 WHERE：去第一个 AND、空条件不加 WHERE

### 遗留问题 / 下次计划

- 🔴 **08-01 必测 Maven 路径映射**（第 5 次机会）
- MyBatis：一级/二级缓存、`<set>` 标签（动态 UPDATE）
- SQL 基础系统过一遍

---

## 上次会话（存档）

**最后更新**:2026-07-30（课前小测 + Node.js 异步错误处理）

## 2026-07-30 会话记录

**主题**：课前小测（07-30）+ 前端复习线 - Node.js 异步错误处理

### 课前小测（pre-session-review）

7 题：**1 个核心错误 + 1 个重要转机**
- Q1 Promise 手写回调执行时机：🔴 **核心错误**（答 A 认为同步执行，实际应进微任务队列）→ A，D 升到 6.0，S 砍到 1，07-31 紧急复查
- Q2 Maven 路径映射：✅ **重要转机**（从连续 A→G→A 摇摆中首次稳定答对）→ G，D 降到 6.8，S 升到 2，08-01 到期需巩固
- Q3 1px 边框：✅ 正确（DPR + transform 方案完整）
- Q4 Node 事件循环：✅ 正确（I/O 上下文中 setImmediate 快）
- Q5 URL 映射拼接：✅ 正确（`/api/user/profile`）
- Q6 Maven 本地仓库机制：✅ 正确（A+B 本地模块 + 远程依赖）
- Q7 MyBatis 作用预测：✅ 正确（解决原生 SQL 写法麻烦）

### 诊断与建议

**⚠️ 核心问题 - Promise 手写（D=6.0, S=1, 明天 07-31 到期）**：
- **问题根源**：混淆"状态同步改变"和"回调异步执行"
- **错误认知**：认为 `.then()` 回调在 `resolve()` 时同步执行
- **正确机制**：Promise 规范要求所有 `.then()` 回调必须进入微任务队列（即使 `resolve` 时已经注册）
- **补救方式**：重写 Promise，重点测试"resolve 时已有 then 注册"场景，用 `queueMicrotask` 或 `setTimeout(fn, 0)` 包裹回调执行

**✅ 重要转机 - Maven 路径映射（D=6.8, S=2, 08-01 到期）**：
- 从连续 A→G→A 摇摆中首次稳定答对 `groupId/artifactId/version`
- 仍需实操巩固：在 `~/.m2/repository/` 找 3 个依赖用手指头点进去验证路径结构

### 主线学习：Node.js 异步错误处理 ✅

**核心机制**：
- try-catch 是【同步作用域守卫】,只在调用栈展开瞬间有效
- Promise reject 是微任务,调用栈清空后才触发 → try-catch 接不住
- `await` 把异步错误【拉回同步语境】,try-catch 重新生效
- 少一个 `await` = 幽灵 bug(本地兜底不报错,生产丢数据)

**两大兜底钩子**：
- `unhandledRejection`：管 Promise 链漏掉的 `.catch()`(进程存活)
- `uncaughtException`：管同步/定时器回调的 throw(默认崩溃退出)
- 兜底后应 `process.exit(1)`：非0退出码触发 PM2/K8s 重启干净进程

**Express 错误处理**：
- Express 4.x 只捕获同步 throw,async 错误需 `asyncHandler` 包装 `Promise.resolve(fn).catch(next)`
- Express 5.x 原生支持

**对比 Java**：
- `uncaughtException` ≈ `Thread.setDefaultUncaughtExceptionHandler`
- 全局兜底 ≈ `@RestControllerAdvice`(Java 能恢复返回响应,Node 兜底不能)

**演示代码**：`code-examples/nodejs/async-error-demo.js`(4 个演示 + 2 个兜底钩子,执行顺序直观证明同步先跑异步后到)

**🤖 AI 时代视角**：
- AI 能做：写 asyncHandler 包装器、生成 try-catch 样板、补 `.catch(next)`
- 人类不可替代：判断"错误该不该兜底"(架构决策)、排查"忘 await 幽灵 bug"、设计全局错误处理策略(日志/告警/优雅关闭/事务回滚)

### 今日面试题沉淀（异步错误处理 3 道）
1. 为什么 try-catch 捕获不到 Promise 错误?→ 同步守卫 vs 微任务时序,await 拉回
2. `unhandledRejection` vs `uncaughtException`?→ Promise链漏catch vs 同步/定时器throw,兜底后 exit(1)
3. Express 4.x 为何捕获不到 async 错误?→ async 抛错变游离 Promise,用 asyncHandler 包装转 next

### 主线学习（第二个）：Node.js 数据库操作 ✅

**连接池**：
- 建连接昂贵(TCP握手+认证+资源分配,几十~几百ms),执行SQL仅~1ms → 别每次挖井喝水
- 池化 = 预建N个连接,借了归还、归还再借(release≠end,归还非关闭)
- 池满策略：waitForConnections(排队) / queueLimit(限队长) / false(快速失败)
- ⚠️ queueLimit:0 无限排队是雪崩温床(DB慢→连接占住→队列爆→服务卡死)

**事务**：
- 原子性：多条SQL打包,commit全成/rollback全撤
- ⚠️ 事务绑连接：必须 getConnection() 固定连接全程用,pool.query() 每次借不同连接→事务失效
- 铁律：begin→SQL→commit,catch里必须 rollback+throw,finally里 release
- catch吞异常 = 数据不一致(没rollback) + 上层误判成功(没throw)

**对比 Java**：
- @Transactional = 动态代理(AOP)自动插入 begin/commit/rollback
- 失效场景：①catch吞异常②同类内部调用③非public(回扣Day14盲区)
- Java连接池映射：max-active≈connectionLimit,max-wait≈acquireTimeout(Spring自动管,Node手动createPool)

**实战判断题**：找出 catch 只 console.log 不 rollback+throw 的 bug（三知识点交汇：吞异常+连接归还+事务回滚）

**🤖 AI 时代视角**：
- AI能做：生成池配置模板、事务样板、CRUD SQL
- 人类不可替代：判断 connectionLimit 大小(QPS/DB承载权衡)、排查连接泄漏/雪崩、决定catch处理策略(rollback+throw vs 补偿事务)

### 今日面试题沉淀（数据库操作 3 道）
1. 为什么用连接池?→ 建连接昂贵(握手+认证+资源),池化复用避免重复开销
2. 事务为何必须同一连接?→ 事务状态绑连接,pool.query借不同连接则事务失效
3. @Transactional 底层做了什么/为何失效?→ AOP代理自动begin/commit/rollback,吞异常/内部调用/非public 失效

### 本次会话遗留 / 下次计划（总）

**紧急复查(FSRS 到期)**：
- 🔴 07-31：Promise 手写回调时机(今天异步错误处理已间接巩固,仍需亲手重写验证)
- 🔴 08-01：Maven 路径映射实操(~/.m2/repository/ 找 3 依赖点进去)

**数据库操作可深入(留待下次/按需)**：
- ORM 对比(Sequelize/Prisma vs 原生 mysql2)
- 事务隔离级别(读未提交/读已提交/可重复读/串行化 + 脏读/幻读)
- N+1 查询问题
- 预处理语句 `?` 占位符防 SQL 注入(今天代码用了但没深讲)

**前端复习线进度**：Node.js 已完成 8 主题(事件循环/模块化/Stream/中间件/JWT/CORS/异步错误处理/数据库操作),下一候选:HTTP 模块 / Express 深入 / 进程与集群

---

### 【历史存档】Day 16 MyBatis 入门（同为 07-30，Java 线）

### 学习成果

**MyBatis 本质（对比纯 JDBC）**：
- 解决 JDBC 4 大痛点：样板代码多、SQL 散落、手动映射、资源泄漏
- 三大核心：SQL 外置化（XML）+ 自动映射（ResultSet→对象）+ 动态代理
- Node.js 类比：JDBC ≈ mysql2 原始 API，MyBatis ≈ Knex.js/Prisma

**Mapper 接口 + XML 绑定机制**（Q2 之前答偏，本次打通）：
- `namespace` = 接口全限定名，`id` = 方法名
- 拼成唯一 **Statement ID**（`com.xxx.UserMapper.findById`）= MyBatis 内部 `Map<String, MappedStatement>` 的 key
- 调方法 → 代理拼 key → 查 SQL → 执行

**动态代理再现（继 Spring AOP 后）**：
- MyBatis 用 JDK 动态代理生成接口代理对象（$Proxy）
- **核心区别**：MyBatis 代理"**没里子**"（接口无实现，代理即全部执行逻辑），Spring AOP 代理"**有里子**"（包装真实 Bean，proceed 调原方法）
- 记忆锚点：AOP 代理=保安（前后检查，放你进去办事），MyBatis 代理=外卖员（你说要啥，它自己跑腿，后厨不存在）
- 底层同技术：Spring 事务/AOP、MyBatis Mapper、Dubbo RPC 全是动态代理

**@Param 参数命名**：
- Java 编译丢参数名（变 arg0/arg1）→ 多参数时 MyBatis 找不到 `#{taskId}`
- `@Param("taskId")` 手动贴标签补回来（多参数必写）

**resultMap vs resultType**：
- `resultType`：简单类型（Integer/String）或列名=属性名的自动映射
- `resultMap`：自定义映射（列名≠属性名如 task_id→taskId、嵌套对象、`<id>` 标主键）

**动态 SQL foreach 批量插入**：
- 一条 SQL 插多行 `VALUES (...),(...),(...)`，**非多次插入**（性能铁律）
- Node 等价：Knex `insert([...])` / mysql2 `VALUES ?` 二维数组

**公司代码实战**：
- 精读 `TopicRecordMapper`（接口 6 方法 + XML 6 SQL 一一对应）
- `<sql>`+`<include>` 复用列名片段（DRY）
- 🐛 发现 bug：`delByTaskId` 里 `delete *` 语法错误（标准 DELETE 不带 *）→ 标记未改（遵守"不顺手重构"原则）

### 错题本

**错题 1：Maven 路径映射（高信心错误第 3 次）🔴**
- 错误原文：`m2/repository/org/mybatis/3.5.9/mybatis:3.5.9`
- 两处错：① 漏了 artifactId `mybatis` 那一层文件夹 ② 文件名写成 `mybatis:3.5.9`（冒号是坐标分隔符，不进路径）
- 正确：`~/.m2/repository/org/mybatis/mybatis/3.5.9/mybatis-3.5.9.jar`
- 强化锚点：groupId 每个点一层 + artifactId 一层 + version 一层 + 文件名 `artifactId-version.jar`
- 归类：**持续高信心错误**（Day11/Day14/Day16 三次），07-31 紧急复查

**错题 2：MyBatis 代理"不干预执行"说反了**
- 错误原文：Q3 答"不干预执行过程，只是提供接口的查询内容"
- 正确：MyBatis 代理恰恰是**全部执行过程**（自己查 SQL、执行、映射）；Spring AOP 才是"不干预核心，前后包一层"
- 归类：概念混淆（已用"有里子/没里子"图示纠正）

**错题 3：批量插入措辞"多次插入"**
- 错误原文：Q3 对比 Node 时说"进行多次插入"
- 正确：`<foreach>` 是一条 SQL 插多行，非多次插入（性能差 N 倍）
- 归类：措辞不精确（本质理解对）

### 今日面试题沉淀（3 道）

1. Mapper 接口无实现类为何能注入调用？→ JDK 动态代理，namespace.方法名 定位 SQL
2. `#{}` vs `${}`？→ `#{}` 预编译防注入（默认用），`${}` 字符串拼接有注入风险
3. resultMap vs resultType 选择？→ 复杂/自定义映射用 resultMap，简单类型用 resultType

### 教学/协作产出（本次重要）

- **AI 时代视角固化**：应用户要求，"🤖 AI 时代视角"板块规范从 memory 迁入根 `CLAUDE.md`「会话追踪」开头（跨设备权威来源），每个知识点总结末尾必带
- **Memory 跨设备备份**：memory 全量镜像到仓库 `docs/claude-memory/`（含 README 说明同步机制），解决换设备丢失问题；CLAUDE.md 加同步约定

### 遗留问题 / 下次计划

- 🔴 **07-31 紧急复查 Maven 路径映射**（高信心错误第 3 次）
- MyBatis 下一步：`#{}` vs `${}` 深入（SQL 注入原理）、动态 SQL `<if>`/`<where>`/`<choose>`、一级/二级缓存、Spring 事务与 MyBatis 协调
- 公司代码 `delete *` bug 待确认是否被调用

---

## 上次会话（存档）

**2026-07-29（Node.js 复习：JWT + CORS）**

## Day 15 学习记录（2026-07-29）

**主题**：Node.js 复习 - JWT 认证 + CORS 跨域

### 课前小测（pre-session-review）

9 题：**3 个重要翻盘** 🎉
- Q3 Node 事件循环：✅ 翻盘（连续 2 次 Hard 后终于全对）→ H→G
- Q6 @Transactional 回滚规则：✅ 翻盘（Day14 盲区）→ H→G
- Q5 Maven 依赖调解：✅ 翻盘（**高信心错误第 3 次终于纠正**）→ A→G
- Q1/Q2 JWT/CORS（预测试）：不知道（正常，新内容）
- Q4/Q7/Q8/Q9（Spring IoC/DI/@RequestMapping）：全对

### 学习成果

**JWT 认证（Q5）**：
- **Session vs JWT 对比**：Session 服务端存状态（跨服务器/存储压力/跨域问题）→ JWT 无状态（签名防篡改）
- **三段结构**：Header.Payload.Signature（base64url 编码）
- **签名机制**：HMAC-SHA256(Header+Payload, secret) → 签名非加密，是防篡改
- **双 token 机制**：Access Token 短期（15分钟）+ Refresh Token 长期（7天），过期刷新无感
- **主动失效难题**：JWT 无状态 → 退出登录/改密后 token 仍有效 → 4 种解法：
  1. 黑名单（Redis 存失效 token）
  2. 短过期（降低风险窗口）
  3. 版本号（Payload 加 tokenVersion，改密时递增）
  4. 密钥轮换（定期换 secret，旧 token 自然失效）
- **手写实现**：从零实现 sign/verify 函数，深度理解 base64url 编码、HMAC 签名、验证流程
- **Debug 2 处**：base64url 二次编码错误、throw 语法错误

**CORS 跨域（Q6）**：
- **为什么存在**：浏览器同源策略防 CSRF 攻击 → 跨域请求需服务器明确允许
- **简单请求 vs 预检请求**：
  - 简单请求：GET/POST/HEAD + 简单头 + Content-Type 仅 3 种 → 直接发送
  - 预检请求：PUT/DELETE/PATCH / Content-Type: application/json / 自定义头（Authorization）→ 先 OPTIONS 预检
- **记忆锚点**："简单请求 = 1995年HTML表单能发的请求；比表单高级的都要预检"
- **OPTIONS 方法**：浏览器自动发起的预检请求（非开发者手动）
- **CORS 配置**：
  - `*`（全部允许，仅静态资源）
  - 单域名（`Access-Control-Allow-Origin: http://example.com`）
  - 白名单数组（遍历 origin 匹配）
- **实战观察**：跨源测试页面 + 后端 OPTIONS 路由 → 看到完整预检流程（OPTIONS 204 + DELETE 200）
- **Debug 1 处**：OPTIONS 路径 `/api/users` 匹配不上 DELETE `/api/users/:id` → 改为 `/api/users/:id`

### 错题本

**错题 1：Node 事件循环阶段（连续 2 次 Hard 后纠正）**
- 错误原文：多次混淆 timers/poll/check 阶段、nextTick 位置
- 正确：timers → poll → check，nextTick 在每阶段之间，setImmediate 在 check 阶段
- 归类：概念模糊（已通过课前小测巩固）

**错题 2：事务回滚规则（Day14 盲区）**
- 错误原文：Day14 验证时只记住规则，说不清"为什么 Checked 不回滚"
- 正确：Spring 认为 Checked = 可恢复业务异常（不回滚），RuntimeException = 编程错误（回滚）
- 归类：概念模糊（今天课前小测纠正）

**错误 3：Maven 依赖调解（高信心错误第 3 次终于纠正）**🎉
- 错误原文：Day11 认为"层级更低"，Day13 认为"B1.0 层级更低"，Day14 又错
- 正确：**最近者优先**（距离根最近）— A→B(v1.0) 距离 1，A→C→B(v2.0) 距离 2，选 v1.0
- 归类：持续高信心错误，今天终于彻底纠正

**编码错误 1：base64url 二次编码**
- 错误原文：`const signature = base64url(crypto.createHmac(...).digest('base64'))`
- 问题：digest('base64') 已返回 base64，base64url() 内部再调 toString('base64') → 二次编码
- 正确：手动 replace：`.digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')`

**编码错误 2：throw 语法错误**
- 错误原文：`return throws('鉴权不通过')`
- 问题：JavaScript 用 `throw` 不是 `throws`，且应 throw Error 对象
- 正确：`throw new Error('鉴权不通过：token 被篡改')`

### 技能验证成果

- ✅ 手写 JWT sign/verify 实现（从零理解 HMAC 签名）
- ✅ 实战观察 CORS 预检请求（跨源页面 + 后端 OPTIONS 路由）
- ✅ Debug 并修复 OPTIONS 路径匹配问题（/:id 参数）
- ✅ 完成 Node.js 讲稿 Q5（JWT）+ Q6（CORS）章节

### 遗留问题 / 下次计划

- Node.js 复习线下一主题：异步错误处理 / HTTP / Express / 数据库
- JWT/CORS 已沉淀到讲稿，待后续面试前默写巩固

---

## Day 14 学习记录（2026-07-28）

**主题**：Spring 事务 @Transactional

### 课前小测（pre-session-review）

7 题：**昨天两个盲区全部翻盘** 🎉
- Q3 Maven 依赖调解：✅ 翻盘（连错 2 次后终于对"就近原则"）→ A→G
- Q4 BeanPostProcessor：✅ 翻盘（昨天只记 after，今天两钩子都对）→ H→G
- Q5 dependencyManagement / Q6 @Around proceed / Q7 z-index 失效：全对
- Q1/Q2 @Transactional 预测试：不知道（正常，新内容）

### 学习成果

- **@Transactional 本质**：Spring 内置的 @Around 事务切面（begin→proceed→commit/rollback），由 TransactionInterceptor 实现
- **回滚规则**：RuntimeException/Error 默认回滚；**Checked 异常默认不回滚**（Spring 认为可预期）；`rollbackFor = Exception.class` 全回滚
- **事务自调用失效**：`this.method()` 绕过代理 → 事务不生效（和 Day13 AOP 自调用同根因）；修法：注入 self / 抽独立 Bean / AopContext
- **传播行为**：REQUIRED（共用事务，同生共死）vs REQUIRES_NEW（挂起外层，独立事务，互不影响）
- **@Service vs @Autowired**：@Service 存（登记 Bean），@Autowired 取（注入依赖）
- **公司代码印证**：SensitiveViewAuditLogServiceImpl.cleanupLogs（rollbackFor + catch 里重新抛 RuntimeException 防止异常被吞）、135 个文件用 @Transactional、多数带 `value="transactionManagerCrowdsourced"` 指定事务管理器

### ⚠️ 验证结果（诚实记录：不理想）

**SOLO：单点结构（2/5）｜ FSRS：多个 Again**

| 题 | 判定 | 问题 |
|----|------|------|
| Q1 回滚规则 | 部分正确 60% | 记住规则，没答"Spring 为什么区分 Checked/Unchecked" |
| Q2 catch 吞异常 | 部分正确 70% | 会修，说不清"切面→异常传播→回滚"因果链 |
| Q3 事务自调用 | ❌ 漏答 | 滑到 @After Advice，核心考点没打通 |
| Q4 传播行为 | 先答错 @After，提示后答对 REQUIRES_NEW | 同样滑到 AOP Advice |

### 错题本

**错题 1：事务自调用失效（漏答，滑到 @After Advice）**🔴 迁移失败
- 错误原文：Q3 问事务自调用，答成"@after 因为他最后执行"
- 误解分析：把"事务问题"答成了"AOP Advice 时机"——AOP 和事务在脑中是两块，没连起来
- 正确：this.method() 绕过代理对象 → 事务切面没触发 → 不生效；同 Day13 AOP 自调用
- 归类：**迁移失败**（Day13 AOP 代理机制没吃透，无法迁移到事务场景）

**错题 2：传播行为混淆 Advice（先答错）**🔴 迁移失败
- 错误原文：Q4 问传播行为，先答"@after"，提示后才答对 REQUIRES_NEW
- 正确：短信独立于下单事务用 REQUIRES_NEW（挂起外层开新事务，互不影响）
- 归类：迁移失败（同错题1根因）

**错题 3：回滚规则缺设计动机**
- 错误原文：只说"IOException 默认必须处理"
- 正确补充：Spring 认为 Checked = 可恢复业务异常（不回滚），RuntimeException = 编程错误（回滚）
- 归类：概念模糊（记规则不记因果）

### 核心诊断

**今天验证印证了 Day13 AOP 学得虚（认知过载导致）**。Q3/Q4 需要用到"AOP 代理 + 自调用"，正是昨天没学透的部分，在它上面盖事务就塌了。→ AOP 代理机制 KP 降级 Again，成最高优先级重学。

### 教学方法调整（本次重要产出）

用户主动反馈 Day13"概念太多一次塞太满"。查证认知科学（工作记忆 3-4 chunk / Chunking / Worked Examples 均 🟢 强证据）后，新增 memory `feedback-cognitive-load-chunking`：
1. 单次新概念控制 1-2 个，讲透再走
2. 每块讲完显式问"继续还是消化"
3. 先代码/场景，术语最后贴标签
4. 深水区拆到独立 Day

### 遗留问题 / 下次计划

- **下次开半天专讲"代理对象 vs this"主线**（小步子）：① 容器存代理不存原始对象 → ② 为什么 this.method 绕过代理 → ③ 收口 AOP 自调用 = 事务自调用同一个坑
- 地基稳后，重验事务 Q3/Q4
- 回滚规则的"设计动机"补上

---

## Day 13 学习记录（2026-07-27）

**主题**：Spring AOP（面向切面编程）+ Bean 生命周期

### 课前小测（pre-session-review）

7 题结果：
- Q1 AOP（预测试）：不知道 → 正常，新内容
- Q2 Bean 生命周期（预测试）：用 Vue 生命周期类比 → 方向对但不同
- Q3 Maven 依赖调解：🔴 **高信心错误重犯**（"B1.0 层级更低"→ 正确是"最近者优先"）
- Q4 @RequestMapping URL：✅ 全对
- Q5 Node 事件循环：✅ 核心对
- Q6 Maven 本地仓库：✅ Day11 纠正成功
- Q7 this 绑定优先级：✅ 全对

### 学习成果

**AOP 核心（5 术语 → Express 中间件类比）**：
- Aspect（切面类）→ Pointcut（execution/@annotation 表达式）→ Advice（5 种时机）→ JoinPoint（被切的方法）→ Weaving（运行时动态代理）
- 5 种 Advice：@Before / @AfterReturning / @AfterThrowing / @After / @Around
- @Around 独有能力：控制 proceed() 调用（短路）+ 改参数 + 改返回值
- Pointcut 两种写法：execution（按包/类/方法名匹配）vs @annotation（注解驱动，更灵活）

**Bean 生命周期（10 步）**：
- 实例化 → 属性填充 → Aware 回调 → BPP.before → @PostConstruct → BPP.after（**AOP 代理在这里生成**）→ 就绪 → @PreDestroy → 销毁
- ⚠️ BPP 有 before + after 两个钩子，课后只记得 after（不对称认知）

**公司代码实战**：
- `LimitFrequencyAspect`：@Before + Guava RateLimiter + @annotation 驱动，IP/账号/方法维度限流
- `HttpSensitiveAspect`：@Around + RSA 解密入参 + 执行原方法 + 掩码脱敏出参 + Token 机制
- 掩码原理：正则捕获组保留头尾，中间换星号（手机号 138****5678）

**技能验证**：
- 写出 `@RateLimit` 注解 + `RateLimitAspect`（先 @Around 后改写 @Before + RateLimitException + @ControllerAdvice）
- code-reviewer 发现 3 高严重度 bug：
  1. computeIfAbsent key 只有 IP（不同 rate 的方法互相覆盖）→ 已修正为 `IP:方法名`
  2. return null 触发原始类型拆箱 NPE → @Before 方案间接解决
  3. String.isBlank() 是 Java 11 API，公司 JDK 8 不兼容 → **未修**
- interviewer 5 道追问：Q1-Q3/Q5 过关，Q4 部分（JDK vs CGLIB 没解释 Spring Boot 2.0 为什么改默认）

### 错题本

**错题 1：Maven 依赖调解规则（高信心错误重犯）**🔴
- 错误原文："B1.0，因为 B1.0 层级更低"
- 误解分析：把"距离根最近"理解成"层级更低"；Day 11 已错过一次，今天又错
- 正确：**最近者优先**——A→B(v1.0) 距离 1，A→C→B(v2.0) 距离 2，选 v1.0
- 归类：概念模糊（持续 2 次，标 Again，最高优先级复习）

**错题 2：BeanPostProcessor 只记 after 漏 before**
- 错误原文："BeanPostProcessor 是后置钩子的时候执行"
- 正确：BPP 有两个方法——postProcessBeforeInitialization（@PostConstruct 前）+ postProcessAfterInitialization（@PostConstruct 后，AOP 在这里）
- 归类：概念模糊

**错题 3：@After 与 @AfterReturning 时序混淆**
- 错误原文：把 @After 和 @AfterReturning/@AfterThrowing 放在同一层级
- 正确：@After 在 @AfterReturning / @AfterThrowing **之后**执行（真 finally 位置）
- 归类：概念模糊

**错题 4：isBlank() Java 版本不兼容（未自检）**
- code-reviewer 指出后仍未修正
- 归类：API 版本意识（Java 8 vs 11），需下次验证

### 遗留问题

- `isBlank()` Java 8 兼容修正（未修）
- `RateLimitException` 自定义异常类（未写出完整代码）
- Q4 JDK vs CGLIB 深度（Spring Boot 2.0 为什么改默认、private 方法失效）
- `@After` 时序概念已理解但未固化

### 下次学习计划

- Spring AOP 深入：JDK 动态代理 vs CGLIB 源码级理解、自调用陷阱验证
- 或 Spring 事务（@Transactional 与 AOP 的关系）
- 优先复习：Maven 依赖调解（Again，最高优先级）

---


## 当前上下文

- 项目:`study-Node.js`(学习/求职准备工作区)
- **主线**:Java 全栈学习(2026-07-14 从 Node.js 转向 Java)
- 原因:公司后端技术栈是 Java(传统 SSM + Dubbo 微服务)
- 目标:能读懂、维护、参与公司后端代码,最终具备真全栈能力
- 时间窗口:约 1 个月后面临裁员风险
- 学习策略:**稳扎稳打、理解原理、能讲清楚为什么**(不速成)

## 公司技术栈分析

### 后端架构
- **框架**:Spring 3.2.6(传统 SSM,非 Spring Boot),XML 配置为主
- **RPC 框架**:Dubbo + Zookeeper
- **ORM**:MyBatis(推测)
- **数据库**:MySQL + MongoDB
- **缓存**:Redis(Redisson)
- **JDK**:Java 8
- **构建工具**:Maven 多模块

### 项目结构
```
crowdsourced-new/          # 服务层(service / impl)
crowdsourced-new-web/      # Web 层(Controller)
crowdsourced-new-api/      # API 定义
```
典型分布式微服务,模块按 API/Service/Impl 分层,Dubbo 做服务调用。

## 学习进度(Week 1)

### Day 1(2026-07-14)
- ✅ 环境搭建:JDK 8 Corretto 1.8.0_492 + IDEA
- ✅ Hello World + 编译执行理解
- ✅ 基本类型、流程控制、类型转换
- ⚠️ 已纠正:"if 必须是 boolean 类型"、`byte` 是二进制数据、`Double` 是包装类

### Day 2(2026-07-15)
- ✅ 方法定义与重载(方法签名)
- ✅ 数组与 ArrayList(固定 vs 动态)
- ✅ 基本类型与包装类(Integer/Character 命名)、自动装箱/拆箱
- 📝 笔记:`Day2-方法与数组.md`

### Day 3(2026-07-16)
- ✅ 类与对象、构造方法 vs 普通方法
- ✅ 封装:private + getter/setter + 校验
- ✅ main 入口、包与 import
- 📝 笔记:`Day3-类与对象封装.md`

### Day 4(2026-07-17)
- ✅ 继承(extends)、super 两个作用
- ✅ 方法重写(@Override)、重写 vs 重载、两同两小一大
- ✅ 多态(向上转型、编译看左运行看右)、feedAll 实战
- 📝 笔记:`Day4-继承与多态.md`

### Day 5(2026-07-18)
- ✅ 接口(interface)+ 抽象类(abstract class)
- ✅ 抽象类 vs 接口对照(is-a vs can-do)
- ✅ 面向接口编程(Service/Impl 分层 = 公司风格)
- ✅ 集合框架:泛型、List、Map、Set(全部对标 JS Array/Object/Set)
- ✅ 实战:`testList` 包(UserService 接口 + UserServiceImpl 实现,Map 存储)
- 📝 笔记:`Day5-接口抽象类与集合框架.md`

**Day 5 课前小测成果**(5 题,关键纠正):
- 🔴 **高信心错误纠正**:`AnimalServiceImpl s = new AnimalServiceImpl()` 误以为"不能跑"→ 实际能跑,区别在面向接口 vs 面向实现
- 🔴 **Day1 易错点重犯**:字符串 `==` vs `equals`(Map 版 UserService 已修正)
- ✅ 多态/抽象类不能 new(Q5 全对)
- ✅ 抽象类 vs 接口选择(Q4 全对,口诀:is-a 抽象类 / can-do 接口)

### Day 6(2026-07-19)
- ✅ 异常体系:Throwable → Error / Exception;Checked vs Unchecked(JS 没有的核心概念)
- ✅ try-catch-finally(对比 JS:Java 按类型多 catch,JS 一个 catch 接所有)
- ✅ throw(动作)vs throws(声明,JS 没有);处理 Checked 两方式
- ✅ 自定义异常(`UserNotFoundException extends RuntimeException`)
- ✅ 实战:`testList` 的 `findByName` 从"返回 null"改造成"抛异常",Main try-catch 接住
- 📝 笔记:`Day6-异常处理.md`

**Day 6 复习 + 理解题成果**(纠正 + 答疑):
- 🔴 **高信心错误纠正**:Checked 异常不处理 → 误以为"能编译运行时报错",实际**编译就过不了**(这是 Checked 名字的由来)
- 💡 答疑:错误类型**不用全记**(记分类逻辑 + 6 个高频);工作中**很少手写异常类**(项目建几个 BusinessException 基类复用,`@ControllerAdvice` 全局接,日常只 `throw new`)
- ✅ catch 顺序、异常 vs null 的取舍,已理解

### Day 7(2026-07-20)⭐ 本次会话 - Week 2 启动
- ✅ **读公司代码**:精读 HelpCenterController(63行样本)+ PaperServiceImpl 异常处理
  - 分层隔离:Controller 看不到 Dao(CLAUDE.md"禁止跨层调用")
  - 统一返回:JsonResultHaveObj<{code,message,result}>
  - 异常实战:throw new ELPBizException + try-catch 包装 + @ControllerAdvice 全局接
- ✅ **Stream API**(Week 2 核心):4 步 stream→filter/map→collect,对标 JS 链式
- ✅ **惰性求值**:中间操作(filter/map/peek)不执行,终端操作(collect/findFirst/forEach)才触发
- ✅ **短路终端**:findFirst 找到就停,效率等同 for 循环(踩坑:peek 不打印)
- ✅ **groupingBy 分组**:一行实现分组,公司超常用(分+计/分+取属性)
- ✅ **Optional**:优雅解决 null,对标 JS `?.`/`??`;已用过的 findFirst 返回值就是 Optional
- ✅ **toString 重写**:解决 `User@30dae81` 打印问题(Object 三大方法:equals/toString/hashCode)
- ✅ 实战:UserServiceImpl 串联 OOP/接口/异常/Stream/Optional/Map,达企业级水准
- 📝 笔记:`Day7-读公司代码与Stream-API.md`

**Day 7 学习成果**:
- 💡 自主发现惰性求值陷阱:"Stream 版 filter 是不是多查询了?" → 深入理解惰性+短路
- 💡 自主踩坑 peek 不打印 → 巩固惰性求值理解
- ✅ JS→Java 映射能力极强(filter/map/groupingBy/Optional 一学就会)
- ✅ UserServiceImpl 已是企业级水准(findByName 用 orElseThrow、findNameById 用 orElse)

## 盲区清单(待巩固)

| 优先级 | 盲区 | 状态 |
|--------|------|------|
| **P0** | 字符串比较 `==` vs `equals` | 🔴 Day5 重犯,已纠正,需固化 |
| **P0** | 接口引用 vs 实现类引用("能不能跑") | 🔴 高信心错误,已纠正 |
| **P0** | `findByName` 找不到应返回 null(非 list[0]) | 🔴 逻辑 bug,已修正 |
| **P0** | Checked 异常不处理 = 编译错误(非运行时) | 🔴 Day6 高信心错误,已纠正 |
| **P1** | `printf` 第一参数是格式字符串(`%s`/`%d`/`%n`) | 🟡 已理解 |
| ~~P1~~ | ~~泛型的意义(类型安全/免强转)~~ | ✅ 已掌握 |
| **P2** | 接口运行时能力(DI / 动态分派) | ⚪ 待 Spring 阶段验证 |

## 下一步学习

### Week 1 剩余(接近收官)
- [x] **异常处理**:try-catch / throw / throws / 自定义异常(Day 6 完成)
- [x] **读公司代码**:HelpCenterController + PaperServiceImpl 异常处理(Day 7 完成)
- [ ] 输出《Java vs Node.js 语法对比.md》
- [ ] 周末总结:能讲清 Java 面向对象与 TS 的区别

### Week 2:Java 核心 API
- [x] **Stream API**(Day 7 启动):stream/filter/map/collect 三大核心已掌握
- [ ] Stream 进阶:forEach/count/sorted/reduce + Optional(findFirst/orElseThrow)
- [ ] 日期时间(LocalDate/DateTimeFormatter)
- [ ] 字符串操作(String/StringBuilder)
- [ ] 文件 I/O(Files/Path)

## Day 7(2026-07-20)⭐ 本次会话 - Week 2 启动
- ✅ **读公司代码**:HelpCenterController(63行精简Controller)
  - 看懂 @Controller/@RequestMapping/@Resource/@ResponseBody
  - 理解 JsonResultHaveObj 统一返回结构
  - 理解分层隔离(Controller 不见 Dao)
  - 理解 if(null != x) 空指针防御
- ✅ **公司异常处理**:PaperServiceImpl 的 throw new ELPBizException
  - 校验失败抛业务异常(带上下文)
  - try-catch 包装异常(技术异常→业务异常)
  - **全局异常处理器** @ControllerAdvice 统一接(业务代码只 throw,不用到处 try-catch)
- ✅ **Stream API**:三大核心 stream/filter/map/collect
  - 对比 JS array.filter().map(),几乎一一对应
  - 方法引用简写 User::getName
  - 实战:testList Main 里 filter+map+collect 一行搞定
- ✅ **惰性求值 + 短路终端**:中间操作不执行,终端操作才触发;findFirst 找到就停
  - 踩坑:peek 不打印(中间操作),正确用 forEach
  - 自主发现:"Stream 版 filter 是不是多查询了?" → 深入理解惰性+短路
- ✅ **groupingBy 分组**:一行实现分组(基础/分组计数/分组取属性),公司超常用
- ✅ **Optional**:优雅解决 null,对标 JS `?.`/`??`
  - map 链式取值 / orElse 默认 / orElseThrow 抛异常 / ifPresent 有值才执行
  - 已用过的 findFirst 返回值就是 Optional
- ✅ **toString 重写**:解决 `User@30dae81` 打印问题(Object 三大方法)
- ✅ 实战:UserServiceImpl 串联 OOP/接口/异常/Stream/Optional/Map,达企业级水准
- 📝 笔记:`Day7-读公司代码与Stream-API.md`

**Day 7 理解题成果**:
- ✅ Q1 为什么用接口类型(解耦)— 完全答对
- ⚠️ Q2 List泛型作用 — 方向对,补充"类型安全+免强转"
- ✅ Q3 null防御(避免NPE)— 理解正确
- ✅ Stream 对比 JS filter/map — JS基础扎实,Java 对应快
- ✅ peek vs forEach(惰性) — 小测全对
- ✅ Optional 练习(findNameById) — 一次写对

## 理解质量评估(累计)

| 阶段 | 评价 |
|------|------|
| Day 1-2 基础语法 | ✅ 优秀 |
| Day 3 面向对象/封装 | ✅ 优秀 |
| Day 4 继承/多态 | ✅ 优秀 |
| Day 5 接口/抽象类/集合 | ✅ 优秀(课前小测纠正了 2 个高价值盲区) |
| Day 6 异常处理 | ✅ 优秀(纠正 Checked 编译错误的高信心误解,理解了公司异常工作流) |
| Day 7 Stream/Optional/读公司代码 | ✅ 优秀(自主发现惰性求值陷阱,UserServiceImpl 达企业级水准) |

**学习态度**:主动思考、深入提问、善于对比 JS、能自我总结、纠正后立刻应用(testList 从 List 改 Map 版,equals/判空一次到位)。

## 运维技能优先级

- **P0**(70% 时间):Java + Spring + MyBatis + MySQL + RESTful + Git
- **P1**(20% 时间):Linux(30 命令)、Docker、CI/CD 概念
- **P2**(10% 时间):K8s(可选,入职后再学)

## 验收标准(每阶段自测)

- 第 3 周:能读懂公司 Controller、解释集合框架设计、对比 Java vs Node.js 类型系统
- 第 7 周:读懂 Spring 配置、解释 IoC/DI/AOP、画接口调用链
- 第 10 周:读懂 MyBatis Mapper、写动态 SQL、解释事务传播
- 第 14 周:读懂 Dubbo 配置、解释 RPC、画微服务架构图
- 第 17 周:Linux 部署 Java 应用、Docker 容器化、排查线上问题
- 第 21 周:完整 Java 项目(简历)、讲清技术选型、答 20+ 面试追问

## 学习节奏

- 工作日 4-5h:上午学新概念 → 下午读公司代码 → 晚上写代码+笔记
- 周六集中做 demo,周日上午复习+输出总结

## 笔记位置

- `Java/Day1~Day5-*.md`(主笔记)
- `Java/INDEX.md`(导航)
- 代码:`projects/java/HelloWorld/src/test/com/fjyu/edu/`(animal / studyInterface / testList)

## 原有学习线(暂缓)

- RAG 项目体检 / 面试资产:暂缓
- Node.js 全栈复习:已完成基础,暂停
- 组件库 / 简历优化:待 Java 阶段四后重启

---

**当前状态**:Week 3 Day 11 完成(Maven 多模块项目),已理解父子继承与模块间依赖机制

---

## Day 11 学习记录(2026-07-24)

**主题**:Maven 多模块项目 - 父子继承与模块间依赖

### 课前复习（pre-session-review）

**5 题小测结果**:
1. Maven 本地仓库作用: ⚠️ 部分正确（AC，漏选 BD）
2. Maven 路径映射: ❌ 高信心错误（选 C，正确是 A）🔴
3. 父 pom 声明模块: ✅ 方向对（需要 `<modules>` 标签）
4. 模块间依赖声明: ✅ 基本正确（GAV 格式对）
5. parent 标签作用: ✅ 理解正确（继承父配置）

### 学习成果

**父 pom 的两个角色**:
- 聚合器（Aggregator）:用 `<modules>` 声明所有子模块，`<packaging>pom</packaging>`
- 配置继承者（Parent）:用 `<dependencyManagement>` 统一管理版本号

**关键标签对比**:
- `<dependencyManagement>`:只管理版本号，子模块要再声明（但不写 version）
- `<dependencies>`:真引入，所有子模块自动继承

**子模块 pom 结构**:
- `<parent>` 声明父项目（groupId/artifactId/version）
- 继承 groupId 和 version，只写 artifactId
- 依赖其他模块:用 GAV 坐标引用

**本地模块互相引用机制（纠正 Day 10 盲区）**:
1. 在父项目运行 `mvn clean install`
2. 每个模块编译后的 jar 安装到本地仓库（~/.m2/repository/）
3. 其他模块从本地仓库引用（**不需要发布到远程**）

**关键理解**:
- 本地模块和远程依赖都存在本地仓库
- Maven 不区分来源，只认 GAV 坐标
- 先在本地仓库找，找不到才从远程下载

**实战成果**:
- ✅ 创建 hello-api 子模块（接口定义）
- ✅ 创建 hello-impl 子模块（依赖 hello-api 的实现）
- ✅ 理解本地模块编译 → 本地仓库 → 引用的完整流程

### 错题本（高信心错误）🔴

**错题 1:Maven 本地仓库存储范围**
- 学生答案:AC（只选了本地模块 hello-maven 和 crowdsourced-new）
- 正确答案:ABCD（本地模块 + 远程依赖都在本地仓库）
- 误解:认为本地仓库只放本地编译的模块，远程依赖（commons-lang3/Spring）在别处
- 正确理解:`~/.m2/repository/` 是**所有 Maven 依赖的统一缓存中心**，本地编译的和远程下载的都存这里
- 分类:概念模糊

**错题 2:Maven 坐标路径映射规则（高信心错误）**🔴
- 学生答案:`~/.m2/repository/com.alibaba/fastjson-1.2.83.jar`（信心 4/5）
- 正确答案:`~/.m2/repository/com/alibaba/fastjson/1.2.83/fastjson-1.2.83.jar`
- 误解:认为 groupId 保持点号不分层，artifactId 直接拼到文件名
- 正确理解:
  - groupId 的每个点都是一层文件夹（`com.alibaba` → `com/alibaba/`）
  - artifactId 是文件夹（`fastjson/`）
  - version 也是文件夹（`1.2.83/`）
  - jar 在最深层（`fastjson-1.2.83.jar`）
- 记忆诀窍:Maven 坐标 = 目录树路径，每个点和字段都是一层文件夹
- 分类:**高信心错误**（hypercorrection 金矿，优先复习）

### 遗留问题

- 父 pom 的完整配置（还需补充 `<modules>` 和 `<packaging>`）
- 多模块项目的完整编译验证（mvn clean install）
- Maven 生命周期详解（clean/compile/package/install 区别）

### 下次学习计划

- 完成 hello-maven 多模块项目实战（补充父 pom、编译验证）
- Maven 生命周期详解
- 读公司项目的 pom.xml（crowdsourced 系列）

**主题**:Maven 基础 - 依赖管理 + 项目结构(Week 3 开始)

### 学习成果

**Maven 核心概念**:
- Maven 是什么:Java 构建工具 + 依赖管理器(对标 npm)
- 解决问题:自动下载 jar、版本管理、标准项目结构、多模块依赖
- Maven 坐标 GAV:GroupId(组织)/ArtifactId(项目名)/Version(版本号)

**标准项目结构**:
- src/main/java/(源代码)
- src/main/resources/(配置文件)
- src/test/java/(测试代码)
- target/(编译输出)
- pom.xml(核心配置,对标 package.json)

**Maven 本地仓库**:
- 位置:`C:\Users\fjyu9\.m2\repository\`
- 所有依赖按 groupId/artifactId/version 分层存储
- IDEA 从本地仓库加载 jar 到 classpath

**实战成果**:
- ✅ 创建第一个 Maven 项目(hello-maven)
- ✅ 引入 commons-lang3 依赖
- ✅ 使用 StringUtils.isBlank()(Day 8 想用但没库,现在能用了)
- ✅ 理解依赖下载 → 本地仓库 → IDEA 识别的完整流程

### 课前小测(pre-session-review)

**第 1 题:Maven 的作用** ✅
- 答案:B(管理第三方库的下载和版本)
- 信心:4/5
- 判定:正确且高信心 — 已验证

**第 2 题:pom.xml 是什么** ✅
- 答案:写各个插件和各种引用的版本
- 信心:4/5
- 判定:正确且高信心 — Node.js 经验迁移成功

**第 3 题:多模块依赖** ⚠️
- 答案:互相引用,但要发到线上然后拉取到本地使用
- 信心:2/5
- 判定:低信心错误 — 新盲区

### 错题本(迁移失败)

**KP**:Maven 多模块依赖机制

**学生原答案**:"互相引用,但要发到线上然后拉取到本地使用"

**误解分析**:
- 迁移失败:把 npm 发布到 npmjs.com 的流程错误类比到 Maven 多模块
- 混淆了"本地模块"和"远程第三方库"两种依赖方式

**正确理解**:
- 本地模块(同一个父项目下):编译后直接从本地仓库(~/.m2/repository/)引用,不经过远程
- 远程第三方库(Spring/MyBatis):才需要从 Maven Central 或公司私服下载
- 公司的 crowdsourced-new/new-web/new-api 三个模块是本地互相引用,不需要发布

**为什么会错**:
- npm 包必须发布到 npmjs.com 才能被其他项目引用(除非 npm link)
- Maven 多模块项目在本地就能互相引用,不需要发布

### 遗留问题

- Maven 多模块项目的 parent pom 怎么写
- 模块间依赖如何声明
- Maven 生命周期(clean/compile/package/install)的区别

### 下次学习计划

- Maven 多模块项目(parent pom、模块间依赖)
- 读公司项目的 pom.xml
- Maven 生命周期详解

---

## 复习线进度（并行）

**最后更新**：2026-08-01

### 当前进度
- JS/TS：✅ 9/9
- Vue3：✅ 9/9
- CSS：✅ 10/10（07-23 收官）
- Node.js：⏳ 10/?（事件循环/模块化/Stream/中间件/JWT/CORS/异步错误/数据库/原生http/cluster ✅）
- React/Next/AI：⬜

### 最近会话（08-01 原生 http + cluster）
- ✅ 原生 http（req/res 是流、手动收 body、Express 封装了什么）
- ✅ cluster 多进程（主进程 IPC 分发 socket、worker 不共享内存）
- 🔴 宏任务/微任务边界成新 KP（Again）：`'data'` 事件答成微任务，"异步就是微任务"混淆第 4 次
- 下一主题：res 流式响应 / worker_threads / Express 深入
