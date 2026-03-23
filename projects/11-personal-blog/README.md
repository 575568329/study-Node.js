# 个人博客后端API

完整的个人博客后端系统，支持用户认证、文章管理、评论系统、文件上传。

## 📋 功能特性

- ✅ 用户注册/登录（JWT认证）
- ✅ 文章发布/编辑/删除
- ✅ 评论系统
- ✅ 文件上传（头像、文章配图）
- ✅ 安全防护（速率限制、密码加密、XSS/CSRF防护）

## 🛠️ 技术栈

- **框架**: Express.js
- **数据库**: MySQL 8.0
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcrypt
- **文件上传**: Multer
- **参数验证**: express-validator
- **安全**: helmet, express-rate-limit, cors

## 📦 安装步骤

### 1. 安装依赖
```bash
cd 11-personal-blog
npm install
```

### 2. 配置数据库

**创建数据库并导入表结构**：
```bash
mysql -u root -p < database/schema.sql
```

**或手动执行**：
```bash
mysql -u root -p
```
```sql
source database/schema.sql
```

### 3. 配置环境变量

编辑 `.env` 文件，填写数据库密码：
```env
DB_PASSWORD=你的MySQL密码
JWT_SECRET=修改为随机字符串（至少32位）
```

### 4. 启动服务器
```bash
node server.js
```

服务器运行在: `http://localhost:3000`

## 📚 API接口

### 公开接口（无需认证）

#### 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456",
  "email": "test@example.com"
}
```

#### 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

响应示例：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    }
  }
}
```

### 需要认证的接口

所有需要认证的接口都在请求头携带Token：
```http
Authorization: Bearer <your_access_token>
```

**示例**：
```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ 数据库表结构

### users (用户表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| username | VARCHAR(50) | 用户名（唯一） |
| password | VARCHAR(255) | 密码（bcrypt加密） |
| email | VARCHAR(100) | 邮箱（唯一） |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(255) | 头像URL |
| bio | TEXT | 个人简介 |

### posts (文章表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| title | VARCHAR(200) | 文章标题 |
| content | TEXT | 文章内容（Markdown） |
| cover_image | VARCHAR(255) | 封面图URL |
| author_id | INT | 作者ID（外键） |
| view_count | INT | 浏览次数 |
| status | ENUM | 状态（draft/published） |

### comments (评论表)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| post_id | INT | 文章ID（外键） |
| user_id | INT | 评论者ID（外键） |
| content | TEXT | 评论内容 |

## 🧪 测试API

### 使用curl测试
```bash
# 注册用户
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456","email":"test@example.com"}'

# 登录
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

### 使用Postman测试

1. 导入API集合（可选）
2. 设置环境变量：
   - `base_url`: `http://localhost:3000`
   - `token`: 登录后获取的accessToken

## 🔒 安全特性

- ✅ JWT认证（无状态token）
- ✅ bcrypt密码加密（Salt Rounds: 10）
- ✅ 速率限制（防止暴力破解）
- ✅ 参数验证（express-validator）
- ✅ Helmet安全头
- ✅ CORS白名单
- ✅ SQL注入防护（参数化查询）
- ✅ XSS防护（数据脱敏）

## 📁 项目结构

```
11-personal-blog/
├── src/
│   ├── config/
│   │   └── database.js          # 数据库配置
│   ├── middleware/
│   │   ├── auth.js              # JWT认证中间件
│   │   └── error.js             # 错误处理中间件
│   ├── routes/
│   │   ├── auth.js              # 认证路由
│   │   ├── users.js             # 用户路由
│   │   ├── posts.js             # 文章路由
│   │   └── comments.js          # 评论路由
│   ├── controllers/
│   │   ├── authController.js    # 认证控制器
│   │   ├── userController.js    # 用户控制器
│   │   ├── postController.js    # 文章控制器
│   │   └── commentController.js # 评论控制器
│   ├── utils/
│   │   └── asyncHandler.js      # 异步错误处理
│   └── app.js                   # Express应用配置
├── database/
│   └── schema.sql               # 数据库表结构
├── uploads/                     # 上传文件目录
├── logs/                        # 日志目录
├── .env                         # 环境变量
├── .env.example                 # 环境变量示例
├── server.js                    # 入口文件
├── package.json                 # 项目配置
└── README.md                    # 项目说明
```

## 🚀 待实现功能

- [ ] 文章模块（posts）
- [ ] 评论模块（comments）
- [ ] 用户中心（users）
- [ ] 文件上传（upload）
- [ ] Token刷新机制

## 📝 学习笔记

这是一个学习项目，重点练习：
1. JWT认证系统
2. RESTful API设计
3. MySQL数据库操作
4. Express中间件机制
5. 安全最佳实践

## 📄 许可证

MIT
