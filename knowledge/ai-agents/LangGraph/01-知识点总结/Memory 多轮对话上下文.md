# Memory 多轮对话上下文

> 学习日期: 2026-05-06 | 置信度: ⭐⭐⭐⭐

---

## 核心概念

LangGraph 的 Memory 不是模型自己记住内容，而是通过 checkpointer 保存图执行后的 state。`MessagesAnnotation` 负责 messages 如何追加，`MemorySaver` 负责保存和恢复 state，`thread_id` 负责定位是哪一条会话。

```text
MessagesAnnotation：怎么合并 messages
MemorySaver：把 state 存在哪里
thread_id：取哪一条会话的 state
```

## 代码示例

```ts
const checkpointer = new MemorySaver();

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", llmNode)
  .compile({ checkpointer });

const runConfig = {
  configurable: { thread_id: "demo-chat-1" },
};

await graph.invoke(
  { messages: [new HumanMessage("我叫张三")] },
  runConfig
);

await graph.invoke(
  { messages: [new HumanMessage("我叫什么？")] },
  runConfig
);
```

## 关键要点

1. 相同 `thread_id` 会延续上下文。
2. 不同 `thread_id` 是隔离会话。
3. `thread_id` 更像会话 ID，不是用户 ID。
4. `MemorySaver` 是内存存储，进程重启会丢。

## ❌ 常见错误与纠正

### 错误：把 Memory 理解为模型自己记住
- **正确理解**: 框架保存 state，下次调用同一 thread 时恢复。

### 错误：把 thread_id 当成 userId
- **正确理解**: userId 属于业务身份，thread_id 属于会话线程。
