import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import * as readline from 'readline/promises';
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
卷积神经网络（CNN）是计算机视觉中最常用的深度学习架构。`;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 30,
});
const chunks = await splitter.splitText(document);

// ---- 2. 向量化 API ----
async function getEmbedding(text) {
  const res = await fetch('https://open.bigmodel.cn/api/paas/v4/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + process.env.ANTHROPIC_AUTH_TOKEN,
    },
    body: JSON.stringify({ model: 'embedding-3', input: text }),
  });
  const data = await res.json();
  return data.data[0].embedding;
}

// ---- 3. 自己实现一个简单的内存向量库 ----
// 这就是向量数据库的核心原理！
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// 把每个 chunk 转成向量并存储
const store = []; // [{ text, vector }]
for (const chunk of chunks) {
  const vector = await getEmbedding(chunk);
  store.push({ text: chunk, vector });
}
const model = new ChatOpenAI({
  model: 'glm-4-flash',
  temperature: 0.3,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  },
});

const messageList = [];
while (true) {
  const question = await rl.question('你:');
  if (question == 'exit') {
    break;
  }
  const questionVector = await getEmbedding(question);
  // 计算问题和每个 chunk 的相似度，按分数排序
  const scored = store.map((item) => ({
    text: item.text,
    score: cosineSimilarity(questionVector, item.vector),
  }));
  scored.sort((a, b) => b.score - a.score);

  // 取最相关的 2 个
  const context = scored
    .slice(0, 2)
    .map((item) => item.text)
    .join('\n\n');

  // ---- 3. 把检索到的内容喂给 AI 生成回答 ----

  const prompt = ChatPromptTemplate.fromMessages([
    [
      'system',
      '根据以下参考资料回答用户问题。如果资料中没有相关内容，请说"根据已有资料无法回答"。\n\n参考资料：\n{context}',
    ],
    ...messageList,
    ['human', '{question}'],
  ]);

  const chain = prompt.pipe(model);
  const result = await chain.invoke({ context, question });
  messageList.push(['human', question]);
  messageList.push(['ai', result.content]);
  console.log('问题:', question);
  console.log('回答:', result.content);
}
