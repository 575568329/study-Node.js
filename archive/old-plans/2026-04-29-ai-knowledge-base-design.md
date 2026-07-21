# AI 知识库问答系统 — 设计文档

> 日期: 2026-04-29 | 项目类型: RAG 演示项目（面试作品集）

---

## 1. 项目概述

一个基于 RAG（检索增强生成）的 AI 知识库问答系统。用户创建知识库、上传文档，AI 基于文档内容回答问题并展示来源追溯。

## 2. 技术栈

| 层 | 技术 | 版本 |
|---|------|------|
| 框架 | Next.js + React + TypeScript | 16.x / 19.x |
| 样式 | Tailwind CSS | 4.x |
| AI 交互 | Vercel AI SDK | v6 |
| AI 编排 | LangChain.js | 0.3.x |
| LLM | 智谱 GLM-5.1 | - |
| Embedding | 智谱 Embedding-3 | fetch 直调 |
| 向量数据库 | Chroma（可切换文件向量库） | 本地 localhost:8000 |

## 3. 核心功能

1. **多知识库管理** — 创建/删除知识库，每个库独立文档集
2. **文档上传** — 上传 txt 文件，自动切片 + 向量化 + 存入 Chroma
3. **RAG 对话** — 基于知识库文档的流式聊天，AI 只根据文档回答
4. **来源追溯** — 显示回答来源于哪篇文档

## 4. 页面设计

| 路由 | 页面 | 功能 |
|------|------|------|
| `/` | 首页 | 知识库列表 + 创建入口 |
| `/kb/[id]` | 知识库详情 | 文档列表 + 上传 + 进入聊天 |
| `/chat/[id]` | 对话页 | RAG 流式聊天 + 来源标签 |

## 5. 数据模型（内存数据库）

```typescript
interface KnowledgeBase {
  id: string
  name: string
  description: string
  docCount: number
  createdAt: string
}

interface Document {
  id: string
  kbId: string
  filename: string
  chunkCount: number
  uploadedAt: string
}
```

知识库和文档的元数据用内存 db.ts 管理（和 nextjs-demo 项目一致的模式）。

### 向量存储策略模式

通过环境变量 `VECTOR_STORE` 切换后端，无需改业务代码：

```typescript
// lib/vector-store/types.ts
interface VectorStore {
  addVectors(collectionName: string, vectors: number[][], documents: string[], ids: string[]): Promise<void>
  similaritySearch(collectionName: string, query: number[], topK: number): Promise<{ content: string; score: number }[]>
  deleteCollection(collectionName: string): Promise<void>
}

// lib/vector-store/chroma-store.ts  — Chroma 实现（有 Chroma 时用）
// lib/vector-store/file-store.ts    — 文件向量库实现（JSON 文件，可提交 Git 同步）
// lib/vector-store/index.ts         — 工厂函数，根据 env 切换
```

| 实现 | 数据位置 | 优点 | 缺点 |
|------|---------|------|------|
| Chroma | localhost:8000 | 生产级、性能好 | 需要安装 Python + 启动服务 |
| File | `data/vectors/` | 零依赖、可 Git 同步 | 数据量大时慢 |

切换方式：`.env.local` 中设置 `VECTOR_STORE=chroma` 或 `VECTOR_STORE=file`。

## 6. API 设计

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/kb` | GET | 知识库列表 |
| `/api/kb` | POST | 创建知识库 `{ name, description }` |
| `/api/kb/[id]` | DELETE | 删除知识库 + Chroma 集合 |
| `/api/kb/[id]/upload` | POST | 上传文档（FormData）→ 切片 → 向量化 |
| `/api/kb/[id]/docs` | GET | 文档列表 |
| `/api/chat` | POST | RAG 对话（流式），body: `{ messages, kbId }` |

## 7. 核心流程

### 文档上传

```
用户选择文件 → FormData 上传 → API Route 接收
→ fs.writeFile 保存到 uploads/ → TextLoader 读取
→ RecursiveCharacterTextSplitter 切片（chunkSize=500, overlap=50）
→ GLM Embedding 逐批向量化 → Chroma.addVectors 存入集合 kb-{id}
→ db.ts 记录文档元数据
```

### RAG 对话

```
用户提问（带 kbId）→ Chroma.similaritySearch(query, 5) 检索 Top5
→ 拼接 system prompt：角色指令 + 检索文档内容
→ streamText({ model, system, messages }) 流式返回
→ 前端 useChat 展示
→ Tool Calling 返回 sources（文档名 + 相似度分数）
```

## 8. 项目结构

```
projects/ai-knowledge-base/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # 首页
│   │   ├── layout.tsx               # 全局布局
│   │   ├── kb/[id]/page.tsx         # 知识库详情
│   │   ├── chat/[id]/page.tsx       # RAG 对话
│   │   └── api/
│   │       ├── kb/route.ts          # GET/POST 知识库
│   │       ├── kb/[id]/route.ts     # DELETE 知识库
│   │       ├── kb/[id]/upload/route.ts  # POST 上传
│   │       ├── kb/[id]/docs/route.ts    # GET 文档列表
│   │       └── chat/route.ts        # POST RAG 对话
│   ├── lib/
│   │   ├── db.ts                    # 内存数据库
│   │   ├── embedding.ts             # GLM Embedding API
│   │   ├── chunker.ts               # 文档切片
│   │   └── vector-store/
│   │       ├── types.ts             # VectorStore 接口定义
│   │       ├── chroma-store.ts      # Chroma 实现
│   │       ├── file-store.ts        # 文件向量库实现
│   │       └── index.ts             # 工厂函数（根据 env 切换）
│   └── components/
│       ├── ChatPanel.tsx            # 聊天面板
│       ├── SourceBadge.tsx          # 来源标签
│       └── DocUploader.tsx          # 文档上传
├── uploads/                         # 上传文件
├── .env.local                       # API Key
└── package.json
```

## 9. 环境依赖

- Node.js 18+
- Python 3.8+（Chroma 需要）
- Chroma 服务：`pip install chromadb && chroma run`
- 智谱 API Key

## 10. 面试展示重点

- RAG Pipeline 设计（检索 → 上下文注入 → 生成）
- 向量数据库原理和使用
- 流式输出实现
- 文档切片策略（chunkSize / overlap 的权衡）
- 来源追溯的可靠性
