  import { Output, generateText} from "ai";
  import { createOpenAI } from "@ai-sdk/openai";
  import { z } from "zod";
  //generateText纯文本版
  export async function POST(req: Request) {
  const { text } = await req.json()
  const glm = createOpenAI({
    baseURL: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  })
  const { output } = await generateText({
    model: glm.chat('glm-4.7'),
    prompt: `分析以下文本的情感：${text}`,
    output: Output.object({
      schema: z.object({
        sentiment: z.enum(['positive', 'neutral', 'negative']),
        summary: z.string(),
      })
    })
  })
  return Response.json(output)
  }