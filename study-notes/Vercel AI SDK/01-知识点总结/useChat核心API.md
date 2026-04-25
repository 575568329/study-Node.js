# useChat 核心 API

> 学习日期: 2026-04-25 | 置信度: ⭐⭐⭐

---

## 核心概念

`useChat` 是 Vercel AI SDK v6 的核心 React Hook，封装了与 AI 模型流式通信的完整生命周期。

### 返回值

```typescript
const {
  messages,      // UIMessage[] - 消息列表
  input,         // string - 输入框绑定值
  setInput,      // (value: string) => void
  status,        // 'submitted' | 'streaming' | 'ready' | 'error'
  sendMessage,   // (message: { text: string }) => void（v6 新名称）
  stop,          // () => void - 停止生成
  reload,        // () => void（v5 风格，v6 用 regenerate）
  regenerate,    // (options: { messageId: string }) => void
} = useChat({ id });
```

### status 状态机

```
ready ──sendMessage──→ submitted ──收到首字节──→ streaming ──完成──→ ready
                                                          └──error──→ error
```

- `submitted`: 请求已发送，等待服务器首字节
- `streaming`: 正在接收流式数据
- `ready`: 空闲，可发送新消息
- `error`: 出错

---

## 代码示例

### 基础聊天组件

```tsx
'use client';

import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, input, setInput, sendMessage, status } = useChat({
    id: 'default-chat',  // v6: 用 id 管理会话
  });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong>
          {/* v6: 从 parts 提取文本，不是 content 字符串 */}
          {msg.parts
            ?.filter((p) => p.type === 'text')
            .map((p, i) => (
              <span key={i}>{p.text}</span>
            ))}
        </div>
      ))}

      {/* 加载状态 */}
      {status === 'submitted' && <div>思考中...</div>}
      {status === 'streaming' && <div>生成中...</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });  // v6: { text } 不是 { content }
          setInput('');
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" disabled={status !== 'ready'}>
          发送
        </button>
      </form>
    </div>
  );
}
```

### 停止生成

```tsx
// streaming 状态下点击停止
<button onClick={() => stop()} disabled={status !== 'streaming'}>
  停止
</button>
```

### 重新生成

```tsx
// regenerate 接收 { messageId }，不是 MouseEvent
// 注意：需要箭头函数包裹！
{messages.map((msg) => (
  <div key={msg.id}>
    {msg.role === 'assistant' && (
      <button onClick={() => regenerate({ messageId: msg.id })}>
        重新生成
      </button>
    )}
  </div>
))}
```

### 新对话（切换 chatID）

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const [chatId, setChatId] = useState('chat-1');
  const { messages, input, setInput, sendMessage } = useChat({ id: chatId });

  const newChat = () => {
    const newId = `chat-${Date.now()}`;
    setChatId(newId);  // 切换 id，useChat 自动重置
  };

  return (
    <div>
      <button onClick={newChat}>新对话</button>
      {/* ... */}
    </div>
  );
}
```

---

## 关键要点

1. **v6 的 `sendMessage`** 替代了 v5 的 `handleSubmit`，参数是 `{ text }` 不是 `{ content }`
2. **`parts` 数组** 替代了 `content` 字符串，消息内容从 `msg.parts.filter(p => p.type === 'text')` 提取
3. **`status` 是状态机**，不用 `isLoading` 布尔值，能区分 submitted 和 streaming
4. **`regenerate`** 参数是 `{ messageId }`，直接传给 onClick 会报类型错误（MouseEvent 不匹配）
5. **`useChat({ id })`** 切换 id 自动重置消息列表，AI SDK 本身不持久化旧对话

---

## ❌ 常见错误与纠正（复习重点）

### 错误1：regenerate 直接传给 onClick

- **错误示例**: `<button onClick={regenerate}>`
- **错误原因**: regenerate 期望 `{ messageId }`，onClick 传的是 MouseEvent
- **正确理解**: `<button onClick={() => regenerate({ messageId: msg.id })}>`

### 错误2：用 `isLoading` 判断加载状态

- **错误示例**: `const { isLoading } = useChat()`
- **错误原因**: v6 没有 `isLoading`，用 `status` 状态机
- **正确理解**: `status === 'submitted' || status === 'streaming'`

### 错误3：用 `msg.content` 读取消息文本

- **错误示例**: `{msg.content}`
- **错误原因**: v6 UIMessage 没有 `content` 字符串字段
- **正确理解**: 从 `msg.parts` 数组提取文本

### 错误4：sendMessage 传 { content }

- **错误示例**: `sendMessage({ content: input })`
- **错误原因**: v6 参数名是 `text` 不是 `content`
- **正确理解**: `sendMessage({ text: input })`

---

## 🔗 相关知识

- [[Tool-Calling]] - Tool Calling 基于 useChat 扩展
- [[v6迁移指南]] - v6 全部破坏性变化汇总
- [[Vercel-AI-SDK速查表]] - API 快速参考
