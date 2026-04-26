# Vercel AI SDK 会话记录 - 2026-04-25

## 会话概述
- **日期**: 2026-04-25
- **时长**: 约 5 小时（上午 + 下午）
- **格式**: 深入讲解 + 理解检查 + 实战编码
- **主要主题（上午）**: useChat 状态管理、停止生成、重新生成、新对话、Tool Calling
- **主要主题（下午）**: Structured Output、System Prompt 深入、Client-side Tool

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

1. **RAG 整合**（P0）— LangChain RAG 后端 + AI SDK 前端流式展示

---

# 下午场：主题 7-9

## Part 6: Structured Output（结构化输出）

### 初始理解检查
**问题**: 你对 Structured Output 的理解是什么？和之前 LangChain 的 Zod 输出有什么不同？
**学生的回答**: 知道 LangChain 用 Zod 做结构化，不确定 AI SDK 的实现方式。

### 深入讲解
- AI SDK 通过模型原生 `response_format` 强制返回 JSON，不是提示词技巧
- 关键 API：`Output.object()` + Zod schema → `generateObject` / `streamObject`
- **API-driven vs Prompt-driven**：
  - AI SDK（API-driven）：设置 `response_format`，模型原生返回 JSON
  - LangChain（Prompt-driven）：提示词要求返回 JSON + JSON.parse 解析
- **GLM 限制**：GLM API 无 `response_format` 参数，不支持 `Output.object()`
- **Workaround**：用 tool calling 模拟（tool + toolChoice:'required' + inputSchema 定义结构）
- **Output vs Tool Calling 区别**：
  - Output.object() 直达取数据，tool calling 绕路执行动作
  - Output 直接返回干净 JSON，tool 需从 input 抠数据

### 理解检查
**问题**: 为什么 LangChain 能调用成功结构化输出，AI SDK 用 GLM 却失败？
**学生回答**: 因为 LangChain 用提示词方式，AI SDK 用 API 参数方式，GLM 没有这个参数。正确。

### 学生提问

| 问题 | 回答要点 |
|------|---------|
| 为什么 LangChain 能调用成功结构化输出 | LangChain 是 prompt-driven（提示词+JSON.parse），AI SDK 是 API-driven（response_format），GLM 没有此参数 |
| 后面主要用 GLM 是不是要以 LangChain 为主 | 不互斥，LangChain 做后端逻辑，AI SDK 做前端交互，组合使用 |

---

## Part 7: System Prompt 深入

### 初始理解检查
**问题**: 你觉得动态 system prompt 应该怎么实现？
**学生的回答**: 用变量拼接？不确定。

### 深入讲解
- `system` 参数：可以传动态字符串
- **策略映射**：`Record<Mode, string>` 对象替代 if-else，根据模式切换指令
- **v6 transport 传参**：`body` 从 `useChat` 移到了 `transport` 层（DefaultChatTransport）
- **ref+state 配合**：
  - state 管显示和切换（触发渲染）
  - ref 管 transport 取最新值（不触发渲染，绕过闭包问题）
  - `useRef` 创建跨渲染持久化可变引用，改值不触发渲染

### 关键代码
```tsx
const modeRef = useRef<Mode>('general');
modeRef.current = mode; // 每次渲染同步

const transport = useMemo(() => new DefaultChatTransport({
  body: () => ({ mode: modeRef.current }), // getter 取最新值
}), []);

const { messages, sendMessage } = useChat({ transport });
```

### ❌ 错误记录

**错误1**: useChat 的 `body` 选项报 TS 错误
**纠正**: v6 移除了 body，改到 transport 层。用 `new DefaultChatTransport({ body: ... })`

**错误2**: transport body 切换角色不生效
**纠正**: body 在 transport 创建时固定。用 `useRef` + getter 函数 `() => ({mode: ref.current})`

### 学生提问

| 问题 | 回答要点 |
|------|---------|
| useChat 怎么传额外参数给后端 | v6 用 DefaultChatTransport({ body }) |
| modeRef 解释 | useRef 创建跨渲染持久化可变引用，改值不触发渲染，用于绕过闭包问题 |

---

## Part 8: Client-side Tool（前端工具）

### 初始理解检查
**问题**: 后端工具和前端工具有什么区别？
**学生的回答**: 后端工具有 execute 在服务端跑，前端工具……是在浏览器跑？

### 深入讲解
- **区分标准**：后端工具有 `execute` → 服务端执行；前端工具无 `execute` → 转发给前端 `onToolCall`
- **onToolCall 返回 void**：不能直接 return 结果，必须用 `addToolOutput` 喂回
- **addToolOutput 桥接**：通过 ref 桥接（时序依赖问题）
- **sendAutomaticallyWhen**：控制是否自动重发
  - `() => true` 导致无限循环！每次响应都触发重发
  - 需要条件判断（检查 `state === 'output-available'`）
- **GLM 问题**：tool calling 不稳定（返回 Python 代码而非 tool call）
- **生产策略**：
  - GLM 当纯文本对话用
  - 浏览器能力前端解决（如获取位置）
  - 通过 body/context 传参数给后端
- **Claude Code 的启示**：Claude 模型 tool calling 能力强是 Claude Code 稳定的原因，架构相同但模型能力差异

### 关键代码
```tsx
const addToolOutputRef = useRef(addToolOutput);
addToolOutputRef.current = addToolOutput;

// 前端工具调用示例
const onToolCall = async (toolCall) => {
  if (toolCall.toolName === 'getLocation') {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      addToolOutputRef.current({
        toolCallId: toolCall.toolCallId,
        output: { lat: position.coords.latitude, lng: position.coords.longitude },
      });
    } catch {
      addToolOutputRef.current({
        toolCallId: toolCall.toolCallId,
        output: { state: 'output-error', errorText: '获取位置失败' },
      });
    }
  }
};
```

### ❌ 错误记录

**错误1**: onToolCall return string 报 TS 错误
**纠正**: v6 onToolCall 返回 void，用 `addToolOutput` 替代 return

**错误2**: `addToolResult` 找不到
**纠正**: v6 中 deprecated，改用 `addToolOutput`

**错误3**: sendAutomaticallyWhen: `() => true` 无限循环
**纠正**: 每次响应都触发重发，需要条件判断

**错误4**: GLM 返回 Python 代码而非 tool call
**纠正**: GLM tool calling 不稳定，生产环境用前端预获取+body传参

### 学生提问

| 问题 | 回答要点 |
|------|---------|
| getCurrentPosition 怎么包 Promise | `new Promise((resolve, reject) => getCurrentPosition(resolve, reject))` |
| 怎么解决获取位置失败不停止 | try-catch 包裹，失败时 addToolOutput({ state: 'output-error', errorText }) |
| Claude Code 怎么解决 client tool 问题 | Claude 模型 tool calling 能力强，架构相同但模型能力差异 |
| GLM 生产环境怎么处理 | GLM 当纯文本对话，复杂交互前端解决，body/context 传参 |

---

## 全天学习成果总结

### 新增主题（共 9 个）
1. 流式聊天基础（04-22）
2. useChat 状态管理（04-25 上午）
3. 停止生成（04-25 上午）
4. 重新生成（04-25 上午）
5. 新对话（04-25 上午）
6. Tool Calling（04-25 上午）
7. Structured Output（04-25 下午）
8. System Prompt 深入（04-25 下午）
9. Client-side Tool（04-25 下午）

### 关键见解
1. Tool Calling 不是提示词触发，是结构化的通信协议（tool_calls JSON）
2. AI SDK 本身不持久化，需要自己实现存储层
3. v6 API 变化巨大，必须先看类型定义再写代码
4. Structured Output 有 API-driven 和 Prompt-driven 两种路径，GLM 只支持后者
5. v6 transport 层取代了 useChat 的 body 选项，ref 是绕过闭包的关键
6. Client-side Tool 的核心是 onToolCall + addToolOutput，GLM tool calling 不稳定需降级处理
7. 模型能力差异决定架构选择（Claude tool calling 稳定 vs GLM 不稳定）

---

## 全天表现评估

### 优势
- [x] 理解速度快，Tool Calling 原理一次就理解了核心
- [x] 实践能力强，所有功能都是自己写代码实现
- [x] 提问质量高，能问到通信协议、思考过程区分等深层问题
- [x] 代码规范意识好，主动拒绝使用 any
- [x] 对 v6 API 变化的适应能力强
- [x] 能快速关联已有知识（LangChain 对比、闭包问题）
- [x] 对"为什么 LangChain 成功 AI SDK 失败"的思考很有深度

### 改进建议
- [ ] 对 v6 API 变更不够敏感（body 位置变化、onToolCall 返回 void），建议每次接触新 API 先看类型定义
- [ ] Client-side Tool 置信度偏低（⭐⭐），需要通过项目实战巩固
- [ ] 实际项目中 Tool Calling 的错误处理和超时机制需要进一步学习
