# 学习记忆存储

**最后更新**: 2026-05-07

---

## 学生概况

- 29岁，6年前端经验，Vue2精通
- 当前目标：全面面向简历和面试，定位全栈型前端 / AI 应用方向前端工程师
- 终极项目：开发类似Claude的AI工具
- 学习风格：实践导向，喜欢自己写代码，深度思考，提出高质量技术问题
- 开始日期：2026-03-13

---

## 当前进度

- **当前重点**: 简历三版本、面试讲稿、项目追问、RAG 项目包装
- **LangGraph 进度**: 10/12（83%），见 `progress/langgraph-progress.md`
- **当前阶段**: study-Node 学习流程已基本走完，后续全面服务简历和面试准备
- **已完成主线**: Node.js、TypeScript、Vue3、React、Next.js、AI基础、LangChain.js、Vercel AI SDK、RAG项目实战核心、LangGraph 多数主题

---

## 教学偏好

- 苏格拉底式教学：先问学生理解，再针对性讲解
- 基于前端经验类比后端概念（利用6年前端基础）
- 解释约200字 + 代码示例，然后立即验证理解
- 学生优势：理解能力强、数据建模直觉优秀、代码质量达生产级别
- 避免：直接倾倒信息、不检查理解就继续
- 学生喜欢自己写代码；导师应提供思路、提示、检查点，少直接替写。

---

## 环境配置备忘

- **MySQL**: 端口3306，Root密码root123456，版本8.0.45，Legacy认证
- **MySQL环境变量**: C:\Program Files\MySQL\MySQL Server 8.0\bin

---

## 会话记录位置

| 内容 | 路径 |
|------|------|
| 每日学习会话 | `sessions/{技能}/YYYY-MM-DD/session-notes.md` |
| 进度追踪 | `progress/{技能}-progress.md` |
| 实战项目 | `projects/{技能}/` |
| 项目索引 | `projects/{技能}/INDEX.md` |

## Codex 启动必读

每次开始项目工作前先读：

1. `memory/latest-session.md`
2. `memory/todo.md`
3. `memory/decisions.md`
4. `memory/architecture.md`

---

## 快速评估检查点

每次新会话开始时确认：
1. 上次学习内容（查看最近session-notes.md）
2. 知识漏洞是否需要复习
3. 今日学习目标
4. 学生对上次内容的理解程度

## 当前学习重点

优先级从 2026-05-07 起调整为简历 / 面试主线：

1. 三版简历：通用版、纯前端版、Node.js 全栈 AI 版。
2. `rag-docs-assistant` 项目包装：README、架构图、演示数据、演示问题、3 分钟讲稿、追问清单。
3. 工作项目讲稿：讯飞澳门项目、地灾 GIS、车载终端。
4. Node.js / Next.js 后端追问补强：API Route、文件上传、SSE、错误处理、日志、任务状态。
5. 前端组件化沉淀：从 RAG 项目和讯飞富文本链路提炼组件案例。
6. LangGraph 仅保留复习和后续整合，不再作为当前主线。

## LangGraph 已学内容

- 已掌握：
  - StateGraph 图编排
  - ReducedValue 追加模式
  - Agent with Tools
  - MessagesAnnotation
  - MemorySaver + thread_id
  - interrupt + Command resume
  - Agent 危险工具审批
  - Checkpoint 持久化设计
  - Subgraph
  - Multi-Agent
- 暂缓学习：
  - Streaming
  - Command + Send 动态路由

---

## 已完成技能摘要

- Node.js核心、异步编程、内置模块、Express框架
- MySQL + Sequelize ORM
- JWT认证、Cookie/Session、CORS、XSS/CSRF防护
- TypeScript、Vue3、React、Next.js
- AI基础、Prompt工程、流式输出基础
- LangChain.js RAG、Chroma、文档加载器、Multi-Query、Agent工具调用
- Vercel AI SDK：useChat、Tool Calling、Structured Output、System Prompt、Client-side Tool、RAG整合
- 项目实战：AI知识库问答系统核心功能

---

## 学习路径

旧路径：

~~Node.js~~ -> ~~TypeScript~~ -> ~~Vue3/React~~ -> ~~Next.js~~ -> ~~AI基础~~ -> ~~LangChain.js~~ -> ~~Vercel AI SDK~~ -> LangGraph.js -> Agent项目 -> 部署/简历/面试

新路径：

~~Node.js~~ -> ~~TypeScript~~ -> ~~React/Next.js~~ -> ~~LangChain / AI SDK / RAG 基础~~ -> ~~LangGraph 核心~~ -> **简历 / 面试 / 项目包装** -> 按面试反馈查漏补缺

---

**下次更新**: 每次学习会话结束后
