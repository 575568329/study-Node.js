# 最近会话

**最后更新**：2026-05-07

## 当前上下文

- 项目：`Node.js-Study`
- 当前阶段：学习内容已基本完成，转入项目证明、简历和面试准备。
- 当前定位：全栈工程师｜Node.js / React / Next.js｜AI 应用方向。
- 当前主项目：外部仓库 `D:\Study\rag-docs-assistant`。
- 当前仓库用途：学习记录、简历素材、项目证明方案、面试资产、辅助 demo。

## 后续工作读取顺序

1. `docs/00-工作入口.md`
2. `docs/01-全栈转型项目证明方案.md`
3. `docs/02-RAG项目体检清单.md`
4. `docs/03-面试资产目录.md`
5. `projects/INDEX.md`
6. `memory/latest-session.md`
7. `memory/todo.md`

简历任务再读：

1. `简历相关/个人背景与简历定位.md`
2. `简历相关/基于study-Node.js的学习路径判断.md`
3. `简历相关/三版本简历方向调研结论.md`
4. `简历相关/resume-web/README.md`

## 最近完成内容

- LangGraph.js 核心学习已完成 12/12。
- 已提交并推送：`feat: 完成 LangGraph 流式输出和动态路由学习`。
- 已提交并推送：`docs: 更新学习记忆上下文`。
- 用户明确：目前学习内容已经完成，后续要用项目证明能力，并保证面试追问能应对。
- 用户明确：放弃纯前端主线，全面转型全栈。
- 已新增项目读取入口与执行计划：
  - `docs/README.md`
  - `docs/00-工作入口.md`
  - `docs/01-全栈转型项目证明方案.md`
  - `docs/02-RAG项目体检清单.md`
  - `docs/03-面试资产目录.md`
  - `projects/INDEX.md`
  - `docs/04-全栈求职执行计划.md`
  - `docs/组件库设计方案.md`

## 当前项目状态

- `Node.js-Study` 不再以课程推进为核心。
- `rag-docs-assistant` 是主项目，需要先做体检；同时组件库作为第二条证明线，按 `docs/组件库设计方案.md` 推进。
- `projects/langgraph-demo`、`projects/langchain-demo`、`projects/ai-chat` 是学习证明，不作为主项目。
- `简历相关/resume-web` 是简历生成工具，后续简历内容从 `docs/` 面试资产中提炼。

## 下一步建议

直接进入：

```text
rag-docs-assistant 项目体检
```

按 `docs/02-RAG项目体检清单.md` 输出：

- 已完成能力。
- 简历可写点。
- 面试风险点。
- 必须补齐项。
- 建议执行顺序。

## 注意事项

- 不提交 `.env` 或密钥。
- 不大规模移动历史学习目录。
- 不把没有项目支撑的技术词写进简历主技能。
- 后续回答默认围绕“项目证明 + 面试可讲”展开。
## 2026-05-07 RAG 项目体检

- 已确认 RAG 主项目真实路径为 `D:\Study\rag-docs-assistant`。
- 已输出 `docs/RAG项目体检报告.md`。
- 体检结论：项目主体能力完整，但优先要修复构建失败、路径记录过期、对话历史不完整、图谱清理不完整等风险。
## 2026-05-07 RAG 构建修复

- 已在 `D:\Study\rag-docs-assistant\next.config.ts` 配置 `turbopack.root = process.cwd()`。
- 已执行 `npm install` 补齐本地依赖。
- 已验证 `npm run build` 通过。
- 下一步建议补删除知识库时图谱清理逻辑。
## 2026-05-07 RAG 数据一致性修复

- 已在 `D:\Study\rag-docs-assistant\src\app\api\kb\[id]\route.ts` 中删除知识库时同步调用 `getGraphStore().deleteCollection(id)`。
- 已验证 `npm run build` 通过。
- 剩余建议：补完整对话历史持久化，或补删除单个文档时图谱节点清理。
## 2026-05-07 RAG 对话历史闭环

- 已在 `D:\Study\rag-docs-assistant\src\lib\db.ts` 增加 `conversationMessages` 存储结构。
- 已扩展 `/api/chat/history?convId=xxx` 返回单个对话及完整消息。
- 已让 `/api/chat` 在带 `conversationId` 时保存 user / assistant 消息和 sources metadata。
- 已让前端通过 `convId` 路由新建、打开并恢复历史对话。
- 已验证 `npm run build` 通过。


## 2026-05-07 文档按项目归档

- 已将 RAG 面试资产统一收口到 `docs/projects/rag-docs-assistant/`。
- 已把求职定位、项目盘点、职业策略和历史调研整理到 `docs/career/`。
- 已把讯飞澳门项目素材和项目表达总结整理到 `docs/work-projects/`。
- 已将 `简历相关/` 收缩为简历工程、原始简历归档和少量直接相关材料。
- 已删除 `docs/` 根目录下与 RAG 项目重复的副本，保留项目分类目录作为真源。

## 2026-05-07 复习模式约定

- 后续 Node / React / Vue / Next / AI / 后端 复习按统一模式推进：
  先判断是否会，不会就按学习时的方式重新讲解，再配小实例或代码，最后出对应面试题。
- 该模式会作为后续知识点复习的默认节奏，避免下次又切回纯讲解或跳步复习。

## 2026-05-07 fullstack 复习入口补齐

- 已新增 `docs/fullstack/统一复习矩阵.md`，把 Node / React / Vue / Next / AI / 后端按 `必问 / 需精进 / 项目关联` 三层拆开。
- 已新增 `docs/fullstack/复习计划.md`，明确顺序为：先矩阵，再 Node，再 React/Vue/Next，再 AI/后端，最后面试模拟和简历回填。
- 已补 `docs/fullstack/` 下的后端与面试补强材料：
  - `Node后端追问清单.md`
  - `数据库与持久化取舍.md`
  - `SSE与WebSocket对比.md`
  - `MQ思想与Node落地.md`
  - `Java概念到Node类比.md`
- 已新增 `docs/projects/rag-docs-assistant/RAG项目简历描述.md`。
