require('dotenv').config();
const app = require('./src/app');
const { sequelize, testConnection } = require('./src/config/sequelize');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: true });
    console.log('数据库表同步完成');

    app.listen(PORT, () => {
      console.log(`电影管理系统: http://localhost:${PORT}`);
      console.log(`API文档: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('启动失败:', error);
    process.exit(1);
  }
};

startServer();
