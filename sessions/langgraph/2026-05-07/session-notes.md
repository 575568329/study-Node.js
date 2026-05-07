# LangGraph.js 学习会话 - 2026-05-07

## 会话概述
- **主题**: Streaming 流式输出 + Command / Send 动态路由
- **状态**: 已完成

## 学习内容

### 1. Streaming 流式输出（08-streaming.ts）
- `invoke()` 一次性返回最终 State。
- `stream()` 返回异步流，可以用 `for await...of` 逐步消费图执行过程。
- `streamMode: "updates"` 输出节点级局部更新，结构是 `节点名 -> 本次更新字段`。
- `streamMode: "values"` 输出每一步完整 State 快照。
- 适用场景：
  - `updates`：步骤进度、执行日志、Agent 轨迹展示。
  - `values`：调试完整状态变化。
  - `invoke`：只关心最终结果。
- 子图内部步骤默认不一定展开；需要观察子图内部节点时配合 `subgraphs: true`。

### 2. Send 动态派发（09-command-send.ts）
- `new Send("worker", { task })` 表示动态派发一次 `worker` 节点执行，并传入独立局部输入。
- `Send` 适合任务数量运行时才知道的场景，如多文件处理、多来源检索、多 worker 并发处理。
- `workerNode` 的入参类型由 `Send` 第二个参数决定，不一定等于主图完整 State。
- 完成 map-reduce 示例：
  - `planner` 拆分任务。
  - `routeTasks` 返回多个 `Send("worker", { task })`。
  - 多个 `worker` 并发返回 `results`。
  - `aggregator` 汇总 `results` 到 `finalAnswer`。

### 3. ReducedValue 并发合并
- 多个 `Send` worker 会在同一个 step 写入同一个字段。
- 如果字段是默认覆盖模式 `LastValue`，会报 `INVALID_CONCURRENT_GRAPH_UPDATE`。
- 使用 `StateSchema` 时，追加型字段应使用 `ReducedValue`，让 LangGraph 知道如何合并多个更新。

### 4. Command 动态路由
- `Command({ update, goto })` 可以在节点内部同时完成状态更新和下一跳路由。
- `update` 写入 State，`goto` 只负责路由，不会成为 State 字段。
- 完成 judge 示例：
  - 简单问题：`judge -> END`，直接写入 `finalAnswer`。
  - 复杂问题：`judge -> planner -> worker -> aggregator -> END`。
- `addNode("judge", judgeNode, { ends: ["planner", END] })` 用于声明 Command 可能跳转的目标。

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| streaming 和 invoke 的区别？ | `invoke` 返回最终结果，`stream` 返回执行过程。 |
| `graph` 是哪里来的？ | `new StateGraph(...).compile()` 得到可执行工作流对象。 |
| 找不到 `input` 名称？ | `input` 是自定义初始 State 对象，不是内置变量。 |
| `invoke` 结果为什么不能 `for await`？ | `invoke` 返回普通 State；`stream` 才返回异步迭代器。 |
| `registry` 为什么不能从主包导入？ | `registry` 属于 Zod 适配层，在 `@langchain/langgraph/zod`。 |
| `StateSchema` 下为什么 reducer 没生效？ | `StateSchema` 使用 `ReducedValue` 表示 reducer 字段，不使用 Zod registry reducer。 |
| `workerNode` 为什么不是完整主图 State？ | `Send("worker", { task })` 传什么，worker 就接收什么。 |

## 理解检查结果

| 检查点 | 学生回答 | 评估 |
|--------|----------|------|
| `updates` vs `values` | `updates` 返回节点更新，`values` 返回完整状态 | 基本正确，需注意 `values` 是每一步完整 State，不是“指定节点状态”。 |
| `Send` 与 `ReducedValue` | 多任务累加时避免覆盖 | 正确。 |
| `Command` 与条件边 | 直接决定下一步节点 | 正确，但应表述为节点自己返回 `goto`。 |
| 简单问题为何只看到 judge | `Command` 直接跳到 END | 正确。 |

## 新增错误记录

### 错误14：把 `invoke()` 返回值当 stream 使用
- **现象**: TypeScript 提示对象没有 `[Symbol.asyncIterator]()`。
- **原因**: `invoke()` 返回最终 State，不是异步迭代器。
- **正确**: 使用 `await graph.stream(...)`，再 `for await...of`。

### 错误15：`StateSchema` 中 Zod registry reducer 未生效
- **现象**: 多个 worker 并发写 `results` 报 `LastValue can only receive one value per step`。
- **原因**: `StateSchema` 将普通 Zod schema 转为 `LastValue`；Zod registry reducer 没被用于该场景。
- **正确**: 使用 `new ReducedValue(...)` 定义可合并字段。

### 错误16：混淆 Send 输入和主图 State
- **现象**: `workerNode` 误按完整主图 State 写类型。
- **原因**: `Send` 的第二个参数会成为目标节点的局部输入。
- **正确**: `new Send("worker", { task })` 对应 `type WorkerInput = { task: string }`。

## 掌握主题
- LangGraph `stream()` 基础使用
- `updates` 与 `values` 的输出差异
- `Send` 动态派发多个 worker
- map-reduce 图模式
- `ReducedValue` 处理并发写入
- `Command({ update, goto })` 节点内动态路由

## 表现评估
- 能准确抓住 `stream` 相比 `invoke` 的核心价值：观察执行过程。
- 能从 `Send` 的实际输入推导 worker 类型，说明已经理解动态派发的输入边界。
- 对 `ReducedValue` 的作用能迁移到并发 worker 场景，说明前面 steps 追加模式已经形成关联。
- 后续需要继续强化：不同 State 定义方式（`StateSchema`、`Annotation.Root`、Zod registry）的 reducer 写法差异。
