# RAG 项目速查表

> 更新日期: 2026-05-05

---

## 项目结构

```
rag-docs-assistant/
├── src/app/
│   ├── api/
│   │   ├── chat/route.ts          # RAG 对话 API
│   │   ├── graph/route.ts         # 图谱 API（overview/search）
│   │   └── kb/
│   │       ├── route.ts           # 知识库 CRUD
│   │       └── [id]/upload/route.ts # 文档上传（含实体提取）
│   ├── layout.tsx                 # 布局（标题、lang="zh-CN"）
│   └── page.tsx                   # 首页（知识库列表 + 上传）
├── src/components/
│   ├── ChatPanel.tsx              # 聊天面板（泛型 useChat + SourceBadge）
│   ├── Sidebar.tsx                # 侧边栏（差异化渲染：对话/数据/图谱）
│   ├── KbCard.tsx                 # 知识库卡片（文档列表卡片化 + 彩色图标）
│   ├── GraphCanvas.tsx            # 图谱画布（白色主题 + ForceGraph2D）
│   ├── GraphPage.tsx              # 图谱页面（自动概览 + 重置按钮）
│   └── GraphSearch.tsx            # 图谱搜索（固定搜索栏 + Ctrl+K + 模态面板）
├── src/lib/
│   ├── chunker.ts                 # 文档切片（标题分段 + 元数据）
│   ├── db.ts                      # JSON 文件持久化（kb/docs/conversations/favorites）
│   ├── embedding.ts               # 智谱 Embedding API
│   ├── entity-extractor.ts        # AI 实体提取（glm-4-flash + structured output）
│   ├── graph-store.ts             # 图谱存储（节点/边/收藏）
│   ├── logger.ts                  # 日志系统
│   ├── types.ts                   # 类型定义（ChunkMetadata, SearchResult, SourceRef）
│   └── vector-store/
│       ├── types.ts               # VectorStore 接口（含 keywordSearch, hybridSearch）
│       ├── file-store.ts          # JSON 文件向量存储（含 metas 持久化）
│       └── index.ts               # 策略模式切换
├── data/
│   ├── db.json                    # 知识库 & 文档 & 对话 & 收藏
│   ├── graph.json                 # 图谱数据（实体/关系）
│   ├── vectors.json               # 向量数据 + metas 元数据
│   └── app.log                    # 运行日志
└── .env.local                     # ZHIPU_API_KEY, VECTOR_STORE
```

## 常用命令

```bash
npm run dev          # 启动开发服务器
rm data/vectors.json # 清理向量数据（需重新上传）
rm data/db.json      # 清理数据库（重启自动创建默认知识库）
```

## 关键参数

| 参数 | 值 | 位置 |
|------|----|------|
| chunkSize | 1000 | upload/route.ts |
| overlap | 100 | upload/route.ts |
| TOP_K | 5 | chat/route.ts |
| MIN_RELEVANCE_SCORE | 0.45 | chat/route.ts（仅向量搜索） |
| RRF_K | 60 | chat/route.ts（混合搜索平滑常数） |
| contextRounds | 2 | chat/route.ts（多轮对话上下文轮数） |
| maxQueryChars | 500 | chat/route.ts（搜索 query 截断长度） |
| embedding model | embedding-3 | embedding.ts |
| chat model | glm-4-flash | chat/route.ts |

## Day 5 新增概念速查

| 概念 | 一句话说明 |
|------|-----------|
| SourceBadge | 回答旁显示来源文档标签（从 chunker 到 UI 全链路元数据） |
| RRF 融合 | Reciprocal Rank Fusion — 按排名倒数加权，融合向量+关键词两路搜索结果 |
| hybridSearch | 并行调用向量搜索+关键词搜索，RRF 融合后取 topK |
| buildSearchQuery | 拼接最近 2 轮对话上下文，让 embedding 搜索理解追问 |
| ChunkMetadata | 切片元数据（fileName + title），绑定在切片阶段 |

## Day 6 新增概念速查

| 概念 | 一句话说明 |
|------|-----------|
| 侧边栏差异化 | 按页面上下文显示不同操作项（对话页新对话/数据页新建知识库/图谱页收藏） |
| KbCard 卡片化 | 文件列表卡片式布局，彩色图标区分文件类型（xlsx绿/pdf红/docx蓝/txt灰/md紫） |
| GraphCanvas 白色主题 | 白底深色文字的图谱配色，适配文档阅读场景 |
| GraphSearch 混合搜索 | 固定搜索栏 + Ctrl+K 快捷键 + 模态结果面板 |
| 实体提取集成 | 上传文档时调用 AI（glm-4-flash + structured output）提取实体写入 GraphStore |
| ForceGraph2D API | 2D 版本用 centerAt(x,y,ms)+zoom(level,ms)，3D 用 cameraPosition，不能混用 |
| JSON 持久化扩展 | db.ts 新增 conversations/favorites CRUD，向后兼容旧数据 |
| flex h-full 链 | Next.js 布局从 layout→page→component 每层都要 flex+h-full，否则高度断裂 |

| 概念 | 一句话说明 |
|------|-----------|
| SourceBadge | 回答旁显示来源文档标签（从 chunker 到 UI 全链路元数据） |
| RRF 融合 | Reciprocal Rank Fusion — 按排名倒数加权，融合向量+关键词两路搜索结果 |
| hybridSearch | 并行调用向量搜索+关键词搜索，RRF 融合后取 topK |
| buildSearchQuery | 拼接最近 2 轮对话上下文，让 embedding 搜索理解追问 |
| ChunkMetadata | 切片元数据（fileName + title），绑定在切片阶段 |
