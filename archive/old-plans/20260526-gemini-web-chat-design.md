# Gemini Web Chat 界面设计

> 最后更新：2026-05-26
> 状态：已讨论（Gemini 审阅并给出架构建议）

## 1. 背景

当前和 Gemini 的对话通过 CLI 命令 `node tools/gemini-api.mjs ask "问题"` 进行，需要 Claude 做中间传话人，体验不流畅。

**目标**：在现有项目内构建一个 Web 聊天界面，用户直接和 Gemini 对话，Claude 通过 REST API 注入上下文。

**已有基础设施**（`tools/gemini-api.mjs`）：
- Cookie/AT Token 提取和缓存（Playwright CDP）
- 81 元素请求体构建 + wrb.fr 响应解析
- 对话连续性（cid/rid/rcid/nonce 自动管理）
- Gemini 3.5 Flash 模型（ID: `56fdd199312815e2`）

## 2. 功能范围

### MVP（本次实现）

| # | 功能 | 说明 |
|---|------|------|
| 1 | 直接聊天 | 用户在浏览器直接发消息给 Gemini，流式显示回复 |
| 2 | 多对话管理 | 新建对话、切换对话、续聊已有对话 |
| 3 | 对话标题 | 自动取首条消息前 20 字，可手动修改 |
| 4 | Claude 注入 | 通过 `POST /api/inject` 注入上下文，页面可见 + 同步发送给 Gemini |
| 5 | 持久化 | 对话记录保存到本地 JSON，重启服务器可恢复 |
| 6 | 会话降级 | 旧会话失效时自动冷启动新会话，注入历史上下文 |
| 7 | 简易鉴权 | 启动时生成随机 Token，WS/REST 请求需携带 |

### 后续迭代

- 搜索历史对话
- 模式切换（plan/verify/quiz/interview）
- 导出为 Markdown
- Gem 集成（自定义系统指令）

## 3. 架构

```
┌─────────────────────────────────────────────────────┐
│                    浏览器                             │
│              gemini-chat.html                        │
│         (WebSocket + fetch API)                      │
└──────────┬─────────────────────┬────────────────────┘
           │ WebSocket           │ REST API
           │ (聊天/流式)          │ (Claude 注入)
           ▼                     ▼
┌─────────────────────────────────────────────────────┐
│            tools/gemini-server.mjs                   │
│          Express + WebSocket (端口 3456)             │
│                                                      │
│  ┌──────────────────┐  ┌─────────────────────────┐  │
│  │ WebSocket Handler│  │ REST API Routes          │  │
│  │ - chat           │  │ POST /api/inject         │  │
│  │ - new_conversation│  │ POST /api/chat           │  │
│  │ - switch/rename  │  │ GET  /api/conversations  │  │
│  └────────┬─────────┘  └────────────┬────────────┘  │
│           │                         │                │
│           ▼                         ▼                │
│  ┌──────────────────────────────────────────────┐    │
│  │         tools/gemini-core.mjs                │    │
│  │  (从 gemini-api.mjs 提取的核心 API 函数)      │    │
│  │  - callStreamGenerate()                      │    │
│  │  - buildRequestBody() / parseStreamResponse()│    │
│  │  - Cookie/AT Token 管理                      │    │
│  └──────────────────────┬───────────────────────┘    │
│                          │                            │
└──────────────────────────┼────────────────────────────┘
                           │ HTTP POST (流式读取)
                           ▼
              Gemini 内部 StreamGenerate API
              (gemini.google.com)
```

**为什么用 WebSocket**：
- 双向通信（用户发消息 + 服务端推送流式回复）
- Claude 注入消息能实时推送到页面
- 比 SSE 实现更自然

## 4. 文件结构（在 Node.js-Study 项目内）

```
d:\Study\Node.js-Study\
  tools/
    gemini-api.mjs          # [已有] CLI 入口，保持不变
    gemini-core.mjs         # [新增] 核心函数提取，export 供复用
    gemini-server.mjs       # [新增] Express + WebSocket 服务器
    gemini-chat.html        # [新增] 单文件聊天页面（服务器静态托管）
  gemini-interactions/
    conversations/          # [新增] 对话数据目录
      index.json            #   对话索引（id, title, updatedAt）
      conv_{id}.json        #   单个对话的消息列表
    .gemini-cookies.txt     # [已有] Cookie 缓存
    .gemini-at-token.txt    # [已有] AT Token 缓存
    context.json            # [已有] 上下文
```

**需安装**：`ws`（WebSocket 库），`express` 已有。

## 5. 核心模块设计

### 5.1 `tools/gemini-core.mjs` — 共享 API 客户端

从 `gemini-api.mjs` 提取并 export 以下函数，**原文件保持不变**：

```js
// Cookie 管理
export async function extractCookiesViaCDP()
export function getCookieString()
export function getAtToken()
export async function ensureCookies()

// API 调用
export function buildRequestBody(text, options)
export function buildModelHeader(modelId)
export function parseStreamResponse(raw)
export function extractTextFromParsed(frames)
export function extractConversationMeta(frames)

// 流式调用（改造核心）
export async function* streamGenerate(prompt, cookieStr, conversation?)
// 返回 AsyncGenerator，每次 yield { type: 'chunk'|'done', content, metadata }

// 一次性调用（兼容 CLI）
export async function callStreamGenerate(prompt, cookieStr, conversation?)

// 常量
export const STREAM_URL, MODEL_IDS, CDP_PORT
```

**关键改造**：

#### 流式函数 `streamGenerate()`

```js
export async function* streamGenerate(prompt, cookieStr, conversation) {
  // 构建请求（同现有逻辑）
  const response = await fetch(url, { method: 'POST', headers, body });

  // 关键：逐行读取 response.body
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // 解析 wrb.fr 帧，提取增量文本
    const lines = buffer.split('\n');
    buffer = lines.pop(); // 保留不完整的行

    for (const line of lines) {
      const parsed = tryParseFrame(line);
      if (parsed?.text && parsed.text !== fullText) {
        const delta = parsed.text.substring(fullText.length);
        fullText = parsed.text;
        yield { type: 'chunk', content: delta };
      }
    }
  }

  // 处理剩余 buffer
  const metadata = extractMetaFromBuffer(buffer);
  yield { type: 'done', content: fullText, metadata };
}
```

### 5.2 `tools/gemini-server.mjs` — 服务器

**启动方式**：`node tools/gemini-server.mjs`

**端口**：3456

**启动时行为**：
1. 生成随机鉴权 Token（UUID）
2. 打印到控制台：`鉴权 Token: xxx-xxx-xxx`（REST API 和 WS 握手需携带）
3. 启动 Express + WebSocket

**主要职责**：
1. 托管 `gemini-chat.html` 静态页面
2. WebSocket 处理聊天消息
3. REST API 处理 Claude 注入
4. 对话数据读写
5. 会话降级处理

#### WebSocket 协议

```js
// 客户端 → 服务端
{ type: "chat",          conversationId, content }
{ type: "new_conversation", title? }
{ type: "switch",        conversationId }
{ type: "rename",        conversationId, title }
{ type: "list" }

// 服务端 → 客户端
{ type: "stream_start",  conversationId }
{ type: "stream_chunk",  conversationId, content }   // 增量文本
{ type: "stream_end",    conversationId, fullText }   // 完整回复
{ type: "inject",        conversationId, content }    // Claude 注入（页面展示）
{ type: "conversation_list", conversations: [...] }
{ type: "messages",      conversationId, messages: [...] }
{ type: "error",         message }
```

#### REST API

```
POST /api/inject
  headers: { Authorization: "Bearer <token>" }
  body: { conversationId?, content }
  → 在对话中插入 claude-context 消息
  → 同时发送给 Gemini（Gemini 能感知注入内容）
  → WebSocket 推送给页面

POST /api/chat
  headers: { Authorization: "Bearer <token>" }
  body: { conversationId?, content }
  → 同 WebSocket chat（供 curl 调用）

GET /api/conversations
  headers: { Authorization: "Bearer <token>" }
  → 对话列表

GET /api/conversations/:id
  headers: { Authorization: "Bearer <token>" }
  → 对话详情（含消息）
```

#### 会话降级策略

```
用户发送消息到旧对话
  → 用旧 cid/rid/nonce 调用 Gemini API
  → 如果 Gemini 返回错误（404/会话不存在）
    → 清空该对话的 geminiMeta
    → 拼接历史消息作为上下文：
      "[系统] 这是一个续接的对话，以下是历史记录：
       用户：xxx
       Gemini：xxx
       ---
       请基于以上上下文继续对话。"
    → 作为新会话发送给 Gemini
    → 获取新的 cid/rid/rcid/nonce
    → 更新对话的 geminiMeta
    → 正常流式回复
```

### 5.3 `tools/gemini-chat.html` — 聊天页面

单文件（HTML + 内联 CSS + 内联 JS），无构建工具。

**UI 布局**：

```
┌──────────────────────────────────────────────┐
│  Gemini Chat                        [连接状态]│
├──────────────┬───────────────────────────────┤
│  侧边栏 240px│  聊天主区域                    │
│              │                               │
│ [+ 新对话]   │  Gemini 回复（灰色气泡）        │
│              │  Claude 注入（蓝色边框）         │
│ > 对话1      │  用户消息（绿色气泡，右对齐）    │
│   对话2      │                               │
│   对话3      │                               │
│              │                               │
│              │  ┌───────────────────┬──────┐  │
│              │  │ 输入框            │ 发送 │  │
│              │  └───────────────────┴──────┘  │
└──────────────┴───────────────────────────────┘
```

**消息角色样式**：

| 角色 | 位置 | 样式 |
|------|------|------|
| `user` | 右对齐 | 绿色背景 `#dcf8c6` |
| `gemini` | 左对齐 | 灰色背景 `#f0f0f0`，支持 Markdown |
| `claude-context` | 左对齐 | 蓝色左边框 + 浅蓝背景，标注"Claude 注入" |

**核心功能**：
- WebSocket 连接 + 自动重连（3 秒间隔）
- 流式显示 Gemini 回复（stream_chunk 增量追加）
- 侧边栏对话列表点击切换，加载历史消息
- 新建对话按钮
- 双击标题进入编辑模式
- Markdown 渲染（marked.js CDN）
- 连接时自动从 URL hash 或 localStorage 读取 Token

### 5.4 对话数据存储

**文件位置**：`gemini-interactions/conversations/`

**index.json**（对话列表）：
```json
[
  {
    "id": "conv_1779440071055",
    "title": "关于向量检索的问题",
    "createdAt": "2026-05-26T01:00:00.000Z",
    "updatedAt": "2026-05-26T01:30:00.000Z",
    "geminiMeta": {
      "cid": "c_xxx",
      "rid": "r_xxx",
      "rcid": "rc_xxx",
      "nonce": "AwAA..."
    }
  }
]
```

**conv_{id}.json**（消息列表）：
```json
[
  {
    "role": "user",
    "content": "什么是向量检索？",
    "timestamp": "2026-05-26T01:00:00.000Z"
  },
  {
    "role": "gemini",
    "content": "向量检索是...",
    "timestamp": "2026-05-26T01:00:05.000Z"
  },
  {
    "role": "claude-context",
    "content": "当前学习阶段：RAG 架构",
    "timestamp": "2026-05-26T01:05:00.000Z"
  }
]
```

**与 Gemini 对话连续性的关系**：
- 每个对话维护独立的 `cid/rid/rcid/nonce`
- 切换对话时，server 使用对应对话的 metadata 调用 Gemini API
- 新建对话时，metadata 为空，Gemini 返回新的 cid/rid
- **会话失效时**：清空 metadata，拼接历史消息作为新会话上下文发送

## 6. Gemini 审阅建议（已采纳）

| # | 建议 | 决策 |
|---|------|------|
| 1 | MVP 必须做流式推送，否则长上下文时页面卡顿 | 已采纳：`streamGenerate()` 改为 AsyncGenerator |
| 2 | 旧会话有过期风险，nonce 冲突会导致请求被拒 | 已采纳：加会话降级策略，失效时注入历史 |
| 3 | Claude 注入必须同步发给 Gemini，否则后续对话会断上下文 | 已采纳：inject 同时触发 Gemini API 调用 |
| 4 | localhost 也可能被恶意网站 CSRF | 已采纳：启动时生成随机 Token 做简易鉴权 |

## 7. 实现步骤

### Step 1: 提取 `tools/gemini-core.mjs`

从 `gemini-api.mjs` 提取核心函数，改为 ESM export 模块。
新增 `streamGenerate()` AsyncGenerator 函数。
**不修改原文件**，保持 CLI 功能正常。

预估：45 分钟

### Step 2: 实现 `tools/gemini-server.mjs`

- Express 静态托管 gemini-chat.html
- 启动时生成鉴权 Token
- WebSocket 消息处理（chat/new/switch/rename/list）
- REST API 路由（inject/chat/conversations），Bearer Token 鉴权
- 对话数据 CRUD
- 流式 Gemini 回复通过 WS 逐 chunk 推送
- 会话降级：旧 cid 失效 → 拼接历史 → 新会话

预估：2 小时

### Step 3: 实现 `tools/gemini-chat.html`

- 布局和样式
- WebSocket 连接管理（含 Token 握手）
- 消息渲染（含 Markdown）
- 侧边栏交互（新建/切换/重命名）
- 流式回复增量追加显示

预估：1.5 小时

### Step 4: 联调测试

1. `node tools/gemini-server.mjs` → 控制台打印 Token
2. 访问 http://localhost:3456 → 页面连接 WS
3. 发消息 → Gemini 流式回复（逐字显示）
4. 切换对话 → 加载历史
5. curl inject → 页面实时显示注入，Gemini 也收到
6. 模拟会话失效 → 自动降级续聊
7. 重启服务器 → 对话恢复

预估：30 分钟

## 8. 使用方式

```bash
# 1. 首次：提取 Cookie（需先启动 Chrome 调试模式）
node tools/gemini-api.mjs init

# 2. 启动聊天服务器
node tools/gemini-server.mjs
# 输出：鉴权 Token: xxxx-xxxx-xxxx

# 3. 浏览器打开
# http://localhost:3456

# 4. Claude 注入上下文（另一个终端，Token 从服务器控制台复制）
curl -X POST localhost:3456/api/inject \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer xxxx-xxxx-xxxx' \
  -d '{"content":"当前学习 RAG 架构，上一节讲了混合检索"}'
```
