# LangChain.js 学习会话 - 2026-04-19

## 会话概述

**主题**: 向量数据库 Chroma + Chroma CRUD + 文档加载器 + RAG 优化（Multi-Query）+ Agent 工具调用
**时长**: 约 4-5 小时
**进度**: 9/14 → 14/14（64% → 100%）

---

## 学习内容

### 1. 向量数据库 Chroma（10.chroma.js）

**核心知识点**:
- Chroma 是轻量级开源向量数据库，客户端-服务器模式运行
- 安装：`pip install chromadb` + `npm install chromadb`
- 启动：`chroma run`（默认 localhost:8000）
- 连接：`new ChromaClient({ host: 'localhost', port: '8000' })`
- 集合管理：getOrCreateCollection / deleteCollection
- 手动传 GLM Embedding（默认 embedding 函数需 HuggingFace，国内不可用）
- query 返回 distances（越小越相似）和 documents

**关键理解**:
- Chroma 是独立的服务端向量数据库，不是浏览器端的
- Chroma 支持多客户端共享，这是相比手写内存向量库的核心优势
- 连接参数已弃用旧写法（path），必须用 host + port

### 2. Chroma CRUD（10.2-chroma-crud.js）

**完整 CRUD 操作**:
- **add**: ids/documents/embeddings/metadatas 数量必须一致
- **get**: 按 id 查询单条
- **query**: queryEmbeddings + nResults(TopK) + where(元数据过滤)
- **update**: 改了文档内容必须同步更新 embeddings
- **delete**: 按 ids 删除
- **count**: 统计总数

**关键理解**:
- ids 始终是数组格式，即使只有一条也要 `ids: ['chunk-1']`
- where 过滤基于 metadata，不是基于文档内容
- update 不更新 embeddings 会导致查询结果错误
- 旧集合残留会导致 where 过滤无效

### 3. 文档加载器（11-document-loader.js）

**核心知识点**:
- TextLoader 从 `@langchain/classic/document_loaders/fs/text` 导入
- 需安装 `@langchain/classic` 包
- loader.load() 返回 docs 数组
- docs[0].pageContent 是文本内容
- docs[0].metadata.source 是文件路径
- 替代硬编码字符串，从真实文件加载知识库

---

## 学习内容（下午）

### 4. RAG 优化 - Multi-Query 多查询（12-rag-multiquery.js）

**核心知识点**:
- Multi-Query 解决基础 RAG 的检索不全问题
- 用 LLM 将用户问题改写为 3 个不同角度的查询变体
- 对原始问题 + 所有变体分别检索，合并去重后生成回答
- 去重使用 Set 按 document id 过滤

**关键理解**:
- LLM 改写查询是核心——把模糊问题变成多个精确查询
- 去重很重要，避免重复文档占用 context 窗口
- 数据量小时效果不明显（可能所有查询返回相同结果）
- 数据量大时能显著提高召回率

**扩展学习**:
- 同时了解了 Re-ranking（重排序）和 Self-RAG（自检）两种策略
- 三种策略可组合使用，解决 RAG 不同环节的问题
- 完整笔记已整理到 `study-notes/LangChain/01-知识点总结/RAG优化策略.md`

### 5. Agent 工具调用（13-agent.js）

**核心知识点**:
- Agent = LLM + 工具 + 自主决策，LLM 自己决定调什么工具、调几次、什么顺序
- `tool()` 把普通函数包装成 LLM 能理解和调用的工具（函数 + name + description + schema）
- `createToolCallingAgent` 组装 Agent（LLM + 工具 + prompt）
- `AgentExecutor` 自动执行循环：思考→调工具→再思考→...→最终回答
- `{agent_scratchpad}` 占位符必须加，记录 Agent 的思考过程
- 与 Chain 的核心区别：Chain 是代码写死流程，Agent 是 LLM 自主决策
- Claude Code 本身就是 Agent 模式的典型例子

**关键理解**:
- `description` 是关键——LLM 靠描述决定用不用这个工具
- `schema` 用 Zod 定义参数格式，LLM 按这个传参
- AgentExecutor 自动处理循环，开发者只需定义工具和 prompt

---

## 学生问题与错误

### 概念理解问题

1. **"Chroma 是浏览器的向量数据库吗？"**
   - 混淆了概念，Chroma 是独立的服务端向量数据库
   - 教学方式：对比手写内存向量库，解释服务端数据库的优势

2. **"向量数据库不能共享"**
   - 手写的内存向量库确实不能共享（进程结束即丢失）
   - Chroma 恰恰支持多客户端共享，这是核心优势

### 代码错误

3. **ids 传字符串而非数组**
   - `ids: 'chunk-1'` → 应该是 `ids: ['chunk-1']`
   - Chroma 要求数组格式

4. **metadatas 数量和 documents 不匹配**
   - 3 条文档但只传了 2 条 metadata
   - 数量必须一致

5. **旧集合残留导致 where 过滤无效**
   - 之前的集合没有 metadata，where 过滤自然无效
   - 解决：先 deleteCollection 再重建

### 环境问题

6. **Windows 双 Python 问题**
   - Windows Store 有个假的 python.exe（exit code 49）
   - 真正的 Python 在 `C:/Users/about/AppData/Local/Python/bin/python.exe`

7. **GLM API 网络波动（ECONNRESET）**
   - 非代码问题，重试即可

---

## 踩坑记录

1. **Windows 双 Python**: Windows Store 的假 python.exe 拦截命令，需在 ~/.bashrc 中把真正 Python 路径加到 PATH 最前面
2. **Chroma 连接参数弃用**: `path` → `host` + `port`
3. **Chroma 默认 embedding 不可用**: 需 HuggingFace 下载模型，国内无法访问，改用手动传 GLM Embedding
4. **TextLoader 导入路径变更**: `langchain/document_loaders/fs/text` → `@langchain/classic/document_loaders/fs/text`

---

## 掌握主题

| # | 主题 | 文件 | 置信度 |
|---|------|------|--------|
| 10 | 向量数据库 Chroma | 10.chroma.js | ⭐⭐⭐ |
| 10.2 | Chroma CRUD | 10.2-chroma-crud.js | ⭐⭐⭐ |
| 11 | 文档加载器 | 11-document-loader.js | ⭐⭐⭐ |
| 12 | RAG 优化（Multi-Query） | 12-rag-multiquery.js | ⭐⭐⭐ |
| 13 | Agent（工具调用） | 13-agent.js | ⭐⭐⭐ |

---

## 表现评估

- **理解速度**: 快，Chroma CRUD 和 Multi-Query 都很快上手
- **实践能力**: 强，独立完成了 10.chroma.js、10.2-chroma-crud.js、12-rag-multiquery.js
- **提问质量**: 高，问了 ids 数组格式、where 过滤语法、查询变体去重等实用问题
- **问题定位**: 准确，能快速区分环境问题和代码问题

---

## 下次学习计划

1. LangGraph 工作流编排（进阶 Agent 场景）
2. Vercel AI SDK（流式交互 + 前端集成）
