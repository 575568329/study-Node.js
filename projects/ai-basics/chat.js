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
          content: `
          你是一个资深的前端面试官。
          我需要你根据你的经验向我提出前端面试相关的题目，我来回答。
          一个完成的对话如下：
          你先出题->我来回答->你给出评价（是否正确，哪里错了，需要复习那部分知识点）然后给出正确的答案
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