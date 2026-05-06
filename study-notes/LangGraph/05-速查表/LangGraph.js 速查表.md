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
