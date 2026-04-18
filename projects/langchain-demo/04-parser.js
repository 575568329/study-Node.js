import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'

// 1. 用zod定义输出结构
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentiment: z.enum(['positive', 'negative', 'neutral']).describe('情感倾向'),
    confidence: z.number().min(0).max(1).describe('置信度')
  })
)

//2. 创建 Model
const model = new ChatOpenAI({
  model: 'glm-4-flash',
  temperature: 0.1,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

//3.创建prompt. {formt_instructions} 是 parser 自动生成的格式说明
const prompt = ChatPromptTemplate.fromMessages([
  ['system', '你是情感分析专家.\n{format_instructions}'],
  ['human','{input}']
])

//4. Chain: prompt -> model -> parser
const chain = prompt.pipe(model).pipe(parser)

//5. 调用
const result = await chain.invoke({
  input: '今天心情太好了!',
  format_instructions: parser.getFormatInstructions()
})

console.log(result)
console.log(typeof result.confidence) // number
console.log(parser.getFormatInstructions()) 