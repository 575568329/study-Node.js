# LangChain.js 学习进度

**Last Updated**: 2026-04-18
**状态**: 进行中

---

## 📊 快速统计

📈 **Overall Progress**: 9/14 topics = **64%**
📚 **学习天数**: 1 天
🎯 **阶段**: 阶段二·第4周（LangChain.js + RAG）

---

## ✅ 已掌握主题

| # | 主题 | 文件 | 日期 | 置信度 |
|---|------|------|------|--------|
| 1 | Model（ChatOpenAI + GLM 兼容） | 01-model.js | 04-18 | ⭐⭐⭐ |
| 2 | Prompt Template（变量占位） | 02-prompt.js | 04-18 | ⭐⭐⭐ |
| 3 | Chain（.pipe() 链式调用） | 03-chain.js | 04-18 | ⭐⭐⭐ |
| 4 | Output Parser（Zod 结构化输出） | 04-parser.js | 04-18 | ⭐⭐⭐ |
| 5 | Embeddings（向量化 + 余弦相似度） | 05-embedding.js | 04-18 | ⭐⭐⭐ |
| 6 | Text Chunking（文本切片策略） | 06-chunking.js | 04-18 | ⭐⭐⭐ |
| 7 | Similarity Search（相似度检索） | 07-retrieval.js | 04-18 | ⭐⭐⭐ |
| 8 | RAG Pipeline（完整检索增强生成） | 08-rag.js | 04-18 | ⭐⭐⭐ |
| 9 | Conversational RAG（多轮对话记忆） | 09-conversation-rag.js | 04-18 | ⭐⭐⭐ |

---

## 📋 待学习主题

| # | 主题 | 优先级 | 备注 |
|---|------|--------|------|
| 10 | 向量数据库（Chroma） | P0 | 替代自实现向量库，真实项目必备 |
| 11 | 文档加载器（Document Loaders） | P1 | 加载 PDF/Markdown/网页等 |
| 12 | RAG 优化（检索策略、重排序） | P1 | 检索质量提升 |
| 13 | Agent（工具调用、Function Calling） | P0 | AI 应用高级能力 |
| 14 | LangGraph（工作流编排） | P2 | 复杂 Agent 场景 |

---

## 🔍 踩坑记录

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| OpenAI SDK 返回零向量 | SDK 发送 GLM 不支持的参数 | 改用 fetch 直接调 API |
| MemoryVectorStore 不可用 | 从 @langchain/community 移除 | 自实现向量库（反而学到了原理） |
| require 在 ES 模块报错 | package.json 设了 type: module | 用 import 语法 |

---

## 📝 学习笔记

- GLM Embedding API 用 fetch 直接调用，不兼容 OpenAI SDK
- 向量数据库原理：存储向量 + 余弦相似度 + TopK 排序
- RAG 核心：检索相关文档片段 → 拼接到 Prompt → LLM 基于上下文生成
- 对话式 RAG：把历史消息展开到 Prompt 中，AI 才能理解指代词
- 幻觉问题：LLM 可能不严格遵守"只根据资料回答"的指令

---

## ⏭️ 下次学习计划

1. 向量数据库 Chroma（本地部署 + 增删改查）
2. 文档加载器（加载真实文件）
3. RAG 优化策略
4. 之后进入 Agent / Tool Calling
