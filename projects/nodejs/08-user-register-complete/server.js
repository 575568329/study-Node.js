// 完整用户注册系统
const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dbConfig = require('./db.config');

const app = express();
const PORT = 3004;

// ========== CORS 中间件 ==========
// 允许所有来源访问（开发环境）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

// 中间件
app.use(express.json());
app.use(express.static('public')); // 静态文件服务

// 创建MySQL连接池
const pool = mysql.createPool(dbConfig);

// ========== Multer 配置 ==========
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传图片文件（jpg, png, gif, webp）'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ========== 参数验证规则 ==========
const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('用户名不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20字符')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),

  body('email')
    .trim()
    .notEmpty().withMessage('邮箱不能为空')
    .isEmail().withMessage('邮箱格式不正确')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6 }).withMessage('密码最少6位')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('密码必须包含大小写字母和数字')
];

// ========== API 路由 ==========

// 测试连接
app.get('/api/test', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ success: true, message: '数据库连接成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '数据库连接失败', error: err.message });
  }
});

// 用户注册（完整版）
app.post('/api/register', upload.single('avatar'), registerValidation, async (req, res) => {
  
  
  let uploadedFile = null;

  try {
    // 1️⃣ 检查参数验证结果
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '参数验证失败',
        errors: errors.array()
      });
    }

    // 2️⃣ 获取请求数据
    const { username, email, password } = req.body;
    const avatarFilename = req.file ? req.file.filename : null;

    // 保存文件引用（用于错误清理）
    uploadedFile = req.file;

    // 3️⃣ 检查用户名是否已存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      // 删除已上传的文件
      if (uploadedFile) {
        fs.unlinkSync(uploadedFile.path);
      }
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    // 4️⃣ 加密密码
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5️⃣ 保存到数据库
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, avatar) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, avatarFilename]
    );

    // 6️⃣ 返回成功响应
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: result.insertId,
        username,
        email,
        avatar: avatarFilename
      }
    });

  } catch (err) {
    console.error('注册失败:', err);

    // 清理已上传的文件
    if (uploadedFile) {
      try {
        fs.unlinkSync(uploadedFile.path);
        console.log('已删除未使用的文件:', uploadedFile.filename);
      } catch (unlinkErr) {
        console.error('删除文件失败:', unlinkErr);
      }
    }

    // 判断错误类型
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }

    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试',
      error: err.message
    });
  }
});

// 查询所有用户
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, username, email, avatar, created_at FROM users'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: '查询失败', error: err.message });
  }
});

// 根据ID查询用户
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: '查询失败', error: err.message });
  }
});

// ========== 错误处理中间件 ==========

// Multer错误处理
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: '文件大小超过限制（最大5MB）'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: '文件数量超过限制'
      });
    }
    return res.status(400).json({
      success: false,
      message: '文件上传失败',
      error: err.message
    });
  }

  // 文件类型错误
  if (err.message.includes('只允许上传图片')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  next(err);
});

// 404处理
app.use((req, res) => {
  res.status(404).json({ success: false, message: '接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
});

// ========== 启动服务器 ==========
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 测试连接: http://localhost:${PORT}/api/test`);
  console.log(`👤 注册接口: POST http://localhost:${PORT}/api/register`);
  console.log(`📊 查询用户: GET http://localhost:${PORT}/api/users`);
});
