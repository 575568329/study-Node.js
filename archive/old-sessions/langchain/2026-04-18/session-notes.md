# LangChain.js 学习会话 - 2026-04-18

## 会话概述

LangChain.js 核心概念学习 + RAG 完整流程实现，从基础四组件到对话式 RAG。

---

## 学习内容

### Part 1: LangChain.js 四大核心组件（回顾）

| 文件 | 主题 | 关键概念 |
|------|------|---------|
| 01-model.js | Model 调用 | ChatOpenAI + GLM API 兼容配置 |
| 02-prompt.js | Prompt Template | ChatPromptTemplate.fromMessages + 变量占位 |
| 03-chain.js | Chain 链式调用 | .pipe() 串联 prompt → model |
| 04-parser.js | Output Parser | StructuredOutputParser + Zod 结构化输出 |

### Part 2: RAG 全流程（今日重点）

| 文件 | 主题 | 关键概念 |
|------|------|---------|
| 05-embedding.js | 向量化 | fetch 直接调 GLM Embedding API（SDK 不兼容） |
| 06-chunking.js | 文本切片 | RecursiveCharacterTextSplitter |
| 07-retrieval.js | 相似度检索 | 自实现余弦相似度 + 内存向量库 |
| 08-rag.js | RAG Pipeline | 文档 → 切片 → 向量化 → 检索 → AI 生成 |
| 09-conversation-rag.js | 对话式 RAG | 多轮对话记忆 + readline/promises |

---

## 关键技术收获

### 1. GLM API 兼容性踩坑

- OpenAI SDK 发送额外参数（dimensions, encoding_format）导致 GLM 返回零向量
- 解决方案：用原生 fetch 直接调用 Embedding API

### 2. 向量数据库原理

- 自己实现了内存向量库（cosineSimilarity + store 数组）
- 理解了向量数据库的核心就是：存储向量 + 计算相似度 + 排序返回 TopK
- 向量存储在本地，LLM 只负责文本→向量的转换

### 3. 对话式 RAG 的关键设计

- 用 `readline/promises` 实现交互式输入
- 历史记录用 `['human', text]` / `['ai', text]` 元组存储
- 通过 `...messageList` 展开到 ChatPromptTemplate.fromMessages
- AI 能理解"它"等指代词，因为历史上下文被传入了

### 4. RAG 幻觉问题

- 即使系统提示说"只根据资料回答"，LLM 仍可能用自己的知识补充
- 这是 RAG 系统的常见问题，需要通过更强的提示词或后处理来控制

---

## 学生表现

- **理解力**: 优秀。能快速理解 RAG 管道的每个环节
- **实践力**: 良好。能独立编写代码，但容易有拼写错误
- **常见问题**: URL 拼写（pass/paas）、方法名拼写、ES 模块与 CommonJS 混用

---

## 下一步学习计划

按加速计划 Week 4 剩余内容：
1. **向量数据库**: Chroma 本地部署 + CRUD（代替自实现向量库）
2. **文档加载器**: 加载 PDF/Markdown 等真实文件
3. **RAG 优化**: 检索策略、重排序、上下文窗口管理
4. **项目1 启动**: AI 知识库问答系统后端
