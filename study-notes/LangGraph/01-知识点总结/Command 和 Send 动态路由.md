# Command 和 Send 动态路由

## Send

`Send` 用于动态派发节点执行任务：

```ts
new Send("worker", { task });
```

含义：

```text
让 worker 节点执行一次，并把 { task } 作为 worker 的输入
```

如果返回多个 `Send`：

```ts
return tasks.map((task) => new Send("worker", { task }));
```

就能动态派发多个 worker，形成 map-reduce 模式。

## worker 输入

`Send` 的第二个参数决定目标节点的输入类型：

```ts
type WorkerInput = {
  task: string;
};

function workerNode(state: WorkerInput) {
  return {
    results: [`完成任务: ${state.task}`],
  };
}
```

worker 不一定接收完整主图 State。

## ReducedValue

多个 worker 并发写同一个字段时，字段必须支持合并：

```ts
results: new ReducedValue(
  z.array(z.string()).default(() => []),
  {
    inputSchema: z.array(z.string()),
    reducer: (existing, update) => existing.concat(update),
  }
)
```

否则默认 `LastValue` 无法在同一个 step 接收多个更新。

## Command

`Command` 用于在节点内部同时更新 State 和决定下一跳：

```ts
return new Command({
  update: {
    finalAnswer: "简单问题直接回答",
  },
  goto: END,
});
```

- `update`：写入 State。
- `goto`：决定下一个节点，不写入 State。

节点需要声明可能跳转的目标：

```ts
.addNode("judge", judgeNode, {
  ends: ["planner", END],
})
```

## 适用场景

- 简单任务直接回答，复杂任务进入 planner。
- 节点内部已经拿到决策，不想额外写条件边函数。
- 动态拆分任务并派发多个 worker。
