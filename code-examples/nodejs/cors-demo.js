/**
 * CORS跨域演示
 *
 * 运行方式：
 * 1. npm install express cors
 * 2. node cors-demo.js
 * 3. 浏览器访问 http://localhost:3000
 */

const express = require('express');
const cors = require('cors');

const app = express();

// ==================== 场景1：允许所有域名（不安全） ====================
app.get('/api/public', (req, res) => {
  // 手动设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ message: '这是公开接口，允许所有域名访问' });
});

// ==================== 场景2：只允许特定域名（推荐） ====================
app.get('/api/protected', cors({
  origin: ['http://localhost:3000', 'https://example.com','http://172.30.16.1:5500']
}), (req, res) => {
  res.json({
    message: '这是受保护接口，只允许白名单域名',
    origin: req.headers.origin  // 查看请求来源
  });
});

// ==================== 场景3：动态白名单 ====================
const corsOptionsDelegate = (req, callback) => {
  const whitelist = ['http://localhost:3000', 'https://example.com','http://172.30.16.1:5500'];
  const origin = req.headers.origin;

  if (!origin || whitelist.indexOf(origin) !== -1) {
    callback(null, { origin: true });  // 允许
  } else {
    callback(new Error('Not allowed by CORS'));  // 拒绝
  }
};

app.get('/api/dynamic', cors(corsOptionsDelegate), (req, res) => {
  res.json({
    message: '这是动态白名单接口',
    origin: req.headers.origin
  });
});

// ==================== 场景4：处理预检请求 ====================
app.options('/api/users/:id', cors({
  origin: 'http://172.30.16.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.delete('/api/users/:id', cors({
  origin: 'http://172.30.16.1:5500',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}), (req, res) => {
  res.json({
    message: 'DELETE请求成功',
    userId: req.params.id
  });
});

// ==================== 前端测试页面 ====================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CORS测试页面</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .test-box {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        button {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          margin: 5px;
        }
        button:hover {
          background: #0056b3;
        }
        .result {
          margin-top: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 4px;
          font-family: monospace;
          white-space: pre-wrap;
        }
        .success { color: green; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>🌐 CORS跨域测试</h1>

      <div class="test-box">
        <h2>测试1：公开接口（允许所有域名）</h2>
        <button onclick="testPublic()">测试 /api/public</button>
        <div id="public-result" class="result"></div>
      </div>

      <div class="test-box">
        <h2>测试2：受保护接口（白名单）</h2>
        <button onclick="testProtected()">测试 /api/protected</button>
        <div id="protected-result" class="result"></div>
      </div>

      <div class="test-box">
        <h2>测试3：动态白名单</h2>
        <button onclick="testDynamic()">测试 /api/dynamic</button>
        <div id="dynamic-result" class="result"></div>
      </div>

      <div class="test-box">
        <h2>测试4：预检请求（DELETE）</h2>
        <button onclick="testDelete()">测试 DELETE /api/users/1</button>
        <div id="delete-result" class="result"></div>
      </div>

      <script>
        async function testPublic() {
          const result = document.getElementById('public-result');
          try {
            const response = await fetch('http://localhost:8000/api/public');
            const data = await response.json();
            result.innerHTML = '<span class="success">✅ 成功：</span>' + JSON.stringify(data, null, 2);
          } catch (error) {
            result.innerHTML = '<span class="error">❌ 失败：</span>' + error.message;
          }
        }

        async function testProtected() {
          const result = document.getElementById('protected-result');
          try {
            const response = await fetch('http://localhost:8000/api/protected');
            const data = await response.json();
            result.innerHTML = '<span class="success">✅ 成功：</span>' + JSON.stringify(data, null, 2);
          } catch (error) {
            result.innerHTML = '<span class="error">❌ 失败：</span>' + error.message;
          }
        }

        async function testDynamic() {
          const result = document.getElementById('dynamic-result');
          try {
            const response = await fetch('http://localhost:8000/api/dynamic');
            const data = await response.json();
            result.innerHTML = '<span class="success">✅ 成功：</span>' + JSON.stringify(data, null, 2);
          } catch (error) {
            result.innerHTML = '<span class="error">❌ 失败：</span>' + error.message;
          }
        }

        async function testDelete() {
          const result = document.getElementById('delete-result');
          try {
            const response = await fetch('http://localhost:8000/api/users/1', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token'
              }
            });
            const data = await response.json();
            result.innerHTML = '<span class="success">✅ 成功：</span>' + JSON.stringify(data, null, 2);
          } catch (error) {
            result.innerHTML = '<span class="error">❌ 失败：</span>' + error.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`\n🚀 CORS演示服务器运行在 http://localhost:${PORT}`);
  console.log(`📄 测试页面：http://localhost:${PORT}`);
  console.log(`\n💡 提示：`);
  console.log(`  - 打开浏览器访问 http://localhost:${PORT}`);
  console.log(`  - 点击各个测试按钮，观察CORS行为\n`);
});
