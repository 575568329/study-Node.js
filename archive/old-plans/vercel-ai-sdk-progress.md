# Vercel AI SDK 学习进度

**Last Updated**: 2026-04-26
**状态**: 🟢 已完成

---

## 📊 快速统计

📈 **Overall Progress**: 10/10 topics = **100%**
📚 **学习天数**: 3 天（04-22, 04-25, 04-26）
🎯 **阶段**: 阶段五·Vercel AI SDK ✅

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
| 7 | Structured Output | `Output.object()` + Zod schema → `generateObject`/`streamObject` | 04-25 | ⭐⭐⭐ |
| 8 | System Prompt 深入 | `system` 参数 + 策略映射 + `DefaultChatTransport({ body })` + `useRef` | 04-25 | ⭐⭐⭐ |
| 9 | Client-side Tool | `onToolCall` + `addToolOutput` + `sendAutomaticallyWhen` | 04-25 | ⭐⭐ |
| 10 | RAG 整合 | LangChain `similaritySearch` + `streamText({ system: context })` | 04-26 | ⭐⭐⭐ |

---

## 📋 待学习主题

（全部完成！）

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
| useChat 的 `body` 选项报 TS 错误 | v6 移除了 body，改到 transport 层 | `new DefaultChatTransport({ body: ... })` |
| transport body 切换角色不生效 | body 在 transport 创建时固定 | 用 `useRef` + getter 函数 `() => ({mode: ref.current})` |
| onToolCall return string 报 TS 错误 | v6 onToolCall 返回 void | 用 `addToolOutput` 替代 return |
| `addToolResult` 找不到 | v6 中 deprecated | 改用 `addToolOutput` |
| sendAutomaticallyWhen: `() => true` 无限循环 | 每次响应都触发重发 | 需要条件判断（检查 `state === 'output-available'`） |
| GLM 返回 Python 代码而非 tool call | GLM tool calling 不稳定 | 生产环境用前端预获取+body传参 |
| LangChain 依赖冲突 ERESOLVE | @langchain/community@1.x 要求 core@1.x，项目有 core@0.x | 简单demo不需要装LangChain，硬编码模拟 |
| 中文关键词检索不准 | split(/\s+/) 按空格分词，中文没有空格 | 真实项目用向量检索 |

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

### Structured Output 核心概念
- AI SDK 通过模型原生 `response_format` 强制返回 JSON，不是提示词技巧
- `Output.object()` + Zod schema → `generateObject` / `streamObject`
- 与 LangChain 对比：LangChain 用 prompt-driven（提示词+JSON.parse），AI SDK 用 API-driven（response_format）
- GLM 限制：GLM API 无 `response_format` 参数，不支持 `Output.object()`
- Workaround：用 tool calling 模拟（tool + toolChoice:'required' + inputSchema 定义结构）
- Output.object() 直达取数据，tool calling 绕路执行动作；Output 直接返回干净 JSON，tool 需从 input 抠数据

### System Prompt 深入
- 动态 system prompt：根据参数切换不同系统指令
- 策略映射：`Record<Mode, string>` 对象替代 if-else
- v6 transport 传参：`body` 从 `useChat` 移到了 `transport` 层（DefaultChatTransport）
- ref+state 配合：state 管显示和切换，ref 管 transport 取最新值
- `useRef` 创建跨渲染持久化可变引用，改值不触发渲染，用于绕过闭包问题

### Client-side Tool 核心概念
- 后端工具有 execute → 服务端执行；前端工具无 execute → 转发给前端 onToolCall
- onToolCall 返回 void，不能直接 return 结果，必须用 addToolOutput 喂回
- addToolOutput 通过 ref 桥接（时序依赖问题）
- sendAutomaticallyWhen 控制是否自动重发（`() => true` 导致无限循环）
- GLM 问题：tool calling 不稳定，建议用前端预获取+body传参替代
- 生产策略：GLM 当纯文本对话用，浏览器能力前端解决，通过 body/context 传给后端
- Claude 模型 tool calling 能力强是 Claude Code 稳定的原因

### RAG 整合核心概念
- **对接模式**：LangChain RAG 后端 + AI SDK 前端流式展示
- **核心流程**：LangChain 检索文档 → 注入 streamText 的 system prompt → 前端流式展示
- **关键代码模式**：
  ```typescript
  const docs = await vectorStore.similaritySearch(query)  // LangChain 检索
  const context = docs.map(d => d.pageContent).join('\n')
  streamText({ system: `基于以下资料回答：\n${context}`, messages })
  ```
- **实战练习**：硬编码知识库 + 关键词检索模拟 RAG，成功检索到 React、Node.js、Next.js 文档
- **中文检索限制**：split(/\s+/) 对中文分词不友好，真实项目用向量检索解决
- **LangChain 依赖冲突**：@langchain/community@1.x 要求 core@1.x，与旧版 core@0.x 冲突
- **简化策略**：简单 demo 不需要安装 LangChain，硬编码模拟即可验证对接流程

### v6 关键变化
- `useChat` 返回 `sendMessage`（不是 `handleSubmit`）
- 消息用 `parts` 数组（不是 `content` 字符串）
- `sendMessage({ text })` 不是 `{ content }`
- 自定义 provider 用 `createOpenAI({ baseURL })` + `.chat()` 方法
- `body` 选项从 useChat 移到 transport 层（DefaultChatTransport）
- onToolCall 返回 void，用 addToolOutput 替代 return/addToolResult

---

## ❓ 学生提问记录

### 2026-04-25（上午：主题 1-6）

| 问题 | 回答要点 |
|------|---------|
| onClick 为什么报红 | regenerate 参数是 `{messageId}` 不是 MouseEvent，需要箭头函数包裹 |
| 怎么切换 chatID | useState 管理 id，传给 useChat({ id })，切换 id 自动重置 |
| 怎么读取旧对话 | AI SDK 本身不持久化，需要自己用 localStorage/数据库按 id 存取 |
| LLM 怎么精准识别调什么工具 | 不是提示词触发，是 LLM 返回标准化的 tool_calls JSON，框架按 name 匹配 |
| 怎么区分思考过程还是回答 | 靠响应结构：content 有文本=普通回答，tool_calls 有内容=要调工具 |
| Vercel AI SDK 本质上调 LangChain 吗 | 完全独立的库，定位不同，常组合使用 |

### 2026-04-25（下午：主题 7-9）

| 问题 | 回答要点 |
|------|---------|
| 为什么 LangChain 能调用成功结构化输出 | LangChain 是 prompt-driven（提示词+JSON.parse），AI SDK 是 API-driven（response_format），GLM 没有此参数 |
| 后面主要用 GLM 是不是要以 LangChain 为主 | 不互斥，LangChain 做后端逻辑，AI SDK 做前端交互，组合使用 |
| useChat 怎么传额外参数给后端 | v6 用 DefaultChatTransport({ body }) |
| modeRef 解释 | useRef 创建跨渲染持久化可变引用，改值不触发渲染，用于绕过闭包问题 |
| getCurrentPosition 怎么包 Promise | `new Promise((resolve, reject) => getCurrentPosition(resolve, reject))` |
| 怎么解决获取位置失败不停止 | try-catch 包裹，失败时 addToolOutput({ state: 'output-error', errorText }) |
| Claude Code 怎么解决 client tool 问题 | Claude 模型 tool calling 能力强，架构相同但模型能力差异 |
| GLM 生产环境怎么处理 | GLM 当纯文本对话，复杂交互前端解决，body/context 传参 |

### 2026-04-26（主题 10）

| 问题 | 回答要点 |
|------|---------|
| 为什么依赖冲突 | community@1.x 要求 core@1.x，但项目有 core@0.x，大版本不兼容 |
| keyword 隐式 any 类型 | 给 keywords 加 string[] 类型注解 |
