---
name: gemini-collab-progress
description: Gemini双AI协作系统开发进度、已知问题和待优化项
type: project
originSessionId: b5c5e92b-b859-43d4-8767-1ef236200ecc
---
# Gemini 双AI协作系统 - 开发进度 (2026-05-25)

## 已完成
- **HTTP API 客户端** (`tools/gemini-api.mjs`) — 替代浏览器 DOM 自动化
  - 仅用浏览器提取 Cookie + AT Token (SNlM0e)，之后纯 HTTP POST
  - 69元素位置数组请求体，非流式模式（index 7 = 0）
  - wrb.fr 响应格式解析（二次 JSON 解析）
  - 三段式上下文注入正常工作
  - 已测试：ask、verify 模式，长回复无截断
- Chrome CDP 浏览器自动化通信（Playwright + 调试端口 19222）
- Gemini Gem 配置（"全栈学习策略师"，4种模式）
- 交互自动保存到 `gemini-interactions/YYYY-MM-DD.md`
- 滚动窗口（保留最近3轮摘要，每轮600字）

**Why**: Gemini API 账号被封，只能通过网页版交互。HTTP API 比浏览器 DOM 自动化快10倍且稳定。
**How to apply**: 
1. 先执行 `node tools/gemini-chat.mjs open` 启动 Chrome 并登录
2. 再执行 `node tools/gemini-api.mjs init` 提取 Cookie
3. 之后直接用 `node tools/gemini-api.mjs ask/verify/plan/quiz/interview "问题"`

## 关键 API 细节
- 端点: `https://gemini.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate`
- AT Token: `window.WIZ_global_data.SNlM0e`（XSRF 保护）
- Model Header: `x-goog-ext-525001261-jspb: [1,null,null,null,"fbb127bbb056c959",null,null,0,[4],null,null,1]`
- 额外 Header: `x-goog-ext-73010989-jspb: [0]`, `x-goog-ext-73010990-jspb: [0]`
- 请求体: `[null, JSON.stringify(69元素数组)]`, form-encoded as `f.req=...`
- 响应: `)]}'\n` 前缀 + 长度前缀帧 + wrb.fr 包裹的 JSON 字符串
- 文本路径: 解析后 `response[4][0][0][1][0]`
- 参考库: HanaokaYuzu/Gemini-API (Python)

## 已知问题
1. Cookie 有效期有限，过期需重新 `init`
2. 非流式模式等待完整响应，长回复可能慢（但可靠）
3. 未实现流式模式（需要 chunked 读取 + 多帧文本合并）

## 文件结构
- `tools/gemini-api.mjs` - HTTP API 客户端（推荐使用）
- `tools/gemini-chat.mjs` - 旧版 DOM 自动化（fallback）
- `docs/gemini-system-prompt.md` - Gem 系统指令
- `gemini-interactions/context.json` - 上下文状态
- `gemini-interactions/.gemini-cookies.txt` - Cookie 缓存（不提交）
- `gemini-interactions/.gemini-at-token.txt` - AT Token 缓存（不提交）

## 前置条件
- 先执行 `node tools/gemini-chat.mjs open` 启动 Chrome 调试模式并登录
- 再执行 `node tools/gemini-api.mjs init` 提取认证信息
