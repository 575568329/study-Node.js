# Vercel AI SDK 学习进度

**Last Updated**: 2026-04-25
**状态**: 🟡 进行中

---

## 📊 快速统计

📈 **Overall Progress**: 6/10 topics = **60%**
📚 **学习天数**: 2 天（04-22, 04-25）
🎯 **阶段**: 阶段五·Vercel AI SDK

---

## ✅ 已掌握主题

| # | 主题 | 关键 API | 日期 | 置信度 |
|---|------|---------|------|--------|
| 1 | 流式聊天基础 | `useChat` + `streamText` + `toUIMessageStreamResponse` | 04-22 | ⭐⭐⭐ |
| 2 | useChat 状态管理 | `status`（submitted/streaming/ready/error） | 04-25 | ⭐⭐⭐ |
| 3 | 停止生成 | `stop()` | 04-25 | ⭐⭐⭐ |
| 4 | 重新生成 | `regenerate()` | 04-25 | ⭐⭐⭐ |
| 5 | 新对话 | `useChat({ id })` 切换 id | 04-25 | ⭐⭐⭐ |
| 6 | Tool Calling | `tool()` + `inputSchema` + `execute` + `stepCountIs` | 04-25 | ⭐⭐⭐ |

---

## 📋 待学习主题

| # | 主题 | 优先级 | 备注 |
|---|------|--------|------|
| 7 | Structured Output | P0 | `generateObject` / `streamObject`，Zod 定义输出格式 |
| 8 | System Prompt 深入 | P1 | 动态 prompt、多轮对话上下文管理 |
| 9 | Client-side Tool | P1 | 前端工具、人机协作审批 |
| 10 | RAG 整合 | P0 | LangChain RAG 后端 + AI SDK 前端流式展示 |

---

## 🔍 踩坑记录

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| v6 API 大量不兼容 | ai@6.0.168 是大版本更新 | 先读类型定义再写代码 |
| `toTextStreamResponse` 页面不显示 | 格式不匹配 v6 useChat 协议 | 改用 `toUIMessageStreamResponse` |
| `ai/react` 模块找不到 | v6 拆分为 `@ai-sdk/react` | 单独安装 `@ai-sdk/react` |
| `handleInputChange` 不存在 | v6 移除了这些方法 | 手动 useState 管理 input |
| UIMessage 没有 `content` | v6 用 `parts` 数组 | 从 parts 提取 text |
| GLM 返回 404 | `openai()` 默认调 `/responses` 端点 | 用 `createOpenAI` + `glm.chat()` 走 `/chat/completions` |
| `isStepCount` 不存在 | Context7 文档与实际版本名不同 | 实际名称是 `stepCountIs` |
| Tool calling 页面不显示 | 默认只执行 1 步，工具结果没喂回 LLM | 加 `stopWhen: stepCountIs(5)` |
| `unknown` 不能用在 JSX `&&` | TypeScript 中 `unknown & T` 类型不合法 | 改用 `typeof t.output !== 'undefined'` |
| `ToolCallPart` 接口定义在组件内 | 组件内定义类型每次渲染重建 | 提到组件外面 |

---

## 📝 学习笔记

### Vercel AI SDK vs LangChain.js
- 完全独立的库，没有依赖关系
- AI SDK：Web 应用的 AI 交互体验（流式渲染、前端 Hook）
- LangChain：AI 编排（RAG、Agent、Chain）
- 实际项目常组合使用：LangChain 做后端逻辑，AI SDK 做前端交互

### Tool Calling 原理
- 注册工具时把定义（name + description + parameters）发给 LLM
- LLM 返回标准化的 `tool_calls` JSON（不是提示词触发，是结构化协议）
- 框架按 name 匹配执行 execute 函数，结果喂回 LLM
- `content` 有文本 = 普通回答，`tool_calls` 有内容 = 要调工具
- v6 用 `stepCountIs(N)` 控制多步循环

### v6 关键变化
- `useChat` 返回 `sendMessage`（不是 `handleSubmit`）
- 消息用 `parts` 数组（不是 `content` 字符串）
- `sendMessage({ text })` 不是 `{ content }`
- 自定义 provider 用 `createOpenAI({ baseURL })` + `.chat()` 方法

---

## ❓ 学生提问记录

### 2026-04-25

| 问题 | 回答要点 |
|------|---------|
| onClick 为什么报红 | regenerate 参数是 `{messageId}` 不是 MouseEvent，需要箭头函数包裹 |
| 怎么切换 chatID | useState 管理 id，传给 useChat({ id })，切换 id 自动重置 |
| 怎么读取旧对话 | AI SDK 本身不持久化，需要自己用 localStorage/数据库按 id 存取 |
| LLM 怎么精准识别调什么工具 | 不是提示词触发，是 LLM 返回标准化的 tool_calls JSON，框架按 name 匹配 |
| 怎么区分思考过程还是回答 | 靠响应结构：content 有文本=普通回答，tool_calls 有内容=要调工具 |
| Vercel AI SDK 本质上调 LangChain 吗 | 完全独立的库，定位不同，常组合使用 |
