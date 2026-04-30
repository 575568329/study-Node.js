# Day 2 会话笔记 — API 层 + 首页

> 日期: 2026-04-30
> 项目: rag-docs-assistant（RAG 知识库问答系统）

---

## 会话概述

完成了 API 层（知识库 CRUD + 文档上传）和首页页面，串通了"上传文件 → 切片 → 向量化 → 存储"的完整后端流程。

## 完成内容

### Step 2.1: chunker.ts — 文档切片
- 实现 `chunkText(text, chunkSize, overlap)` 函数
- 学到：步长 = chunkSize - overlap，Math.max 防无限循环
- 关键概念：overlap 防止关键信息被切断在边界

### Step 2.2: /api/kb — 知识库 CRUD
- GET 返回列表，POST 创建知识库
- 学到：request.json() 是异步方法需要 await
- API Route 文件必须在 src/app/api/ 下（不是 src/api/）

### Step 2.3: /api/kb/[id]/upload — 文档上传
- 完整流程：校验 → 接收文件 → 切片 → 批量向量化 → 存储
- embedding.ts 改造为批量模式（string[] → number[][]）
- 学到：FormData 接收用 request.formData()，File 对象有 name/text() 属性
- 设计：卫语句思想——先校验再耗时操作

### Step 2.4: /api/kb/[id] DELETE — 删除知识库
- 同时删除内存数据 + 向量数据
- 学到：db.deleteKB() 返回 void，不包在 NextResponse.json 里

### Step 2.4: page.tsx — 首页
- Claude 写 UI + 样式，用户写接口逻辑
- 学到：fetch 判断成功用 res.ok 而非 if(res)

## 学生提问记录

| 问题 | 类别 |
|------|------|
| 使用 embeddings 模型进行向量转化每次只能传一条吗？ | API 能力 |
| formData 里面怎么获取文件名称？ | API 使用 |
| 保存的时候每一条向量都有 ID 吗？ | 数据建模 |
| addVectors 没有 return 怎么获取状态？ | 错误处理 |
| createKB 不需要加吗？ | 职责边界 |
| 不需要 try catch 吗？ | 错误处理 |
| ../../../../../lib/chunker 导入没有别名吗？ | 工程化 |
| 把 try 提到最前面做校验？ | 流程设计 |

## 编码质量

### 进步
- TS 类型错误清零（Day 1 有 5 次）
- 数组操作错误清零（Day 1 有 4 次）
- map 使用自然流畅（chunks 生成 ids）
- await 无遗漏

### 仍需关注
- 层级边界：addVectors 第一个参数传了 file.name 而非集合名（重复问题）
- 错误处理：if(res) vs res.ok 的区别
- 流程设计：校验应放在耗时操作之前

## 面试题

1. 文档切片的 chunkSize 和 overlap 参数怎么选择？权衡是什么？
2. fetch 的 res 和 res.ok 有什么区别？
3. 上传文档的完整流程是什么？每一步的作用？

## 下次计划

Day 3: RAG 对话 + 来源追溯
- /api/chat — RAG 对话 API（similaritySearch + system prompt 注入 + streamText）
- ChatPanel.tsx — 聊天面板（useChat + 流式展示）
- SourceBadge.tsx — 来源追溯标签
- /chat/[id]/page.tsx — 对话页
