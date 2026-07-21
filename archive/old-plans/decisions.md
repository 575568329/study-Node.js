# 决策记录

**最后更新**：2026-05-07

本文件用于追加记录重要项目决策与学习决策，不覆盖历史记录。

---

## 2026-05-07 - 仓库主线切换为简历和面试准备

**决策**：`study-Node.js` 学习流程视为基本走完，当前仓库主线切换为简历、面试和项目包装准备。

**原因**：
- 用户已将 `简历相关/` 移动到 `study-Node.js` 内。
- Node.js、TypeScript、React、Next.js、LangChain、Vercel AI SDK、RAG、LangGraph 核心学习已经覆盖。
- 当前最重要目标是求职转化，而不是继续推进课程式学习。

**影响**：
- `简历相关/` 成为当前主工作目录。
- `rag-docs-assistant` 是 Node.js 全栈 AI 版简历的主项目支撑。
- `sessions/`、`progress/`、`study-notes/`、`projects/` 作为面试支撑材料和查漏补缺资料。
- 后续任务优先级：三版简历、PDF、项目讲稿、追问清单、面试模拟。

---

## 2026-05-07 - 学习主线从 LangGraph 扩展切换到 RAG 项目闭环

**决策**：暂停继续扩展 LangGraph 新主题和新 Agent 项目，优先把 `rag-docs-assistant` 打磨成可投递、可演示、可讲解的主项目。

**原因**：
- `study-Node.js` 已覆盖 Node.js、TypeScript、React、Next.js、LangChain、Vercel AI SDK、RAG、LangGraph，多数基础已经够用。
- 当前简历和面试更缺项目闭环、架构图、README、演示数据、讲稿和追问答案。
- 继续学习 MCP / OpenClaw / LangGraph 高级主题会增加关键词，但短期内不能显著提升投递可信度。

**影响**：
- `rag-docs-assistant` 成为当前唯一主项目。
- `projects/langchain-demo`、`projects/ai-chat`、`projects/langgraph-demo` 作为学习 demo 和面试复习材料，不作为主简历项目。
- LangGraph 的 Streaming、Command + Send 后置，后续需要时再恢复。

**下一步**：
- 补 README、架构图、演示数据、3 分钟讲稿、追问清单。
- 补 Node.js API Route、文件上传、SSE、错误处理、日志和任务状态。
- 从 RAG 项目提炼组件化沉淀案例。

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

---

## 2026-05-07 - 文档按项目归档优先于按类型平铺

**决策**：后续求职材料按项目归属分类收口，RAG 主项目、工作项目、求职策略分别放到独立目录，不再把同一项目的材料继续平铺在 `docs/` 根目录。

**原因**：
- 项目材料已经从零散草稿进入可复习、可演示、可引用的阶段。
- 同一项目的 README、架构、讲稿、追问、演示脚本应该保持同目录，减少路径漂移。
- `docs/` 根目录继续保留总入口和跨项目索引更合理。

**影响**：
- `docs/projects/rag-docs-assistant/` 作为 RAG 主项目真源。
- `docs/career/` 作为求职定位和历史调研真源。
- `docs/work-projects/` 作为工作项目表达真源。
- `简历相关/` 只保留简历工程和原始简历归档。

---

## 2026-05-07 - 复习采用“先判断会不会”的教学节奏

**决策**：后续 Node / React / Vue / Next / AI / 后端 的复习统一采用“先判断会不会，不会就重讲，再做实例或代码，最后出面试题”的节奏。

**原因**：
- 用户希望复习过程接近学习阶段的节奏，但目标是面试可答而不是只听懂。
- 这种节奏能把“理解、动手、表达”串成一个闭环，便于发现盲区。
- 先问再讲可以避免重复灌输已经掌握的内容。

**影响**：
- 后续每个知识点都先做理解确认。
- 不会的内容补讲时要配小实例或代码。
- 每个知识点最后都要落到面试题。

---

## 2026-05-07 - 组件库定位收敛为 AI 场景与复杂状态抽象

**决策**：`fullstack-ui-kit` 不做通用大而全 UI 库，优先抽取 AI 对话、RAG 来源引用、Agent 执行步骤、文件上传、流式输出、错误恢复等组件。

**原因**：
- 用户明确组件库主要服务 AI 相关场景、简历项目沉淀和前端疑难杂症。
- 普通按钮、输入框、弹窗、表格等组件不是核心卖点，做太多会稀释项目价值。
- 面试里更有说服力的是“从真实项目中抽象出高频复杂场景组件”，而不是重复造常规 UI 轮子。

**影响**：
- 第一批优先组件调整为 `ChatMessage`、`SourceCard`、`StepTimeline`、`UploadPanel`。
- `StreamingText`、`ErrorStatePanel`、`RetryNotice`、`ConversationHistoryPanel` 作为复杂状态补强。
- 常规基础组件只保留最小能力，不作为简历主卖点。

---

## 2026-05-07 - 组件库实现采用最小可运行 Vite 子项目

**决策**：`projects/fullstack-ui-kit` 先用独立 Vite + React + TypeScript 子项目落地，并以 `ChatMessage`、`SourceCard`、`StepTimeline`、`UploadPanel` 作为首批可演示组件。

**原因**：
- 组件库需要先有可运行、可构建、可展示的真实代码，再继续补文档和面试材料。
- 先做 AI / RAG / Agent 场景组件，比先做 Button / Input / Modal 更符合项目定位。
- 最小可运行版本更容易验证构建链路和后续扩展边界。

**影响**：
- 组件库可直接 `npm run dev` 和 `npm run build`。
- 后续优先补 `StreamingText`、`ErrorStatePanel`、`RetryNotice`、`ConversationHistoryPanel`。
- 普通基础组件后置，只作为辅助，不作为主卖点。

---

## 2026-05-07 - npm 版本独立放在 D:\\Study\\fullstack-ui-kit

**决策**：真正要发布 npm 的组件库独立仓库放到 `D:\Study\fullstack-ui-kit`，不再依附于 `Node.js-Study`。

**原因**：
- npm 包需要清晰独立的仓库边界。
- 这样可以单独配置 `peerDependencies`、`exports`、`files`、打包产物和发布流程。
- 方便后续直接绑定 `git@github.com:575568329/fullstack-ui-kit.git`。

**影响**：
- `Node.js-Study` 里保留方案和索引，不再作为发布源。
- `D:\Study\fullstack-ui-kit` 成为 npm 发布真源。
- 目前已切为 library mode，并可成功构建出 `dist/index.js`、`dist/index.cjs`、`dist/style.css`。

---

## 2026-05-07 - 仓库级子代理工作流采用主线程加子代理模式

**决策**：把 `codex_with_cc` 的核心协作思想集成到当前仓库规则中，采用“主线程规划 + 子代理分工 + 主线程验收”的协作模式。

**原因**：
- 当前项目涉及 RAG 主项目、组件库、简历和面试材料，任务并行度高。
- 子代理适合做调查、实现和审查分工，能减少单线程上下文污染。
- 需要一套可重复的协作规范，而不是每次临时决定是否拆分。

**影响**：
- `AGENTS.md` 增加了子代理调度边界和输出要求。
- 新增 `docs/codex_with_cc子代理工作流.md` 作为可执行说明。
- 后续大任务可以优先考虑并行拆分，但必须保持 scope 互斥、主线程最终验收。
