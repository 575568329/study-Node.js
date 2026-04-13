import { NextResponse } from 'next/server'
export async function POST(request: Request) {
  const body = await request.json()
  const { message } = body
  const res = await fetch(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.ANTHROPIC_AUTH_TOKEN,
      },
      body: JSON.stringify({
        model: 'glm-4-flash',
        messages: [{ role: 'system',
          content: `你是一个情感分析专家。分析用户输入的中文句子的情感倾向。
                    只返回 JSON，不要其他文字。

                    规则：
                    - sentiment: positive（正面）、negative（负面）、neutral（中性）
                    - confidence: 0.0 到 1.0 的浮点数

                    示例：
                    "今天天气真好，心情很开心" → {"sentiment": "positive", "confidence": 0.95}
                    "这个产品质量太差了，非常失望" → {"sentiment": "negative", "confidence": 0.9}
                    "今天去了超市买了点东西" → {"sentiment": "neutral", "confidence": 0.6}
                    `
        },{role:'user',content:message}],
        temperature: 0.1,
        // stream:true,
        response_format: { type: 'json_object' }
      }),
    },
  );
  // return new Response(res.body, {
  //   headers: {
  //     'Content-Type': 'text/event-stream',
  //     'Cache-Control': 'no-cache',
  //   }
  // })
  const data = await res.json()
  const result = JSON.parse(data.choices[0].message.content)
  return NextResponse.json(result)
}