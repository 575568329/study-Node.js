# 向量数据库 Chroma

## 核心概念

Chroma 是轻量级开源向量数据库，采用**客户端-服务器**模式运行。

### 与手写内存向量库对比

| 特性 | 手写内存向量库 | Chroma |
|------|--------------|--------|
| 数据持久化 | 进程结束即丢失 | 持久化到磁盘 |
| 多客户端共享 | 不支持 | 支持 |
| CRUD 操作 | 需自己实现 | 内置完整 CRUD |
| 元数据过滤 | 需自己实现 | where 条件过滤 |
| 生产可用 | 仅学习用途 | 可用于生产 |

### 架构

```
Node.js 应用 (chromadb 客户端)
        ↓ HTTP
Chroma 服务器 (localhost:8000)
        ↓ 持久化
数据目录 (./chroma-data/)
```

## 安装与启动

```bash
# 安装 Chroma 服务器（Python）
pip install chromadb

# 启动服务器
chroma run
# 默认监听 localhost:8000

# JS 客户端
npm install chromadb
```

> **Windows 双 Python 坑**：Windows Store 有个假的 python.exe（exit code 49），真正的 Python 在 `C:/Users/about/AppData/Local/Python/bin/python.exe`。需在 ~/.bashrc 中把真正的 Python 路径加到 PATH 最前面。

## 连接

```javascript
import { ChromaClient } from 'chromadb'

const client = new ChromaClient({
  host: 'localhost',
  port: '8000'
})
```

> **注意**：旧写法 `path: 'http://localhost:8000'` 已弃用，必须用 `host` + `port` 分开传。

## 集合管理

```javascript
// 创建或获取集合
const collection = await client.getOrCreateCollection({
  name: 'my-knowledge'
})

// 删除集合（清除旧数据时使用）
await client.deleteCollection({ name: 'my-knowledge' })
```

## 手动传 GLM Embedding

Chroma 默认的 embedding 函数（`@chroma-core/default-embed`）需从 HuggingFace 下载模型，国内无法访问。改为手动传 GLM Embedding：

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

## 完整 CRUD

### add - 添加文档

```javascript
const ids = ['chunk-1', 'chunk-2', 'chunk-3']
const documents = ['文档内容1', '文档内容2', '文档内容3']
const embeddings = await Promise.all(documents.map(d => getEmbedding(d)))
const metadatas = [
  { source: 'file1.txt', category: 'tech' },
  { source: 'file1.txt', category: 'tech' },
  { source: 'file2.txt', category: 'science' }
]

await collection.add({ ids, documents, embeddings, metadatas })
```

**关键点**：ids / documents / embeddings / metadatas 数量必须一致。

### get - 按 ID 查询

```javascript
const result = await collection.get({ ids: ['chunk-1'] })
```

### query - 相似度检索

```javascript
const queryEmbedding = await getEmbedding('搜索文本')
const results = await collection.query({
  queryEmbeddings: [queryEmbedding],
  nResults: 3,        // TopK
  where: { category: 'tech' }  // 元数据过滤（可选）
})
```

- `distances` 越小越相似
- `where` 基于元数据过滤，不是基于文档内容
- `nResults` 控制返回条数

### update - 更新文档

```javascript
const newContent = '更新后的内容'
const newEmbedding = await getEmbedding(newContent)

await collection.update({
  ids: ['chunk-1'],
  documents: [newContent],
  embeddings: [newEmbedding]
})
```

**关键点**：改了文档内容必须同步更新 embeddings，否则查询结果会错误。

### delete - 删除文档

```javascript
await collection.delete({ ids: ['chunk-1'] })
```

### count - 统计总数

```javascript
const count = await collection.count()
console.log(`集合中共 ${count} 条文档`)
```

## 常见错误

| 错误 | 原因 | 解决 |
|------|------|------|
| ids 传字符串 | `ids: 'chunk-1'` | 必须是数组 `ids: ['chunk-1']` |
| metadatas 数量不匹配 | 3 条文档但 2 条 metadata | 数量必须一致 |
| where 过滤无效 | 旧集合残留无 metadata | 先 deleteCollection 再重建 |
| 连接参数弃用 | `path: 'http://...'` | 改为 `host` + `port` |
| 默认 embedding 不可用 | 需从 HuggingFace 下载模型 | 手动传 GLM Embedding |
