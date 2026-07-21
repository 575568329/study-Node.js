# Streaming 流式输出

## 核心区别

```ts
await graph.invoke(input);
```

返回最终 State。

```ts
const stream = await graph.stream(input, { streamMode: "updates" });

for await (const chunk of stream) {
  console.log(chunk);
}
```

返回执行过程，可以逐步消费。

## streamMode

### updates

输出每个节点的局部更新：

```ts
{
  researcher: {
    researchNotes: "..."
  }
}
```

适合展示步骤进度、执行日志、Agent 轨迹。

### values

输出每一步完整 State：

```ts
{
  task: "...",
  researchNotes: "...",
  draft: "",
  review: ""
}
```

适合调试 State 如何一步步变化。

## 记忆点

```text
updates = 增量日志
values = 状态快照
invoke = 最终结果
stream = 执行过程
```

## 子图流式输出

默认主图 stream 主要暴露主图节点执行流。要观察子图内部节点，需要配合子图展开选项，例如 `subgraphs: true`。
