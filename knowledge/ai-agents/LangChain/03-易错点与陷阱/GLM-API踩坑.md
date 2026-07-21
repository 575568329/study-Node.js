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

## 4. Chroma 默认 Embedding 不可用

**现象**：Chroma 的默认 embedding 函数 `@chroma-core/default-embed` 报错，无法下载模型。

**原因**：默认 embedding 函数需从 HuggingFace 下载模型，国内网络无法访问。

**解决方案**：手动传 GLM Embedding，add/query 时显式传入 embeddings 数组。

**教训**：国内使用向量数据库时，embedding 函数要提前验证可用性。

## 5. Windows 双 Python 问题

**现象**：`pip install chromadb` 报错或 python 命令返回 exit code 49。

**原因**：Windows Store 有个假的 python.exe（App Execution Aliases），会拦截 python 命令。真正的 Python 在 `C:/Users/about/AppData/Local/Python/bin/python.exe`。

**解决方案**：在 ~/.bashrc 中把真正的 Python 路径加到 PATH 最前面：
```bash
export PATH="/c/Users/about/AppData/Local/Python/bin:$PATH"
```

**教训**：Windows 环境下 Python 安装路径容易冲突，安装后必须验证 `python --version` 和 `pip --version`。

## 6. TextLoader 导入路径变更

**现象**：`import { TextLoader } from 'langchain/document_loaders/fs/text'` 报错找不到模块。

**原因**：TextLoader 已从 `langchain` 主包迁移到 `@langchain/classic` 包。

**解决方案**：
```bash
npm install @langchain/classic
```
```javascript
import { TextLoader } from '@langchain/classic/document_loaders/fs/text'
```

**教训**：LangChain.js 生态拆包频繁，导入失败时优先查 `@langchain/classic` 或官方文档。

## 7. Chroma 连接参数弃用

**现象**：`path: 'http://localhost:8000'` 传给 ChromaClient 报弃用警告。

**原因**：新版 chromadb 客户端不再接受 `path` 参数。

**解决方案**：改为 `host` + `port` 分开传：
```javascript
const client = new ChromaClient({ host: 'localhost', port: '8000' })
```

## 8. 常见拼写错误

| 错误 | 正确 | 场景 |
|------|------|------|
| `pass` | `paas` | GLM API URL |
| `temperatore` | `temperature` | 模型参数 |
| `spliText` | `splitText` | 切片方法 |
| `inivoke` | `invoke` | 调用方法 |
| `Promiss` | `Promise` | 变量名 |
