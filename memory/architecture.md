# 项目架构

**最后更新**：2026-05-07

## 仓库目标

`Node.js-Study` 已从 AI 辅助学习仓库切换为简历、面试和项目包装准备仓库。学习资料作为面试支撑材料继续保留。

核心技术栈：
- TypeScript
- React / Next.js
- Node.js
- RAG
- LangChain.js / Vercel AI SDK / LangGraph.js（作为支撑能力）

## 学习系统结构

```text
Node.js-Study/
├── AGENTS.md                  # Codex 导师规则与记忆规则
├── CLAUDE.md                  # 之前 Claude 导师规则
├── memory/                    # Codex 恢复上下文记忆
├── 简历相关/                  # 当前主目录：简历、方案、评价、网页简历项目
├── progress/                  # 各技能学习进度
├── sessions/                  # 每日学习会话记录
├── study-notes/               # Obsidian 风格笔记
├── projects/                  # 实战项目与练习 demo
└── code-examples/             # 小型代码示例
```

## Codex 必读记忆文件

`AGENTS.md` 要求每次开始工作前读取：

```text
memory/latest-session.md
memory/todo.md
memory/decisions.md
memory/architecture.md
```

任务结束时，如果上下文变化，需要同步更新这些文件。

## 当前学习架构

当前重点：简历、面试和项目包装。

```text
study-Node.js/简历相关/
  -> 三版简历 / 方案 / 评价 / 面试材料 / resume-web

C:\Users\about\OneDrive\桌面\study\rag-docs-assistant
  -> RAG 主项目，负责支撑 Node.js 全栈 AI 版简历

study-Node.js/sessions、progress、study-notes、projects
  -> 学习记录、补强笔记和 demo 仓库
```

LangGraph 当前状态：已完成 10/12，暂缓继续扩展，后续作为 Agent / MCP / Human-in-the-loop 的补充能力。

LangGraph 示例文件：

```text
projects/langgraph-demo/
├── 01-hello-graph.ts
├── 01-hello-graph2.ts
├── 02-agent-with-tools.ts
├── 03-agent-with-memory.ts
├── 04-human-in-the-loop.ts
├── 05-agent-tool-approval.ts
├── 06-subgraph.ts
├── 07-multi-agent.ts
├── package.json
└── .env
```

禁止在记忆文件中记录 `.env` 的密钥值。

## LangGraph 概念路线

```text
StateGraph 基础
  -> Agent with Tools
  -> Memory / Checkpoint
  -> Human-in-the-loop
  -> 工具审批
  -> Subgraph
  -> Multi-Agent
  -> Streaming
  -> Command + Send
```

当前不继续新开 Agent 项目；先把三版简历、RAG 主项目、工作项目讲稿和面试追问准备完整。

## 关键数据流

### Agent with Tools

```text
HumanMessage
  -> agent 节点
  -> toolsCondition 判断是否存在 tool_calls
  -> 如需工具则进入 ToolNode
  -> agent 节点总结工具结果
  -> END
```

### Memory

```text
graph.invoke(input, { configurable: { thread_id } })
  -> checkpointer 根据 thread_id 加载旧 state
  -> MessagesAnnotation 追加新 messages
  -> graph 执行
  -> checkpointer 保存更新后的 state
```

### Human-in-the-loop

```text
节点调用 interrupt(value)
  -> 图返回 __interrupt__
  -> 外部用户批准 / 拒绝
  -> graph.invoke(new Command({ resume }), 同一个 runConfig)
  -> 图从 checkpoint 中恢复并继续执行
```

### 生产持久化边界

```text
users / conversations / messages
  -> 用户可见历史、归属、权限

LangGraph checkpoint
  -> 图执行恢复、中断点、pending execution state
```

## 教学交互模式

沿用苏格拉底式教学：
- 先问用户已有理解。
- 用简短解释和具体代码讲概念。
- 讲完立即检查理解。
- 用户写 demo 时，优先给提示和检查点，不直接替写完整答案。
- 完成学习里程碑后更新 progress 和 session 文件。
