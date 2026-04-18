import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { Form } from 'react-router-dom'

const model = new ChatOpenAI({
  model: 'glm-4-flash',
  temperature: 0.7,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

// 创建模版
const prompt = ChatPromptTemplate.fromMessages([
  ['system','你是一个资深{role},请用简介的语言回答]'],
  ['human','{input}']
])

// 填充变量并调用
const fromatted = await prompt.invoke({ role:'前端工程师', input:'什么是闭包?' })
const result = await model.invoke(fromatted)
console.log(result.content);
