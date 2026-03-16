/**
 * Express 中间件（Middleware）示例
 * 演示中间件的执行顺序和next()的作用
 */

const express = require('express');
const app = express();

// ============================================
// 1. 应用级中间件（所有请求都会经过）
// ============================================

// 中间件1：记录请求日志
app.use((req, res, next) => {
  console.log('\n--- 中间件1：请求日志 ---');
  console.log(`时间: ${new Date().toISOString()}`);
  console.log(`方法: ${req.method}`);
  console.log(`路径: ${req.url}`);

  // 调用next()，传递给下一个中间件
  // 如果不调用next()，请求就会停在这里！
  next();
});

// 中间件2：模拟验证（假设有些路径需要验证）
app.use((req, res, next) => {
  console.log('--- 中间件2：权限检查 ---');

  // 模拟：所有路径都需要检查，除了 /public
  if (req.url.startsWith('/public')) {
    console.log('公开路径，跳过验证');
    return next(); // return可以避免继续执行
  }

  console.log('需要验证的路径，检查Token');
  // 这里可以检查 req.headers.token
  next();
});

// ============================================
// 2. 路由级中间件（只对特定路由生效）
// ============================================

// 为 /api 开头的路由添加专门的处理
app.use('/api', (req, res, next) => {
  console.log('--- 中间件：API路由专属 ---');
  console.log('所有/api开头的请求都会经过这里');

  // 可以在这里添加API特有的处理
  req.apiVersion = 'v1.0'; // 给req对象添加属性
  next();
});

// ============================================
// 3. 内置中间件
// ============================================

// 解析JSON格式的请求体
app.use(express.json());

// 解析URL编码的请求体（表单数据）
app.use(express.urlencoded({ extended: true }));

// ============================================
// 4. 路由定义
// ============================================

// 公开路径
app.get('/public/data', (req, res) => {
  res.json({
    message: '这是公开数据，不需要验证',
    apiVersion: req.apiVersion
  });
});

// API路由
app.post('/api/users', (req, res) => {
  console.log('--- 路由处理：创建用户 ---');
  console.log('请求体:', req.body);

  res.json({
    message: '创建用户成功',
    receivedData: req.body,
    apiVersion: req.apiVersion
  });
});

app.get('/api/users', (req, res) => {
  console.log('--- 路由处理：获取用户列表 ---');

  res.json({
    users: [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ],
    apiVersion: req.apiVersion
  });
});

// ============================================
// 5. 中间件的顺序很重要！
// ============================================

// 演示中间件执行顺序
app.get('/demo/order', (req, res, next) => {
  console.log('→ 路由处理函数');
  res.json({
    message: '演示中间件执行顺序',
    hint: '查看控制台输出'
  });
});

// 放在后面的中间件（不会被匹配到的路由使用）
app.use((req, res, next) => {
  console.log('--- 中间件：最后的机会 ---');
  console.log('这个中间件只在前面没有匹配的路由时执行');
  next();
});

// ============================================
// 6. 错误处理中间件（4个参数）
// ============================================

app.use((err, req, res, next) => {
  console.error('--- 错误处理中间件 ---');
  console.error(err.stack);

  res.status(500).json({
    error: '服务器内部错误',
    message: err.message
  });
});

// ============================================
// 启动服务器
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Express中间件示例运行在 http://localhost:${PORT}`);
  console.log('\n可以访问以下路由测试中间件：');
  console.log(`  GET    http://localhost:${PORT}/public/data`);
  console.log(`  GET    http://localhost:${PORT}/api/users`);
  console.log(`  POST   http://localhost:${PORT}/api/users`);
  console.log(`  GET    http://localhost:${PORT}/demo/order`);
  console.log(`  404    http://localhost:${PORT}/not-found`);
});
