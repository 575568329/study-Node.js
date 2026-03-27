# Express参数验证和文件上传学习项目

## 📚 学习目标

掌握两个重要的Express中间件：
1. **express-validator** - 参数验证（防止脏数据和攻击）
2. **multer** - 文件上传（处理multipart/form-data）

---

## 🚀 快速启动

### 1️⃣ 启动后端服务器

```bash
# 进入项目目录
cd d:\study\Node.js-Study\projects\06-validator-upload

# 启动后端（端口3002）
node server.js
```

**启动成功后你会看到**：
```
🚀 服务器运行在 http://localhost:3002

📝 中间件:
   - express-validator: 参数验证
   - multer: 文件上传
   - cors: 跨域支持
   - morgan: 日志记录

📚 测试API:
   POST /api/register          - 用户注册（参数验证）
   POST /api/upload/avatar     - 上传头像
   POST /api/register-with-avatar - 注册+上传头像
```

### 2️⃣ 启动前端服务器

**新开一个终端窗口**：

```bash
# 进入前端目录
cd d:\study\Node.js-Study\projects\06-validator-upload\frontend

# 启动前端（端口3000）
python -m http.server 3000
```

### 3️⃣ 打开浏览器测试

访问：`http://localhost:3000`

---

## 🧪 测试内容

### 测试1：参数验证（express-validator）

**测试场景**：
1. ✅ 输入正确的邮箱：`test@example.com`
2. ❌ 输入错误的邮箱：`abc` → 查看错误提示
3. ❌ 输入短密码：`123` → 查看错误提示
4. ❌ 输入弱密码：`abcdef` → 提示"必须包含字母和数字"
5. ❌ 输入非法年龄：`150` → 提示"1-120之间"

**验证规则**：
- 用户名：3-20字符，只允许字母、数字、下划线
- 邮箱：必须是有效的邮箱格式
- 密码：6-20字符，必须包含字母和数字
- 年龄：可选，1-120之间
- 手机号：可选，中国大陆手机号

---

### 测试2：文件上传（multer）

**测试场景**：
1. ✅ 上传图片文件（jpg/png/gif）→ 成功上传
2. ❌ 上传非图片文件（txt/pdf/exe）→ 提示"只允许上传图片"
3. ❌ 上传超过5MB的图片 → 提示"文件大小超过限制"
4. ✅ 上传后在浏览器访问：`http://localhost:3002/uploads/文件名`

**上传规则**：
- 允许的格式：jpg, png, gif, webp
- 文件大小限制：最大5MB
- 存储位置：`./uploads/`目录
- 文件命名：`avatar-时间戳-随机数.扩展名`

---

### 测试3：注册 + 上传头像（综合）

**测试场景**：
1. 输入用户信息 + 选择头像 → 同时验证参数和上传文件
2. 只输入信息不上传头像 → 也能成功（头像可选）
3. 参数验证失败 → 不会上传文件

---

## 📂 项目结构

```
06-validator-upload/
├── backend/
│   ├── server.js          # Express服务器
│   ├── uploads/           # 上传文件存储目录（自动创建）
│   └── package.json       # 项目依赖
├── frontend/
│   └── index.html         # 测试页面
└── README.md              # 本文件
```

---

## 🔧 技术栈

### 后端
- Express.js 4.18.2
- express-validator 7.0.1
- multer 1.4.5
- cors 2.8.5
- morgan 1.10.0

### 前端
- 纯HTML + CSS + JavaScript（无框架）
- Fetch API进行HTTP请求
- FormData处理文件上传

---

## 📖 核心代码解析

### 1. express-validator 参数验证

```javascript
import { body, validationResult } from 'express-validator';

// 定义验证规则
app.post('/api/register', [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20字符')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字、下划线'),

  body('email')
    .trim()
    .isEmail().withMessage('邮箱格式不正确')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('密码至少6个字符')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('密码必须包含字母和数字'),
], (req, res) => {
  // 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array() // 返回详细错误信息
    });
  }

  // 验证通过，处理业务逻辑
  res.json({ success: true, message: '注册成功' });
});
```

---

### 2. multer 文件上传

```javascript
import multer from 'multer';

// 存储配置
const storage = multer.diskStorage({
  destination: 'uploads/', // 存储目录
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器：只允许图片
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // 接受文件
  } else {
    cb(new Error('只允许上传图片文件'), false); // 拒绝文件
  }
};

// Multer实例
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB限制
});

// 单文件上传路由
app.post('/upload', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '请选择文件' });
  }

  res.json({
    success: true,
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});
```

---

## 🎯 API接口

| 方法 | 路径 | Content-Type | 说明 |
|------|------|--------------|------|
| POST | `/api/register` | `application/json` | 用户注册（参数验证） |
| POST | `/api/upload/avatar` | `multipart/form-data` | 上传头像 |
| POST | `/api/register-with-avatar` | `multipart/form-data` | 注册+上传头像 |

---

## 📝 错误处理示例

### 参数验证失败
```json
{
  "success": false,
  "message": "参数验证失败",
  "errors": [
    {
      "type": "field",
      "value": "abc",
      "msg": "邮箱格式不正确",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### 文件上传失败
```json
{
  "success": false,
  "message": "只允许上传图片文件（jpg, png, gif, webp）"
}
```

### 文件大小超限
```json
{
  "success": false,
  "message": "文件大小超过限制（最大5MB）"
}
```

---

## ❓ 常见问题

### Q1: 参数验证失败时，前端如何显示具体错误？

**A**: 后端返回`errors`数组，包含每个字段的错误信息：

```javascript
errors.array().forEach(error => {
  console.log(`${error.path}: ${error.msg}`);
});
```

### Q2: 如何同时验证多个字段？

**A**: 使用数组验证规则：

```javascript
[
  body('username').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]
```

### Q3: 如何上传多个文件？

**A**: 使用`upload.array()`：

```javascript
app.post('/upload', upload.array('photos', 10), (req, res) => {
  // 最多上传10个文件
  console.log(req.files); // 文件数组
});
```

---

## 📚 学习笔记

**日期**：2026-03-17
**学习主题**：express-validator + multer
**掌握程度**：
- 参数验证：⭐⭐⭐⭐⭐
- 文件上传：⭐⭐⭐⭐⭐

**关键要点**：
1. ✅ 永远不要信任用户输入，必须验证
2. ✅ 不能只依赖前端验证，必须后端再次验证
3. ✅ 文件上传要限制类型、大小、数量
4. ✅ 使用express-validator提供友好的错误提示
5. ✅ multer处理文件上传，存储到磁盘或内存

---

**下一步学习**：继续Express其他内容或数据库连接
