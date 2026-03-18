import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import { body, validationResult, param } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002;

// ============================================
// 中间件配置
// ============================================
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 静态服务：提供上传的文件访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Multer文件上传配置
// ============================================

// 存储配置
const storage = multer.diskStorage({
  // 文件存储位置
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // 文件命名：字段名-时间戳-随机数.扩展名
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 文件过滤器：只允许图片
const fileFilter = (req, file, cb) => {
  // 允许的MIME类型
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // 接受文件
  } else {
    cb(new Error('只允许上传图片文件（jpg, png, gif, webp）'), false);
  }
};

// Multer实例配置
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制5MB
  }
});

// ============================================
// 路由：用户注册（参数验证）
// ============================================

app.post('/api/register', [
  // 验证规则
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20字符')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字、下划线'),

  body('email')
    .trim()
    .notEmpty().withMessage('邮箱不能为空')
    .isEmail().withMessage('邮箱格式不正确')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6, max: 20 }).withMessage('密码长度6-20字符')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/).withMessage('密码必须包含字母和数字'),

  body('age')
    .optional() // 可选字段
    .isInt({ min: 1, max: 120 }).withMessage('年龄必须是1-120之间的整数'),

  body('phone')
    .optional()
    .isMobilePhone('zh-CN').withMessage('手机号格式不正确')
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
  const { username, email, password, age, phone } = req.body;

  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
      username,
      email,
      age,
      phone,
      createdAt: new Date().toISOString()
    }
  });
});

// ============================================
// 路由：上传头像
// ============================================

// 单文件上传
app.post('/api/upload/avatar', upload.single('avatar'), (req, res) => {
  // 检查是否有文件
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '请选择要上传的文件'
    });
  }

  res.json({
    success: true,
    message: '文件上传成功',
    data: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `http://localhost:${PORT}/uploads/${req.file.filename}`
    }
  });
});

// ============================================
// 路由：用户注册 + 头像上传（综合）
// ============================================

app.post('/api/register-with-avatar',
  upload.single('avatar'), // 1️⃣ 先用 Multer 解析 FormData
  [
    // 2️⃣ 然后验证参数（此时 req.body 已被 Multer 解析）
    body('username')
      .trim()
      .notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20字符'),

    body('email')
      .trim()
      .isEmail().withMessage('邮箱格式不正确')
      .normalizeEmail(),

    body('password')
      .isLength({ min: 6 }).withMessage('密码至少6个字符')
  ],
  (req, res) => {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    // 检查验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    // 文件上传和参数验证都通过
    const { username, email } = req.body;
    const avatarUrl = req.file ? `http://localhost:${PORT}/uploads/${req.file.filename}` : null;

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        username,
        email,
        avatar: avatarUrl,
        createdAt: new Date().toISOString()
      }
    });
  }
);

// ============================================
// 错误处理中间件
// ============================================

// Multer错误处理
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer特定错误
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制（最大5MB）'
      });
    }
    return res.status(400).json({
      success: false,
      message: `文件上传错误: ${err.message}`
    });
  } else if (err) {
    // 其他错误（包括文件过滤器错误）
    return res.status(400).json({
      success: false,
      message: err.message || '服务器错误'
    });
  }
  next();
});

// 通用错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// ============================================
// 启动服务器
// ============================================

// 创建uploads目录（如果不存在）
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`\n🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`\n📝 中间件:`);
  console.log(`   - express-validator: 参数验证`);
  console.log(`   - multer: 文件上传`);
  console.log(`   - cors: 跨域支持`);
  console.log(`   - morgan: 日志记录`);
  console.log(`\n📚 测试API:`);
  console.log(`   POST /api/register          - 用户注册（参数验证）`);
  console.log(`   POST /api/upload/avatar     - 上传头像`);
  console.log(`   POST /api/register-with-avatar - 注册+上传头像`);
  console.log(`\n📁 上传文件存储位置: ./uploads/`);
  console.log(`\n⚠️  注意事项:`);
  console.log(`   - 只允许上传图片（jpg, png, gif, webp）`);
  console.log(`   - 文件大小限制5MB`);
  console.log(`   - 所有POST请求使用multipart/form-data格式\n`);
});
