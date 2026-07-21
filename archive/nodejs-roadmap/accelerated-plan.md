# 🚀 8周求职冲刺计划（4月-5月）

**创建日期**: 2026-03-31
**调整日期**: 2026-03-31（由4周调整为8周）
**目标**: 2个月完成 AI 应用开发转型，6月初开始求职
**求职定位**: AI+前端复合型人才（月薪 20K-50K）

---

## 市场调研结论

- AI 前端岗位同比增长 74%，复合人才极度稀缺
- 薪资溢价 30%-50%（相比纯前端）
- 核心技能组合：TypeScript + LangChain.js + RAG + Agent + 全栈交付
- Vercel AI SDK（npm 880万/周）比 LangChain.js（243万/周）更流行，两个都要学

---

## 阶段一：前端基础收尾（第1-2周，04-01 ~ 04-14）

### 第1周（04-01 ~ 04-07）：React Hooks 进阶

**目标**: React 核心全部掌握，不再回头

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | useMemo / useCallback 性能优化 | 代码练习 |
| Day 2 | useContext / useReducer 状态管理 | 代码练习 |
| Day 3 | 自定义 Hook 设计 + React 事件类型 + 泛型组件 | React 收尾 |
| Day 4 | React Router v6 + 数据获取模式 | 路由练习 |
| Day 5 | Zustand 状态管理（轻量，对标 Pinia） | 状态管理练习 |
| Day 6-7 | 综合练习：用 React+TS 重写一个完整小项目 | React 毕业项目 |

**交付物**: React 全部核心完成（28/28 topics），可独立开发 React 应用

### 第2周（04-08 ~ 04-14）：Next.js 基础

**目标**: 掌握 Next.js 核心能力，为 AI 应用搭建全栈框架

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | Next.js 项目搭建 + App Router + 文件路由 | Next.js 项目 |
| Day 2 | Server Components vs Client Components | 组件练习 |
| Day 3 | API Routes + Server Actions | 后端 API |
| Day 4 | SSR / SSG / ISR 渲染策略 | 渲染模式练习 |
| Day 5 | Next.js + TypeScript + Tailwind CSS 整合 | 全栈项目骨架 |
| Day 6-7 | Next.js 实战：搭建 AI 项目前端骨架 + 布局 + 路由 | 项目1 前端框架 |

**交付物**: 可运行的 Next.js 全栈项目骨架

---

## 阶段二：AI 核心技能（第3-5周，04-15 ~ 05-05）

### 第3周（04-15 ~ 04-21）：大模型基础 + Prompt 工程

**目标**: 理解大模型原理，掌握 API 调用和 Prompt 设计

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | 大模型基础：Transformer/Token/Embedding 概念 | 概念笔记 |
| Day 2 | OpenAI API 调用（Chat Completion、参数调优） | API 调用代码 |
| Day 3 | Anthropic API 调用 + 两者对比 | API 调用代码 |
| Day 4 | Prompt Engineering：结构化/ Few-shot / Chain of Thought | Prompt 模板库 |
| Day 5 | 流式输出原理：SSE / ReadableStream / 前端配合 | 流式输出代码 |
| Day 6-7 | 实战：做一个命令行聊天工具（流式输出） | CLI 聊天工具 |

**交付物**: 能独立调用 AI API + 设计 Prompt + 处理流式输出

### 第4周（04-22 ~ 04-28）：LangChain.js + RAG

**目标**: 掌握 LangChain.js 核心，构建 RAG Pipeline

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | LangChain.js 入门：Model / Prompt / Chain / Output Parser | 练习代码 |
| Day 2 | Embeddings 原理 + 文本切片策略（Chunking） | 切片练习 |
| Day 3 | 向量数据库：Chroma 本地部署 + CRUD 操作 | 向量存储代码 |
| Day 4 | RAG 完整 Pipeline：加载 → 切片 → 向量化 → 检索 → 生成 | RAG Pipeline |
| Day 5 | RAG 优化：检索策略、重排序、上下文窗口管理 | 优化版 RAG |
| Day 6-7 | **项目1 开始**: AI 知识库问答系统后端 | RAG 后端 API |

**交付物**: 可运行的 RAG Pipeline + 项目1 后端

### 第5周（04-29 ~ 05-05）：Vercel AI SDK + 项目1 整合

**目标**: 前端 AI 交互 + 项目1 前后端整合

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | Vercel AI SDK：useChat / useCompletion / streaming | AI 交互组件 |
| Day 2 | Vercel AI SDK + Next.js API Routes + Tool Calling | 全栈 AI 练习 |
| Day 3 | 项目1：前端（Next.js + Vercel AI SDK）+ 后端（LangChain.js RAG） | 项目整合 |
| Day 4 | 项目1：文档上传 + 多轮对话 + 上下文管理 | 功能完善 |
| Day 5 | 项目1：UI 打磨 + 错误处理 + 加载状态 | 项目完善 |
| Day 6 | 项目1：前端 UI 优化（侧边栏差异化、图谱白底适配、JSON 持久化、实体提取集成）| UI 优化完成 |
| Day 7 | 项目1：测试 + 修复 + 功能验证 | 项目1 完成 |

**交付物**: **项目1 完成** — AI 知识库问答系统（前端 + 后端 + RAG）

---

## 阶段三：Agent + 项目2（第6-7周，05-06 ~ 05-19）

### 第6周（05-06 ~ 05-12）：LangGraph + Agent 开发

**目标**: 掌握 Agent 工作流编排，做出第二个项目

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | LangGraph.js 入门：State / Node / Edge / 图编排 | Agent 练习 | ✅ |
| Day 2 | Agent 模式：ReAct / Tool Use / Function Calling | Agent 练习 |
| Day 3 | Multi-Agent 概念 + 人机协作模式 | 概念 + 练习 |
| Day 4 | **项目2 开始**: AI Agent 助手（工具调用 + 联网搜索） | 项目2 骨架 |
| Day 5 | 项目2：Agent 编排 + 工具定义 + 状态管理 | Agent 功能 |
| Day 6-7 | 项目2：前端界面 + 对话管理 + 结果展示 | 项目2 功能完善 |

**交付物**: Agent 工作流掌握 + 项目2 开发中

### 第7周（05-13 ~ 05-19）：项目2 完善 + 两个项目打磨

**目标**: 项目2 完成，两个项目都达到可展示水平

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | 项目2：功能完善 + 边界场景处理 | 项目2 完善 |
| Day 2 | 项目2：UI 优化 + 交互细节打磨 | 项目2 完善 |
| Day 3 | 两个项目：统一代码风格 + TypeScript 类型补全 | 代码质量 |
| Day 4 | 两个项目：README 编写 + 技术文档 | 项目文档 |
| Day 5 | 两个项目：Docker 化 + 部署到 Vercel/Railway | 项目上线 |
| Day 6-7 | 两个项目：最终测试 + 修复 + 录制演示 | 项目交付 |

**交付物**: **两个 AI 项目上线**，有公开访问地址

---

## 阶段四：求职冲刺（第8周，05-20 ~ 05-26）

**目标**: 简历 + 面试准备 + 开始投递

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | 简历重写：突出 AI+前端复合能力 + 项目经历 | 简历 v1 |
| Day 2 | 面试题整理：RAG 原理 / Prompt 工程 / Agent 模式 / 流式输出 | 面试题库 |
| Day 3 | 模拟面试：技术问答（AI 应用开发方向） | 面试练习 |
| Day 4 | 模拟面试：项目讲解（技术选型、架构设计、难点解决） | 项目讲解稿 |
| Day 5 | GitHub Profile 优化 + 个人技术博客（选做） | GitHub 打磨 |
| Day 6-7 | 开始投递简历 + 持续优化 + 查漏补缺 | 求职启动 |

**交付物**: 简历 + 面试准备完成 + 开始投递

---

## 核心项目规划

### 项目1：AI 知识库问答系统（第4-5周）

**技术栈**：
- 前端：Next.js + React + TypeScript + Tailwind CSS
- AI 交互：Vercel AI SDK（流式输出）
- AI 编排：LangChain.js
- 向量数据库：Chroma（本地开发）/ Pinecone（线上）
- 部署：Vercel + Railway

**核心功能**：
1. 文档上传 + 自动切片 + 向量化
2. 基于文档的智能问答（RAG）
3. 流式输出对话界面
4. 多轮对话 + 上下文管理
5. 检索结果高亮 + 来源追溯

**面试展示重点**：RAG Pipeline 设计、向量检索优化、流式输出实现

### 项目2：AI Agent 助手（第6-7周）

**技术栈**：
- 前端：Next.js + React + TypeScript + Tailwind CSS
- AI 编排：LangGraph.js
- 工具集成：联网搜索 / 文件操作 / 代码执行
- 部署：Vercel + Railway

**核心功能**：
1. 多工具 Agent（搜索、计算、文件处理）
2. Agent 工作流可视化（展示推理过程）
3. 人机协作（审批节点）
4. 对话历史 + 任务状态管理

**面试展示重点**：Agent 编排、工具调用、状态管理、人机协作设计

---

## 每日时间分配

| 时段 | 内容 | 时长 |
|------|------|------|
| 上午 | 新概念学习 + 跟练代码 | 2-3h |
| 下午 | 项目实战 + 写代码 | 3-4h |
| 晚上 | 笔记整理 + 复习 + 查漏补缺 | 1-2h |

**总时长**: 每天 6-9 小时

---

## 关键里程碑

| 日期 | 里程碑 | 验证标准 |
|------|--------|---------|
| 04-07 | React 全部完成 | 能独立开发 React+TS 应用 |
| 04-14 | Next.js 基础完成 | 能搭建全栈项目骨架 |
| 04-21 | AI 基础 + Prompt 掌握 | 能独立调用 API + 设计 Prompt |
| 04-28 | RAG Pipeline + 项目1后端 | RAG 问答可用 |
| 05-05 | **项目1 完成** | 可演示的 RAG 知识问答系统 |
| 05-12 | Agent 开发掌握 | 能编排多工具 Agent |
| 05-19 | **项目2 完成 + 两个项目上线** | 两个公开可访问的 AI 应用 |
| 05-26 | 简历 + 面试准备 | 开始投递简历 |

---

## 风险预案

| 风险 | 应对方案 |
|------|---------|
| 提前被裁（4月底前） | 项目1 优先做完，至少有一个能展示的 AI 项目 |
| LangChain.js 学不动 | 降级到 Vercel AI SDK + 直接调 OpenAI API |
| Agent 开发太难 | 项目2 简化为单工具 Agent，不做 Multi-Agent |
| 向量数据库部署麻烦 | 开发用 Chroma 本地，上线用 Pinecone 免费额度 |
| Next.js 来不及深入 | 用 React + Vite 先交付，SSR 面试时说"了解" |

---

## 成功标准

- [ ] 2 个可演示的 AI 应用（RAG 问答 + Agent 助手）
- [ ] 项目已部署上线，有公开访问地址
- [ ] GitHub README 完整，技术选型有理有据
- [ ] 简历突出 AI+前端复合能力
- [ ] 能流畅回答：RAG 原理、Prompt 工程、Agent 模式、流式输出
- [ ] 能讲解项目的技术选型和架构设计思路
