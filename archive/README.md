# archive — Node.js 路线时代归档

> **本目录不再维护**。这里存放 2026-07-14 转向 Java 全栈方向之前的 Node.js 全栈路线遗留材料。
>
> 这些内容**不是垃圾**，是那段学习经历的真实记录，保留供日后查阅。但新工作不再在此推进，路径引用也不再更新。

## 归档背景

- **时间范围**：2026-03 ~ 2026-05（Node.js / React / Next.js / AI 应用全栈方向）
- **转折点**：2026-07-14 调整为 Java 全栈（Spring Boot / Dubbo / MySQL），以公司代码为教材
- **当前活跃区**：`knowledge/`（三线 vault）、`career/`（求职）、`projects/`（代码 demo）—— 那里的内容才是当前真源

## 目录速查

| 目录 | 文件数 | 内容 | 原位置 |
|------|--------|------|--------|
| [`nodejs-roadmap/`](./nodejs-roadmap) | 2 | Node.js 路线核心：加速计划 + 详细进度 | `progress/` |
| [`old-plans/`](./old-plans) | 22 | 过时的转型方案、设计文档、旧技能进度、项目记忆 | `docs/01-04`、`docs/plans/`、`progress/`、`memory/` |
| [`old-sessions/`](./old-sessions) | 46 | 9 个技能的学习会话记录（按日期） | `sessions/` |
| [`component-library/`](./component-library) | 3 | 组件库设计（已暂缓项目） | `docs/component-library/` |

---

## 各目录详解

### 📁 nodejs-roadmap/ — Node.js 路线核心

| 文件 | 说明 |
|------|------|
| `accelerated-plan.md` | Node.js 8 周求职冲刺计划（**已暂缓**）|
| `nodejs-progress.md` | Node.js 详细进度记录（78KB，最完整的路线进度）|

### 📁 old-plans/ — 过时规划与旧进度（22 文件）

**转型方案（原 `docs/01-04`，2026-05）**：
- `01-全栈转型项目证明方案.md`、`02-RAG项目体检清单.md`（Node.js 版）、`03-面试资产目录.md`、`04-全栈求职执行计划.md`

**设计文档（原 `docs/plans/`，带日期）**：
- `2026-04-29-ai-knowledge-base-design.md` + `...-learning-plan.md` — AI 知识库设计（外部 RAG 项目）
- `2026-05-22-dual-ai-collaboration-design.md` — 双 AI 协作设计（**Gemini 工具链的早期设计**，理解 `tools/gemini/` 演进时可查阅）
- `20260526-gemini-web-chat-design.md` — Gemini Web Chat 设计（同上，`tools/gemini/gemini-server.mjs` 的设计来源）
- `2026-05-22-interview-sprint-plan.md` — 面试冲刺计划

**旧技能进度（原 `progress/`，Node.js 路线技能快照）**：
- `ai-basics-progress.md`、`langchain-progress.md`、`langgraph-progress.md`、`nextjs-progress.md`、`react-progress.md`、`typescript-progress.md`、`vercel-ai-sdk-progress.md`、`vue3-progress.md`
- `current.md` — 旧"当前技能指针"（指向 TypeScript）

**项目记忆（原 `memory/`，2026-05-07 快照）**：
- `MEMORY.md`、`architecture.md`、`decisions.md` — 旧路线的项目架构与决策记录

**其他**：
- `进阶学习路线图.md` — 历史学习路线参考

### 📁 old-sessions/ — 学习会话记录（46 文件）

9 个技能的会话记录，每个技能一个目录，内含 `INDEX.md` + 按日期的 `session-notes.md`。

| 技能 | 会话数 | 时间跨度 |
|------|--------|---------|
| `nodejs/` | 14 | 2026-03-13 ~ 03-27（最完整）|
| `project-practice/` | 5 | 2026-04-29 ~ 05-05 |
| `react/` | 3 | 2026-03-31 ~ 04-04 |
| `ai-basics/` | 3 | 2026-04-10 ~ 04-13 |
| `langchain/` | 2 | 2026-04-18 ~ 04-19 |
| `langgraph/` | 2 | 2026-05-06 ~ 05-07 |
| `nextjs/` | 2 | 2026-04-07 ~ 04-08 |
| `vercel-ai-sdk/` | 2 | 2026-04-25 ~ 04-26 |
| `typescript/`、`vue3/` | 各 1 | 2026-03-31 |

另有 `SESSION-TEMPLATE.md`（会话笔记模板）、`nodejs/SESSION-TEMPLATE.md`。

### 📁 component-library/ — 组件库设计（已暂缓）

| 文件 | 说明 |
|------|------|
| `设计方案.md` | 组件库设计总纲 |
| `组件范围.md` | 组件范围清单 |
| `组件说明.md` | 已实现组件说明 |

> 组件库项目已暂缓（见原 `docs/00-工作入口.md` 暂缓事项）。

---

## 查阅提示

- **想了解 Node.js 路线学到哪了** → `nodejs-roadmap/nodejs-progress.md` + `old-sessions/nodejs/`
- **想了解 Gemini 工具链怎么演进来的** → `old-plans/2026-05-22-dual-ai-collaboration-design.md` + `20260526-gemini-web-chat-design.md`
- **想看旧面试准备材料** → 注意：当前面试材料在 `career/interview/`，这里只有过时的方案（`01-04`）
- **不要在这里做新工作** —— 新内容写进 `knowledge/` 或 `career/`

---
**归档时间**: 2026-07-21（仓库三线重构）
