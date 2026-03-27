// =============================================
// Sequelize配置 - ORM框架
// =============================================
const { Sequelize } = require('sequelize');
require('dotenv').config();

// 创建Sequelize实例
const sequelize = new Sequelize(
  process.env.DB_NAME,      // 数据库名: blog_db
  process.env.DB_USER,      // 用户名: root
  process.env.DB_PASSWORD,  // 密码: root123456
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',       // 数据库类型: mysql, postgres, sqlite, mssql
    logging: false,         // 不显示SQL日志（生产环境）

    // 连接池配置（与mysql2的createPool类似）
    pool: {
      max: 10,              // 最大连接数
      min: 0,               // 最小连接数
      acquire: 30000,       // 获取连接的最大时间（毫秒）
      idle: 10000           // 连接空闲时间（毫秒）后释放
    },

    // 字符集
    define: {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  }
);

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Sequelize数据库连接成功');
    console.log(`📊 数据库: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error('❌ Sequelize数据库连接失败:', error.message);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection
};
