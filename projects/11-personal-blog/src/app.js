// =============================================
// Express应用配置
// =============================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const errorHandler = require('./middleware/error');

const app = express();

// ===== 安全中间件 =====
app.use(helmet({
  contentSecurityPolicy: false  // 临时禁用CSP，防止阻止API请求
}));

// ===== CORS配置 =====
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// ===== 速率限制 =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制100次请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api', limiter);

// 登录接口单独限制（5次/分钟）
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: '登录失败次数过多，请1分钟后再试'
});
app.use('/api/auth/login', loginLimiter);

// ===== 日志记录（不记录敏感信息）=====
morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return '{}';
  }
  const { password, ...safeBody } = req.body;
  return JSON.stringify(safeBody);
});
app.use(morgan(':method :url :status :response-time ms - :body'));

// ===== 解析请求体 =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== 静态文件 =====
app.use('/uploads', express.static('uploads'));

// ===== 路由 =====
// 添加调试日志
app.use((req, res, next) => {
  console.log(`📥 请求: ${req.method} ${req.url}`);
  console.log(`📍 路径: ${req.path}`);
  console.log(`🔗 原始URL: ${req.originalUrl}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes); // 用户路由
app.use('/api/upload', uploadRoutes); // 文件上传路由
app.use('/api', commentRoutes); // 评论路由（包含/posts/:id/comments和/comments/:id）

// ===== 404处理 =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// ===== 错误处理中间件 =====
app.use(errorHandler);

module.exports = app;
