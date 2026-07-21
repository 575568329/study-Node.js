# 混合检索与 RRF 融合

> 学习日期: 2026-05-04 | 置信度: ⭐⭐⭐

---

## 核心概念

混合检索（Hybrid Search）的核心思想：**单一路径的搜索都有局限**。向量搜索擅长语义理解但可能漏掉精确关键词匹配；关键词搜索擅长精确匹配但无法理解语义。将两者结合，用 RRF（Reciprocal Rank Fusion）算法融合结果，取长补短。

### 为什么需要混合检索

在 rag-docs-assistant 项目中，纯向量搜索存在明显问题：
- 中文短片段的 embedding 质量不高，相似度分数偏低
- 用户用特定术语搜索时（如"BM25"），向量搜索可能匹配不到
- 短问题（"怎么安装"）语义信息太少，向量搜索难以准确定位

### RRF 融合算法

RRF 的公式非常简单：

```
RRF_Score(d) = Σ 1 / (k + rank_i(d))
```

其中 `k` 是平滑常数（通常取 60），`rank_i(d)` 是文档 d 在第 i 个排序列表中的排名。

**直觉理解**：每个搜索路径给文档打分的方式是"排名越靠前分数越高"，然后把所有路径的分数加起来。这样即使某个路径漏掉了某条结果，另一个路径也能把它捞回来。

## 代码示例

```typescript
// 1. 关键词搜索实现（FileStore）
async keywordSearch(
  collectionName: string,
  query: string,
  topK: number
): Promise<SearchResult[]> {
  const store = this.loadStore();
  const collection = store.collections[collectionName];

  // 中文逐字分词 + 英文按词分词
  const queryChars = [...query];  // 中文拆成单字
  const queryWords = query.toLowerCase().split(/\s+/);  // 英文按空格

  const scored = collection.texts.map((text, i) => {
    const lower = text.toLowerCase();
    let score = 0;
    // 中文：逐字匹配
    for (const char of queryChars) {
      if (lower.includes(char)) score++;
    }
    // 英文：按词匹配
    for (const word of queryWords) {
      if (lower.includes(word)) score++;
    }
    return { index: i, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => ({
      id: collection.ids[s.index],
      score: s.score,
      text: collection.texts[s.index],
      meta: collection.metas?.[s.index] ?? null,
    }));
}

// 2. 混合搜索 — 并行调用 + RRF 融合
async function hybridSearch(
  vectorStore: VectorStore,
  collectionName: string,
  queryEmbedding: number[],
  queryText: string,
  topK: number
): Promise<SearchResult[]> {
  // 并行调用两路搜索
  const [vectorResults, keywordResults] = await Promise.all([
    vectorStore.search(collectionName, queryEmbedding, topK * 2),
    vectorStore.keywordSearch!(collectionName, queryText, topK * 2),
  ]);

  // RRF 融合
  const K = 60;  // 平滑常数
  const scoreMap = new Map<string, { score: number; result: SearchResult }>();

  // 向量搜索路径的排名
  vectorResults.forEach((r, rank) => {
    const existing = scoreMap.get(r.id);
    const rrfScore = 1 / (K + rank + 1);
    if (existing) {
      existing.score += rrfScore;
    } else {
      scoreMap.set(r.id, { score: rrfScore, result: r });
    }
  });

  // 关键词搜索路径的排名
  keywordResults.forEach((r, rank) => {
    const existing = scoreMap.get(r.id);
    const rrfScore = 1 / (K + rank + 1);
    if (existing) {
      existing.score += rrfScore;
    } else {
      scoreMap.set(r.id, { score: rrfScore, result: r });
    }
  });

  // 按 RRF 分数排序
  return [...scoreMap.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => ({ ...item.result, score: item.score }));
}
```

## 关键要点

1. **两路并行**：`Promise.all` 并行调用向量和关键词搜索，不增加延迟
2. **RRF 不依赖原始分数**：只依赖排名（rank），所以两路搜索的分数尺度不同也没关系
3. **混合搜索不做阈值过滤**：RRF 分数通常很小（约 0.016），和余弦相似度的阈值（0.45）完全不在一个量级
4. **每路取 topK * 2**：给融合留出空间，避免某路的好结果因 topK 限制被截断

## ❌ 常见错误与纠正（复习重点）⚠️

### 错误1：用余弦相似度阈值过滤 RRF 结果
- **错误示例**: `hybridResults.filter(r => r.score >= 0.45)`
- **错误原因**: RRF 分数范围约 0.01~0.02，余弦相似度阈值 0.45 会过滤掉所有结果
- **正确理解**: 混合搜索的结果不做阈值过滤，直接取 topK；如果需要过滤质量，应在各路搜索内部各自过滤

### 错误2：只用一路搜索的结果
- **错误示例**: 向量搜索结果够用就不做关键词搜索了
- **错误原因**: 两路搜索覆盖的场景不同，漏掉任何一路都可能丢失相关结果
- **正确理解**: 即使一路搜索看起来结果够多，另一路可能包含它漏掉的关键信息

### 错误3：中文分词用 split(" ")
- **错误示例**: `query.split(" ")` 处理中文查询
- **错误原因**: 中文没有空格分隔词语，split 后整个句子变成一个"词"
- **正确理解**: 中文用 `[...query]` 展开为单字符数组，英文用 `split(/\s+/)` 按空格分词

## 🔗 相关知识
- [[文件向量存储实现]] — 向量搜索的底层实现
- [[RAG对话API设计]] — hybridSearch 在 chat route 中的调用方式
- [[多轮对话检索优化]] — 另一个提升检索质量的策略
