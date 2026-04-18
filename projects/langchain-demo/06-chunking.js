import 'dotenv/config'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'

//模拟一篇长文档
const document = `人工智能（Artificial Intelligence，简称AI）是计算机科学的一个分支，旨在开发能够模拟人类智能的系统。
AI的核心技术包括机器学习、深度学习、自然语言处理和计算机视觉等。
机器学习是AI最重要的子领域，它让计算机能够从数据中自动学习和改进。

深度学习是机器学习的一个子集，使用多层神经网络来处理复杂的模式识别任务。
它在图像识别、语音识别和自然语言处理等领域取得了突破性进展。
著名的深度学习框架包括TensorFlow、PyTorch和Keras。

自然语言处理（NLP）让计算机能够理解、解释和生成人类语言。
ChatGPT等大语言模型就是NLP技术的典型应用。
这些模型通过海量文本数据训练，能够进行对话、翻译、写作等任务。

计算机视觉使机器能够从图像和视频中提取信息并做出决策。
它在自动驾驶、医疗影像分析、人脸识别等领域有广泛应用。
卷积神经网络（CNN）是计算机视觉中最常用的深度学习架构。`

//创建切片器
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 150, // 每块最大150字符
  chunkOverlap: 30, // 相邻块重叠30字符(保持上下文连贯)
})

//切片
const chunks = await splitter.splitText(document)

console.log(`原文长度: ${document.length} 字符`)
console.log(`切片数量: ${chunks.length} 块`)
console.log('---')
chunks.forEach((chunk, i) => {
  console.log(`\n块 ${i + 1} (${chunk.length}字):`)
  console.log(chunk)
})