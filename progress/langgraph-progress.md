# LangGraph.js 学习进度

**开始日期**: 2026-05-06
**最后更新**: 2026-05-06
**学习天数**: 1
**总体进度**: 4/12 (33%)

## 已掌握主题

| # | 主题 | 文件 | 日期 | 置信度 |
|---|------|------|------|--------|
| 1 | StateGraph 图编排（State/Node/Edge/条件分支） | 01-hello-graph2.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 2 | ReducedValue 追加模式 | 01-hello-graph2.ts | 2026-05-06 | ⭐⭐⭐ |
| 3 | Agent with Tools（ToolNode + toolsCondition） | 02-agent-with-tools.ts | 2026-05-06 | ⭐⭐⭐⭐ |
| 4 | MessagesAnnotation 消息状态 | 02-agent-with-tools.ts | 2026-05-06 | ⭐⭐⭐ |

## 待学习主题

| # | 主题 | 预估难度 |
|---|------|---------|
| 5 | Memory 记忆（多轮对话上下文） | ⭐⭐ |
| 6 | Human-in-the-loop（人工审批） | ⭐⭐⭐ |
| 7 | Checkpoint 持久化 | ⭐⭐⭐ |
| 8 | Subgraph 子图 | ⭐⭐⭐⭐ |
| 9 | Multi-Agent 编排 | ⭐⭐⭐⭐ |
| 10 | Streaming 流式输出 | ⭐⭐ |
| 11 | Interrupt 中断恢复 | ⭐⭐⭐ |
| 12 | Command + Send 动态路由 | ⭐⭐⭐⭐ |

## 踩坑记录

| 坑 | 解决方案 | 日期 |
|----|---------|------|
| MessagesState 不存在 | 用 MessagesAnnotation | 2026-05-06 |
| addEdge 传函数不是字符串 | 传节点名字符串 | 2026-05-06 |
| ChatOpenAI apiKey 参数名 | 是 apiKey 不是 openAIApiKey | 2026-05-06 |
| dotenv 加载时机 | 用同步 config() 放文件顶部 | 2026-05-06 |
| .env 等号有空格 | 去掉空格 | 2026-05-06 |

## 下次学习计划
- Memory（多轮对话上下文保持）
- Human-in-the-loop（工具执行前人工审批）
