# Tool Calling

> 学习日期: 2026-04-25 | 置信度: ⭐⭐⭐

---

## 核心概念

Tool Calling 让 LLM 能够调用外部工具（函数）。LLM 本身不执行代码，而是返回结构化的 JSON 告诉框架"我想调哪个工具，参数是什么"。

### 通信协议

```
┌──────────┐      请求（messages + tools 定义）      ┌──────────┐
│  前端     │  ─────────────────────────────────────→  │  LLM     │
│  useChat  │                                        │          │
│          │  ←─────────────────────────────────────  │          │
└──────────┘   响应：content（文字） 或 tool_calls     └──────────┘
                                                          │
                                               tool_calls? │
                                                          ↓
                                                   框架匹配 execute
                                                          │
                                                          ↓
                                                   执行结果喂回 LLM
                                                          │
                                                          ↓
                                                   LLM 再回复（可能继续调工具）
```

### 区分规则

- 响应中 `content` 有文本 → 普通文字回答
- 响应中 `tool_calls` 有内容 → 要调工具（不是提示词触发！）

---

## 代码示例

### 后端：定义工具 + Route Handler

```typescript
// app/api/chat/route.ts
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { stepCountIs } from 'ai';  // 注意：不是 isStepCount！
import { glm } from '@/lib/ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: glm.chat('glm-4-flash'),
    messages,
    tools: {
      // 工具定义：name 就是 key
      getWeather: tool({
        description: '获取指定城市的天气信息',
        parameters: z.object({
          city: z.string().describe('城市名称'),
        }),
        execute: async ({ city }) => {
          // 实际调用外部 API
          const res = await fetch(
            `https://api.weather.com?city=${city}`
          );
          return res.json();
        },
      }),

      calculator: tool({
        description: '计算数学表达式',
        parameters: z.object({
          expression: z.string().describe('数学表达式'),
        }),
        execute: async ({ expression }) => {
          // 简单示例，实际应用需要安全评估
          return { result: eval(expression) };
        },
      }),
    },
    // 关键：控制多步循环，默认只执行 1 步！
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
```

### 前端：渲染工具调用结果

```tsx
'use client';

import { useChat } from '@ai-sdk/react';

// 类型定义提到组件外面，避免每次渲染重建
interface ToolCallPart {
  type: 'tool-call';
  toolCallId: string;
  toolName: string;
  args: Record<string, unknown>;
}

interface ToolResultPart {
  type: 'tool-result';
  toolCallId: string;
  toolName: string;
  result: unknown;
}

export default function Chat() {
  const { messages, input, setInput, sendMessage, status } = useChat();

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>
          {msg.parts?.map((part, index) => {
            switch (part.type) {
              case 'text':
                return <p key={index}>{part.text}</p>;

              case 'tool-call':
                // LLM 决定调用工具
                return (
                  <div key={index} className="tool-call">
                    调用工具: {(part as ToolCallPart).toolName}
                    <pre>{JSON.stringify((part as ToolCallPart).args, null, 2)}</pre>
                  </div>
                );

              case 'tool-result':
                // 工具执行结果
                return (
                  <div key={index} className="tool-result">
                    结果: {(part as ToolResultPart).toolName}
                    {/* unknown 不能直接用在 JSX &&，需要类型检查 */}
                    {typeof (part as ToolResultPart).result !== 'undefined' && (
                      <pre>
                        {JSON.stringify((part as ToolResultPart).result, null, 2)}
                      </pre>
                    )}
                  </div>
                );

              default:
                return null;
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" disabled={status !== 'ready'}>发送</button>
      </form>
    </div>
  );
}
```

---

## 关键要点

1. **tool() 函数**：定义工具的 `description`（LLM 看的）+ `parameters`（Zod schema）+ `execute`（实际执行函数）
2. **LLM 不执行代码**：只返回 `tool_calls` JSON（包含 name + args），框架负责匹配和执行
3. **stepCountIs(N)**：控制最大执行步数。默认只执行 1 步，必须显式设置才能多步循环
4. **parts 数组**：一条消息可以混合 text / tool-call / tool-result 多种 part
5. **execute 是异步的**：可以在里面调外部 API、查数据库等

---

## ❌ 常见错误与纠正（复习重点）

### 错误1：用 `isStepCount` 而不是 `stepCountIs`

- **错误示例**: `stopWhen: isStepCount(5)`
- **错误原因**: Context7 文档名称与实际版本不同
- **正确理解**: `stopWhen: stepCountIs(5)`（从 `ai` 包导入）

### 错误2：Tool calling 页面不显示结果

- **错误示例**: 没有设置 `stopWhen`
- **错误原因**: 默认只执行 1 步，工具结果没有喂回 LLM 生成最终回答
- **正确理解**: 必须加 `stopWhen: stepCountIs(N)` 允许多步循环

### 错误3：`unknown` 类型用在 JSX `&&`

- **错误示例**: `{result && <pre>{JSON.stringify(result)}</pre>}`
- **错误原因**: TypeScript 中 `unknown` 不能直接用在逻辑表达式中
- **正确理解**: `typeof result !== 'undefined' && ...`

### 错误4：类型定义写在组件内部

- **错误示例**: 在组件函数体内 `interface ToolCallPart {...}`
- **错误原因**: 每次渲染都会重新创建类型（虽然运行时没影响，但不规范）
- **正确理解**: 提到组件外面

---

## 🔗 相关知识

- [[useChat核心API]] - Tool Calling 基于 useChat 扩展
- [[v6迁移指南]] - v6 中 Tool Calling 的 API 变化
- [[Vercel-AI-SDK速查表]] - tool() API 参考
