const http = require('node:http')

const server = http.createServer((req, res) => {
  // 只处理 POST /api/user，其他一律 404
  if (req.method !== 'POST' || req.url !== '/api/user') {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ error: '不支持的请求' }))
    return
  }

  // 攒 Buffer 而不是字符串拼接：中文被切在 chunk 边界会乱码
  const chunks = []

  req.on('data', chunk => {
    chunks.push(chunk)
    console.log(`收到一片 ${chunk.length} 字节`)
  })

  // 'end' 触发时 body 才完整（poll 阶段的宏任务）
  req.on('end', () => {
    const raw = Buffer.concat(chunks).toString('utf8')
    console.log('完整 body:', raw)

    let data
    try {
      data = JSON.parse(raw)
    } catch {
      // 客户端传了非法 JSON，属于它的错 → 400
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: 'body 不是合法 JSON' }))
      return
    }

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ received: data, name: data.name }))
  })

  // 客户端中途断开（关浏览器/拔网线）会触发，不监听则进程崩溃
  req.on('error', err => {
    console.error('请求流出错:', err.message)
    res.writeHead(500).end()
  })
})

server.listen(3000, () => {
  console.log('监听 http://127.0.0.1:3000')
})
//Invoke-RestMethod -Uri http://127.0.0.1:3000/api/user -Method Post -ContentType "application/json; charset=utf-8" -Body '{"name":"张三","age":18}'