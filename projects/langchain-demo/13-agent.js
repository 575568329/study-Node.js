import 'dotenv/config'
import { tool } from '@langchain/core/tools'
import { AgentExecutor, createToolCallingAgent } from '@langchain/classic/agents'
import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { z } from 'zod'

const model = new ChatOpenAI({
  model: 'glm-5.1',
  temperature: 0.3,
  configuration: {
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN
  }
})

const calculator = tool(
  ({expression}) => {
    // 实际执行的逻辑
    return String(eval(expression))
  },
  {
    name: 'calculator',//工具名
    description:'计算数学表达式的结果', // 描述(LLM靠这个决定用不用)
    schema: z.object({
      expression: z.string().describe('数学表达式,如"2+3')
    })
  }
)

const getCurrentTime = tool(
  ()=>new Date().toLocaleString('zh-CN'),
  {
    name: 'get_current_time',
    description: '获取当前日期和时间',
    schema: z.object({})
  }
)
const tools = [calculator,getCurrentTime]
const prompt = ChatPromptTemplate.fromMessages([
  ['system','你是一个有用的助手,可以使用工具帮助用户.'],
  ['human','{input}'],
  ['placeholder','{agent_scratchpad}'], // 必须有,Agent的思考过程写在这里
])

const agent = await createToolCallingAgent({llm:model,tools,prompt})
const agentExecutor = new AgentExecutor({ agent, tools })

const result = await agentExecutor.invoke({
  input:'现在几点了? 123*456 是多少?'
})

console.log(result.output);
