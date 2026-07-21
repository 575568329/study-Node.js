# AI SDK v6 useChat 与流式输出

> 学习日期: 2026-05-03 | 置信度: ⭐⭐⭐⭐

---

## 核心概念

AI SDK v6（ai@6）是 Vercel 的 AI 交互库，`useChat` Hook 封装了完整的流式对话流程。

### v6 关键变化
- `body` 参数移到 `transport` 层，使用 `DefaultChatTransport`
- `onToolCall` 返回 `void`（不再是 result），需要用 `addToolOutput`
- `messages` 格式使用 `parts` 数组（`{ type: 'text', text: '...' }`）

## 代码示例

```typescript
// ChatPanel.tsx
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

const { messages, sendMessage, status, stop, regenerate } = useChat({
  id: kbId,  // 按知识库隔离对话
  transport: new DefaultChatTransport({
    body: () => ({ kbId })  // v6: body 在 transport 中
  })
})

// 发送消息
sendMessage({ text: input })

// 渲染消息（parts 格式）
const text = m.parts?.filter(p => p.type === 'text').map(p => p.text).join('')
```

## 关键要点
1. `id` 参数用于区分不同对话实例，避免消息串混
2. `status` 有 `ready` | `error` | 其他状态，控制发送/停止按钮切换
3. 后端用 `streamText(...).toUIMessageStreamResponse()` 返回流式响应
4. 前端消息格式用 `parts` 而非 `content`，需要手动提取文本

## ❌ 常见错误与纠正（复习重点）⚠️

### 错误1：消息格式不匹配
- **错误示例**: 后端收到 `{ role, content }` 但前端发的是 `{ role, parts }`
- **错误原因**: v6 的 UIMessage 使用 parts 数组，不是纯字符串
- **正确理解**: 后端需要转换 `parts → content`：

```typescript
const messages = rawMessages.map(m => ({
  role: m.role,
  content: m.parts?.filter(p => p.type === 'text').map(p => p.text).join('') ?? ''
}))
```

## 🔗 相关知识
- [[RAG对话API设计]]
