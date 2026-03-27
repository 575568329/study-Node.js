/**
 * 用户认证路由
 * 功能：注册、登录、获取个人信息
 */

import express from 'express';
import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { pool } from './db.js';
import { generateAccessToken, generateRefreshToken, verifyToken } from './jwtUtils.js';
import { authMiddleware } from './authMiddleware.js';

const router = express.Router();

/**
 * 📝 用户注册
 * POST /api/auth/register
 * Body: { username, email, password }
 */
router.post('/register', [
  // 参数验证
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('email').trim().isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码至少6位')
], async (req, res) => {
  // 1️⃣ 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }

  // 2️⃣ 获取参数
  const { username, email, password } = req.body;

  try {
    // 3️⃣ 检查用户名是否已存在
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 3️⃣-2 检查邮箱是否已存在
    const [existingEmails] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingEmails.length > 0) {
      return res.status(400).json({
        success: false,
        message: '邮箱已被注册'
      });
    }

    // 4️⃣ 加密密码（单向哈希）
    const saltRounds = 10; // 加密强度（10-12为宜）
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5️⃣ 插入数据库（包含email字段）
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    console.log('✅ 用户注册成功：', username, email);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        userId: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    console.error('❌ 注册失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 🔐 用户登录（生成Access Token + Refresh Token）
 * POST /api/auth/login
 * Body: { username, password }
 */
router.post('/login', [
  body('username').trim().notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], async (req, res) => {
  // 1️⃣ 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }

  // 2️⃣ 获取参数
  const { username, password } = req.body;

  try {
    // 3️⃣ 查询用户
    const [users] = await pool.query(
      'SELECT id, username, password FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 4️⃣ 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 5️⃣ 生成Access Token（15分钟）和Refresh Token（7天）⭐
    const accessToken = generateAccessToken({
      userId: user.id,
      username: user.username
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      username: user.username
    });

    console.log('✅ 用户登录成功：', username);

    // 6️⃣ 返回两个token
    res.json({
      success: true,
      message: '登录成功',
      data: {
        accessToken, // ⏰ 15分钟过期
        refreshToken, // 📅 7天过期
        user: {
          userId: user.id,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('❌ 登录失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 👤 获取个人信息（需要认证）
 * GET /api/auth/profile
 * Headers: Authorization: Bearer <token>
 */
router.get('/profile', authMiddleware, async (req, res) => {
  // authMiddleware已经验证了token，并将用户信息挂在req.user上
  const { userId, username } = req.user;

  try {
    // 从数据库获取完整用户信息（不包含密码，包含email）
    const [users] = await pool.query(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      message: '获取成功',
      data: users[0]
    });
  } catch (error) {
    console.error('❌ 获取用户信息失败：', error);
    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

/**
 * 🔄 刷新Access Token
 * POST /api/auth/refresh-token
 * Body: { refreshToken }
 */
router.post('/refresh-token', [
  body('refreshToken').notEmpty().withMessage('Refresh Token不能为空')
], async (req, res) => {
  // 1️⃣ 检查验证结果
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }

  // 2️⃣ 获取refreshToken
  const { refreshToken } = req.body;

  try {
    // 3️⃣ 验证refreshToken ⭐ 使用verifyToken
    const decoded = verifyToken(refreshToken);

    // 4️⃣ 生成新的accessToken
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      username: decoded.username
    });

    console.log('✅ Token刷新成功：', decoded.username);

    res.json({
      success: true,
      message: '刷新成功',
      data: {
        accessToken: newAccessToken // ⏰ 新的Access Token（15分钟）
      }
    });
  } catch (error) {
    // Token无效或过期
    console.error('❌ Refresh Token无效：', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh Token已过期，请重新登录'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Refresh Token无效'
      });
    }

    res.status(500).json({
      success: false,
      message: '服务器错误'
    });
  }
});

export default router;
