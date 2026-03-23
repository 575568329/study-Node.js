# 项目索引

> **所有实战项目的快速导航**
> **更新频率**: 每次创建新项目后更新

---

## 📊 项目概览

| 项目 | 学习日期 | 难度 | 状态 | 核心技术 |
|------|---------|------|------|---------|
| [01-express-demo](#01-express-demo) | - | ⭐ | ✅ 完成 | Express基础 |
| [02-static-server](#02-static-server) | - | ⭐ | ✅ 完成 | 静态资源服务 |
| [03-modular-routes](#03-modular-routes) | - | ⭐⭐ | ✅ 完成 | 模块化路由 |
| [05-express-middleware](#05-express-middleware) | 2026-03-17 | ⭐⭐ | ✅ 完成 | 中间件机制 |
| [06-validator-upload](#06-validator-upload) | 2026-03-18 | ⭐⭐⭐ | ✅ 完成 | 参数验证+文件上传 |
| [07-mysql-crud](#07-mysql-crud) | 2026-03-20 | ⭐⭐⭐ | ✅ 完成 | MySQL CRUD |
| [08-user-register-complete](#08-user-register-complete) | 2026-03-20 | ⭐⭐⭐⭐ | ✅ 完成 | 完整用户系统 |
| [10-security-best-practice](#10-security-best-practice) | 2026-03-23 | ⭐⭐⭐ | ✅ 完成 | 安全最佳实践 |
| [11-personal-blog](#11-personal-blog) | 2026-03-23 | ⭐⭐⭐⭐⭐ | ✅ 完成 | 个人博客API |

---

## 📂 项目详情

### 01-express-demo
**难度**: ⭐ | **状态**: ✅ 完成
**学习主题**: Express基础

**功能**:
- Express基本使用
- 路由定义
- 请求响应处理

**技术栈**:
- Express

---

### 02-static-server
**难度**: ⭐ | **状态**: ✅ 完成
**学习主题**: 静态资源服务

**功能**:
- 使用express.static托管静态文件
- HTML、CSS、JS文件访问

**技术栈**:
- Express
- express.static

---

### 03-modular-routes
**难度**: ⭐⭐ | **状态**: ✅ 完成
**学习主题**: 模块化路由

**功能**:
- express.Router()模块化
- 路由分离与组织
- URL前缀挂载

**技术栈**:
- Express
- express.Router

---

### 05-express-middleware
**难度**: ⭐⭐ | **状态**: ✅ 完成
**学习日期**: 2026-03-17
**学习主题**: Express中间件机制

**功能**:
- 中间件执行顺序
- 应用级vs路由级中间件
- 错误处理中间件

**技术栈**:
- Express
- helmet
- morgan
- cors

**关键文件**:
- `server.js` - 主服务器
- `middleware/` - 自定义中间件

---

### 06-validator-upload
**难度**: ⭐⭐⭐ | **状态**: ✅ 完成
**学习日期**: 2026-03-18
**学习主题**: 参数验证 + 文件上传

**功能**:
- ✅ 用户注册参数验证（express-validator）
- ✅ 头像文件上传（Multer）
- ✅ 前后端分离
- ✅ CORS跨域处理

**技术栈**:
- Express
- express-validator（参数验证）
- Multer（文件上传）
- cors（跨域）
- morgan（日志）

**关键文件**:
- `backend/server.js` - Express服务器
- `backend/uploads/` - 上传文件存储
- `frontend/index.html` - 测试页面

**启动方式**:
```bash
# 后端（端口3002）
cd 06-validator-upload/backend
node server.js

# 前端（端口3000）
cd 06-validator-upload/frontend
python -m http.server 3000
```

**API接口**:
- `POST /api/register` - 用户注册
- `POST /api/upload/avatar` - 上传头像
- `POST /api/register-with-avatar` - 注册+上传

**学习成果**:
- ✅ 掌握express-validator参数验证
- ✅ 掌握Multer文件上传机制
- ✅ 理解前后端分离架构

---

### 07-mysql-crud
**难度**: ⭐⭐⭐ | **状态**: ✅ 完成
**学习日期**: 2026-03-20
**学习主题**: MySQL基础CRUD操作

**功能**:
- ✅ 连接MySQL数据库（mysql2）
- ✅ 创建数据库和表
- ✅ CREATE（插入数据）
- ✅ READ（查询数据）
- ✅ UPDATE（更新数据）
- ✅ DELETE（删除数据）

**技术栈**:
- Express
- mysql2（MySQL驱动）
- 连接池配置

**关键文件**:
- `server.js` - Express服务器
- `db.config.js` - 数据库配置

**启动方式**:
```bash
# 确保MySQL服务运行
sc query MySQL80

# 启动服务器
cd 07-mysql-crud
node server.js
```

**API接口**:
- `GET /api/test` - 测试数据库连接
- `POST /api/users` - 创建用户
- `GET /api/users` - 查询所有用户
- `GET /api/users/:id` - 查询单个用户
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

**学习成果**:
- ✅ 掌握mysql2连接池配置
- ✅ 掌握参数化查询（防SQL注入）
- ✅ 掌握完整CRUD操作

---

### 10-security-best-practice
**难度**: ⭐⭐⭐ | **状态**: ✅ 完成
**学习日期**: 2026-03-23
**学习主题**: 安全最佳实践综合演示

**功能**:
- ✅ 速率限制（rate-limiting）
- ✅ Helmet安全头（7个HTTP响应头）
- ✅ 数据脱敏（SQL查询排除、代码删除、日志脱敏）
- ✅ 日志安全（morgan自定义token）
- ✅ 环境变量管理（.env配置）

**技术栈**:
- Express
- express-rate-limit
- helmet
- morgan
- cors

**关键文件**:
- `server.js` - Express服务器
- `.env.example` - 环境变量模板
- `test.html` - 前端测试页面

**启动方式**:
```bash
cd 10-security-best-practice
npm install
node server.js
```

**测试接口**:
- `POST /api/login` - 登录（速率限制：5次/分钟）
- `GET /api/data` - 获取数据（速率限制：100次/15分钟）

**安全头演示**:
```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'none'
X-XSS-Protection: 0
```

**学习成果**:
- ✅ 理解速率限制的必要性（防暴力破解）
- ✅ 掌握Helmet自动添加安全头
- ✅ 理解数据脱敏的3种方法
- ✅ 深入理解日志安全风险

---

### 08-user-register-complete
**难度**: ⭐⭐⭐⭐ | **状态**: ✅ 完成
**学习日期**: 2026-03-20
**学习主题**: 完整用户注册系统（综合实战）

**功能**:
- ✅ 参数验证（express-validator）
- ✅ 文件上传（Multer）
- ✅ 密码加密（bcrypt）
- ✅ 数据库存储（mysql2）
- ✅ 错误处理与资源清理
- ✅ CORS跨域处理

**技术栈**:
- Express
- express-validator
- Multer
- bcrypt（密码加密）
- mysql2
- cors

**关键文件**:
- `server.js` - Express服务器
- `db.config.js` - 数据库配置
- `register.html` - 测试页面
- `uploads/avatars/` - 头像存储

**启动方式**:
```bash
# 1. 确保MySQL服务运行
sc query MySQL80

# 2. 确保数据库存在
mysql -u root -p
USE blog_database;
SHOW TABLES;

# 3. 启动服务器
cd 08-user-register-complete
npm start
```

**API接口**:
- `GET /api/test` - 测试数据库连接
- `POST /api/register` - 注册新用户（multipart/form-data）
- `GET /api/users` - 查询所有用户
- `GET /api/users/:id` - 根据ID查询用户

**注册要求**:
- 用户名：3-20字符，字母数字下划线
- 邮箱：有效邮箱格式
- 密码：至少6位，包含大小写字母和数字
- 头像：可选，支持jpg/png/gif/webp，最大5MB

**执行流程**:
```
用户提交表单
  ↓
1. 参数验证（express-validator）
  ↓ (验证通过)
2. 文件上传（Multer）
  ↓ (上传成功)
3. 检查用户是否存在
  ↓ (用户不存在)
4. 密码加密（bcrypt）
  ↓
5. 保存到数据库（mysql2）
  ↓
6. 返回成功响应
```

**安全特性**:
- 🔐 bcrypt密码加密（saltRounds = 10）
- 🛡️ 参数化查询（防SQL注入）
- 📁 文件类型检查（只允许图片）
- 📏 文件大小限制（最大5MB）
- ✅ 前后端双重验证

**学习成果**:
- ✅ 掌握完整用户注册流程
- ✅ 理解异步操作的依赖关系
- ✅ 掌握错误处理和资源清理
- ✅ 理解中间件执行顺序

---

### 11-personal-blog
**难度**: ⭐⭐⭐⭐⭐ | **状态**: ✅ 完成（核心功能100%）
**学习日期**: 2026-03-23
**学习主题**: 个人博客后端API（综合项目）

**功能**:
- ✅ 用户认证系统（注册、登录、JWT认证中间件）
- ✅ 文章管理系统（发表、编辑、删除、查询、分页）
- ✅ 评论系统（发表评论、删除评论、获取评论列表）
- ✅ 用户中心（查看个人信息、更新个人信息）

**技术栈**:
- Express（Web框架）
- mysql2（MySQL驱动）
- jsonwebtoken（JWT认证）
- bcryptjs（密码加密）
- express-validator（参数验证）
- cors（跨域）
- helmet（安全头）
- express-rate-limit（速率限制）
- morgan（日志）

**关键文件**:
- `server.js` - 服务器入口
- `src/app.js` - Express应用配置
- `src/config/database.js` - 数据库配置
- `src/controllers/` - 业务逻辑控制器
- `src/routes/` - 路由定义
- `src/middleware/auth.js` - JWT认证中间件
- `database/schema.sql` - 数据库表结构

**启动方式**:
```bash
# 1. 确保MySQL服务运行
sc query MySQL80

# 2. 创建数据库
mysql -u root -p < database/schema.sql

# 3. 配置环境变量
cp .env.example .env
# 编辑.env，设置数据库密码和JWT密钥

# 4. 安装依赖
npm install

# 5. 启动服务器
node server.js
```

**API接口**:

**公开接口**:
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/posts` - 获取文章列表（分页）
- `GET /api/posts/:id` - 获取文章详情
- `GET /api/posts/:id/comments` - 获取文章评论

**需要认证的接口**（需要JWT token）:
- `GET /api/users/profile` - 获取个人信息
- `PUT /api/users/profile` - 更新个人信息
- `POST /api/posts` - 发表文章
- `PUT /api/posts/:id` - 编辑文章
- `DELETE /api/posts/:id` - 删除文章
- `POST /api/posts/:id/comments` - 发表评论
- `DELETE /api/comments/:id` - 删除评论

**数据库设计**:
```
users (用户表)
  ├─ id, username, password, email
  ├─ nickname, avatar, bio
  └─ created_at, updated_at

posts (文章表)
  ├─ id, title, content, cover_image
  ├─ author_id (外键→users.id)
  ├─ view_count, status (draft/published)
  └─ created_at, updated_at

comments (评论表)
  ├─ id, post_id (外键→posts.id)
  ├─ user_id (外键→users.id)
  └─ content, created_at

uploads (文件上传表)
  ├─ id, filename, stored_name
  ├─ file_path, file_size, mime_type
  └─ uploader_id (外键→users.id)
```

**安全特性**:
- 🔐 JWT认证（无状态token）
- 🔐 bcrypt密码加密（Salt Rounds: 10）
- 🛡️ SQL参数化查询（防注入）
- 🛡️ 权限验证（作者身份检查）
- 🚦 速率限制（防暴力破解）
- 🛡️ Helmet安全头（7个）
- 🛡️ CORS白名单
- 🔍 数据脱敏（不返回password）

**代码质量**:
- ⭐⭐⭐⭐⭐ 生产级别
- 完整的错误处理
- SQL联表查询（LEFT JOIN）
- 分页查询（LIMIT、OFFSET）
- 动态SQL构建
- 边界检查（404、403）
- 清晰的代码注释

**学习成果**:
- ✅ 掌握JWT认证完整流程
- ✅ 掌握MySQL联表查询
- ✅ 掌握动态SQL构建
- ✅ 掌握权限验证模式
- ✅ 理解RESTful API设计
- ✅ 掌握生产级代码规范

**解决的Bug（7个）**:
1. authController: 变量命名一致性
2. postController: 返回空列表、返回错误的ID、动态SQL逻辑错误
3. app.js: morgan日志配置（GET请求body为undefined）
4. userController: 数组判断错误、email检查逻辑、返回值错误、数据检查逻辑

**项目完成度**: 95%（核心功能100%，文件上传功能未实现）

---

## 🎯 项目技能映射

### Express框架 (D领域)
- ✅ 基础路由 [01, 02, 05]
- ✅ 模块化路由 [03]
- ✅ 中间件机制 [05]
- ✅ 静态资源服务 [02]
- ✅ 错误处理 [05, 08]

### 数据库 (E领域)
- ✅ MySQL连接 [07, 08]
- ✅ CRUD操作 [07]
- ✅ 连接池配置 [07, 08]
- ✅ 参数化查询 [07, 08]

### 认证与安全 (F领域)
- ✅ 参数验证 [06, 08]
- ✅ 密码加密 [08]
- ✅ CORS跨域 [06, 08]
- ✅ 文件上传安全 [06, 08]

---

## 📈 项目复杂度演进

```
Level 1: Express基础
├─ 01-express-demo
└─ 02-static-server

Level 2: 模块化与中间件
├─ 03-modular-routes
└─ 05-express-middleware

Level 3: 功能增强
├─ 06-validator-upload (参数验证+文件上传)
└─ 07-mysql-crud (数据库CRUD)

Level 4: 综合实战
└─ 08-user-register-complete (完整用户系统)
```

---

## 🔍 快速查找

### 按技术查找
- **Express**: 所有项目
- **mysql2**: [07-mysql-crud](#07-mysql-crud), [08-user-register-complete](#08-user-register-complete)
- **express-validator**: [06-validator-upload](#06-validator-upload), [08-user-register-complete](#08-user-register-complete)
- **Multer**: [06-validator-upload](#06-validator-upload), [08-user-register-complete](#08-user-register-complete)
- **bcrypt**: [08-user-register-complete](#08-user-register-complete)
- **CORS**: [06-validator-upload](#06-validator-upload), [08-user-register-complete](#08-user-register-complete)

### 按功能查找
- **用户注册**: [08-user-register-complete](#08-user-register-complete)
- **文件上传**: [06-validator-upload](#06-validator-upload), [08-user-register-complete](#08-user-register-complete)
- **数据库操作**: [07-mysql-crud](#07-mysql-crud), [08-user-register-complete](#08-user-register-complete)
- **参数验证**: [06-validator-upload](#06-validator-upload), [08-user-register-complete](#08-user-register-complete)

---

## 📝 待创建的项目

- [ ] 09-jwt-login - JWT登录认证
- [ ] 10-blog-api - 个人博客API
- [ ] 11-movie-manager - 电影管理系统（完整CRUD）

---

**最后更新**: 2026-03-23
**总项目数**: 10
**维护者**: AI导师自动更新
