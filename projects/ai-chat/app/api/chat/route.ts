// export async function POST(request: Request) {
//   const body = await request.json()
//   const { message } = body
//   const res = await fetch(
//     'https://open.bigmodel.cn/api/paas/v4/chat/completions',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: 'Bearer ' + process.env.ANTHROPIC_AUTH_TOKEN,
//       },
//       body: JSON.stringify({
//         model: 'glm-4-flash',
//         messages: [{ role: 'system',
//           content: `你是一个资深代码审查助手。
//           规则：
//           1. 先找出代码中的问题（语法错误、逻辑问题、安全隐患）
//           2. 分析每个问题的原因
//           3. 给出修正建议和正确的代码
//           4. 如果代码没有问题，说明它写得好在哪里
//           5. 不要编造不存在的问题

//           示例：
//           用户输入: const arr = [1, 2, 3]; arr.push(4, 5); const result = arr.map(x => x * 2
//           你的输出:
//           ## 发现问题
//           - 第1行末尾缺少右括号：${`darr.map(x => x * 2`+ '→ 应为'+ `arr.map(x => x * 2)`}

//           ## 原因分析
//           - map 回调的箭头函数 ` + 'x => x * 2' +` 外层缺少闭合括号，会导致语法错误

//           ## 修正建议
//           \`\`\`javascript
//           const arr = [1, 2, 3];
//           arr.push(4, 5);
//           const result = arr.map(x => x * 2);
//           \`\`\`

//           请按照以上格式审查用户提交的代码。请一步一步思考。
//           `
//         },...message],
//         temperature: 0.1,
//         stream:true,
//       }),
//     },
//   );
//   return new Response(res.body, {
//     headers: {
//       'Content-Type': 'text/event-stream',
//       'Cache-Control': 'no-cache',
//     }
//   })
// }

//Vercel AI SDK架构的使用方法

import { createOpenAI } from "@ai-sdk/openai";
import { streamText, tool, stepCountIs, } from "ai";
import { z } from "zod";

const glm = createOpenAI({
  baseURL: 'https://open.bigmodel.cn/api/paas/v4',
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
})

export async function POST(request: Request) {
  const body  = await request.json();
  const messages = body.messages.map((m: { role: string; parts?: { type: string; text: string }[] }) => ({
  role: m.role,
  content: m.parts?.filter(p => p.type === 'text').map(p => p.text).join('') ?? '',
}))
  const mode: 'developer' | 'analyst' = body.mode ?? 'developer'
  const prompts = {
    developer: '你是一个资深代码审查助手。请审查用户提交的代码，找出其中的语法错误、逻辑问题和安全隐患，并给出修正建议和正确的代码。如果代码没有问题，说明它写得好在哪里。',
    analyst: '你是一个情感分析大师请根据用户输入的文本分析用户的情绪并总结用户的输入。'
  }
  // 技术知识作为资料库
  const knowledgeBase = [
  'Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时，使用事件驱动和非阻塞 I/O 模型。',
  'TypeScript 是 JavaScript 的超集，添加了静态类型系统，编译后生成纯 JavaScript 代码。',
  'React 是 Facebook 开发的 UI 库，使用虚拟 DOM 和组件化架构，通过 JSX 描述界面。',
  'Next.js 是基于 React 的全栈框架，支持 SSR、SSG 和 API Routes。',
  'LangChain 是 AI 应用开发框架，提供 RAG、Agent、Chain 等编排能力。',
]

const query = messages[messages.length - 1]?.content ?? ''
const keywords:string[] = query.split(/\s+/).filter(Boolean)
const results = knowledgeBase.filter(doc =>
  keywords.some(keyword => doc.includes(keyword))
)
console.log('检索结果:', results)

   const result = streamText({
    model: glm.chat('glm-4-flash'),  // 用 glm 而不是 openai
    messages,
    // system: prompts[mode],
    system: `基于以下参考资料回答问题:\n${results.join('\n')}`,
    tools:{
      getWeather: tool({
        description: '获取某个城市的天气',
        inputSchema: z.object({
          city: z.string().describe('城市名称'),
        }),
        execute: async ({ city }) => {          // 这里可以调用第三方天气API获取天气信息
          return `当前${city}的天气是晴天，温度25度。`
        }
      }),
      getLocation: tool({
        description: '获取当前的地理位置',
        inputSchema: z.object({}),
        // execute: async ({ ip }) => {          // 这里可以调用第三方API获取地理位置信息
        //   return `当前${ip}的地理位置是北京市。`
        // }
      })
    },
    stopWhen: stepCountIs(5), // 最多执行5步
  })


 

  return result.toUIMessageStreamResponse()
}
