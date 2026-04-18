# LangChain.js 练习项目

LangChain.js 核心概念学习代码，使用智谱 GLM API。

## 文件说明

| 文件 | 主题 |
|------|------|
| 01-model.js | Model 调用（ChatOpenAI + GLM） |
| 02-prompt.js | Prompt Template（变量占位） |
| 03-chain.js | Chain 链式调用（.pipe()） |
| 04-parser.js | Output Parser + Zod 结构化输出 |
| 05-embedding.js | 向量化 + 余弦相似度 |
| 06-chunking.js | 文本切片（RecursiveCharacterTextSplitter） |
| 07-retrieval.js | 相似度检索（自实现内存向量库） |
| 08-rag.js | 完整 RAG Pipeline |
| 09-conversation-rag.js | 对话式 RAG（多轮对话记忆） |

## 运行

```bash
npm install
node 01-model.js
```

## 环境要求

- Node.js 18+
- .env 文件配置 `ANTHROPIC_AUTH_TOKEN`（智谱 API Key）
