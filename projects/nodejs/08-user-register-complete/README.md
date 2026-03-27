# 用户注册系统 - 完整版

一个功能完整的用户注册系统，整合了参数验证、文件上传、密码加密和数据库存储。

## ✨ 功能特性

- ✅ **参数验证**：使用 express-validator 验证用户输入
- ✅ **文件上传**：使用 Multer 处理头像上传
- ✅ **密码加密**：使用 bcrypt 加密密码
- ✅ **数据库存储**：使用 mysql2 连接 MySQL
- ✅ **错误处理**：完整的错误处理和资源清理
- ✅ **异步处理**：使用 async/await 处理异步操作

## 🔧 技术栈

- **Express** - Web框架
- **express-validator** - 参数验证
- **Multer** - 文件上传
- **mysql2** - MySQL数据库连接
- **bcrypt** - 密码加密

## 📋 注册要求

### 用户名
- 3-20字符
- 只允许字母、数字和下划线
- 不能为空

### 邮箱
- 必须是有效的邮箱格式
- 不能为空

### 密码
- 至少6位
- 必须包含大写字母
- 必须包含小写字母
- 必须包含数字

### 头像（可选）
- 支持格式：jpg、png、gif、webp
- 最大大小：5MB
- 文件命名：`avatar-时间戳-随机数.扩展名`

## 🚀 快速开始

### 1. 安装依赖（已完成）

```bash
npm install
```

### 2. 确保MySQL服务运行

```bash
sc query MySQL80
```

### 3. 确保数据库和表已创建

```sql
USE blog_database;

-- 如果没有users表，创建它
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 启动服务器

```bash
npm start
```

你会看到：
```
🚀 服务器运行在 http://localhost:3004
📝 测试连接: http://localhost:3004/api/test
👤 注册接口: POST http://localhost:3004/api/register
📊 查询用户: GET http://localhost:3004/api/users
```

### 5. 测试系统

在浏览器中打开 `register.html` 文件，或直接双击打开。

## 📡 API 接口

### POST /api/register

注册新用户

**请求格式**：`multipart/form-data`

**参数**：
- `username` (必填) - 用户名
- `email` (必填) - 邮箱
- `password` (必填) - 密码
- `avatar` (可选) - 头像文件

**成功响应**（201）：
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "avatar": "avatar-1234567890-123456789.jpg"
  }
}
```

**失败响应**（400）：
```json
{
  "success": false,
  "message": "参数验证失败",
  "errors": [
    {
      "msg": "用户名长度3-20字符",
      "param": "username",
      "location": "body"
    }
  ]
}
```

### GET /api/test

测试数据库连接

**响应**：
```json
{
  "success": true,
  "message": "数据库连接成功"
}
```

### GET /api/users

查询所有用户（不包含密码）

**响应**：
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "avatar": "avatar-1234567890-123456789.jpg",
      "created_at": "2026-03-20T12:00:00.000Z"
    }
  ]
}
```

### GET /api/users/:id

根据ID查询用户

## 🔄 执行流程

```
用户提交表单
  ↓
1. 参数验证（express-validator）
  ├─ 用户名：3-20字符、字母数字下划线
  ├─ 邮箱：有效格式
  └─ 密码：至少6位、包含大小写字母和数字
  ↓ (验证通过)
2. 文件上传（Multer）
  ├─ 检查文件类型（只允许图片）
  ├─ 检查文件大小（最大5MB）
  └─ 保存到 uploads/avatars/
  ↓ (上传成功)
3. 检查用户是否存在
  └─ 查询数据库
  ↓ (用户不存在)
4. 密码加密（bcrypt）
  └─ 生成哈希值
  ↓
5. 保存到数据库（mysql2）
  ├─ 保存用户信息
  └─ 保存头像文件名
  ↓
6. 返回成功响应
```

## ⚠️ 错误处理

### 参数验证失败（400）
- 用户名不符合要求
- 邮箱格式错误
- 密码不符合要求

### 文件上传失败（400）
- 文件类型不支持
- 文件大小超过限制

### 数据库错误（500）
- 用户名或邮箱已存在
- 数据库连接失败
- SQL执行失败

### 资源清理
- 如果注册失败，自动删除已上传的文件
- 避免垃圾文件占用存储空间

## 📁 项目结构

```
08-user-register-complete/
├── db.config.js      # 数据库配置
├── server.js         # Express服务器 + API路由
├── register.html     # 测试页面
├── uploads/          # 上传文件目录（自动创建）
│   └── avatars/      # 头像文件
├── package.json      # 项目依赖
└── README.md         # 说明文档
```

## 🔐 安全特性

1. **密码加密**：使用 bcrypt 加密，saltRounds = 10
2. **参数化查询**：防止SQL注入
3. **文件类型检查**：只允许上传图片
4. **文件大小限制**：防止大文件攻击
5. **参数验证**：前后端双重验证

## 🎯 关键代码解释

### 1. 密码加密
```javascript
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### 2. 参数化查询
```javascript
await pool.query(
  'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
  [username, email, hashedPassword]
);
```

### 3. 文件清理
```javascript
try {
  // 保存到数据库
  await pool.query(...);
} catch (err) {
  // 删除已上传的文件
  if (uploadedFile) {
    fs.unlinkSync(uploadedFile.path);
  }
}
```

## 📖 下一步学习

- [ ] 用户登录（JWT认证）
- [ ] 密码重置功能
- [ ] 邮箱验证
- [ ] 用户资料编辑
- [ ] 头像显示
- [ ] 分页查询

---

**学习时间**: 2026-03-20
**当前进度**: 综合实战 - 完整用户注册系统
