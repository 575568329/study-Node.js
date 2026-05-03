# 项目实战 Day 3 — RAG 对话 + 文档上传 + 日志系统

**日期**: 2026-05-03
**项目**: rag-docs-assistant（AI 知识库问答系统）
**状态**: 已完成

---

## 本次完成的功能

### 1. RAG 对话 API（`/api/chat`）
- 用户提问 → 向量化 → 相似度搜索 → 注入上下文 → LLM 流式回答
- 相似度过滤：topScore < 0.45 的结果视为不相关
- 引用标注：有相关内容时句中标注 [编号]，无相关内容时标注 AI 补充回答
- 全量日志记录：搜索结果、注入上下文、LLM 回答

### 2. 聊天面板（`ChatPanel`）
- 使用 AI SDK v6 的 `useChat` + `DefaultChatTransport` 传递 kbId
- 流式输出、停止生成、重新生成
- 消息气泡区分用户/助手

### 3. 文档上传按钮
- 首页知识库卡片上新增"上传文档"按钮
- `<label>` 包裹隐藏 `<input type="file">`，`e.stopPropagation()` 防止冒泡
- 同名文件去重校验
- 上传成功/失败提示

### 4. 日志系统（`logger.ts`）
- 所有操作和对话记录写入 `data/app.log`
- 记录：文档上传、对话请求、相似度搜索结果、注入上下文、LLM 回答
- 格式：`[ISO时间戳] 级别 消息 {JSON详情}`

### 5. 数据持久化（`db.ts`）
- 从内存数据库改为 JSON 文件持久化（`data/db.json`）
- 重启服务数据不丢失
- 默认知识库（know_0）始终存在

---

## 本次调整/优化的功能

### 切片优化（`chunker.ts`）
- **调整前**：纯按字符数切片（500字符/段），无语义结构
- **调整后**：按 Markdown 标题分段，每段切片携带所属标题，保留上下文语义
- 最终参数：chunkSize=1000, overlap=100

### 向量存储（`file-store.ts`）
- **调整前**：相对路径 `./data/vectors.json`，不自动创建目录
- **调整后**：`path.resolve()` 绝对路径，写入前自动 `mkdirSync({ recursive: true })`
- 新增 `count()` 方法统计集合向量数

### 上传接口（`upload/route.ts`）
- 新增同名文件去重检查
- ID 格式改为 `kb${id}-chunk-${Date.now()}-${i}` 避免冲突
- 常量提取：chunkSize、overlap

### 对话接口（`chat/route.ts`）
- 集合名统一为 `kb-${kbId}`（修复上传/查询集合名不一致的 bug）
- 新增相似度阈值过滤（MIN_RELEVANCE_SCORE=0.45）
- system prompt 分两种策略：有相关内容 vs 无相关内容
- TOP_K 从 3 调到 5

### 代码风格优化
- 所有模块加顶部注释（职责 + 核心流程）
- 函数加 JSDoc（参数说明、用途）
- 关键步骤编号注释（Step 1, Step 2...）
- 常量提取命名（`MIN_RELEVANCE_SCORE`、`TOP_K`）
- 通用逻辑提取为独立函数（`buildSystemPrompt`、`cosineSimilarity`、`withHeading`）
- 清理 koroFileHeader 模板注释

---

## 踩坑记录

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 上传成功但查询 0 篇文档 | docCount 统计的是切片数而非文件数 | 改为统计文档记录数 |
| 刷新后文档数变为 0 | db.ts 内存数据重启丢失 | 改为 JSON 文件持久化 |
| 上传文档按钮触发卡片跳转 | `<label>` 的 click 冒泡到卡片 | `onClick` 加在 `<label>` 上而非 `<input>` |
| 集合名不匹配导致搜不到 | 上传用 `kb-${id}`，查询用 `kbId` | 统一为 `kb-${kbId}` |
| 同文件重复上传 | 无去重检查 | 上传前校验 db.listDocs 中同名文件 |
| LLM 回答未引用文档内容 | 搜索结果不相关（topScore<0.6） | 降低阈值到 0.45，增大 TOP_K 到 5 |
| data 目录不存在导致 ENOENT | file-store 未自动创建目录 | 写入前 `mkdirSync({ recursive: true })` |

---

## 遗留问题 / 后续优化

- [ ] 混合搜索（向量 + 关键词 BM25）提升召回率
- [ ] 更好的 embedding 模型（当前 embedding-3 对中文短片段效果一般）
- [ ] SourceBadge 来源追溯标签
- [ ] 文件删除时同步清理向量数据
- [ ] 多轮对话上下文优化
