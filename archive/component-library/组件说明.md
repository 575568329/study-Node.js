# fullstack-ui-kit 组件说明

更新时间：2026-05-07

## 项目定位

`fullstack-ui-kit` 不是一个通用 UI 大而全组件库，而是一个围绕 **AI 应用、RAG 工作台、Agent 执行过程和复杂前端状态** 的组件沉淀项目。

它的目标不是替代 Ant Design，而是把真实项目里更值得讲、也更难抽象的交互封装成组件，方便复用和面试表达。

## 当前已实现组件

### 1. `ChatMessage`

作用：

- 展示 AI 对话消息。
- 区分 `user`、`assistant`、`tool` 三种角色。
- 展示消息时间和当前状态，例如 `streaming`、`final`、`error`。

适用场景：

- ChatGPT 类聊天页面。
- RAG 问答记录。
- Agent 输出消息流。

为什么重要：

- 对话类界面里，消息结构和状态是最核心的交互之一。
- 后续如果要做流式输出，这个组件可以直接扩展。

### 2. `SourceCard`

作用：

- 展示检索到的来源片段。
- 显示标题、摘要、相关性分数、位置和标签。

适用场景：

- RAG 检索结果展示。
- 回答引用来源展示。
- 文档命中结果卡片。

为什么重要：

- 它能把“回答为什么是这个答案”展示出来。
- 这类组件是 RAG 项目里最容易被面试追问的部分。

### 3. `StepTimeline`

作用：

- 展示执行步骤的过程和状态。
- 支持 `pending`、`running`、`success`、`error`。

适用场景：

- Agent 执行链路展示。
- 任务流程展示。
- LangGraph 或工作流回放。

为什么重要：

- 这类组件能把流程状态可视化，便于排查和讲解。
- 它体现的是“复杂前端状态管理”，不是普通展示 UI。

### 4. `UploadPanel`

作用：

- 展示上传文件列表。
- 展示上传进度和错误状态。
- 支持重试操作。

适用场景：

- 文档上传。
- 知识库导入。
- 文件解析任务。

为什么重要：

- 文件上传是很多 AI/RAG 应用的入口环节。
- 上传、进度、错误、重试，本身就是一个完整的前端难点场景。

## 当前组件分层

### AI 对话层

- `ChatMessage`

### RAG 来源层

- `SourceCard`

### 流程执行层

- `StepTimeline`

### 上传与任务层

- `UploadPanel`

这种分层的目的很明确：

1. 每个组件都对应一个真实场景。
2. 组件之间可以独立复用。
3. 面试时能直接讲“我为什么会抽这个组件”。

## 目前不作为主卖点的组件

当前没有把下面这些普通控件作为主卖点：

- `Button`
- `Input`
- `Modal`
- `Toast`
- `Tabs`
- `Table`

原因：

1. 这些组件太常规。
2. 这个库的价值在于场景抽象，不在于重复造轮子。
3. 先把 AI / RAG / Agent 相关的组件做深更有证明力。

## 简历表达建议

如果后续继续补强，这个项目更适合这样表达：

```text
沉淀 React + TypeScript 组件库，围绕 AI 对话、RAG 来源引用、Agent 执行步骤和文件上传等高频场景进行组件抽象，封装 ChatMessage、SourceCard、StepTimeline、UploadPanel 等组件，提升业务页面复用性与复杂状态处理能力。
```

## 下一步建议

1. 补 `StreamingText`
2. 补 `ErrorStatePanel`
3. 补 `RetryNotice`
4. 补 `ConversationHistoryPanel`
5. 写独立仓库的 `README`

