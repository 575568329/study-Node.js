# RAG项目体检报告

更新时间：2026-05-07

## 总结

`rag-docs-assistant` 已经具备“全栈 AI 应用项目”的主体能力：Next.js 工作台、知识库管理、多格式文档上传、文档解析、切片、Embedding、向量检索、混合检索、AI SDK 流式回答、来源引用、本地 JSON 持久化和知识图谱。

当前项目可以作为简历主项目继续打磨，但还不能直接作为稳定交付版本写满能力点。构建问题、删除知识库时的图谱清理、完整对话历史持久化已在本次修复并验证通过，剩余优先风险是删除单个文档时图谱数据未同步清理、图谱生成状态不可见、生产级数据存储与权限方案缺失。

当前真实项目路径：

```text
D:\Study\rag-docs-assistant
```

旧文档中记录的路径 `C:\Users\about\OneDrive\桌面\study\rag-docs-assistant` 当前不存在，需要后续同步修正。

## 已完成能力

### 代码结构

- Next.js 16 App Router 项目结构清楚，页面分为 `chat`、`data`、`graph` 三个工作区。
- API Route 已按业务拆分：`/api/chat`、`/api/chat/history`、`/api/kb`、`/api/kb/[id]/upload`、`/api/kb/[id]/docs`、`/api/graph`、`/api/graph/search`、`/api/graph/favorites`。
- 核心服务模块有基本边界：`db.ts`、`doc-parser.ts`、`chunker.ts`、`embedding.ts`、`vector-store/`、`graph-store.ts`、`logger.ts`。
- README 已覆盖项目定位、技术栈、核心能力、启动方式、检索范围和项目结构。

### 知识库

- 支持创建知识库：`POST /api/kb`。
- 支持删除知识库：`DELETE /api/kb/[id]`。
- 支持知识库选择：前端通过 `kbId` query 参数贯穿 `chat`、`data`、`graph` 页面。
- 支持“全部知识库”检索：`kbId` 为空时，对所有知识库集合做统一检索。

### 文档上传与解析

- 支持 `.txt`、`.md`、`.pdf`、`.docx`、`.xlsx` 五种格式。
- 上传接口有知识库存在校验、文件为空校验、10MB 大小限制、同名文件拦截。
- 前端上传使用 `XMLHttpRequest`，支持上传进度展示。
- 原始文件会保存到 `data/uploads/`，来源卡片支持下载原文件。
- 解析失败会返回错误，前端以 Toast 展示失败状态。

### 切片与向量化

- 切片逻辑支持 Markdown 标题分段，再按固定字符长度切片。
- 当前上传链路使用 `chunkSize=1000`、`overlap=100`。
- 每个切片保留 `filename`、`heading`、`chunkIndex` 元数据，用于来源追溯。
- Embedding 使用智谱 `embedding-3`，支持批量向量化。
- 向量存储抽象为 `VectorStore`，当前支持本地 `FileStore` 和可选 `ChromaStore`。

### RAG 问答

- 对话接口会把最近上下文拼接成检索 query，支持基础多轮追问检索。
- 支持单知识库检索和跨知识库检索。
- FileStore 模式支持向量检索 + 关键词检索 + RRF 混合排序。
- 对话回答使用 AI SDK `streamText` 和 `toUIMessageStreamResponse`，具备 SSE/流式输出能力。
- 通过 `messageMetadata` 返回来源引用，前端 `SourceCard` 可以展示来源文件、知识库名称、分数和下载入口。
- 无相关上下文时，system prompt 要求明确标注“AI 补充回答”。

### 知识图谱

- 上传文档后会添加文档节点，并异步调用 LLM 抽取实体和关系。
- 图谱数据通过 `graphology` 存储到 `data/graph.json`。
- 图谱页支持概览、搜索、节点详情、扩展邻域、收藏节点。
- 图谱查询支持按 `kbId` 过滤。

### 后端能力

- 主要 API 有基础入参校验。
- 有文件日志 `data/app.log`，包含上传、检索、对话等关键日志。
- 本地持久化使用 `data/db.json`、`data/vectors.json`、`data/graph.json`、`data/uploads/`。
- README 中已说明 FileStore 适合开发演示，生产可演进到数据库和 Chroma。

## 简历可写点

可以写，但要按“个人项目 / 演示级系统”的边界表达：

1. 基于 Next.js + React + TypeScript 实现 AI 知识管理工作台，包含知识库管理、文档上传、RAG 对话和知识图谱三个核心模块。
2. 封装多格式文档解析链路，支持 txt、md、pdf、docx、xlsx 上传解析，并进行切片、批量 Embedding 和本地向量持久化。
3. 实现基于向量检索、关键词检索和 RRF 融合排序的混合检索，提高精确关键词和语义相似问题的召回能力。
4. 使用 AI SDK 实现流式问答，并通过来源元数据返回引用文件、章节和相关性分数，降低回答不可追溯风险。
5. 设计本地 FileStore / ChromaStore 向量存储抽象，支持从本地演示环境向独立向量库演进。
6. 使用 graphology 构建知识图谱数据结构，基于文档内容异步抽取实体和关系，并支持图谱搜索、节点详情和收藏。

暂不建议写得过满的点：

- 不要写“生产级权限系统”，当前没有用户、角色、权限隔离。
- 不要写“完整对话持久化”，当前只保存对话标题和元数据，不保存消息内容。
- 不要写“大规模高并发向量检索”，当前 FileStore 是 JSON 文件读写，适合演示和小规模本地场景。
- 不要写“完整 GraphRAG”，当前图谱主要用于可视化与实体关系展示，问答链路没有使用图谱增强检索。

## 面试风险点

### P0：构建问题已修复

执行命令：

```bash
npm run build
```

第一次体检结果：失败。

失败原因：Next.js 16/Turbopack 推断 workspace root 为 `D:\`，因为检测到 `D:\package-lock.json`，导致构建时从错误根目录解析依赖，报 `Module not found`。

已处理：

- 在 `next.config.ts` 中配置 `turbopack.root = process.cwd()`，固定项目根目录。
- 执行 `npm install` 补齐 `package-lock.json` 中已有但本地 `node_modules` 缺失的依赖。
- 再次执行 `npm run build`，结果通过。

当前验证结果：

```text
✓ Compiled successfully
✓ Finished TypeScript
✓ Generating static pages
```

### P0：项目路径记录过期

当前执行计划里记录的主项目路径是：

```text
C:\Users\about\OneDrive\桌面\study\rag-docs-assistant
```

实际存在路径是：

```text
D:\Study\rag-docs-assistant
```

后续所有入口文档应改为真实路径，否则每次恢复任务都会先定位失败。

### P1：完整对话历史持久化已修复

`/api/chat/history` 现在支持两种读取方式：

- `GET /api/chat/history?kbId=xxx`：读取对话列表。
- `GET /api/chat/history?convId=xxx`：读取单个对话及完整消息。

已处理：

- 在 `db.ts` 中新增 `conversationMessages` 存储结构。
- `/api/chat` 在收到 `conversationId` 时保存本轮 user / assistant 消息，assistant 消息会保留来源引用 metadata。
- 左侧新建对话后跳转到 `/chat?convId=xxx`，发送消息时会携带 `conversationId`。
- 点击历史对话会按 `convId` 恢复消息内容。

剩余限制：当前仍是本地 JSON 文件存储，适合演示和单机使用；生产环境需要迁移到数据库。

### P1：删除知识库图谱清理已修复

`DELETE /api/kb/[id]` 现在会删除知识库元数据、文档记录、向量集合、图谱集合和原始文件。

已处理：在 `src/app/api/kb/[id]/route.ts` 中调用 `getGraphStore().deleteCollection(id)`。

剩余风险：删除单个文档时当前只清理文档元数据、原始文件和 chunk 向量，尚未按文档维度清理图谱节点。

### P1：图谱抽取失败只记录日志，前端没有任务状态

实体抽取是上传成功后的异步任务，失败不影响上传结果，这是合理设计。但当前没有“图谱生成中 / 失败 / 可重试”的前端状态，用户只能从日志知道失败。

面试中可以解释为“上传主链路不被图谱抽取阻塞”，但需要补一个任务状态或重试入口，才能支撑更完整的工程说法。

### P1：本地 JSON 持久化不适合多人和并发

`db.ts` 和 `FileStore` 都是读 JSON、改内存、写 JSON。单机演示没问题，但多用户、多请求并发下可能有写覆盖、锁竞争和性能问题。

需要准备清楚演进方案：SQLite / PostgreSQL 存业务元数据，Chroma / pgvector 存向量，文件存储迁移到对象存储或独立上传目录。

### P2：API 校验还不够结构化

当前 API 使用手写判断，没有统一 schema 校验。可以运行，但面试追问“参数校验怎么做、错误码怎么统一”时，需要补一个清晰方案，例如 Zod schema + 统一 error response helper。

### P2：ChatPage 中实体点击还是 TODO

`handleEntityClick` 目前只是 `console.log`，没有跳转图谱页。说明“问答结果关联实体跳图谱”这条链路还没闭环。

## 必须补齐项

### 第一优先级：构建已通过

- [x] 修复 Next workspace root 推断问题。
- [x] 执行 `npm install` 补齐本地依赖。
- [x] 执行 `npm run build`，确认生产构建通过。

### 第二优先级：同步修正项目路径文档

- 把 `docs/00-工作入口.md`、`docs/04-全栈求职执行计划.md`、`memory/todo.md` 中的旧路径改为 `D:\Study\rag-docs-assistant`。
- 避免后续任务启动时重复定位失败。

### 第三优先级：补数据一致性

- [x] 删除知识库时同步清理图谱数据。
- [ ] 删除文档时考虑同步清理该文档对应图谱节点，至少先在文档里说明当前限制。

### 第四优先级：对话历史闭环已完成

- [x] 新增消息存储结构：`conversationMessages`。
- [x] `chat` 接口完成后保存 user / assistant 消息。
- [x] 点击历史对话时按 `conversationId` 恢复消息。

### 第五优先级：补图谱生成状态

- 文档记录中增加 `graphStatus`：`pending | running | success | error`。
- 实体抽取失败时写入错误状态。
- 数据页或图谱页展示失败原因和重试入口。

### 第六优先级：补面试材料

- 写 `docs/RAG项目架构设计.md`。
- 写 `docs/RAG项目3分钟讲稿.md`。
- 写 `docs/RAG项目追问清单.md`。
- 准备 3 个演示文档和 5 个稳定演示问题。

## 建议执行顺序

1. 已完成：修复构建环境问题，`npm run build` 已通过。
2. 修正 Node.js-Study 文档里的 RAG 项目真实路径。
3. 已完成：删除知识库时同步清理图谱数据。
4. 已完成：补完整对话历史持久化。
5. 补图谱生成状态和失败提示。
6. 在 README 中增加“当前限制与演进方案”。
7. 产出架构图、讲稿、追问清单和演示脚本。

## 体检结论

项目已经具备简历主项目的基础，不需要推倒重做。构建、路径同步、删除知识库图谱清理、完整对话历史持久化已处理，下一步建议处理图谱生成状态展示，或者补删除单个文档时的图谱清理。等项目能稳定运行和演示后，再进入组件库脚手架更合理。

