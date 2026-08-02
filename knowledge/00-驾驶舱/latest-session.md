# 最近一次学习记录

**日期**: 2026-08-02 下午
**主题**: SSE (Server-Sent Events) 流式响应

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
