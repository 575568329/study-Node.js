# LangChain.js 速查表

## 初始化项目

```bash
npm init -y
# package.json 中加 "type": "module"
npm install @langchain/core @langchain/openai @langchain/textsplitters langchain dotenv zod
```

## Model

```javascript
import { ChatOpenAI } from '@langchain/openai'

const model = new ChatOpenAI({
  model: 'glm-4-flash',
  temperature: 0.7,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})
```

## Prompt Template

```javascript
import { ChatPromptTemplate } from '@langchain/core/prompts'

const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是{role}'],
  ['human', '{input}']
])
```

## Chain

```javascript
const chain = prompt.pipe(model).pipe(parser)
const result = await chain.invoke({ role: '...', input: '...' })
```

## Output Parser (Zod)

```javascript
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    field: z.string().describe('描述')
  })
)

// 获取格式指令 → 放到 prompt 中
parser.getFormatInstructions()
```

## Text Splitter

```javascript
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 30
})
const chunks = await splitter.splitText(text)
```

## Embedding (GLM fetch)

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

## 余弦相似度

```javascript
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (magA * magB)
}
```

## 交互式输入

```javascript
import * as readline from 'readline/promises'
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const input = await rl.question('你: ')
rl.close()
```

## Chroma 向量数据库

```bash
# 安装
pip install chromadb    # Python 服务器
npm install chromadb    # JS 客户端

# 启动服务器
chroma run              # 默认 localhost:8000
```

```javascript
import { ChromaClient } from 'chromadb'

// 连接
const client = new ChromaClient({ host: 'localhost', port: '8000' })

// 集合管理
const collection = await client.getOrCreateCollection({ name: 'my-kb' })
await client.deleteCollection({ name: 'my-kb' })

// 添加文档（ids/documents/embeddings/metadatas 数量必须一致）
await collection.add({
  ids: ['c1', 'c2'],
  documents: ['文本1', '文本2'],
  embeddings: [emb1, emb2],
  metadatas: [{ source: 'a.txt' }, { source: 'b.txt' }]
})

// 相似度查询
const results = await collection.query({
  queryEmbeddings: [queryEmb],
  nResults: 3,
  where: { source: 'a.txt' }  // 元数据过滤（可选）
})
// results.distances 越小越相似

// 按 ID 查询
await collection.get({ ids: ['c1'] })

// 更新（改内容必须同步更新 embeddings）
await collection.update({
  ids: ['c1'],
  documents: ['新内容'],
  embeddings: [newEmb]
})

// 删除
await collection.delete({ ids: ['c1'] })

// 统计
const count = await collection.count()
```

## TextLoader（文档加载器）

```bash
npm install @langchain/classic
```

```javascript
import { TextLoader } from '@langchain/classic/document_loaders/fs/text'

const loader = new TextLoader('./knowledge.txt')
const docs = await loader.load()
// docs[0].pageContent → 文本内容
// docs[0].metadata.source → 文件路径
```

## RAG 优化：Multi-Query（多查询）

```javascript
// Step 1: 用 LLM 生成查询变体
const rewritePrompt = ChatPromptTemplate.fromMessages([
  ['system', '将用户问题改写成3个不同角度的搜索查询，返回JSON数组。只返回JSON。'],
  ['human', '{question}']
])
const queries = JSON.parse((await rewritePrompt.pipe(model).invoke({ question })).content)

// Step 2: 对原始问题 + 变体分别检索
const allResults = []
for (const q of [...queries, question]) {
  const emb = await getEmbedding(q)
  allResults.push(await collection.query({ queryEmbeddings: [emb], nResults: 3 }))
}

// Step 3: 按 id 去重合并
const seen = new Set()
const allDocs = []
for (const result of allResults) {
  for (let i = 0; i < result.ids[0].length; i++) {
    if (!seen.has(result.ids[0][i])) {
      seen.add(result.ids[0][i])
      allDocs.push(result.documents[0][i])
    }
  }
}

// Step 4: 拼接 context 生成回答
const context = allDocs.join('\n\n')
```

## Agent 工具调用

```javascript
import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { AgentExecutor, createToolCallingAgent } from '@langchain/classic/agents'

// 定义工具
const myTool = tool(
  ({ param }) => `结果: ${param}`,
  {
    name: 'my_tool',
    description: '工具描述（LLM 靠这个决定用不用）',
    schema: z.object({
      param: z.string().describe('参数描述')
    })
  }
)

const tools = [myTool]

// Prompt（必须包含 agent_scratchpad）
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是助手，可以使用工具帮助用户。'],
  ['human', '{input}'],
  ['placeholder', '{agent_scratchpad}'],  // 必须！记录思考过程
])

// 创建并运行 Agent
const agent = await createToolCallingAgent({ llm: model, tools, prompt })
const agentExecutor = new AgentExecutor({ agent, tools })
const result = await agentExecutor.invoke({ input: '用户问题' })
console.log(result.output)
```
