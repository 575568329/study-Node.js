import 'dotenv/config'

// GLM Embedding API（OpenAI SDK 不兼容，用 fetch 直接调用）
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

// 把两段文本转成向量
const vector1 = await getEmbedding('猫是一种可爱的宠物')
const vector2 = await getEmbedding('狗是人类的好朋友')
const vector3 = await getEmbedding('汽车需要加油才能行驶')

console.log('向量维度:', vector1.length);
console.log('前5个数字:', vector1.slice(0,5));

// 计算余弦相似度
function cosineSimilarity(a, b){
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const magA = Math.sqrt(a.reduce((sum, val)=> sum + val * val, 0))
  const magB = Math.sqrt(b.reduce((sum, val)=> sum + val * val, 0))
  return dot / (magA * magB)
}

console.log('猫 vs 狗:', cosineSimilarity(vector1, vector2).toFixed(4));
console.log('猫 vs 汽车:', cosineSimilarity(vector1, vector3).toFixed(4));



