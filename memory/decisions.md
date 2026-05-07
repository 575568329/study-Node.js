# 决策记录

**最后更新**：2026-05-07

本文件用于追加记录重要项目决策与学习决策，不覆盖历史记录。

---

## 2026-05-07 - 使用仓库内 memory 文件作为 Codex 恢复上下文

**决策**：按照 `AGENTS.md` 要求，在仓库内 `memory/` 目录维护 Codex 工作记忆。

**原因**：
- `AGENTS.md` 明确要求每次启动前读取：
  - `memory/latest-session.md`
  - `memory/todo.md`
  - `memory/decisions.md`
  - `memory/architecture.md`
- 仓库内记忆文件随项目走，后续 session、账号或工具切换时更容易恢复上下文。

**取舍**：
- 这套记忆与外部 Claude 记忆目录 `C:\Users\fjyu9\.claude\...` 分离。
- 仓库内 memory 只记录项目上下文，不记录全局个人记忆或敏感信息。

---

## 2026-05-06 - LangGraph 示例按主题拆成小文件

**决策**：每个 LangGraph 学习主题在 `projects/langgraph-demo/` 下独立一个示例文件。

**原因**：
- 用户通过自己写代码和运行示例学习。
- 小文件让每个概念都能独立运行、独立复习、独立排错。

**当前映射**：
- `01-hello-graph2.ts`：基础图编排。
- `02-agent-with-tools.ts`：ToolNode 与 toolsCondition。
- `03-agent-with-memory.ts`：MemorySaver 与 thread 隔离。
- `04-human-in-the-loop.ts`：interrupt / resume。
- `05-agent-tool-approval.ts`：危险工具审批。
- `06-subgraph.ts`：子图组合。
- `07-multi-agent.ts`：Multi-Agent 审核循环。

---

## 2026-05-06 - 区分 messages 与 checkpoint

**决策**：聊天消息与 LangGraph checkpoint 分开建模，不能混为一谈。

**原因**：
- messages 用于用户侧聊天历史展示。
- checkpoint 用于恢复图执行状态，包括中断点、待执行节点和 pending writes。

**影响**：
- 生产级 ChatGPT 类应用中，应使用业务表维护 users / conversations / messages，同时使用持久化 checkpointer 恢复 LangGraph 执行现场。

---

## 2026-05-06 - 危险工具默认需要审批

**决策**：未知工具或危险工具默认要求人工审批。

**原因**：
- fail closed 策略可以避免模型误调用未知或危险能力。
- 审批界面必须展示真实工具名和真实参数，不能只展示模型自然语言解释。

**影响**：
- 安全工具可显式加入白名单。
- 删除、写文件、发请求等破坏性工具必须做参数校验、路径白名单和人工审批。
