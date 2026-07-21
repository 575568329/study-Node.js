# RAG 优化策略

> 学习日期: 2026-04-19 | 置信度: ⭐⭐⭐

---

## 核心概念

基础 RAG 的检索环节容易出问题：查询表述不精确导致漏检、检索结果不够相关、检索不足导致幻觉。三种优化策略分别解决不同问题。

## 优化1：多查询（Multi-Query）✅ 已实现

### 解决什么问题
用户的问题可能表述不够精确，一次检索可能漏掉相关内容。例如问"深度学习和机器学习有什么区别"但知识库里只有分开描述两者的段落。

### 原理
```
用户问题 → LLM 改写为多个查询变体 → 分别检索 → 合并去重 → 生成回答
```

### 代码示例（12-rag-multiquery.js 的核心逻辑）

```javascript
// Step 1: 用 LLM 生成查询变体
const rewritePrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是查询优化助手。将用户的问题改写成3个不同角度的搜索查询，返回JSON数组格式，例如：["查询1","查询2","查询3"]。只返回JSON，不要其他内容。'],
  ['human', '{question}']
])
const rewriteChain = rewritePrompt.pipe(model)
const rewriteResult = await rewriteChain.invoke({ question })
const queries = JSON.parse(rewriteResult.content)

// Step 2: 对原始问题 + 所有变体分别检索
const allResults = []
for (const q of [...queries, question]) {
  const emb = await getEmbedding(q)
  const result = await collection.query({
    queryEmbeddings: [emb],
    nResults: 3
  })
  allResults.push(result)
}

// Step 3: 合并结果，按 id 去重
const seen = new Set()
const allDocs = []
for (const result of allResults) {
  for (let i = 0; i < result.ids[0].length; i++) {
    const id = result.ids[0][i]
    if (!seen.has(id)) {
      seen.add(id)
      allDocs.push(result.documents[0][i])
    }
  }
}

// Step 4: 用去重后的文档生成回答
const context = allDocs.join('\n\n')
```

### 关键要点
1. LLM 改写查询是核心——把模糊问题变成多个精确查询
2. 去重很重要，避免重复文档占用 context 窗口
3. 数据量小时效果不明显（可能所有查询返回相同结果）
4. 数据量大时效果显著，能显著提高召回率

## 优化2：重排序（Re-ranking）

### 解决什么问题
向量检索按"语义相似度"排序，但相似度最高的不一定最相关。例如搜索"Python"可能返回蛇的文档。

### 原理
```
用户问题 → 向量检索取 TopN（N较大，如10条）→ LLM/模型按相关性重新排序 → 取 TopK（K较小，如3条）→ 生成回答
```

### 代码示例

```javascript
// Step 1: 向量检索多取一些结果
const results = await collection.query({
  queryEmbeddings: [queryEmb],
  nResults: 10  // 多取一些
})

// Step 2: 用 LLM 对每条结果打分排序
const rerankPrompt = ChatPromptTemplate.fromMessages([
  ['system', `你是一个文档相关性评估专家。评估以下文档与用户问题的相关性，返回1-10的分数。
只返回一个数字，不要其他内容。

用户问题: {question}

文档内容: {document}`],
  ['human', '请评分']
])

const scored = []
for (const doc of results.documents[0]) {
  const scoreChain = rerankPrompt.pipe(model)
  const scoreResult = await scoreChain.invoke({ question, document: doc })
  const score = parseInt(scoreResult.content.trim())
  scored.push({ doc, score })
}

// Step 3: 按分数排序，取前3条
scored.sort((a, b) => b.score - a.score)
const topDocs = scored.slice(0, 3).map(item => item.doc)
```

### 关键要点
1. 先"宽取"（TopN 大），再"精选"（重排序后取 TopK 小）
2. LLM 打分比向量相似度更准确，但增加了 API 调用成本
3. 生产环境可以用专门的 reranking 模型（如 Cohere Rerank）
4. 适合知识库数据量大、检索结果质量参差不齐的场景

## 优化3：Self-RAG（自检）

### 解决什么问题
LLM 可能基于自身知识"编造"回答，不严格基于检索到的文档内容。

### 原理
```
生成回答 → 再问 LLM "这个回答是否基于提供的参考资料？" → 是则返回，否则重试或拒绝回答
```

### 代码示例

```javascript
// Step 1: 正常生成回答
const answer = await chain.invoke({ context, question })

// Step 2: 自检验证
const verifyPrompt = ChatPromptTemplate.fromMessages([
  ['system', `你是一个事实核查员。判断AI的回答是否严格基于提供的参考资料。

参考资料: {context}
用户问题: {question}
AI回答: {answer}

请只回答 YES 或 NO。如果回答中有参考资料未提及的内容，回答 NO。`],
  ['human', '请判断']
])

const verifyChain = verifyPrompt.pipe(model)
const verifyResult = await verifyChain.invoke({ context, question, answer: answer.content })
const isReliable = verifyResult.content.trim().toUpperCase().includes('YES')

if (isReliable) {
  console.log('回答可靠:', answer.content)
} else {
  console.log('回答可能包含幻觉，请谨慎参考')
  console.log('原始回答:', answer.content)
}
```

### 关键要点
1. 多一次 LLM 调用，成本翻倍但可靠性提升
2. 适合对准确性要求高的场景（医疗、法律等）
3. 不是100%可靠——验证 LLM 本身也可能判断错误
4. 可以和 Multi-Query 组合使用，效果更好

## 三种策略对比

| 策略 | 解决问题 | 额外成本 | 适用场景 |
|------|---------|---------|---------|
| Multi-Query | 检索不全 | +1次LLM + N次检索 | 知识库大、查询模糊 |
| Re-ranking | 检索不精确 | +N次LLM（打分） | 结果多但质量参差 |
| Self-RAG | 回答不可靠 | +1次LLM（验证） | 对准确性要求高 |

## 相关知识
- [[RAG完整流程]] — 基础 RAG 是这些优化的起点
- [[向量数据库Chroma]] — Multi-Query 基于 Chroma 检索
