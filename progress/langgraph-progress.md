# LangGraph.js 学习进度

**开始日期**: 2026-05-06
**最后更新**: 2026-05-06
**学习天数**: 1
**总体进度**: 10/12 (83%)

## 已掌握主题

| # | 主题 | 文件 | 日期 | 置信度 |
|---|------|------|------|--------|
| 1 | StateGraph 图编排（State/Node/Edge/条件分支） | 01-hello-graph2.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 2 | ReducedValue 追加模式 | 01-hello-graph2.ts | 2026-05-06 | ⭐⭐⭐ |
| 3 | Agent with Tools（ToolNode + toolsCondition） | 02-agent-with-tools.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 4 | MessagesAnnotation 消息状态 | 02-agent-with-tools.ts | 2026-05-06 | ⭐⭐⭐ |
| 5 | Memory 记忆（多轮对话上下文） | 03-agent-with-memory.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 6 | Human-in-the-loop（interrupt + Command resume） | 04-human-in-the-loop.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 7 | Agent 工具审批（危险工具执行前人工审批） | 05-agent-tool-approval.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 8 | Checkpoint 持久化设计（messages vs checkpoint） | 设计讨论 | 2026-05-06 | ⭐⭐⭐ |
| 9 | Subgraph 子图（主图调用子图 + State 映射） | 06-subgraph.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 10 | Multi-Agent 编排（角色分工 + 条件审核循环） | 07-multi-agent.ts | 2026-05-06 | ⭐⭐⭐⭐ |

## 待学习主题

| # | 主题 | 预估难度 |
|---|------|---------|
| 11 | Streaming 流式输出 | ⭐⭐ |
| 12 | Command + Send 动态路由 | ⭐⭐⭐⭐ |

## 踩坑记录

| 坑 | 解决方案 | 日期 |
|----|---------|------|
| MessagesState 不存在 | 用 MessagesAnnotation | 2026-05-06 |
| addEdge 传函数不是字符串 | 传节点名字符串 | 2026-05-06 |
| ChatOpenAI apiKey 参数名 | 是 apiKey 不是 openAIApiKey | 2026-05-06 |
| dotenv 加载时机 | 用同步 config() 放文件顶部 | 2026-05-06 |
| .env 等号有空格 | 去掉空格 | 2026-05-06 |
| dotenv 成功加载但变量名不一致 | .env 中是 ZHIPU_API_KEY，代码也必须读取 process.env.ZHIPU_API_KEY | 2026-05-06 |
| config 变量名冲突 | dotenv 的 config() 与 LangGraph runConfig 避免同名 | 2026-05-06 |
| interrupt resume 类型不明确 | Demo 可用 `as { approved: boolean }`，生产建议用 Zod 校验 | 2026-05-06 |
| LLM 可能脑补工具参数 | 危险工具执行前展示真实参数，并做路径白名单、权限校验、审批 | 2026-05-06 |
| messages 表不能替代 checkpoint | messages 解决展示历史，checkpoint 解决图从哪里继续 | 2026-05-06 |
| withApproval 泛型推断为 unknown | 调用时显式传入输入类型，如 `withApproval<CalculatorInput>()` | 2026-05-06 |
| State 字段名和节点名冲突 | State channel 与 node 共享命名空间，字段用名词、节点用动词，如 `draft` / `generateDraft` | 2026-05-06 |
| z.enum 返回值被推断为 string | 显式声明字面量联合类型，如 `type ReviewDecision = "approved" | "revise" | "force_final"` | 2026-05-06 |
| Multi-Agent 审核循环可能无限重试 | 增加 `revisionCount` 和 `force_final`，达到上限后强制收敛 | 2026-05-06 |

## 下次学习计划
- Streaming 流式输出
- Command + Send 动态路由
