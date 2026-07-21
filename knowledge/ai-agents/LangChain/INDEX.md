# LangChain.js 学习笔记

> 🧠 **记忆锚点**:**LangChain = 用 LLM 搭应用的框架;四大组件 Model/Prompt/Chain/Output Parser 串成链。两条主线:RAG(切块→embedding→向量库→检索→生成,治幻觉与私有数据)和 Agent(tool() 定义工具 + AgentExecutor 自主调用)。**

## 进度概览

- **当前进度**: 14/14 主题（100%） ✅ 已完成
- **进度文件**: [langchain-progress.md](../../progress/langchain-progress.md)
- **练习代码**: [projects/langchain-demo/](../../projects/langchain-demo/)

---

## 笔记目录

### [01-知识点总结](01-知识点总结/)

| 文件 | 内容 |
|------|------|
| [LangChain四大组件.md](01-知识点总结/LangChain四大组件.md) | Model / Prompt / Chain / Output Parser |
| [RAG完整流程.md](01-知识点总结/RAG完整流程.md) | Embedding → Chunking → Retrieval → Generation |
| [向量数据库Chroma.md](01-知识点总结/向量数据库Chroma.md) | Chroma 连接、CRUD、元数据过滤 |
| [文档加载器.md](01-知识点总结/文档加载器.md) | TextLoader 从文件加载知识库 |
| [RAG优化策略.md](01-知识点总结/RAG优化策略.md) | Multi-Query / Re-ranking / Self-RAG 三种优化 |
| [Agent工具调用.md](01-知识点总结/Agent工具调用.md) | tool() 定义工具 + createToolCallingAgent + AgentExecutor |

### [03-易错点与陷阱](03-易错点与陷阱/)

| 文件 | 内容 |
|------|------|
| [GLM-API踩坑.md](03-易错点与陷阱/GLM-API踩坑.md) | GLM API 兼容性、Chroma、TextLoader 踩坑记录 |

### [05-速查表](05-速查表/)

| 文件 | 内容 |
|------|------|
| [LangChain.js速查表.md](05-速查表/LangChain.js速查表.md) | 常用 API + Chroma CRUD + TextLoader 速查 |

---

## 下次学习

1. LangGraph 工作流编排（进阶）
2. Vercel AI SDK（流式交互 + 前端集成）
