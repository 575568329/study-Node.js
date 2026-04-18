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
