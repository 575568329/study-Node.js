# Node.js + MySQL CRUD 示例

学习如何使用 mysql2 包连接 MySQL 数据库并实现完整的 CRUD 操作。

## 📚 学习内容

- ✅ mysql2 包安装和使用
- ✅ 数据库连接池配置
- ✅ 参数化查询（防止SQL注入）
- ✅ CRUD 操作（Create、Read、Update、Delete）
- ✅ 错误处理
- ✅ async/await 异步操作

## 🔧 环境准备

### 1. 确保MySQL已安装并运行

```bash
# 检查MySQL服务
sc query MySQL80

# 测试连接
mysql -u root -p
```

### 2. 确保数据库已创建

```sql
-- 连接MySQL后执行
CREATE DATABASE blog_database;
USE blog_database;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 启动项目

### 1. 安装依赖（已完成）

```bash
npm install mysql2 express
```

### 2. 启动服务器

```bash
node server.js
```

你会看到：
```
🚀 服务器运行在 http://localhost:3003
📊 测试连接: http://localhost:3003/test-connection
```

### 3. 测试API

#### 方式1：使用 test.html

在浏览器中打开 `test.html` 文件，进行可视化测试。

#### 方式2：使用 curl

```bash
# 测试连接
curl http://localhost:3003/test-connection

# 查询所有用户
curl http://localhost:3003/api/users

# 创建用户
curl -X POST http://localhost:3003/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"123456"}'

# 查询单个用户
curl http://localhost:3003/api/users/1

# 更新用户
curl -X PUT http://localhost:3003/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"username":"newname","email":"new@example.com","password":"789"}'

# 删除用户
curl -X DELETE http://localhost:3003/api/users/1
```

## 📁 项目结构

```
07-mysql-crud/
├── db.config.js      # 数据库配置
├── server.js         # Express服务器 + API路由
├── test.html         # 测试页面
├── package.json      # 项目依赖
└── README.md         # 说明文档
```

## 🎯 核心概念

### 1. 连接池

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root123456',
  database: 'blog_database',
  connectionLimit: 10  // 最多10个连接
});
```

**优势**：
- 复用连接，提高性能
- 自动管理连接的分配和释放
- 限制最大连接数，防止资源耗尽

### 2. 参数化查询

```javascript
// ✅ 安全：使用占位符
await pool.query('SELECT * FROM users WHERE id = ?', [id]);

// ❌ 危险：拼接SQL（可能导致SQL注入）
const sql = `SELECT * FROM users WHERE id = ${id}`;
```

### 3. async/await

```javascript
// ✅ 推荐：async/await
const [rows] = await pool.query('SELECT * FROM users');

// ❌ 不推荐：回调函数
pool.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log(results);
});
```

## 🔑 关键API

### GET /api/users
查询所有用户

### GET /api/users/:id
根据ID查询用户

### POST /api/users
创建新用户
- Body: `{ username, email, password }`

### PUT /api/users/:id
更新用户
- Body: `{ username, email, password }`

### DELETE /api/users/:id
删除用户

## ⚠️ 常见错误

### 1. 连接失败

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**解决**：检查MySQL服务是否运行

```bash
sc query MySQL80
# 如果状态不是 RUNNING，启动服务
net start MySQL80
```

### 2. 认证失败

```
Error: Access denied for user 'root'@'localhost'
```

**解决**：检查 `db.config.js` 中的密码是否正确

### 3. 数据库不存在

```
Error: Unknown database 'blog_database'
```

**解决**：先创建数据库

```sql
CREATE DATABASE blog_database;
```

## 📖 下一步学习

- [ ] 使用 express-validator 进行参数验证
- [ ] 集成 Multer 实现文件上传
- [ ] 使用 bcrypt 加密密码
- [ ] 实现 JWT 认证
- [ ] 学习事务处理
- [ ] 学习 JOIN 多表查询

---

**学习时间**: 2026-03-19
**当前进度**: E.4 - Node.js连接mysql2
