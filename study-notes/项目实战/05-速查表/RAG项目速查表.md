# RAG 项目速查表

> 更新日期: 2026-05-03

---

## 项目结构

```
rag-docs-assistant/
├── src/app/
│   ├── api/
│   │   ├── chat/route.ts          # RAG 对话 API
│   │   └── kb/
│   │       ├── route.ts           # 知识库 CRUD
│   │       └── [id]/upload/route.ts # 文档上传
│   └── page.tsx                   # 首页（知识库列表 + 上传）
├── src/components/
│   └── ChatPanel.tsx              # 聊天面板
├── src/lib/
│   ├── chunker.ts                 # 文档切片（标题分段）
│   ├── db.ts                      # JSON 文件持久化
│   ├── embedding.ts               # 智谱 Embedding API
│   ├── logger.ts                  # 日志系统
│   ├── types.ts                   # 类型定义
│   └── vector-store/
│       ├── types.ts               # VectorStore 接口
│       ├── file-store.ts          # JSON 文件向量存储
│       └── index.ts               # 策略模式切换
├── data/
│   ├── db.json                    # 知识库 & 文档记录
│   ├── vectors.json               # 向量数据
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
| MIN_RELEVANCE_SCORE | 0.45 | chat/route.ts |
| embedding model | embedding-3 | embedding.ts |
| chat model | glm-4-flash | chat/route.ts |
