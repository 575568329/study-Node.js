# RAG 完整流程

## 什么是 RAG？

**Retrieval-Augmented Generation（检索增强生成）**

核心思路：不让 AI 靠"记忆"回答，而是先从文档中检索相关内容，再基于检索结果生成回答。

```
用户提问 → 向量化 → 在文档库中检索相似片段 → 拼接到 Prompt → AI 生成回答
```

## 流程拆解

### Step 1: 文档切片（Chunking）

长文档需要切成小块，因为：
- 向量化有长度限制
- 小块检索更精准

```javascript
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,      // 每块最大字符数
  chunkOverlap: 30     // 相邻块重叠（保持上下文连贯）
})
const chunks = await splitter.splitText(document)
```

**chunkSize**：太小丢失上下文，太大检索不精准
**chunkOverlap**：避免关键信息被切断在两块之间

### Step 2: 向量化（Embedding）

把文本转成数字向量（高维数组），语义相近的文本向量也相近：

```javascript
async function getEmbedding(text) {
  const res = await fetch('https://open.bigmodel.cn/api/paas/v4/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.ANTHROPIC_AUTH_TOKEN
    },
    body: JSON.stringify({ model: 'embedding-3', input: text })
  })
  const data = await res.json()
  return data.data[0].embedding  // 返回 2048 维向量
}
```

### Step 3: 相似度检索

用**余弦相似度**衡量两个向量的语义接近程度（-1 到 1，越大越相似）：

```javascript
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (magA * magB)
}
```

检索流程：问题向量化 → 和每个文档块算相似度 → 排序 → 取 TopK

### Step 4: 生成回答

把检索到的文档片段作为上下文拼入 Prompt：

```javascript
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '根据以下参考资料回答...\n\n参考资料：\n{context}'],
  ['human', '{question}']
])
```

### Step 5: 对话记忆（Conversational RAG）

多轮对话时，把历史消息展开到 Prompt 中：

```javascript
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '根据参考资料回答...\n\n参考资料：\n{context}'],
  ...messageList,      // 展开历史
  ['human', '{question}']
])

// 每轮结束后追加历史
messageList.push(['human', question])
messageList.push(['ai', result.content])
```

## 向量数据库原理

本质就是三件事：
1. **存储**：把文档块和它的向量存起来
2. **查询**：新问题转向量，和所有存储的向量算相似度
3. **排序**：返回最相似的 TopK 个文档块

真实的向量数据库（Chroma、Pinecone）在此基础上做了索引优化，支持大规模数据。

## 已知问题

- **幻觉泄漏**：LLM 可能不严格遵守"只根据资料回答"，会用自身知识补充
- **检索质量**：如果切片不当，可能检索不到最相关的内容
