/**
 * 数据库配置
 * 功能：创建MySQL连接池
 */

import mysql from 'mysql2/promise';

// 创建连接池
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123456',
  database: 'blog_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('✅ 数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('❌ 数据库连接失败:', err.message);
  });
