# GLM API 踩坑记录

## 1. OpenAI SDK 返回零向量

**现象**：用 `@langchain/openai` 的 `OpenAIEmbeddings` 调用 GLM Embedding API，返回的向量全是 0。

**原因**：OpenAI SDK 自动发送额外参数（`dimensions`、`encoding_format`），GLM API 不认识这些参数，导致返回异常。

**解决方案**：用原生 `fetch` 直接调用 GLM API：

```javascript
async function getEmbedding(text) {
  const res = await fetch('https://open.bigmodel.cn/api/paas/v4/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.ANTHROPIC_AUTH_TOKEN
    },
    body: JSON.stringify({ model: 'embedding-3', input: text })
  })
  const data = await res.json()
  return data.data[0].embedding
}
```

**教训**：第三方 SDK 兼容性不是100%，遇到异常时优先用最原始的方式（fetch）验证。

## 2. MemoryVectorStore 不可用

**现象**：`@langchain/community/vectorstores/memory` 导入失败。

**原因**：MemoryVectorStore 已从 `@langchain/community` 包中移除。

**解决方案**：自己实现内存向量库（反而更深入理解了向量数据库原理）。

## 3. ES 模块与 CommonJS 混用

**现象**：`require is not defined` 报错。

**原因**：`package.json` 设置了 `"type": "module"`，必须用 `import` 语法。

**注意**：
- `require()` → `import`
- `readline` 回调式 → `readline/promises` async 式
- 所有涉及 Node.js 内置模块的都要用 ES 模块语法

## 4. 常见拼写错误

| 错误 | 正确 | 场景 |
|------|------|------|
| `pass` | `paas` | GLM API URL |
| `temperatore` | `temperature` | 模型参数 |
| `spliText` | `splitText` | 切片方法 |
| `inivoke` | `invoke` | 调用方法 |
| `Promiss` | `Promise` | 变量名 |
