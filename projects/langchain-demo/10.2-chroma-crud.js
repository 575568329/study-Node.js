import 'dotenv/config'
import { ChromaClient } from "chromadb";
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
// ---- 1. 准备文档并切片 ----
const document = `人工智能（AI）是计算机科学的一个分支，旨在开发能够模拟人类智能的系统。
AI的核心技术包括机器学习、深度学习、自然语言处理和计算机视觉等。
机器学习是AI最重要的子领域，它让计算机能够从数据中自动学习和改进。

深度学习是机器学习的一个子集，使用多层神经网络来处理复杂的模式识别任务。
它在图像识别、语音识别和自然语言处理等领域取得了突破性进展。

自然语言处理（NLP）让计算机能够理解、解释和生成人类语言。
ChatGPT等大语言模型就是NLP技术的典型应用。
这些模型通过海量文本数据训练，能够进行对话、翻译、写作等任务。

计算机视觉使机器能够从图像和视频中提取信息并做出决策。
它在自动驾驶、医疗影像分析、人脸识别等领域有广泛应用。
卷积神经网络（CNN）是计算机视觉中最常用的深度学习架构。`

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 200, chunkOverlap: 30 })
const chunks = await splitter.splitText(document)

// 1. 连接 Chroma 服务器
const client = new ChromaClient({ host: 'localhost', port: '8000' })
await client.deleteCollection({ name: 'study' })
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
  embeddings,
   metadatas: chunks.map(() => ({ category: 'AI' }))                            // 手动传向量
})

console.log(await collection.count());
console.log(await collection.get({ids:['chunk-1']}));
const queryEmb = await getEmbedding('什么是深度学习')
console.log(await collection.query({
  queryEmbeddings: [queryEmb],
  nResults: 2,
  where: { category: 'AI' }  // 类似 SQL: WHERE category = 'AI'
})
);
console.log(await collection.update({
  ids:['chunk-0'],
  documents: ['新的文本内容'],
  embeddings: [await getEmbedding('新的文本内容')]
}));
console.log(await collection.get({ids:['chunk-0']}));
await collection.delete({ ids: ['chunk-0'] })
console.log(await collection.count());

