# 项目实战 Day 4 — UI 打磨 + 错误处理 + Markdown 渲染

**日期**: 2026-05-04
**项目**: rag-docs-assistant（AI 知识库问答系统）
**状态**: 已完成

---

## 课前小测

| 题号 | 类型 | 结果 | 置信度 | 备注 |
|------|------|------|--------|------|
| Q1 | 预测试 | :warning: | 中 | 思路对（上传进度），但题目问的是 React loading 状态管理 |
| Q2 | 预测试 | :warning: | 中 | 方向对（关键词辅助），不是 BM25 但思路合理 |
| Q3 | 盲区 | :x: | **高** | 答成了 chunkSize/overlap，实际问的是 TOP_K 和 MIN_RELEVANCE_SCORE |
| Q4 | 随机 | :white_check_mark: | 高 | 完全正确 |
| Q5 | 跨技能 | :white_check_mark: | 高 | 完全正确 |

---

## 本次完成的功能

### 1. 上传进度条

- **问题**: 用户上传文档时没有任何反馈，不知道上传是否在进行
- **方案**: 使用 XMLHttpRequest（XHR）的 `upload.onprogress` 事件追踪上传百分比
- **核心代码**: `Record<string, number>` 类型独立追踪每个知识库的上传进度
- **为什么不用 fetch**: fetch API 不支持上传进度监听，这是 fetch 的已知限制

### 2. 加载状态

- **问题**: 页面加载知识库列表时显示空白，用户不知道数据是否在加载
- **方案**: `useState<boolean>` 管理加载状态，三元表达式渲染三种状态
  - 加载中 → 显示 "加载中..." 提示
  - 空列表 → 显示 "暂无知识库" 提示
  - 有数据 → 渲染列表

### 3. Toast 通知组件

- **问题**: 操作成功/失败后没有视觉反馈
- **方案**: 自定义 Toast 组件
  - 接收 `message`、`status`（success/error）、`onClose` 回调
  - `useEffect` + `setTimeout` 实现 3 秒自动消失
  - 条件渲染：`toast` 为 `null` 时不渲染组件

### 4. Markdown 渲染

- **问题**: LLM 回答中的加粗、列表、代码块以原始 Markdown 文本显示
- **方案**: 使用 `react-markdown` 库渲染 LLM 回答
  - 支持加粗、列表、代码块等常见 Markdown 语法
  - 提升对话回答的可读性

---

## 学生提问记录

1. **不知道 fetch 和 XMLHttpRequest 的区别**
   - 学生不清楚 fetch 不支持上传进度监听
   - 讲解了 fetch vs XHR 的核心差异

2. **XHR 模板字符串用了单引号**
   - `'/api/kb/${id}/upload'` 用单引号不会替换变量
   - 必须使用反引号 `` `/api/kb/${id}/upload` ``

3. **console.log 使用了 stale state**
   - `setLoadCode` 后立即读 `loadCode` 拿到的是旧值
   - 讲解了 setState 异步特性

4. **XHR 缺少 onload/onerror 回调**
   - 上传完成后没有刷新列表
   - 补充了 onload 回调中的列表刷新逻辑

5. **loadCode 全局状态导致所有卡片共享进度**
   - 需要用 `Record<string, number>` 独立追踪每个知识库

6. **JSX 三元表达式括号嵌套错误**
   - 多了一个 `</div>`，导致编译报错

---

## 踩坑记录

1. **fetch 不支持上传进度监听** → 改用 XHR `upload.onprogress`
2. **单引号 vs 反引号** — 模板字符串必须用反引号，单引号不会替换变量
3. **setState 异步** — 不能在 `setXxx` 后立即读取 state 拿新值
4. **Toast message 为空时仍渲染** → 改为 `toast` 为 `null` 时不渲染组件
5. **loadCode 全局状态** → 多个卡片共享进度，需要用 Record 独立追踪
6. **JSX 三元表达式括号嵌套错误** → 多了一个 `</div>`

---

## 表现评估

- **理解速度**: 快，XHR 概念一次讲清就能用
- **参与度**: 高，自己写了 Toast 组件和上传逻辑
- **薄弱点**: setState 异步特性需要加深理解
- **亮点**: Toast 组件设计合理，考虑了自动消失和条件渲染

---

## 遗留问题 / 后续优化

- shadcn/ui 引入（后续优化 UI 一致性）
- 混合搜索（向量 + 关键词 BM25）提升中文检索效果
- TOP_K 和 MIN_RERELANCE_SCORE 参数调优（盲区，需加强）

---

# 项目实战 Day 5 — 项目优化（全链路改造）

**日期**: 2026-05-04
**项目**: rag-docs-assistant（AI 知识库问答系统）
**状态**: 已完成

---

## 本次完成的优化项

### 1. SourceBadge 来源追溯（核心改造）

- **问题**: 用户无法知道 AI 回答的依据来自哪个文档
- **方案**: 全链路元数据管道（chunker → vector store → chat API → UI）
- **新增类型**: `ChunkMetadata`（fileName, title）、`SearchResult`（id, score, text, meta）、`SourceRef`（fileName, title, score）
- **chunker 改造**: 新增 `chunkTextWithMetadata()` 返回带文件名/标题的结构化切片
- **VectorStore 扩展**: `addVectors` 新增可选 `metas` 参数
- **FileStore 持久化**: metas 数组写入 `vectors.json`，向后兼容旧数据（metas 为 undefined 时返回 null）
- **Chat API**: 通过 AI SDK v6 `messageMetadata` 将 sources 附加到流式响应
- **ChatPanel**: 泛型化 `useChat<MessageWithSources>`，渲染来源标签

### 2. 多轮对话上下文优化

- **问题**: 多轮对话时，后续问题（如"还有吗？"）缺少上下文，embedding 搜索效果差
- **方案**: `buildSearchQuery()` 拼接最近 2 轮对话 + 当前问题作为 embedding 输入
- **设计**: 仅影响 embedding 搜索输入，LLM 仍接收完整原始消息（不丢上下文）
- **截断**: 拼接后截断到 500 字符，避免稀释关键信息

### 3. 混合检索（向量 + 关键词 BM25）

- **问题**: 纯向量搜索对中文短片段语义理解有限
- **方案**: 双路召回 + RRF 融合
  - 向量搜索: 余弦相似度
  - 关键词搜索: `FileStore.keywordSearch`（中文逐字 + 英文按词分词）
  - 新增 `hybridSearch` 并行调用两路搜索
  - RRF（Reciprocal Rank Fusion）融合两路结果
- **关键**: RRF 分数范围（约 0.016）与余弦相似度（0~1）不同，混合搜索不做固定阈值过滤

### 4. UI 元数据修正

- `layout.tsx` 标题改为"RAG 知识库问答系统"
- `lang="zh-CN"` 设置正确的页面语言

---

## 踩坑记录

1. **ChromaDB metadatas 不接受 null** — 必须过滤 null 值，`metas.map(m => m ?? {})`
2. **旧 vectors.json 没有 metas 字段** — 向后兼容处理，旧数据 metas 为 undefined 时返回 null
3. **多次上传产生孤儿向量数据** — 优化前没有 chunkIds 机制，多份向量无法追溯。删除只删一份
4. **混合搜索 RRF 分数太低被阈值过滤** — RRF 分数约 0.016，余弦相似度阈值 0.45 不适用。修复：混合搜索不做阈值过滤
5. **TypeScript 类型推断问题** — `collection.metas` 可能为 undefined，赋值给临时变量解决

---

## 学生提问记录

1. "删除文档的时候没有删除到向量数据吗" — 解释了孤儿数据的产生原因（优化前无 chunkIds 机制）

---

## 表现评估

- **理解速度**: 快，对元数据链路、RRF 融合等概念理解准确
- **参与度**: 高，主动测试验证，发现问题后立即反馈
- **实践能力**: 强，能独立操作项目（删除文档、重新上传、查看日志验证）

---

## 遗留问题 / 后续优化

- 文档删除时清理对应的向量数据（chunkIds 追溯）
- shadcn/ui 引入优化 UI 一致性
- 准备进入 LangGraph.js 学习阶段
