// 数据库配置文件

module.exports = {
  host: 'localhost',      // MySQL服务器地址
  port: 3306,             // MySQL端口
  user: 'root',           // 用户名
  password: 'root123456', // 密码（你设置的root密码）
  database: 'blog_database', // 数据库名
  waitForConnections: true,      // 等待可用连接
  connectionLimit: 10,           // 连接池最大连接数
  queueLimit: 0                  // 队列限制（0=无限制）
};
