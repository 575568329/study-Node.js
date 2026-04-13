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
          content: `你是一个资深代码审查助手。
          规则：
          1. 先找出代码中的问题（语法错误、逻辑问题、安全隐患）
          2. 分析每个问题的原因
          3. 给出修正建议和正确的代码
          4. 如果代码没有问题，说明它写得好在哪里
          5. 不要编造不存在的问题

          示例：
          用户输入: const arr = [1, 2, 3]; arr.push(4, 5); const result = arr.map(x => x * 2
          你的输出:
          ## 发现问题
          - 第1行末尾缺少右括号：${`darr.map(x => x * 2`+ '→ 应为'+ `arr.map(x => x * 2)`}

          ## 原因分析
          - map 回调的箭头函数 ` + 'x => x * 2' +` 外层缺少闭合括号，会导致语法错误

          ## 修正建议
          \`\`\`javascript
          const arr = [1, 2, 3];
          arr.push(4, 5);
          const result = arr.map(x => x * 2);
          \`\`\`

          请按照以上格式审查用户提交的代码。请一步一步思考。
          `
        },...message],
        temperature: 0.1,
        stream:true,
      }),
    },
  );
  return new Response(res.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  })
}