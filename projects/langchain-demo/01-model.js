import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { HumanMessage } from '@langchain/core/messages'

//1.创建Model
const model = new ChatOpenAI({
  model:'glm-4-flash',
  temperatore: 0.7,
  configuration:{
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

//2. 调用(一行搞定,不用手写)
const result = await model.invoke([new HumanMessage('用一句话解释什么是Node.js')])
console.log(result.content)
