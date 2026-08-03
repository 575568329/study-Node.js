/**
 * WebSocket 聊天室（含生产级改进）
 *
 * 改进点：
 * 1. broadcast 加 try-catch（防 send 异常中断循环）
 * 2. 客户端自动重连（onclose 里 setTimeout 重连）
 *
 * 安装依赖：npm install ws
 * 启动：node code-examples/nodejs/ws-chat.js
 * 打开：http://127.0.0.1:8080（开多个标签页模拟多人聊天）
 */
const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    fs.createReadStream(path.join(__dirname, 'ws-client.html')).pipe(res);
  }
});

const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`新客户端连接，当前在线: ${clients.size}`);
  broadcast({ type: 'system', message: `有人加入聊天（当前 ${clients.size} 人）` });

  ws.on('message', (data) => {
    broadcast({ type: 'chat', message: data.toString() });
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`客户端断开，当前在线: ${clients.size}`);
    broadcast({ type: 'system', message: `有人离开（当前 ${clients.size} 人）` });
  });
});

// ✅ 改进 1：broadcast 加 try-catch，防止单个 send 异常中断整个循环
function broadcast(data) {
  const json = JSON.stringify(data);
  for (const client of clients) {
    try {
      if (client.readyState === WebSocket.OPEN) {
        client.send(json);
      }
    } catch (err) {
      // 单个发送失败不影响其他人
      console.error('广播失败（移除该客户端）:', err.message);
      clients.delete(client);
    }
  }
}

server.listen(8080, () => {
  console.log('HTTP + WebSocket 服务启动: http://127.0.0.1:8080');
});
