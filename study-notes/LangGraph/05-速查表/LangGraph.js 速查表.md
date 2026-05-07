# LangGraph.js 速查表

## StateGraph

```ts
new StateGraph(State)
  .addNode("node", nodeFn)
  .addEdge(START, "node")
  .addEdge("node", END)
  .compile();
```

## MessagesAnnotation

Agent 工具调用推荐使用：

```ts
new StateGraph(MessagesAnnotation)
```

## Memory

```ts
const checkpointer = new MemorySaver();
const graph = builder.compile({ checkpointer });

const runConfig = {
  configurable: { thread_id: "chat-1" },
};
```

## Human-in-the-loop

```ts
const review = interrupt(payload) as { approved: boolean };

await graph.invoke(
  new Command({ resume: { approved: true } }),
  runConfig
);
```

## 工具审批

```ts
const SAFE_TOOL_NAMES = new Set(["calculator", "getTime"]);

function shouldRequireApproval(toolName: string) {
  return !SAFE_TOOL_NAMES.has(toolName);
}
```

更推荐配置表：

```ts
const toolPolicies = {
  calculator: { approvalRequired: false },
  deleteFile: { approvalRequired: true },
};
```

## Checkpoint 设计

```text
messages：给用户看
checkpoint：给图恢复
thread_id：放 conversations 表
```

## Subgraph

```ts
async function callSubgraph(state: typeof MainState.State) {
  const result = await subGraph.invoke({ query: state.question });
  return { summary: result.summary };
}
```

## Multi-Agent 条件循环

```ts
type ReviewDecision = "approved" | "revise" | "force_final";

function routeAfterReview(state: typeof TeamState.State) {
  return state.reviewDecision === "revise" ? "writer" : "final";
}
```
## Streaming

```ts
const stream = await graph.stream(input, {
  streamMode: "updates",
});

for await (const chunk of stream) {
  console.log(chunk);
}
```

```text
updates：节点局部更新
values：每一步完整 State
```

## Send

```ts
function routeTasks(state: typeof PlannerState.State) {
  return state.tasks.map((task) => new Send("worker", { task }));
}
```

目标节点接收 `Send` 第二个参数：

```ts
type WorkerInput = { task: string };
```

## ReducedValue

```ts
results: new ReducedValue(
  z.array(z.string()).default(() => []),
  {
    inputSchema: z.array(z.string()),
    reducer: (existing, update) => existing.concat(update),
  }
)
```

用于多个 worker 并发写同一字段时合并结果。

## Command

```ts
return new Command({
  update: {
    finalAnswer: "简单问题直接回答",
  },
  goto: END,
});
```

```text
update：写 State
goto：决定下一跳
```
