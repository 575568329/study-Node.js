import 'dotenv/config'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const model = new ChatOpenAI({
  model: 'glm-4-flash',
  temperature: 0.7,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

const prompt = ChatPromptTemplate.fromMessages([
  ['system','你是一个资深{role},请用简介的语言回答'],
  ['human','{input}']
])

// Chain: 用pipe吧prompt和model串起来
const chain = prompt.pipe(model)

//现在一步搞定: 
const result = await chain.invoke({ role:'前端工程师', input: '什么是Promiss?' })
console.log(result.content);
