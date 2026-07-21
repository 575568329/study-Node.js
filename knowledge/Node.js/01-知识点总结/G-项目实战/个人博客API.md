---
tags:
  - 项目实战
  - Express
  - JWT
  - 文件上传
  - G领域
创建时间: 2026-03-24
更新时间: 2026-03-24
掌握程度: ✅ 已掌握
---

# 个人博客API项目

## 📚 项目概述

**项目名称**: 个人博客API（Personal Blog API）
**技术栈**: Node.js + Express + MySQL + JWT + Multer
**项目路径**: [[../../projects/11-personal-blog]]
**完成时间**: 2026-03-24
**掌握程度**: ✅ 已掌握

---

## 🎯 项目功能

### 核心功能
1. ✅ **用户认证系统**
   - 用户注册（密码加密）
   - 用户登录（JWT认证）
   - Token刷新机制
   - 密码加密（bcrypt）

2. ✅ **文章管理系统**
   - 创建文章
   - 获取文章列表（分页）
   - 获取文章详情
   - 更新文章（权限验证）
   - 删除文章（权限验证）
   - 文章状态管理（草稿/已发布）

3. ✅ **评论系统**
   - 发表评论
   - 获取文章评论列表
   - 删除评论（权限验证）

4. ✅ **用户中心**
   - 获取个人信息
   - 更新个人信息
   - 修改密码
   - 用户头像上传

5. ✅ **文件上传功能**
   - 用户头像上传
   - 文章封面图上传
   - 文件类型验证（只允许图片）
   - 文件大小限制（最大2MB）
   - 静态文件服务

---

## 📁 项目结构

```
11-personal-blog/
  ├── src/
  │   ├── config/
  │   │   └── database.js          # 数据库配置
  │   ├── controllers/
  │   │   ├── authController.js    # 认证控制器
  │   │   ├── postController.js    # 文章控制器
  │   │   ├── commentController.js # 评论控制器
  │   │   ├── userController.js    # 用户控制器
  │   │   └── uploadController.js  # 上传控制器
  │   ├── middleware/
  │   │   ├── auth.js              # JWT认证中间件
  │   │   ├── error.js             # 错误处理中间件
  │   │   └── upload.js            # 文件上传中间件
  │   ├── routes/
  │   │   ├── auth.js              # 认证路由
  │   │   ├── posts.js             # 文章路由
  │   │   ├── comments.js          # 评论路由
  │   │   ├── users.js             # 用户路由
  │   │   └── upload.js            # 上传路由
  │   ├── utils/
  │   │   └── jwt.js               # JWT工具函数
  │   ├── app.js                   # Express应用配置
  │   └── server.js                # 服务器启动
  ├── uploads/                     # 上传文件目录
  │   ├── avatars/                 # 用户头像
  │   └── covers/                  # 文章封面
  ├── .env                         # 环境变量
  ├── .gitignore
  └── package.json
```

---

## 🔧 技术要点

### 1️⃣ 数据库设计

#### users表（用户表）
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  avatar VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### posts表（文章表）
```sql
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  cover_image VARCHAR(255),
  author_id INT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'draft',
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id)
);
```

#### comments表（评论表）
```sql
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

### 2️⃣ JWT认证

#### 登录流程
```javascript
// 1. 验证用户名密码
// 2. 生成JWT Token
const accessToken = jwt.sign(
  { user_id: user.id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// 3. 生成Refresh Token
const refreshToken = jwt.sign(
  { user_id: user.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// 4. 返回Token
res.json({
  success: true,
  data: {
    accessToken,
    refreshToken
  }
});
```

#### 认证中间件
```javascript
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token不存在' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token无效或已过期' });
  }
};
```

---

### 3️⃣ 文件上传

#### Multer配置
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, 'uploads/avatars/');
    } else if (file.fieldname === 'cover') {
      cb(null, 'uploads/covers/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件！'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },  // 2MB
  fileFilter: fileFilter
});
```

#### 上传控制器
```javascript
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请选择要上传的文件' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await pool.query(
      'UPDATE users SET avatar = ? WHERE id = ?',
      [avatarUrl, req.user.user_id]
    );

    res.json({
      success: true,
      message: '头像上传成功',
      data: { url: avatarUrl }
    });
  } catch (error) {
    // 删除已上传的文件
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
};
```

---

### 4️⃣ 权限验证

#### 示例：更新文章权限
```javascript
exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.user_id;

  // 检查文章是否存在
  const [posts] = await pool.query(
    'SELECT * FROM posts WHERE id = ?',
    [postId]
  );

  if (posts.length === 0) {
    return res.status(404).json({ message: '文章不存在' });
  }

  // 检查权限
  if (posts[0].author_id !== userId) {
    return res.status(403).json({ message: '无权修改此文章' });
  }

  // 更新文章
  // ...
};
```

---

## 📡 API接口清单

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新Token

### 文章接口
- `GET /api/posts` - 获取文章列表（分页）
- `GET /api/posts/:id` - 获取文章详情
- `POST /api/posts` - 创建文章（需认证）
- `PUT /api/posts/:id` - 更新文章（需认证）
- `DELETE /api/posts/:id` - 删除文章（需认证）

### 评论接口
- `GET /api/posts/:id/comments` - 获取文章评论
- `POST /api/posts/:id/comments` - 发表评论（需认证）
- `DELETE /api/comments/:id` - 删除评论（需认证）

### 用户接口
- `GET /api/users/me` - 获取个人信息（需认证）
- `PUT /api/users/me` - 更新个人信息（需认证）
- `PUT /api/users/me/password` - 修改密码（需认证）

### 上传接口
- `POST /api/upload/avatar` - 上传头像（需认证）
- `POST /api/upload/cover` - 上传封面图（需认证）

---

## 🎯 项目亮点

1. ✅ **完整的JWT认证系统**
   - Access Token（15分钟）
   - Refresh Token（7天）
   - 自动刷新机制

2. ✅ **权限验证**
   - 文章作者才能修改/删除
   - 评论作者才能删除

3. ✅ **文件上传**
   - Multer文件上传
   - 文件类型验证
   - 文件大小限制
   - 静态文件服务

4. ✅ **密码安全**
   - bcrypt密码加密（salt rounds: 10）
   - 不存储明文密码

5. ✅ **错误处理**
   - 统一错误处理中间件
   - 友好的错误信息

6. ✅ **代码结构**
   - 分层清晰（routes/controllers/middleware）
   - 模块化路由
   - 配置文件独立

---

## 🚀 启动项目

### 安装依赖
```bash
cd projects/11-personal-blog
npm install
```

### 配置环境变量
```bash
# .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123456
DB_NAME=blog_database
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=3000
```

### 启动服务器
```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

---

## 📝 学习收获

通过这个项目，你掌握了：

1. ✅ **Express框架**
   - 路由设计
   - 中间件机制
   - 错误处理

2. ✅ **JWT认证**
   - Token生成与验证
   - 认证中间件
   - Token刷新机制

3. ✅ **MySQL操作**
   - 连接池配置
   - CRUD操作
   - 事务处理（可选）

4. ✅ **文件上传**
   - Multer配置
   - 文件验证
   - 静态资源服务

5. ✅ **RESTful API设计**
   - 合理的URL设计
   - HTTP方法使用
   - 统一的响应格式

6. ✅ **安全性**
   - 密码加密
   - SQL注入防护
   - 权限验证

---

## 🔗 相关资源

- **相关笔记**:
  - [[JWT在Express中的实现]]
  - [[Multer文件上传]]
  - [[RESTful API设计规范]]
  - [[SQL注入防护]]

---

**项目状态**: ✅ 已完成
**掌握程度**: ✅ 已掌握
**完成时间**: 2026-03-24
**代码质量**: ⭐⭐⭐⭐⭐
