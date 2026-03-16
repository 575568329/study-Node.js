/**
 * Express 框架入门示例
 * 演示Express的核心功能：路由、参数、响应
 */

const express = require('express');

// 创建Express应用
const app = express();

// ============================================
// 1. 基本路由
// ============================================

// GET / - 首页
app.get('/', (req, res) => {
  res.send('<h1>欢迎来到Express服务器</h1>');
});

// GET /hello - 简单的问候
app.get('/hello', (req, res) => {
  res.send('你好，Express！');
});

// GET /api/user - 返回JSON数据
app.get('/api/user', (req, res) => {
  // res.json() 自动设置 Content-Type 为 application/json
  res.json({
    id: 1,
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com'
  });
});

// ============================================
// 2. 路由参数 (Route Parameters)
// ============================================

// GET /api/users/:id - 获取单个用户（:id是动态参数）
app.get('/api/users/:id', (req, res) => {
  // req.params 包含路由参数
  const userId = req.params.id;

  res.json({
    message: `获取用户ID: ${userId}`,
    userId: userId,
    url: req.url  // 原始请求URL
  });
});

// GET /api/posts/:postId/comments/:commentId - 多个参数
app.get('/api/posts/:postId/comments/:commentId', (req, res) => {
  const { postId, commentId } = req.params;

  res.json({
    postId,
    commentId,
    message: `文章${postId}的评论${commentId}`
  });
});

// ============================================
// 3. 查询参数 (Query Parameters)
// ============================================

// GET /api/search?keyword=nodejs&page=1
app.get('/api/search', (req, res) => {
  // req.query 包含查询参数（自动解析好的对象）
  const { keyword, page = 1 } = req.query;

  res.json({
    keyword,
    page,
    message: `搜索关键词: ${keyword}, 第${page}页`
  });
});

// ============================================
// 4. POST 请求
// ============================================

// 需要先配置中间件来解析JSON请求体（后面会讲）
// 这里先演示基本路由
app.post('/api/users', (req, res) => {
  res.json({
    message: '创建用户',
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// 5. 响应方法
// ============================================

app.get('/api/responses', (req, res) => {
  // Express提供多种响应方法

  // res.send() - 发送各种类型的数据（自动设置Content-Type）
  // res.json() - 发送JSON
  // res.status() - 设置状态码

  res.status(200).json({
    message: '各种响应方法',
    methods: {
      send: 'res.send(data) - 发送数据',
      json: 'res.json(obj) - 发送JSON',
      status: 'res.status(code) - 设置状态码'
    }
  });
});

// ============================================
// 6. all() - 匹配所有HTTP方法
// ============================================

app.all('/api/all', (req, res) => {
  res.json({
    method: req.method,
    message: '这个路由匹配所有HTTP方法（GET、POST、PUT、DELETE等）'
  });
});

// ============================================
// 7. 404处理（放在最后）
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: '页面未找到',
    path: req.url,
    method: req.method
  });
});

// ============================================
// 启动服务器
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Express服务器运行在 http://localhost:${PORT}`);
  console.log('\n可以访问以下路由测试：');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/hello`);
  console.log(`  GET  http://localhost:${PORT}/api/user`);
  console.log(`  GET  http://localhost:${PORT}/api/users/123`);
  console.log(`  GET  http://localhost:${PORT}/api/posts/456/comments/profile`);
  console.log(`  GET  http://localhost:${PORT}/api/search?keyword=nodejs&page=2`);
  console.log(`  POST http://localhost:${PORT}/api/users`);
  console.log(`  GET  http://localhost:${PORT}/api/responses`);
  console.log(`  ANY http://localhost:${PORT}/api/all`);
});
