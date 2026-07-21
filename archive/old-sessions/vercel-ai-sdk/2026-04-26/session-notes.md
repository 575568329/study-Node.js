# Vercel AI SDK 会话记录 - 2026-04-26

## 会话概述
- **日期**: 2026-04-26
- **主要主题**: RAG 整合（LangChain RAG 后端 + AI SDK 前端流式展示）
- **格式**: 讲解 + 实战编码
- **里程碑**: Vercel AI SDK 全部 10/10 完成！

---

## 学习过程

### Part 1: RAG 整合

#### 核心概念讲解
- **对接模式**：LangChain RAG 后端 + AI SDK 前端流式展示
- **核心流程**：LangChain 检索文档 → 注入 streamText 的 system prompt → 前端流式展示
- **关键代码模式**：
  ```typescript
  const docs = await vectorStore.similaritySearch(query)  // LangChain 检索
  const context = docs.map(d => d.pageContent).join('\n')
  streamText({ system: `基于以下资料回答：\n${context}`, messages })
  ```

#### 实战练习
- **方案**：硬编码知识库 + 关键词检索模拟 RAG
- **知识库内容**：React、Node.js、Next.js 文档片段
- **检索方式**：split(/\s+/) 关键词匹配
- **结果**：成功检索到相关文档并通过 streamText 流式展示

#### 踩坑记录

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| LangChain 依赖冲突 ERESOLVE | @langchain/community@1.x 要求 core@1.x，项目有 core@0.x | 简单demo不需要装LangChain，硬编码模拟 |
| 中文关键词检索不准 | split(/\s+/) 按空格分词，中文没有空格 | 真实项目用向量检索 |

---

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| 为什么依赖冲突 | community@1.x 要求 core@1.x，但项目有 core@0.x，大版本不兼容 |
| keyword 隐式 any 类型 | 给 keywords 加 string[] 类型注解 |

---

## 学习成果总结

### 新增主题
- RAG 整合（LangChain 检索 + AI SDK 流式展示对接模式）

### 关键见解
1. RAG 整合的本质是"检索结果注入 system prompt"，两个库各司其职
2. LangChain 负责知识检索（向量存储 + 相似度搜索），AI SDK 负责流式交互
3. 简单 demo 可以用硬编码 + 关键词检索替代向量检索，验证对接流程
4. 中文分词是关键词检索的硬伤，真实项目必须用向量检索
5. npm 依赖大版本冲突（core@1.x vs core@0.x）是常见问题，需要理解 semver

---

## 表现评估

### 优势
- [x] 快速理解 RAG 整合的对接本质（检索 → 注入 → 流式展示）
- [x] 遇到依赖冲突能快速分析原因（大版本不兼容）
- [x] 主动发现中文检索的限制并提出向量检索方案

### 改进建议
- [ ] 真实项目中需要实操向量检索（Chroma/Pinecone）对接 AI SDK 的完整流程

---

## Vercel AI SDK 学习总结（全部完成）

### 已掌握的 10 个主题

| # | 主题 | 关键 API | 置信度 |
|---|------|---------|--------|
| 1 | 流式聊天基础 | `useChat` + `streamText` + `toUIMessageStreamResponse` | ⭐⭐⭐ |
| 2 | useChat 状态管理 | `status`（submitted/streaming/ready/error） | ⭐⭐⭐ |
| 3 | 停止生成 | `stop()` | ⭐⭐⭐ |
| 4 | 重新生成 | `regenerate()` | ⭐⭐⭐ |
| 5 | 新对话 | `useChat({ id })` 切换 id | ⭐⭐⭐ |
| 6 | Tool Calling | `tool()` + `inputSchema` + `execute` + `stepCountIs` | ⭐⭐⭐ |
| 7 | Structured Output | `Output.object()` + Zod schema | ⭐⭐⭐ |
| 8 | System Prompt 深入 | `system` + 策略映射 + `DefaultChatTransport` + `useRef` | ⭐⭐⭐ |
| 9 | Client-side Tool | `onToolCall` + `addToolOutput` + `sendAutomaticallyWhen` | ⭐⭐ |
| 10 | RAG 整合 | LangChain 检索 + `streamText({ system: context })` | ⭐⭐⭐ |

### 下一步
- 进入项目实战阶段（AI 知识库问答系统）
- 将 LangChain.js + Vercel AI SDK 组合应用于实际项目
