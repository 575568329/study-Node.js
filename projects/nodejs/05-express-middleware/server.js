import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

const app = express();
const PORT = 3001;

// ============================================
// 中间件1: helmet - 安全头部防护
// ============================================
// 作用：自动设置各种安全相关的HTTP响应头
// 防护：XSS攻击、点击劫持、MIME类型嗅探等
app.use(helmet());

// ============================================
// 中间件2: morgan - HTTP请求日志记录
// ============================================
// 作用：在控制台自动记录每个请求的详细信息
// 格式：'dev'格式适合开发环境，彩色输出
app.use(morgan('dev'));

// ============================================
// 中间件3: cors - 跨域资源共享
// ============================================
// 作用：允许前端跨域访问后端API
// 生产环境建议指定origin，开发环境可以用默认（允许所有源）
app.use(cors({
  origin: 'http://localhost:3000', // 只允许这个源访问
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 允许的HTTP方法
  credentials: true // 允许携带Cookie（如果需要）
}));

// ============================================
// Express内置中间件
// ============================================
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码请求体

// ============================================
// 测试路由
// ============================================

// GET请求 - 获取用户列表
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: '张三', email: 'zhangsan@example.com' },
    { id: 2, name: '李四', email: 'lisi@example.com' },
    { id: 3, name: '王五', email: 'wangwu@example.com' }
  ];
  res.json({
    success: true,
    data: users
  });
});

// POST请求 - 创建用户
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  // 简单验证
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: '姓名和邮箱不能为空'
    });
  }

  res.status(201).json({
    success: true,
    message: '用户创建成功',
    data: {
      id: Date.now(),
      name,
      email
    }
  });
});

// PUT请求 - 更新用户
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  res.json({
    success: true,
    message: `用户 ${id} 更新成功`,
    data: { id, name, email }
  });
});

// DELETE请求 - 删除用户
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    success: true,
    message: `用户 ${id} 删除成功`
  });
});

// 故意制造错误的路由（测试错误处理）
app.get('/api/error', (req, res) => {
  throw new Error('这是一个测试错误');
});

// ============================================
// 错误处理中间件（必须放在最后）
// ============================================
app.use((err, req, res, next) => {
  console.error('错误详情:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || '服务器内部错误'
  });
});

// ============================================
// 启动服务器
// ============================================
app.listen(PORT, () => {
  console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 已启用的中间件:`);
  console.log(`   - helmet: 安全防护`);
  console.log(`   - morgan: 日志记录`);
  console.log(`   - cors: 跨域支持 (源: http://localhost:3000)`);
  console.log(`\n📚 测试API:`);
  console.log(`   GET    /api/users      - 获取用户列表`);
  console.log(`   POST   /api/users      - 创建用户`);
  console.log(`   PUT    /api/users/:id  - 更新用户`);
  console.log(`   DELETE /api/users/:id  - 删除用户`);
  console.log(`   GET    /api/error      - 测试错误处理\n`);
});
