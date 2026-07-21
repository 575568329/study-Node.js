# Vercel AI SDK 速查表

> 学习日期: 2026-04-25 | 置信度: ⭐⭐⭐

---

## 安装

```bash
npm install ai @ai-sdk/react @ai-sdk/openai zod
```

---

## 后端 API（Route Handler）

### streamText — 流式文本生成

```typescript
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: yourModel,
    messages,
    // 可选：
    system: 'You are a helpful assistant.',
    tools: { /* tool definitions */ },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
```

### tool — 定义工具

```typescript
import { tool } from 'ai';
import { z } from 'zod';

const myTool = tool({
  description: '工具描述（LLM 看的）',
  parameters: z.object({
    param1: z.string().describe('参数描述'),
    param2: z.number().optional(),
  }),
  execute: async ({ param1, param2 }) => {
    // 实际执行逻辑
    return { result: '...' };
  },
});
```

### 自定义 Provider

```typescript
import { createOpenAI } from '@ai-sdk/openai';

export const myProvider = createOpenAI({
  baseURL: 'https://your-api.com/v1',
  apiKey: process.env.API_KEY!,
});

// 使用
const model = myProvider.chat('model-name');
```

---

## 前端 API（React Hook）

### useChat — 核心 Hook

```typescript
import { useChat } from '@ai-sdk/react';

const {
  // 数据
  messages,     // UIMessage[]
  input,        // string
  error,        // Error | undefined

  // 状态
  status,       // 'submitted' | 'streaming' | 'ready' | 'error'

  // 方法
  setInput,     // (value: string) => void
  sendMessage,  // (message: { text: string }) => void
  stop,         // () => void
  regenerate,   // (options: { messageId: string }) => void
} = useChat({
  id: 'chat-id',        // 会话标识，切换自动重置
  api: '/api/chat',     // 默认值
  onError: (err) => {}, // 错误回调
});
```

### UIMessage 结构

```typescript
interface UIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  parts: Array<
    | { type: 'text'; text: string }
    | { type: 'tool-call'; toolCallId: string; toolName: string; args: Record<string, unknown> }
    | { type: 'tool-result'; toolCallId: string; toolName: string; result: unknown }
  >;
}
```

### 提取文本

```typescript
// 从消息中提取纯文本
const text = msg.parts
  ?.filter(p => p.type === 'text')
  .map(p => p.text)
  .join('') ?? '';
```

---

## 状态判断

```typescript
// 等待首字节
const isThinking = status === 'submitted';

// 正在流式输出
const isStreaming = status === 'streaming';

// 可以发送新消息
const isReady = status === 'ready';

// 出错
const isError = status === 'error';

// 任意加载中
const isLoading = status === 'submitted' || status === 'streaming';
```

---

## 常用模式

### 新对话

```typescript
const [chatId, setChatId] = useState('chat-1');
const chat = useChat({ id: chatId });

const newChat = () => setChatId(`chat-${Date.now()}`);
```

### 停止生成

```typescript
<button onClick={() => stop()} disabled={status !== 'streaming'}>
  停止
</button>
```

### 重新生成

```typescript
<button onClick={() => regenerate({ messageId: msg.id })}>
  重新生成
</button>
```

---

## v6 陷阱速查

| 陷阱 | 正确做法 |
|------|---------|
| `handleSubmit` | `sendMessage` |
| `{ content }` | `{ text }` |
| `msg.content` | `msg.parts` |
| `ai/react` | `@ai-sdk/react` |
| `isLoading` | `status` 状态机 |
| `isStepCount` | `stepCountIs` |
| `toTextStreamResponse` | `toUIMessageStreamResponse` |
| `maxSteps` | `stopWhen: stepCountIs(N)` |
| `openai('model')` | `createOpenAI().chat('model')` |
| `handleInputChange` | 手动 `setInput` |

---

## 🔗 相关知识

- [[useChat核心API]] - 详细的 useChat 用法
- [[Tool-Calling]] - Tool Calling 完整示例
- [[v6迁移指南]] - 迁移详情和错误对照
