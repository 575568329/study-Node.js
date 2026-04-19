import 'dotenv/config'
import { ChromaClient } from "chromadb";
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { TextLoader } from '@langchain/classic/document_loaders/fs/text'

const loader = new TextLoader('./word.txt')
const document = await loader.load()

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 30 })
const chunks = await splitter.splitText(document[0].pageContent)

// 1. 连接 Chroma 服务器
const client = new ChromaClient({ host: 'localhost', port: '8000' })

// 2. 创建/获取集合(类似数据库的"表")
const collection = await client.getOrCreateCollection({name: 'study'})

// 1. 加上你的 getEmbedding 函数（从 05-embedding.js 抄过来）
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

// 3. 存数据(add)
// 2. 存数据时手动传 embeddings
const embeddings = []
for (const chunk of chunks) {
  embeddings.push(await getEmbedding(chunk))
}
await collection.add({
  ids: chunks.map((_, i) => `chunk-${i}`),
  documents: chunks,
  embeddings                              // 手动传向量
})

const question = '什么是深度学习'


//4. 查询(query) -- 自动算相似度 + 返回 TopK
const queryEmbedding = await getEmbedding(question)
const results = await collection.query({
  queryEmbeddings: [queryEmbedding],       // 注意是数组
  nResults: 3
})
// results.documents[0] -> 匹配的文档数组
// results.distances[0] -> 距离数组(越小越相似)

const model = new ChatOpenAI({
  model: 'glm-5.1',
  temperature: 0.3,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

const rewritePrompt = ChatPromptTemplate.fromMessages([
  ['system', '你是查询优化助手。将用户的问题改写成3个不同角度的搜索查询，返回JSON数组格式，例如：["查询1","查询2","查询3"]。只返回JSON，不要其他内容。'],
  ['human', '{question}']
])

const QueryOptimization = rewritePrompt.pipe(model)
const OptimizationResult = await QueryOptimization.invoke({ results, question })
const OptimizationData = JSON.parse(OptimizationResult.content)
let resultsList = []
for (const item of OptimizationData) {
  const queryEmbedding = await getEmbedding(item)
  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],       // 注意是数组
    nResults: 3
  })
  resultsList.push(results)
}

// 合并所有检索结果，按 id 去重
const seen = new Set()
const allDocs = []
for (const result of resultsList) {
  for (let i = 0; i < result.ids[0].length; i++) {
    const id = result.ids[0][i]
    if (!seen.has(id)) {
      seen.add(id)
      allDocs.push(result.documents[0][i])
    }
  }
}

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '根据以下参考资料回答用户问题。如果资料中没有相关内容，请说"根据已有资料无法回答"。\n\n参考资料：\n{allDocs}'],
  ['human', '{question}']
])
const chain = prompt.pipe(model)
const result = await chain.invoke({ allDocs, question })
console.log(allDocs);

console.log('问题:', question)
console.log('回答:', result.content)
