# 待办事项

**最后更新**：2026-05-07

## 当前主线

学习内容已基本完成。当前全面转向：

**用 RAG 主项目证明 Node.js / React / Next.js / AI 应用全栈能力，并准备面试追问材料。**

## 下一步任务

### P0：计划固化

- [x] 新增 `docs/04-全栈求职执行计划.md`。
- [x] 新增 `docs/组件库设计方案.md`。

### P1：项目体检

- [x] 切到外部仓库 `D:\Study\rag-docs-assistant`。
- [x] 按 `docs/02-RAG项目体检清单.md` 检查代码结构。
- [x] 输出 `docs/RAG项目体检报告.md`。
- [x] 标注已完成能力、简历可写点、面试风险点、必须补齐项。

### P2：组件库脚手架

- [x] 创建 `projects/fullstack-ui-kit`。
- [x] 配置 Vite + React + TypeScript。
- [x] 实现 AI / RAG / Agent 相关基础示例页。
- [x] 跑通 demo 页面。
- [ ] 补组件分层说明和 README。
- [x] 独立迁移到 `D:\\Study\\fullstack-ui-kit`。
- [x] 切换为可发布 npm 包结构。

### P3：RAG 项目面试资产

- [ ] 补 `rag-docs-assistant` README：项目定位、核心能力、技术栈、运行方式、演示流程。
- [ ] 补 RAG 项目架构图：上传 -> 解析 -> 切片 -> 向量化 -> 检索 -> Prompt -> SSE 流式回答 -> 来源引用。
- [ ] 准备 3 个演示文档和 5 个稳定演示问题。
- [ ] 写 RAG 项目 3 分钟讲稿。
- [ ] 写 RAG 项目 15-30 个常见追问答案。
- [ ] 写 RAG 项目演示脚本。

### P4：组件库第一版

- [x] 优先补 AI / RAG / Agent 相关组件：UploadPanel / SourceCard / ChatMessage / StepTimeline。
- [ ] 补前端复杂状态组件：StreamingText / ErrorStatePanel / RetryNotice / ConversationHistoryPanel。
- [ ] 仅保留普通基础组件最小集合，不把 Button / Input / Modal / Toast 作为主卖点。
- [ ] 补组件 API 文档。
- [ ] 准备组件库 2 分钟讲稿和追问清单。
- [ ] 初始化独立仓库 git remote 并准备首次提交。

### P5：全栈追问补强

- [ ] 梳理 API Route、文件上传、SSE、错误处理、日志。
- [ ] 梳理 JSON / SQLite / PostgreSQL / Chroma 的取舍。
- [ ] 从 RAG 项目中沉淀 3-5 个组件案例。
- [ ] 准备 Node.js 全栈 AI 版自我介绍。
- [ ] 大任务默认按子代理工作流拆分，任务边界和验收标准先写清楚。

### P6：工作项目材料

- [ ] 准备讯飞澳门项目 3 分钟讲稿和追问清单。
- [ ] 准备地灾 GIS 项目 2 分钟讲稿和追问清单。
- [ ] 补齐工作项目中的量化信息和真实边界。

### P7：简历落地

- [ ] 检查并完善 `简历相关/resume-web` 简历内容。
- [ ] 从 `docs/` 面试资产中提炼简历 bullet。
- [ ] 导出 PDF 并检查分页、空白和控件隐藏。
- [ ] 按 `docs/fullstack/复习计划.md` 继续推进 Node / React / Vue / Next / AI / 后端 复习，并把成熟内容回填到简历。

## 已完成

- [x] Node.js、TypeScript、Vue3、React、Next.js、AI 基础、LangChain.js、Vercel AI SDK 学习主线。
- [x] LangGraph.js 核心主题 12/12。
- [x] 初始化 memory 文件。
- [x] 简历相关文件夹已移动到 `study-Node.js/简历相关`。
- [x] 项目主线从学习流程切换为项目证明与面试准备。
- [x] 新增后续工作入口文档：`docs/00-工作入口.md`。
- [x] 新增项目分层索引：`projects/INDEX.md`。

## 技术债 / 清理项

- [ ] 确保 `.env` 不提交，不在 memory 文件中记录任何密钥。
- [ ] 检查 `AGENTS.md`、`CLAUDE.md` 中当前阶段描述是否同步到“全栈项目证明”。
- [ ] 如果后续继续维护 LangGraph demo，再补 `projects/langgraph-demo/INDEX.md`。


- [ ] 将 `docs/career/` 和 `docs/work-projects/` 继续提炼进简历成稿，删除不再需要的历史草稿。
