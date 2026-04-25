# Vercel AI SDK 会话记录 - 2026-04-25

## 会话概述
- **日期**: 2026-04-25
- **时长**: 约 2 小时
- **格式**: 深入讲解 + 理解检查 + 实战编码
- **主要主题**: useChat 状态管理、停止生成、重新生成、新对话、Tool Calling

---

## 学习过程

### Part 1: useChat 状态管理

#### 初始理解检查
**问题**: 你对 useChat 的 status 已经了解什么？
**学生的回答**: 知道有 status 字段，但不确定具体有哪些值和转换逻辑。

#### 深入讲解
- `status` 是一个状态机：`ready` → `submitted` → `streaming` → `ready`
- 比 `isLoading` 布尔值更精细：能区分"等待首字节"和"正在接收数据"
- `error` 状态：请求出错时进入

#### 理解检查
**问题**: submitted 和 streaming 的区别是什么？
**学生回答**: submitted 是请求发出去了还没收到回复，streaming 是已经在收数据了。正确。

---

### Part 2: 停止生成 & 重新生成

#### 初始理解检查
**问题**: 你觉得 stop() 和 regenerate() 分别在什么场景下使用？
**学生的回答**: stop 是 AI 回了一半觉得不好想停掉，regenerate 是回答完了觉得不满意想重新生成。

#### 深入讲解
- `stop()`：中断流式传输，保留已生成的内容
- `regenerate({ messageId })`：删除指定消息后重新请求
- 注意：regenerate 参数是 `{ messageId }`，不能直接传给 onClick

#### ❌ 错误记录
**错误**: onClick 直接传 regenerate 报红
**纠正**: regenerate 期望 `{ messageId }` 不是 MouseEvent，需要箭头函数包裹
```tsx
// 错误
<button onClick={regenerate}>
// 正确
<button onClick={() => regenerate({ messageId: msg.id })}>
```

---

### Part 3: 新对话

#### 初始理解检查
**问题**: 你觉得如何实现"新对话"功能？
**学生的回答**: 切换 chatID？

#### 深入讲解
- `useChat({ id })` 中的 id 是会话标识
- 用 useState 管理 id，切换 id 自动重置消息列表
- AI SDK 本身不持久化旧对话，需要自己用 localStorage/数据库按 id 存取

#### 理解检查
**问题**: 如果想读取之前的对话怎么办？
**学生回答**: 需要自己存储，SDK 不负责。正确。

---

### Part 4: Tool Calling（重点）

#### 初始理解检查
**问题**: 你对 Tool Calling 的理解是什么？LLM 是怎么"调"工具的？
**学生的回答**: 不太确定，是不是通过提示词让 LLM 知道有什么工具？

#### 深入讲解
Tool Calling 的完整通信协议：
1. 工具定义（name + description + parameters）随请求发给 LLM
2. LLM 返回标准化的 `tool_calls` JSON（不是执行代码，只是说"我想调 X"）
3. 框架按 name 匹配 execute 函数，执行后结果喂回 LLM
4. 区分靠字段：`content` 有值 = 文字回答，`tool_calls` 有值 = 要调工具

**关键代码**：
```typescript
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { stepCountIs } from 'ai';

const result = streamText({
  model: glm.chat('glm-4-flash'),
  messages,
  tools: {
    getWeather: tool({
      description: '获取天气',
      parameters: z.object({ city: z.string() }),
      execute: async ({ city }) => { /* ... */ },
    }),
  },
  stopWhen: stepCountIs(5),  // 关键！默认只 1 步
});
```

#### 理解检查
**问题**: LLM 怎么精准识别调什么工具？是提示词匹配吗？
**学生回答**: 不是，是 LLM 返回标准化的 tool_calls JSON，框架按 name 匹配 execute 函数。正确。

#### ❌ 错误记录

**错误1**: `isStepCount` 不存在
**纠正**: 实际名称是 `stepCountIs`（Context7 文档与实际版本不同）

**错误2**: Tool calling 页面不显示工具调用结果
**纠正**: 默认只执行 1 步，工具结果没有喂回 LLM。加 `stopWhen: stepCountIs(5)`

**错误3**: `unknown` 不能用在 JSX `&&`
**纠正**: 改用 `typeof t.output !== 'undefined'`

**错误4**: `ToolCallPart` 接口定义在组件内
**纠正**: 提到组件外面

---

### Part 5: Vercel AI SDK vs LangChain.js

#### 学生提问
**问题**: Vercel AI SDK 本质上调 LangChain 吗？

#### 回答要点
- 完全独立的库，没有依赖关系
- AI SDK 定位：Web 应用的 AI 交互体验（流式渲染、前端 Hook）
- LangChain 定位：AI 编排（RAG、Agent、Chain）
- 实际项目常组合使用：LangChain 做后端逻辑 + AI SDK 做前端交互

---

## 学习成果总结

### 新增主题
- useChat 状态管理（status 状态机）
- 停止生成（stop()）
- 重新生成（regenerate({ messageId })）
- 新对话（切换 id）
- Tool Calling（tool + inputSchema + execute + stepCountIs）
- Vercel AI SDK vs LangChain.js 定位对比

### 关键见解
1. Tool Calling 不是提示词触发，是结构化的通信协议（tool_calls JSON）
2. AI SDK 本身不持久化，需要自己实现存储层
3. v6 API 变化巨大，必须先看类型定义再写代码

---

## 表现评估

### 优势
- [x] 理解速度快，Tool Calling 原理一次就理解了核心
- [x] 实践能力强，所有功能都是自己写代码实现
- [x] 提问质量高，能问到通信协议、思考过程区分等深层问题
- [x] 代码规范意识好，主动拒绝使用 any
- [x] 对 v6 API 变化的适应能力强

### 改进建议
- [ ] 可以多关注 TypeScript 类型体操，对 SDK 类型定义的理解会更深入
- [ ] 实际项目中 Tool Calling 的错误处理和超时机制需要进一步学习

---

## 下次学习建议

1. **Structured Output**（P0）— `generateObject` / `streamObject` + Zod 定义输出格式
2. **System Prompt 深入**（P1）— 动态 prompt、多轮对话上下文管理
3. **Client-side Tool**（P1）— 前端工具、人机协作审批
4. **RAG 整合**（P0）— LangChain RAG 后端 + AI SDK 前端流式展示
