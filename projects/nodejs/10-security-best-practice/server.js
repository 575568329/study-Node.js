import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = 3003;

// ============================================
// 安全最佳实践演示
// ============================================

// 1️⃣ Helmet - HTTP安全头
app.use(helmet({
  contentSecurityPolicy: {  // CSP内容安全策略
    directives: {
      defaultSrc: ["'self'"],  // 只允许加载本站资源
      scriptSrc: ["'self'"],   // 只允许执行本站脚本
      styleSrc: ["'self'", "'unsafe-inline'"], // 允许内联样式
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}));

// 2️⃣ 全局限流：每分钟100次
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 100, // 最多100次请求
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  },
  standardHeaders: true, // 返回速率限制信息
  legacyHeaders: false,
});

app.use('/api/', globalLimiter);

// 登录接口更严格：每分钟5次
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: '登录尝试次数过多，请1分钟后再试'
  },
  skipSuccessfulRequests: true, // 成功的登录不计入限制
});

app.use(express.json());

// 3️⃣ Morgan日志安全：不记录敏感信息
// 自定义token：安全地记录请求体
morgan.token('safe-body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) return '{}';

  // 创建副本，删除敏感字段
  const safeBody = { ...req.body };
  delete safeBody.password;
  delete safeBody.token;
  delete safeBody.refresh_token;

  return JSON.stringify(safeBody);
});

// 自定义格式：只记录关键信息
const safeLogFormat = ':method :url :status - :safe-body - Response: :response-time ms';
app.use(morgan(safeLogFormat));

// 4️⃣ CORS白名单（复习）
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500','http://172.21.224.1:5500'],
  credentials: true
}));

// 提供静态文件（测试页面）
app.use(express.static('.'));

// ============================================
// 模拟数据库
// ============================================

const users = [
  { id: 1, username: 'alice', email: 'alice@example.com', password: 'hashed_password_123', phone: '13800138000' },
  { id: 2, username: 'bob', email: 'bob@example.com', password: 'hashed_password_456', phone: '13900139000' },
];

// ============================================
// 路由演示
// ============================================

// 测试1：查看安全头
app.get('/api/headers', (req, res) => {
  res.json({
    message: '查看响应头中的安全头',
    headers: req.headers // 返回请求头（不含敏感信息）
  });
});

// 测试2：登录接口（限流 + 日志脱敏）
app.post('/api/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  // 模拟登录验证
  const user = users.find(u => u.username === username);

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      message: '用户名或密码错误'
    });
  }

  // 登录成功，返回用户信息（不含密码）
  const { password: _, ...safeUser } = user; // 删除password字段

  res.json({
    success: true,
    message: '登录成功',
    data: safeUser
  });
});

// 测试3：获取用户列表（数据脱敏）
app.get('/api/users', (req, res) => {
  // ❌ 错误示例：返回所有字段
  // res.json(users);

  // ✅ 正确示例：只返回安全字段
  const safeUsers = users.map(user => {
    const { password, phone, ...safeUser } = user; // 删除敏感字段
    return safeUser;
  });

  res.json({
    success: true,
    data: safeUsers
  });
});

// 测试4：获取单个用户（SQL级别的脱敏）
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: '用户不存在'
    });
  }

  // ❌ 错误示例：返回所有字段
  // res.json(user);

  // ✅ 正确示例1：SQL查询时就排除（推荐）
  // SELECT id, username, email FROM users WHERE id = ?
  const { password, phone, ...safeUser } = user;

  // ✅ 正确示例2：手机号脱敏（只显示前3后4位）
  safeUser.phone = user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

  res.json({
    success: true,
    data: safeUser
  });
});

// 测试5：触发限流
app.get('/api/test-limit', (req, res) => {
  res.json({
    success: true,
    message: '请求成功',
    timestamp: new Date().toISOString()
  });
});

// 测试6：演示不安全的日志（对比）
app.post('/api/unsafe-log', (req, res) => {
  // ❌ 危险：记录了密码
  console.log('不安全的日志:', req.body);

  res.json({
    success: true,
    message: '查看控制台，日志中包含password（危险！）'
  });
});

// 测试7：演示安全的日志
app.post('/api/safe-log', (req, res) => {
  // ✅ 安全：删除密码后记录
  const { password, ...safeBody } = req.body;
  console.log('安全的日志:', safeBody);

  res.json({
    success: true,
    message: '查看控制台，日志中不包含password（安全）'
  });
});

// ============================================
// 启动服务器
// ============================================

app.listen(PORT, () => {
  console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`\n🛡️ 安全最佳实践演示：`);
  console.log(`   1. Helmet - HTTP安全头`);
  console.log(`   2. Rate Limiting - 速率限制`);
  console.log(`   3. 数据脱敏 - 不返回敏感字段`);
  console.log(`   4. 日志安全 - 不记录敏感信息\n`);
  console.log(`\n📚 测试API：`);
  console.log(`   GET  /api/headers        - 查看安全头`);
  console.log(`   POST /api/login         - 登录（限流：5次/分钟）`);
  console.log(`   GET  /api/users         - 获取用户列表（数据脱敏）`);
  console.log(`   GET  /api/users/:id     - 获取单个用户（手机号脱敏）`);
  console.log(`   GET  /api/test-limit    - 触发限流测试（100次/分钟）`);
  console.log(`   POST /api/unsafe-log    - 不安全的日志示例`);
  console.log(`   POST /api/safe-log      - 安全的日志示例\n`);
  console.log(`\n⚠️ 注意事项：`);
  console.log(`   - 登录接口限流：5次/分钟（失败计入，成功不计）`);
  console.log(`   - 其他接口限流：100次/分钟`);
  console.log(`   - 查看响应头中的安全头（X-Frame-Options、CSP等）\n`);
});
