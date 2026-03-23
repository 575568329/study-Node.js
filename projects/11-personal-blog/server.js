// =============================================
// 服务器入口文件
// =============================================
require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');

const PORT = process.env.PORT || 3000;

// 启动服务器
const startServer = async () => {
  try {
    // 测试数据库连接
    await testConnection();

    // 启动HTTP服务器
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 服务器运行在: http://localhost:${PORT}`);
      console.log(`📚 API文档: http://localhost:${PORT}/api`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
};

startServer();
