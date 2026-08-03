# 最近一次学习记录

**最后更新**:2026-08-03（Day 18 MyBatis 缓存机制）

## Day 18 学习记录（2026-08-03）

**主题**：MyBatis 缓存机制（一级缓存 + 二级缓存 + 适用场景判断）

### 课前小测（pre-session-review）

5 题：**1 个重要翻盘 + 1 个需关注**
- Q1 事务绑连接：❌ 方向对但归因错（说"线程不同"→ 应该是"连接不同"，事务绑连接不是绑线程，是绑同一个 Connection）→ A
- Q2 BFC 触发条件：✅ **翻盘**（position/overflow:hidden/float）→ A→G
- Q3 @Transactional 回滚规则：✅ 结论对（`rollbackFor=Exception.class` 回滚了 IOException）→ G→H（因果表述含糊）
- Q4 #{} vs ${}：✅ 正确（ORDER BY 列名用 `${}`）→ G
- Q5 MyBatis 缓存：不知道（正常，预测试）→ 今日新内容

### 学习成果

**一级缓存（SqlSession 级别）**：
- 默认开启，关不掉
- 同一个 SqlSession 内相同查询 → 命中缓存不发 SQL
- **缓存 Key = Statement ID + 参数值**（两个维度，缺一不可）
- 清空 4 种场景：SqlSession 关闭 / INSERT/UPDATE/DELETE / 手动 clearCache
- SqlSession 不是进程，是"数据库操作上下文"，包裹连接 + 一级缓存，用完 close()

**二级缓存（Mapper 级别）**：
- **默认关闭**（一级默认开、二级默认关——重要区别）
- 跨 SqlSession 共享缓存
- 查询路径：一级缓存 → 二级缓存 → 数据库
- 3 项配置：全局 `cacheEnabled=true` + Mapper 加 `<cache/>` + 实体类 `implements Serializable`
- 增删改时清空**整个 Mapper 的二级缓存（不是只清自己的）

**缓存适用场景**：
- ✅ 字典表、配置表（查多改少，非常适合）
- ❌ 订单、库存（频繁改动 → 缓存命中率极低 + 一致性问题）
- 公司项目几乎不用 `<cache/>`（业务数据频繁变更）

**SqlSession / Mapper / Spring 的关系**：
- SqlSession = 数据库连接 + 一级缓存的包装对象（MyBatis 自动管）
- Mapper = 你写的接口（UserMapper.java），通过动态代理生成实现
- Spring 环境下不用手写 SqlSession / getMapper → `@Autowired` 自动注入

### 错题本

**错题 1：事务绑连接（归因错误）🔴**
- 错误原文："因为他们没有用同一个线程"
- 正确：**事务绑的是 Connection（连接），不是线程**。两个连接 = 两个独立事务，conn1 commit 了就回不了
- Node 对比：`conn1.query()` 和 `conn2.query()` 各自独立，conn1 提交不影响 conn2
- 归类：概念混淆（线程 vs 连接，昨天 A 的延续，根因是"await 同步性混淆"的第 5 次变体）

### 今日面试题沉淀（2 道）

1. MyBatis 两级缓存区别？→ 一级：SqlSession 级（默认开、同 session 内），二级：Mapper 级（默认关、跨 session 共享）。查询路径：一级→二级→DB。增删改清空。
2. 为什么公司项目不用二级缓存？→ 业务数据频繁变更，缓存命中率低 + 一致性难保证。字典表/配置表适合。

### 遗留问题 / 下次计划

- MyBatis 下一步：`<set>` 标签（动态 UPDATE）、与 Spring 事务协调
- 🔴 事务绑连接 Again 第 2 次（08-04 测，记住：绑的是 Connection 不是线程）

---

## 上次会话（存档）

**2026-08-02（Node.js 复习：SSE 流式响应）**

---

## 学习内容

### SSE 协议格式

**服务端三响应头**：
- `Content-Type: text/event-stream`
- `Cache-Control: no-cache`
- `Connection: keep-alive`

**消息格式**：
- `data: xxx\n\n`（双换行 `\n\n` 是消息终止符）
- 单个 `\n` 只分隔多行消息内的字段

**客户端 API**：
- `EventSource` 自动处理重连

### 流式响应本质

- `res.write()` 边缘触发，立即发送，不等 `res.end()`
- 区别于 `await res.json()` 全量缓冲后解析
- AI 应用流式输出的技术基础

### EventSource 生命周期

1. **服务端断开**（`res.end()` / 网络故障）：
   - 触发客户端 `onerror`
   - 自动重连（默认 3 秒）
   
2. **客户端主动关闭**（`es.close()`）：
   - 设置 `readyState = CLOSED`
   - **不触发 `onerror`**
   - **阻止重连**

3. **约定**：服务端发 `[DONE]` 标记 → 客户端收到后调 `close()` 优雅关闭

### 技术选型洞察

**SSE vs WebSocket**：
- SSE：单向低成本（无协议升级、自动重连、标准 HTTP）
- WebSocket：双向高成本（协议升级、心跳维护）
- AI 对话场景：客户端不回推数据 → WebSocket 是过度设计

### 生产三大坑

1. **Nginx 缓冲**
   - 默认攒够 4KB 才转发
   - 几十字节的消息会卡十几秒
   - 解决：`proxy_buffering off` 或后端 `X-Accel-Buffering: no`

2. **连接泄漏**
   - 客户端断开，服务端 timer 继续运行
   - 解决：`req.on('close')` 监听断开，`clearInterval(timer)` 清理

3. **CORS**
   - `file://` 协议打开 HTML，origin 是 `null`
   - 解决：`Access-Control-Allow-Origin: *`

### 排查顺序（面试亮点）

1. **第一步**：抓包/DevTools Network 对比服务器发送时间戳 vs 浏览器接收时间戳
2. **第二步**：检查 Nginx/网关配置 `proxy_buffering` / `X-Accel-Buffering`
3. **第三步**：代码层（`res.write()` 时机、`\n\n` 终止符）

---

## 实战代码

**文件**：
- `projects/nodejs/01-express-demo/sse-chat.js`（服务端）
- `projects/nodejs/01-express-demo/sse-client.html`（客户端）

**服务端关键实现**：
```javascript
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no',          // 防 Nginx 缓冲
  'Access-Control-Allow-Origin': '*'  // 防 CORS
})
res.flushHeaders()  // 立即发送响应头

const timer = setInterval(() => {
  res.write(`data: ${JSON.stringify({ content: char })}\n\n`)
}, 80)

req.on('close', () => clearInterval(timer))  // 防连接泄漏
```

**客户端停止按钮**：
```javascript
const es = new EventSource('http://127.0.0.1:3000/chat')

es.onmessage = (e) => {
  if (e.data === '[DONE]') {
    es.close()
    output.textContent += ' ✅'
    return
  }
  const { content } = JSON.parse(e.data)
  output.textContent += content
}

document.getElementById('stop').onclick = () => {
  es.close()
  output.textContent += ' ❌'
}
```

**验证结果**：
- ✅ 逐字流式输出正常
- ✅ 服务端完成时显示 ✅
- ✅ 点击停止按钮显示 ❌，无重连
- ✅ 服务端 `req.on('close')` 正确清理 timer

---

## 理解盲区修正

### 1. 误认为 `res.write()` 会等流执行完再返回
- ❌ 错误理解：以为要等所有 `write()` 执行完才发送
- ✅ 纠正：流是边缘触发，每次 `write()` 立即发送（这是 `await res.json()` 的行为，不是流）

### 2. 反向理解 `req.on('close')` 方向
- ❌ 错误表述："客户端会监听 close 事件"
- ✅ 纠正：服务端的 `req` 对象监听客户端断开事件（方向：客户端发起 → 服务端检测）

### 3. 误以为 `es.close()` 会触发 `onerror`
- ❌ 错误理解：以为所有断开都触发 `onerror` + 重连
- ✅ 纠正：
  - 服务端断开（`res.end()` / 网络故障）→ 触发 `onerror` + 自动重连
  - 客户端 `es.close()` → 设置 `readyState = CLOSED`，不触发 `onerror`，阻止重连

---

## 🤖 AI 时代视角

**被 AI 贬值**：
- `data: xxx\n\n` 格式拼装
- 三个响应头复制粘贴
- `EventSource` API 查文档

**AI 时代更值钱**：
- **技术选型判断力**：为什么不用 WebSocket（成本 vs 收益）
- **跨层排查能力**：本地好线上不流式（抓包时间戳 → Nginx 配置 → 代码）
- **资源清理意识**：`req.on('close')` 防内存泄漏
- **协议生命周期理解**：`res.end()` vs `es.close()` 对重连的不同影响

**对你的意义**：
- 简历 AI 应用方向必问
- 答出"Nginx 缓冲排查顺序"拉开差距
- 连接生命周期管理体现工程成熟度

---

## 进度更新

- **Node.js 复习线**：12/? 完成（新增 SSE）
- **新增 KP**：`SSE 流式响应（格式/EventSource/重连机制/生产坑）` G，S=3 天，08-05 复查
- **课前复查**：DB 连接池 G（S 延至 6 天，08-08）

---

## 明日复查（08-03）

- 数据库事务绑连接（S=1，`pool.query` 每次可能拿不同连接，必须 `getConnection`）
- BFC 触发条件（S=1，漏 `display: flow-root` 专用触发）

---

## 下次学习方向

- worker_threads（CPU 密集计算）
- Express 深入（中间件源码/错误处理机制）
- WebSocket（双向通信对比）

---

## 2026-08-03 会话记录（第二台设备）

**主题**：前端复习线 - WebSocket（双向实时通信）

### 课前小测（另一台设备已完成，跳过）

### 主线学习：WebSocket ✅

**协议机制**：
- 独立协议（ws:// / wss://），通过 HTTP Upgrade 握手后脱离 HTTP
- 全双工：客户端和服务端随时互发消息
- 同端口复用 80/443，穿过代理和防火墙（运维友好）

**WebSocket vs SSE 对比**：
- SSE = 单向（服务端→客户端）+ EventSource 自动重连 + 纯文本
- WebSocket = 双向 + 手动重连（指数退避+熔断）+ 文本+二进制
- 选型看"客户端需不需要主动推数据"：AI 流式→SSE，聊天/协同→WebSocket

**生产三大坑**：
1. broadcast 无 try-catch → 单个 send 异常中断整个循环（已修复）
2. 无自动重连 → 需 onclose 里 setTimeout + 指数退避 + 最大重试（已实现）
3. Nginx 60 秒超时断空闲连接 → proxy_read_timeout 延长 + 心跳保活

**实战代码**：`code-examples/nodejs/ws-chat.js` + `ws-client.html`
- 服务端：broadcast try-catch + Set 管理连接
- 客户端：自动重连（指数退避 3s→6s→9s→12s→15s，最多 5 次）+ 手动断开/重连按钮

**理解验证（3 题）**：
- Q1 自动重连熔断：✅ 正确（指数退避+最大重试，比 SSE 无脑重连更生产级）
- Q2 readyState 检查：✅ 正确（防御性编程+try-catch 双保险）
- Q3 Nginx 缓冲：✅ 正确（握手后走 ws 协议不走 HTTP，不存在 SSE 的 buffer 问题，但有 60s 超时坑）

**🤖 AI 时代视角**：
- AI 能做：生成 WebSocket 样板代码、broadcast/reconnect 逻辑
- 人类不可替代：技术选型判断（SSE vs WebSocket 成本收益）、生产坑排查（Nginx 超时/broadcast 异常/内存泄漏）、心跳重连策略设计（架构决策）

### 面试题沉淀（WebSocket 3 道）
1. WebSocket vs SSE 怎么选？→ 单向推送用 SSE（简单自动重连），双向实时用 WebSocket
2. WebSocket 需手动实现什么？→ 自动重连（指数退避+熔断）、心跳保活、离线消息队列
3. WebSocket 和 HTTP 关系？→ 独立协议，HTTP Upgrade 握手建立，握手后脱离 HTTP 变全双工

### 前端复习线进度
Node.js 已完成 **13 个主题**（新增 WebSocket）。下一候选：worker_threads / Express 深入 / 进程与集群（已有 cluster 基础）
