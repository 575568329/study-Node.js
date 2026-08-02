const http = require('node:http')

// 模拟 LLM 生成的回答（真实场景是调 OpenAI/智谱 API）
const ANSWER = '事件循环是 Node.js 处理异步的核心机制，它分为六个阶段。'

http.createServer((req, res) => {
  if (req.url !== '/chat') {
    res.writeHead(404).end()
    return
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',     // ← 关键：禁止 Nginx 缓冲，否则线上不流式
    'Access-Control-Allow-Origin': '*'   // ← file:// 打开页面时 origin 是 null，不给这个头会被浏览器拦
  })
  res.flushHeaders()                // 立刻把头发出去，客户端马上知道连上了

  let i = 0
  const timer = setInterval(() => {
    if (i >= ANSWER.length) {
      clearInterval(timer)
      res.write('data: [DONE]\n\n')   // ← 结束标记，客户端凭这个 close()
      res.end()
      return
    }
    // 发 JSON，前端自己解 —— 生产里通常这样，能带 role/tokens 等元信息
    res.write(`data: ${JSON.stringify({ content: ANSWER[i] })}\n\n`)
    i++
  }, 80)

  // ⚠️ 必须清理：用户关页面/点停止，连接断了但 timer 还在跑
  req.on('close', () => {
    clearInterval(timer)
    console.log('客户端断开，已清理 timer')
  })
}).listen(3000, () => console.log('http://127.0.0.1:3000'))