# 面试题：文档切片与 API 设计

---

## Q1: 文档切片的 chunkSize 和 overlap 参数怎么选择？权衡是什么？

**我的回答**：
> 根据文档大小和向量 API 的上下文要求来设置。可以按照 API 的最大上下文来设置 chunkSize，而 overlap 根据 chunkSize 的大小适当增加或缩小，主要考虑到两个文本截断的地方可能是关键位置，导致匹配不上。

**补充**：chunkSize 不是"根据文档大小"调整的，而是固定值（我们用 500），不管文档多大都是同一个 chunkSize。它根据 Embedding 模型的 token 上限来定。

**chunkSize 权衡**：
- 太大（5000字）→ 混了多个主题，检索不精准；可能超出 Embedding 模型 token 上限
- 太小（50字）→ 语义不完整，检索到的片段信息量不够
- 推荐值：300~500 字（中文约 150~250 个词）

**overlap 权衡**：
- 太大 → 重复内容多，浪费存储和 token
- 太小 → 关键信息刚好被切断在边界处
- 推荐值：chunkSize 的 10%（如 chunkSize=500, overlap=50）

---

## Q2: fetch 的 res 和 res.ok 有什么区别？

**我的回答**：
> fetch 的 res 是 Promise()，而 res.ok 是获取了返回的状态，是布尔类型的数据可以用来判断，如果直接用 res 判断会一直是 true。

**补充**：res 不是 Promise——`await fetch()` 之后拿到的 res 是 Response 对象。Response 对象永远存在（哪怕 404/500），所以 `if(res)` 永远为 true。`res.ok` 是 Response 上的布尔属性，只有 2xx 状态码才为 true。

**核心区别**：
- `res`（Response 对象）**永远存在**——即使服务器返回 404/500，fetch 也会拿到 Response
- `res.ok` 是布尔值，只有 HTTP 状态码 2xx 时为 `true`
- fetch 只有**网络错误**（断网、DNS 解析失败）才会 reject

```typescript
// 错误：res 永远 truthy
if (res) { ... }

// 正确
if (res.ok) { ... }
if (res.status === 200) { ... }
```

---

## Q3: 上传文档的完整流程是什么？每一步的作用？

**我的回答**：
> 上传 → 接收文档 → 判断 ID 知识库是否存在 → 切片 → 传给向量模型转换 → 保存向量数据和文本数据 → 保存元数据 → 返回成功。

**完整流程**：
1. **接收文件** — `formData.get('file')` 拿到 File 对象
2. **校验知识库** — 确认目标知识库存在（卫语句，尽早返回）
3. **读取文本** — `file.text()` 提取文件内容
4. **切片** — `chunkText()` 按 chunkSize/overlap 切成片段
5. **向量化** — `getEmbedding()` 批量调 Embedding API，文本→向量
6. **存储向量** — `addVectors()` 存入向量库，每个切片有唯一 id
7. **记录元数据** — `db.addDoc()` 记录文件名、切片数、上传时间
8. **返回结果** — 成功/失败响应

**关键设计**：校验前置（避免无效的 API 调用）、try-catch 包裹、集合名用 `kb-${id}` 隔离不同知识库。
