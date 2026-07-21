# Checkpoint 持久化设计

> 学习日期: 2026-05-06 | 置信度: ⭐⭐⭐

---

## 核心概念

Checkpoint 是图执行现场快照，负责让 LangGraph 从某一步继续执行。`MemorySaver` 只保存到内存，服务重启会丢。生产环境需要数据库 checkpointer。

## 关键区别

```text
messages：聊天历史，给用户看
checkpoint：执行现场，给 LangGraph 恢复
```

只保存 messages 无法恢复 Human-in-the-loop 的暂停点，因为缺少当前节点、pending interrupt、channel 版本、下一步任务等执行信息。

## 业务表设计

```text
conversations
- id
- user_id
- title
- thread_id
- status
- created_at
- updated_at

messages
- id
- conversation_id
- role
- content
- tool_name
- tool_call_id
- metadata
- created_at

approvals
- id
- conversation_id
- thread_id
- interrupt_id
- status
- payload
- decision
- created_at
- resolved_at
```

## 关键要点

1. `thread_id` 是 conversation 级别字段。
2. `messages` 通过 `conversation_id` 关联会话。
3. 审批任务建议单独建 approvals 表。
4. 线上多用户项目更适合 Postgres/MySQL checkpointer。
