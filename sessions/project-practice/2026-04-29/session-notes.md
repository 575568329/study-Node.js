# Day 1 会话笔记 — 项目搭建 + 数据层

> 日期: 2026-04-29
> 时长: 约 6 小时
> 项目: rag-docs-assistant（RAG 知识库问答系统）

---

## 会话概述

搭建了 AI 知识库问答系统的项目骨架和完整数据层。用户通过苏格拉底式教学，自己编写了所有代码。

## 完成内容

### Step 1.1: 项目初始化
- `create-next-app` 创建项目（Next.js 16 + React 19 + TypeScript + Tailwind CSS 4）
- 安装依赖：ai@6, @ai-sdk/openai@3, chromadb@3
- Git 初始化 + 关联 GitHub 远程仓库

### Step 1.2: 环境配置
- `.env.local` 配置 ZHIPU_API_KEY 和 VECTOR_STORE=file

### Step 1.3: 向量存储策略模式
- `types.ts` — VectorStore 接口（addVectors / similaritySearch / deleteCollection）
- `chroma-store.ts` — Chroma 实现（getOrCreateCollection + add/query + distance→score 转换）
- `file-store.ts` — 文件向量库实现（JSON 读写 + 余弦相似度计算 + 排序截取）
- `index.ts` — 工厂函数（环境变量切换 Chroma/File）

### Step 1.4: Embedding 封装
- `embedding.ts` — GLM Embedding API 封装（fetch 直调，单文本→单向量）

### Step 1.5: 内存数据库
- `types.ts`（lib 层）— KnowledgeBase + Document 数据模型
- `db.ts` — 内存数据库（listKB/createKB/deleteKB/listDocs/addDoc/deleteDocs）

## 学生提问记录

| 问题 | 类别 |
|------|------|
| 这三个方法不需要设计吗？ | 设计思维 |
| ids 是有什么作用？ | 概念理解 |
| topK 是什么意思？ | 概念理解 |
| collection 怎么获取的？ | API 使用 |
| client 是从哪里来？ | 设计模式（依赖注入） |
| 直接 return 这两个实例吗？ | 设计模式（工厂） |
| similaritySearch 类型报错（二维数组） | TypeScript |
| cosineSimilarity 怎么调用？ | 数组操作 |
| Document 是用来存储什么的？ | 数据建模 |
| docCount 从哪里获取？ | 数据建模 |
| KnowledgeBase 中存的是什么信息？ | 数据建模 |
| 新增的时候这两个都要更新吗？ | 数据建模 |

## 理解检查

- ✅ 策略模式理解正确（多种实现 + 环境变量切换）
- ✅ Chroma 二维数组转换理解了（documents[0] 取内层数组）
- ✅ distance → score 转换理解了（1 - distance）
- ✅ 余弦相似度 vs 欧氏距离理解了（方向 vs 距离）
- ✅ 向量层 vs 业务层的边界理解了

## 编码薄弱点

详见项目文档：`docs/coding-review.md`

主要薄弱领域：
1. **TypeScript 类型**（5次）— 数组维度、export、返回值类型
2. **数组操作**（4次）— sort、slice、循环变量
3. **错误处理**（2次）— throw vs return string
4. **层级边界**（2次）— 文件位置、职责划分

## 掌握主题

| # | 主题 | 置信度 |
|---|------|--------|
| 1 | 策略模式实战（接口+实现+工厂） | ⭐⭐⭐ |
| 2 | Chroma API 使用（add/query/delete） | ⭐⭐⭐ |
| 3 | 余弦相似度实现 | ⭐⭐⭐ |
| 4 | GLM Embedding API（fetch 直调） | ⭐⭐⭐ |
| 5 | 内存数据库设计（CRUD + 实时计算） | ⭐⭐⭐ |

## 面试题

1. 策略模式在什么场景下使用？
2. 余弦相似度 vs 欧氏距离的区别和适用场景？
3. 向量存储层和业务数据层为什么要分开设计？

## 下次计划

Day 2: 文档上传 + 切片向量化
- lib/chunker.ts — 文档切片工具
- /api/kb — 知识库 CRUD API
- /api/kb/[id]/upload — 文档上传 API
- 首页 page.tsx — 知识库列表
