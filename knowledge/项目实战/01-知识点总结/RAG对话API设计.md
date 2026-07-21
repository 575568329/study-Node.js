# RAG 对话 API 设计

> 学习日期: 2026-05-03 | 置信度: ⭐⭐⭐

---

## 核心概念

RAG（Retrieval-Augmented Generation）对话流程：
1. 用户提问 → 将问题向量化（Embedding）
2. 在向量库中做相似度搜索，找到最相关的文档片段
3. 将搜索结果作为上下文注入 system prompt
4. LLM 基于上下文流式生成回答

## 代码示例

```typescript
// 核心流程（/api/chat/route.ts）
const [queryVector] = await getEmbedding([userQuery])          // Step 1: 向量化
const searchResults = await vectorStore.similaritySearch(...)    // Step 2: 搜索
const context = results.map((r, i) => `[${i + 1}] ${r.content}`) // Step 3: 拼接上下文
const result = streamText({ system: buildSystemPrompt(...) })  // Step 4: 流式回答
```

## 关键要点
1. 相似度搜索需要设置最低阈值（MIN_RELEVANCE_SCORE），低于阈值的结果视为不相关
2. system prompt 分两种策略：有相关内容时标注引用，无相关内容时标注 AI 补充
3. 引用标注应紧跟语句后面，不要在末尾汇总
4. TOP_K 控制搜索返回数量，需平衡召回率和噪声

## ❌ 常见错误与纠正（复习重点）⚠️

### 错误1：集合名不一致
- **错误示例**: 上传用 `kb-${id}`，查询用 `kbId`
- **错误原因**: 上传和查询接口由不同时间编写，命名规范不统一
- **正确理解**: 统一使用 `kb-${kbId}` 格式，在常量中定义

### 错误2：相似度阈值过高导致全部过滤
- **错误示例**: MIN_RELEVANCE_SCORE = 0.6，实际大部分结果在 0.5-0.6 之间
- **错误原因**: 对 embedding 模型的实际表现预期过高
- **正确理解**: 0.45-0.55 对中文短片段来说是正常范围，需要结合混合搜索优化

### 错误3：docCount 统计切片数而非文件数
- **错误示例**: 上传 1 个文件显示 12 篇文档
- **错误原因**: 直接用向量库的 count() 方法统计
- **正确理解**: 文档记录和向量切片是两层概念，docCount 应统计文档表记录数

## 🔗 相关知识
- [[AI SDK v6 useChat 与流式输出]]
- [[文档切片策略]]
- [[文件向量存储实现]]
