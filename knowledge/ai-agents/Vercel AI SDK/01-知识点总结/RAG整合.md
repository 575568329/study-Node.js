# RAG 整合

> LangChain RAG 后端 + Vercel AI SDK 前端流式展示的对接模式

---

## 核心思路

RAG 整合的本质是**两个库各司其职**：

- **LangChain**：负责知识检索（向量存储 + 相似度搜索）
- **AI SDK**：负责流式交互（streamText + useChat）

对接方式：将检索结果注入 `streamText` 的 `system` prompt。

---

## 核心代码模式

```typescript
// 1. LangChain 检索文档
const docs = await vectorStore.similaritySearch(query)
const context = docs.map(d => d.pageContent).join('\n')

// 2. 注入 system prompt，通过 AI SDK 流式返回
const result = streamText({
  model: glm.chat('glm-4-flash'),
  system: `基于以下资料回答问题。如果资料中没有相关内容，请诚实说明。\n\n${context}`,
  messages,
})

return result.toUIMessageStreamResponse()
```

---

## 实战练习（硬编码模拟）

真实项目需要向量数据库，但简单 demo 可以用硬编码 + 关键词检索：

```typescript
// 硬编码知识库
const knowledgeBase: Record<string, string> = {
  react: 'React 是 Facebook 开发的 UI 库...',
  'node.js': 'Node.js 是基于 Chrome V8 的 JavaScript 运行时...',
  'next.js': 'Next.js 是 React 全栈框架...',
}

// 关键词检索（简化版）
function searchDocs(query: string): string {
  const keywords: string[] = query.toLowerCase().split(/\s+/)
  const results: string[] = []
  for (const [key, content] of Object.entries(knowledgeBase)) {
    if (keywords.some(kw => key.includes(kw))) {
      results.push(content)
    }
  }
  return results.join('\n')
}
```

---

## 踩坑记录

### 1. LangChain 依赖冲突

**问题**：安装 `@langchain/community` 时报 ERESOLVE 错误。

**原因**：`@langchain/community@1.x` 要求 `@langchain/core@1.x`，但项目中已有 `@langchain/core@0.x`（从 LangChain.js 学习阶段安装的）。大版本号不兼容。

**解决方案**：简单 demo 不需要安装 LangChain，用硬编码模拟检索即可验证对接流程。真实项目时统一升级到 core@1.x。

### 2. 中文关键词检索不准

**问题**：`split(/\s+/)` 对中文分词不友好，中文句子没有空格。

**解决方案**：真实项目用向量检索（Chroma / Pinecone），通过 Embedding 相似度匹配，不依赖分词。

---

## 与纯 LangChain RAG 的区别

| 对比项 | 纯 LangChain RAG | LangChain + AI SDK RAG |
|--------|-----------------|----------------------|
| 检索方式 | LangChain vectorStore | 相同 |
| 结果注入 | LCEL Chain pipe | system prompt 拼接 |
| 前端展示 | 需自己实现流式 | useChat 自动处理 |
| 交互体验 | 基础 | 流式 + 状态管理 + 工具调用 |

---

## 生产环境架构

```
用户提问 → Next.js API Route
             ↓
         vectorStore.similaritySearch(query)
             ↓
         检索结果 → 拼接到 system prompt
             ↓
         streamText({ system, messages })
             ↓
         前端 useChat 流式展示
```

---

## 相关主题

- [[useChat核心API]] — 前端流式展示基础
- [[Tool-Calling]] — 可扩展为 RAG + Tool Calling 组合
- `ai-agents/LangChain/` — LangChain RAG 完整流程

---

*最后更新：2026-04-26*
