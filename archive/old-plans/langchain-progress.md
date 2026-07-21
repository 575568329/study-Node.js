# LangChain.js 学习进度

**Last Updated**: 2026-04-19
**状态**: ✅ 已完成

---

## 📊 快速统计

📈 **Overall Progress**: 14/14 topics = **100%**
📚 **学习天数**: 2 天
🎯 **阶段**: 阶段四·LangChain.js（已完成）

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
| 10 | 向量数据库 Chroma（连接 + 存储 + 查询） | 10.chroma.js | 04-19 | ⭐⭐⭐ |
| 10.2 | Chroma CRUD（增删改查 + 元数据过滤） | 10.2-chroma-crud.js | 04-19 | ⭐⭐⭐ |
| 11 | 文档加载器（TextLoader） | 11-document-loader.js | 04-19 | ⭐⭐⭐ |
| 12 | RAG 优化（Multi-Query 多查询） | 12-rag-multiquery.js | 04-19 | ⭐⭐⭐ |
| 13 | Agent（工具调用 + 自主决策） | 13-agent.js | 04-19 | ⭐⭐⭐ |

---

## 📋 待学习主题（进阶）

| # | 主题 | 优先级 | 备注 |
|---|------|--------|------|
| 14 | LangGraph（工作流编排） | P2 | 复杂 Agent 场景，进阶内容 |

---

## 🔍 踩坑记录

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| OpenAI SDK 返回零向量 | SDK 发送 GLM 不支持的参数 | 改用 fetch 直接调 API |
| MemoryVectorStore 不可用 | 从 @langchain/community 移除 | 自实现向量库（反而学到了原理） |
| require 在 ES 模块报错 | package.json 设了 type: module | 用 import 语法 |
| Windows 双 Python 问题 | Windows Store 有个假的 python.exe（exit code 49） | ~/.bashrc 中把真正的 Python 路径加到 PATH 最前面 |
| Chroma 连接参数弃用 | `path: 'http://localhost:8000'` 已弃用 | 改为 `host: 'localhost', port: '8000'` |
| Chroma 默认 embedding 不可用 | `@chroma-core/default-embed` 需从 HuggingFace 下载模型，国内无法访问 | 手动传 GLM Embedding |
| TextLoader 导入路径变更 | `langchain/document_loaders/fs/text` 不再可用 | 改为 `@langchain/classic/document_loaders/fs/text` |

---

## 📝 学习笔记

- GLM Embedding API 用 fetch 直接调用，不兼容 OpenAI SDK
- 向量数据库原理：存储向量 + 余弦相似度 + TopK 排序
- RAG 核心：检索相关文档片段 → 拼接到 Prompt → LLM 基于上下文生成
- 对话式 RAG：把历史消息展开到 Prompt 中，AI 才能理解指代词
- 幻觉问题：LLM 可能不严格遵守"只根据资料回答"的指令

### Chroma 向量数据库
- 客户端-服务器模式：pip install chromadb 安装，`chroma run` 启动（localhost:8000）
- JS 客户端：npm install chromadb，`new ChromaClient({ host, port })`
- ids 始终是数组格式：`ids: ['chunk-1']` 而非 `ids: 'chunk-1'`
- add/get/query/update/delete 完整 CRUD
- query 返回 distances（越小越相似），支持 where 元数据过滤
- update 文档内容时必须同步更新 embeddings
- 旧集合残留会导致过滤无效，需先 deleteCollection

### 文档加载器
- TextLoader：从 `@langchain/classic/document_loaders/fs/text` 导入
- loader.load() 返回 docs 数组：docs[0].pageContent + docs[0].metadata.source
- 替代硬编码字符串，从真实文件加载知识库到 RAG 流程

### RAG 优化（Multi-Query 多查询）
- 核心思路：用 LLM 把模糊问题改写为多个精确查询变体，分别检索后合并去重
- 流程：用户问题 → LLM 生成 3 个查询变体 → 逐一检索 → 合并去重 → 生成回答
- 去重用 Set 按 id 去重，避免重复文档占用 context 窗口
- 数据量小时效果不明显（可能返回相同结果），数据量大时能显著提高召回率
- 笔记：三种 RAG 优化策略（Multi-Query / Re-ranking / Self-RAG）已整理到 `study-notes/LangChain/01-知识点总结/RAG优化策略.md`

### Agent 工具调用
- Agent = LLM + 工具 + 自主决策，LLM 自己决定调什么工具、调几次、什么顺序
- `tool()` 把普通函数包装成 LLM 能理解和调用的工具（函数 + name + description + schema）
- `createToolCallingAgent` 组装 Agent（LLM + 工具 + prompt），`AgentExecutor` 自动执行循环
- `{agent_scratchpad}` 占位符必须加，记录 Agent 的思考过程
- 与 Chain 的核心区别：Chain 是代码写死流程，Agent 是 LLM 自主决策
- Claude Code 本身就是 Agent 模式的典型例子

---

## ⏭️ 下次学习计划

1. LangGraph 工作流编排（进阶 Agent 场景）
2. Vercel AI SDK（流式交互 + 前端集成）
