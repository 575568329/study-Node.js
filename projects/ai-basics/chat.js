require('dotenv').config();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let messageList = [];
let fullContent = ''
async function main() {
  console.log(JSON.stringify(messageList));
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
        }, ...messageList],
        temperature: 0.1,
        stream:true,
      }),
    },
  );
  const reader = res.body.getReader();
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    try{
    const chunk = decoder.decode(value, { stream: true })

    const lines = chunk.split('\n').filter(line => line.startsWith('data:'))

    for (const line of lines) {
      const data = line.slice(6) // 去掉 "data: "前缀
      if (data === '[DONE]') break

      const json = JSON.parse(data)
      const content = json.choices[0]?.delta?.content
      if(content) {
        process.stdout.write(content)
        fullContent+=content
      }
    }
    }catch{

    }
  }

  
  
  messageList.push({
    role: 'assistant',
    content: fullContent,
  });
}
function chat() {
  rl.question('你:', async (input) => {
    if (input == 'exit') {
      rl.close();
      return;
    }
    messageList.push({
      role: 'user',
      content: input,
    });
    await main();
    chat();
  });
}
chat();