# 🚀 4周求职冲刺计划

**创建日期**: 2026-03-31
**目标**: 1个月内完成 AI 应用开发转型，构建可求职的作品集项目
**求职定位**: AI+前端复合型人才（月薪 20K-50K）

---

## 市场调研结论

- AI 前端岗位同比增长 74%，复合人才极度稀缺
- 薪资溢价 30%-50%（相比纯前端）
- 核心技能组合：TypeScript + LangChain.js + RAG + Agent + 全栈交付
- Vercel AI SDK（npm 880万/周）比 LangChain.js（243万/周）更流行，两个都要学

---

## 第1周（04-01 ~ 04-07）：React 收尾 + Next.js 基础

**目标**: 完成前端框架学习，为 AI 应用搭好前端基础

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | React: useMemo/useCallback + 自定义 Hook | 代码练习 |
| Day 2 | React: useContext/useReducer + 性能优化 | 代码练习 |
| Day 3 | React: 条件渲染/列表渲染/事件类型 收尾 | 所有 React 基础完成 |
| Day 4 | Next.js: 项目搭建 + App Router + SSR 基础 | Next.js 项目 |
| Day 5 | Next.js: API Routes + Server Actions | 后端 API 练习 |
| Day 6-7 | Next.js: 整合 React 知识，搭建 AI 项目前端骨架 | AI 项目前端框架 |

**交付物**: 可运行的 Next.js 项目骨架（含路由、布局、API Routes）

---

## 第2周（04-08 ~ 04-14）：LangChain.js + RAG 核心实战

**目标**: 掌握 AI 应用开发核心技能，做出第一个 RAG 应用

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | OpenAI/Anthropic API 调用 + Prompt Engineering 基础 | API 调用代码 |
| Day 2 | LangChain.js 入门：链式调用、模板、输出解析 | LangChain 练习 |
| Day 3 | Embeddings 原理 + 向量数据库（Chroma/Pinecone） | 向量存储代码 |
| Day 4 | RAG 架构：文档加载 → 切片 → 向量化 → 检索 → 生成 | RAG Pipeline |
| Day 5 | RAG 优化：检索策略、重排序、上下文窗口管理 | 优化版 RAG |
| Day 6-7 | **项目实战**: 基于个人笔记库的知识问答系统 | RAG 应用 MVP |

**交付物**: 可运行的 RAG 知识问答应用（上传文档 → 智能问答）

---

## 第3周（04-15 ~ 04-21）：Vercel AI SDK + Agent + 项目完善

**目标**: 掌握前端 AI 交互 + Agent 开发，完善项目

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | Vercel AI SDK：流式输出 + useChat/useCompletion | 流式聊天界面 |
| Day 2 | Vercel AI SDK + Next.js 整合 + Tool Calling | AI 交互组件 |
| Day 3 | LangGraph.js 入门：Agent 工作流编排 | Agent 练习 |
| Day 4 | Agent 实战：Tool Use + ReAct 模式 + Multi-Agent 概念 | Agent 代码 |
| Day 5 | 项目整合：前端(Next.js+Vercel AI SDK) + 后端(LangChain.js+RAG) | 全栈 AI 应用 |
| Day 6-7 | 项目打磨：UI 优化、错误处理、加载状态、响应式 | 完善 AI 产品 |

**交付物**: 完整的全栈 AI 应用（前端 + 后端 + AI + 数据库）

---

## 第4周（04-22 ~ 04-28）：部署上线 + 简历 + 面试准备

**目标**: 项目上线 + 简历投递 + 面试能力

| 天 | 内容 | 产出 |
|---|---|---|
| Day 1 | Docker 基础 + Vercel/Railway 部署 | 项目上线 |
| Day 2 | README 编写 + 项目文档 + 演示视频 | 项目文档 |
| Day 3 | 简历重写：突出 AI+前端复合能力 | 简历 v1 |
| Day 4 | 面试题准备：RAG 原理、Prompt 工程、Agent 模式 | 面试题库 |
| Day 5 | 模拟面试：AI 应用开发相关技术问题 | 面试练习 |
| Day 6-7 | 投递简历 + 持续优化项目 + 查漏补缺 | 开始求职 |

**交付物**: 上线的 AI 项目 + 简历 + 开始投递

---

## 核心项目规划

### 项目：AI 知识库问答系统

**技术栈**：
- 前端：Next.js + React + TypeScript + Tailwind CSS
- AI 交互：Vercel AI SDK（流式输出）
- AI 编排：LangChain.js + LangGraph.js
- 向量数据库：Chroma（本地）或 Pinecone（云端）
- 部署：Vercel（前端）+ Railway（后端服务）

**核心功能**：
1. 文档上传 + 自动切片 + 向量化
2. 基于文档的智能问答（RAG）
3. 流式输出对话界面
4. 多轮对话 + 上下文管理
5. Agent 模式（可选：联网搜索、代码执行）

---

## 每日时间分配建议

| 时段 | 内容 | 时长 |
|------|------|------|
| 上午 | 新概念学习 + 跟练代码 | 2-3h |
| 下午 | 项目实战 + 写代码 | 3-4h |
| 晚上 | 笔记整理 + 复习 + 查漏补缺 | 1-2h |

**总时长**: 每天 6-9 小时（全职学习强度）

---

## 风险预案

| 风险 | 应对方案 |
|------|---------|
| LangChain.js 学不动 | 降级到直接用 OpenAI SDK + 自建 RAG |
| 项目做不完 | 优先保证 RAG 核心功能，Agent 模式可后补 |
| 时间不够 Next.js | 用已有 React 知识 + Vite 先交付，Next.js 后补 |
| 面试前项目没上线 | 本地演示版 + 录屏也可以展示 |

---

## 成功标准

- [ ] 1个可演示的 AI 应用（RAG 问答系统）
- [ ] 项目已部署上线，有公开访问地址
- [ ] GitHub README 完整，技术选型有理有据
- [ ] 简历突出 AI+前端复合能力
- [ ] 能流畅回答：RAG 原理、Prompt 工程、Agent 模式、流式输出
