# 个人博客 API 设计文档

## 📋 API路由结构

### 公开接口（无需认证）
```
POST   /api/auth/register       - 用户注册
POST   /api/auth/login          - 用户登录
GET    /api/posts               - 获取文章列表（分页）
GET    /api/posts/:id           - 获取文章详情
GET    /api/posts/:id/comments  - 获取文章评论
```

### 需要认证的接口（需要JWT Token）
```
# 用户模块
GET    /api/users/profile       - 获取个人信息
PUT    /api/users/profile       - 更新个人信息
POST   /api/users/avatar        - 上传头像

# 文章模块
POST   /api/posts               - 发表文章
PUT    /api/posts/:id           - 编辑文章
DELETE /api/posts/:id           - 删除文章
POST   /api/posts/:id/publish   - 发布文章

# 评论模块
POST   /api/posts/:id/comments  - 发表评论
DELETE /api/comments/:id        - 删除评论

# 文件模块
POST   /api/upload              - 上传文件（图片、文档）
```

---

## 🔐 认证方式

**JWT Token**：
- 登录成功返回：`{ accessToken, refreshToken }`
- 前端请求携带：`Authorization: Bearer <token>`
- Token过期自动刷新

---

## 📊 数据库表关系

```
users (用户)
  ├─ 1:N → posts (文章)
  ├─ 1:N → comments (评论)
  └─ 1:N → uploads (文件)

posts (文章)
  └─ 1:N → comments (评论)
```

---

## 🎯 实现优先级

### Phase 1: 基础功能（必须）
1. ✅ 用户注册/登录
2. ✅ 获取文章列表
3. ✅ 发表文章
4. ✅ 获取文章详情
5. ✅ 发表评论

### Phase 2: 管理功能（重要）
6. ✅ 编辑/删除文章
7. ✅ 删除评论
8. ✅ 更新个人信息

### Phase 3: 增强功能（可选）
9. ✅ 上传头像
10. ✅ 上传文件
11. ✅ 文章草稿功能
12. ✅ 浏览次数统计
