/**
 * Express服务器入口文件
 * JWT认证系统
 */

import express from 'express';
import cors from 'cors';
import authRoutes from './authRoutes.js';

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors()); // 允许跨域
app.use(express.json()); // 解析JSON请求体

// 路由配置
app.use('/api/auth', authRoutes);

// 根路径测试
app.get('/', (req, res) => {
  res.json({
    message: 'JWT认证系统API',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      profile: 'GET /api/auth/profile (需要token)'
    }
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('❌ 服务器错误：', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log('=================================');
  console.log('📚 可用接口：');
  console.log(`   POST   http://localhost:${PORT}/api/auth/register  - 用户注册`);
  console.log(`   POST   http://localhost:${PORT}/api/auth/login     - 用户登录`);
  console.log(`   GET    http://localhost:${PORT}/api/auth/profile   - 获取个人信息（需要token）`);
  console.log('=================================');
});
