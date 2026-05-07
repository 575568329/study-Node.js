# Node.js-Study

🚀 **使用AI辅助学习AI应用全栈开发的学习仓库**

系统学习全栈开发技能，目标成为**AI应用开发全栈工程师**。使用Claude Code作为AI导师，采用苏格拉底式教学法，实战驱动。

---

## 🎯 学习目标

### 终极目标
🎯 **成为AI应用开发全栈工程师**（2个月冲刺求职）
- 技术栈：TypeScript + React/Next.js + LangChain.js + Vercel AI SDK
- 求职定位：AI+前端复合型人才（月薪 20K-50K）

### 当前阶段
📍 **项目实战** — AI 知识库问答系统
- ✅ 已完成：Vercel AI SDK（10/10 = 100%）
- ✅ 已完成：LangChain.js（14/14 = 100%）
- ⏭️ 下一步：项目实战（AI 知识库问答系统）

### 用户基础
- ✅ **6年前端开发经验**，Vue2精通
- ✅ **TypeScript / Vue3 / React / Next.js** 已全部完成

---

## 📊 技能进度总览

| 技能 | 状态 | 进度 | 笔记 |
|------|------|------|------|
| Node.js | ✅ 已完成 | 71% | [笔记](study-notes/Node.js/INDEX.md) |
| TypeScript | ✅ 已完成 | 100% | [笔记](study-notes/TypeScript/INDEX.md) |
| Vue3 + TS | ✅ 已完成 | - | [笔记](study-notes/Vue3/INDEX.md) |
| React + TS | ✅ 已完成 | - | [笔记](study-notes/React/INDEX.md) |
| Next.js | ✅ 已完成 | - | [笔记](study-notes/Next.js/INDEX.md) |
| **LangChain.js** | ✅ **已完成** | **100%** | [笔记](study-notes/LangChain/INDEX.md) |
| **Vercel AI SDK** | ✅ **已完成** | **100%** | [笔记](study-notes/Vercel%20AI%20SDK/INDEX.md) |
| **LangGraph.js** | ✅ **核心完成** | **100%** | [笔记](study-notes/LangGraph/INDEX.md) |

---

## 📂 项目结构

```
Node.js-Study/
├── CLAUDE.md                    # AI导师配置（当前技能指针）
├── progress/                    # 各技能进度追踪
│   ├── langchain-progress.md    # LangChain.js 进度
│   ├── vercel-ai-sdk-progress.md # Vercel AI SDK 进度
│   ├── ai-basics-progress.md    # AI 基础进度
│   └── accelerated-plan.md      # 8周求职冲刺计划
├── sessions/                    # 每日学习会话记录
│   ├── vercel-ai-sdk/2026-04-25/ # Vercel AI SDK 会话
│   ├── langchain/2026-04-18/   # LangChain 会话
│   ├── nextjs/                  # Next.js 会话
│   ├── react/                   # React 会话
│   └── typescript/              # TypeScript 会话
├── projects/                    # 实战项目
│   └── langchain-demo/          # LangChain.js 练习（13个示例）
├── study-notes/                 # Obsidian 笔记库
│   ├── LangChain/               # LangChain 学习笔记
│   ├── Vercel AI SDK/           # Vercel AI SDK 学习笔记
│   ├── Next.js/                 # Next.js 学习笔记
│   ├── React/                   # React 学习笔记
│   ├── TypeScript/              # TypeScript 学习笔记
│   └── Node.js/                 # Node.js 学习笔记
├── code-examples/               # 代码练习片段
└── README.md                    # 本文件
```

---

## 🔥 当前学习：项目实战

### 已掌握的主题（Vercel AI SDK 已完成）

| 主题 | 关键 API | 置信度 |
|------|---------|--------|
| 流式聊天基础 | useChat + streamText + toUIMessageStreamResponse | ⭐⭐⭐ |
| useChat 状态管理 | status（submitted/streaming/ready/error） | ⭐⭐⭐ |
| 停止生成 | stop() | ⭐⭐⭐ |
| 重新生成 | regenerate({ messageId }) | ⭐⭐⭐ |
| 新对话 | useChat({ id }) 切换 id | ⭐⭐⭐ |
| Tool Calling | tool() + inputSchema + execute + stepCountIs | ⭐⭐⭐ |
| Structured Output | Output.object() + Zod + generateObject/streamObject | ⭐⭐⭐ |
| System Prompt 深入 | system + 策略映射 + DefaultChatTransport + useRef | ⭐⭐⭐ |
| Client-side Tool | onToolCall + addToolOutput + sendAutomaticallyWhen | ⭐⭐ |
| RAG 整合 | LangChain 检索 + streamText({ system: context }) | ⭐⭐⭐ |

### 下一步计划

- 项目1：AI 知识库问答系统（RAG）
- 项目2：AI Agent 助手（工具调用）

### LangChain.js 已完成的练习

| 文件 | 主题 | 关键概念 |
|------|------|---------|
| 01-model.js | Model 调用 | ChatOpenAI + GLM API 兼容配置 |
| 02-prompt.js | Prompt Template | ChatPromptTemplate + 变量占位 |
| 03-chain.js | Chain | .pipe() 链式调用 |
| 04-parser.js | Output Parser | Zod 结构化输出 |
| 05-embedding.js | 向量化 | Embedding + 余弦相似度 |
| 06-chunking.js | 文本切片 | RecursiveCharacterTextSplitter |
| 07-retrieval.js | 相似度检索 | 自实现内存向量库 |
| 08-rag.js | RAG Pipeline | 完整检索增强生成 |
| 09-conversation-rag.js | 对话式 RAG | 多轮对话记忆 |
| 10.chroma.js | 向量数据库 Chroma | 连接 + 存储 + 查询 |
| 10.2-chroma-crud.js | Chroma CRUD | 增删改查 + 元数据过滤 |
| 11-document-loader.js | 文档加载器 | TextLoader 从文件加载知识库 |
| 12-rag-multiquery.js | RAG 优化 Multi-Query | LLM 改写查询 + 多路检索 + 去重 |
| 13-agent.js | Agent 工具调用 | tool() + createToolCallingAgent + AgentExecutor |

### 待学习内容

- LangGraph 工作流编排（进阶）
- 部署（Vercel + Railway）

---

## 📖 学习路线与进度

### ✅ 阶段1：Node.js 后端基础（已完成）
- Express + MySQL + JWT + 中间件
- 71% 核心内容完成

### ✅ 阶段2：TypeScript（已完成 100%）
- 类型系统、泛型、装饰器、工具类型

### ✅ 阶段3：前端框架升级（已完成）
- Vue3 Composition API + TypeScript
- React Hooks + TypeScript
- Next.js App Router + SSR/SSG

### ✅ 阶段3.5：AI 应用开发基础（已完成）
- LLM 原理、API 调用、Prompt 工程、流式输出
- 结构化输出 + Few-shot + CoT

### ✅ 阶段4：LangChain.js + RAG（已完成 100%）
- LangChain 四大核心组件 ✅
- RAG 完整流程（Embedding → Chunking → Retrieval → Generation）✅
- 对话式 RAG ✅
- 向量数据库 Chroma ✅
- 文档加载器 ✅
- RAG 优化（Multi-Query 多查询）✅
- Agent 工具调用 ✅

### 🔥 阶段5：Vercel AI SDK + 项目整合
- useChat / streaming / Tool Calling / Structured Output / System Prompt / Client-side Tool / RAG 整合 ✅（10/10 完成）
- 项目1：AI 知识库问答系统（RAG）（进行中）
- 项目2：AI Agent 助手（工具调用）

---

## 📊 学习统计

**开始日期**: 2026-03-13
**最近更新**: 2026-04-26
**求职冲刺**: 8周计划（04-01 ~ 05-26）

### 进度里程碑

| 日期 | 里程碑 |
|------|--------|
| 03-13 | 开始学习 Node.js |
| 03-25 | Node.js 核心内容完成（71%） |
| 03-30 | TypeScript 完成（100%） |
| 04-07 | React 全部完成 |
| 04-14 | Next.js 基础完成 |
| 04-15 | AI 应用开发基础完成 |
| 04-18 | LangChain.js RAG 全流程完成（64%） |
| 04-19 | LangChain.js Chroma + 文档加载器完成（86%） |
| 04-19 | LangChain.js RAG 优化 Multi-Query 完成（93%） |
| 04-19 | LangChain.js Agent 工具调用完成（100%） |
| 04-22 | Vercel AI SDK 流式聊天基础完成 |
| 04-25 | Vercel AI SDK useChat + Tool Calling + Structured Output + System Prompt + Client-side Tool 完成（90%） |
| 04-26 | Vercel AI SDK RAG 整合完成（100%）|
| ~04-28 | LangChain.js 完成 + 项目1后端 |
| ~05-05 | **项目1完成**（AI 知识库问答系统） |
| ~05-19 | **项目2完成**（AI Agent 助手） |
| ~05-26 | 简历 + 面试准备 + 开始投递 |

---

## 🛠️ 技术栈

### 已掌握
- **后端**: Node.js、Express、MySQL、Sequelize ORM、JWT
- **前端**: Vue2/Vue3、React、Next.js、TypeScript
- **工具**: Git、VS Code、Postman、Obsidian

### 正在学习
- **项目实战**: AI 知识库问答系统（RAG + LangChain.js + AI SDK）

### 待学习
- **AI 编排**: LangGraph.js（Agent 工作流，进阶）
- **部署**: Vercel + Railway

---

## 🔧 如何使用

### 开始学习

1. **打开 Claude Code**
   ```bash
   cd study-Node.js
   claude-code
   ```

2. **开始今日学习** → 触发课前小测 + 新内容学习

3. **自动记录** → 会话笔记 + 进度追踪 + Obsidian 笔记

### 关键文件

| 用途 | 文件 |
|------|------|
| 当前技能指针 | `CLAUDE.md` |
| Vercel AI SDK 进度 | `progress/vercel-ai-sdk-progress.md` |
| LangChain 进度 | `progress/langchain-progress.md` |
| 8周冲刺计划 | `progress/accelerated-plan.md` |
| 今日学习笔记 | `sessions/vercel-ai-sdk/2026-04-26/session-notes.md` |
| Vercel AI SDK 笔记 | `study-notes/Vercel AI SDK/INDEX.md` |
| LangChain 笔记 | `study-notes/LangChain/INDEX.md` |
| 练习代码 | `projects/langchain-demo/` |

---

## 🔗 相关资源

**官方文档**:
- [LangChain.js](https://js.langchain.com/)
- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/docs/latest/api/)

---

## 📝 许可

本项目仅供个人学习使用。

---

**最后更新**: 2026-04-25
**当前技能**: 项目实战（Vercel AI SDK 100% ✅）→ LangGraph.js
**GitHub**: https://github.com/575568329/study-Node.js.git


