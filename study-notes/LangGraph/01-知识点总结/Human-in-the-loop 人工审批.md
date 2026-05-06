# Human-in-the-loop 人工审批

> 学习日期: 2026-05-06 | 置信度: ⭐⭐⭐⭐

---

## 核心概念

Human-in-the-loop 是让图执行到关键节点时暂停，等待人类输入后继续。它依赖 checkpointer 保存暂停现场。

```text
interrupt(value) -> 暂停并返回 __interrupt__
Command({ resume }) -> 带人类答案恢复执行
```

## 代码示例

```ts
function humanReviewNode(state: typeof State.State) {
  const review = interrupt({
    question: "是否批准执行?",
    action: state.action,
  }) as { approved: boolean };

  return { approved: review.approved };
}

await graph.invoke(input, runConfig);

await graph.invoke(
  new Command({ resume: { approved: true } }),
  runConfig
);
```

## 关键要点

1. 第一次 invoke 执行到 `interrupt()` 会暂停。
2. 返回值中 `__interrupt__.value` 用于前端展示审批信息。
3. `__interrupt__.id` 标识暂停点。
4. 第二次 invoke 用 `Command({ resume })` 恢复。

## ❌ 常见错误与纠正

### 错误：把 resume 当成 State 字段
- **正确理解**: `resume` 是恢复输入，节点需要把它写入 `approved` 等 State 字段。

### 错误：以为只保存 messages 就能恢复
- **正确理解**: 恢复中断点需要 checkpoint 保存图执行现场。
