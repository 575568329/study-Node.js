// =============================================
// 认证控制器 - 用户注册、登录
// =============================================
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { token } = require('morgan');
require('dotenv').config();

/**
 * 用户注册
 * POST /api/auth/register
 * Body: { username, password, email }
 */
const register = async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    // TODO 1: 检查用户名是否已存在
    // 提示: SELECT * FROM users WHERE username = ?
    // 如果存在，返回400错误
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    // TODO 2: 检查邮箱是否已存在
    // 提示: SELECT * FROM users WHERE email = ?
    const [existingEmails] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    if (existingUsers.length>0||existingEmails.length>0) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }
    // TODO 3: 加密密码
    // 提示: await bcrypt.hash(password, 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);


    // TODO 4: 插入新用户
    // 提示: INSERT INTO users (username, password, email) VALUES (?, ?, ?)
    const [result] = await pool.query(
      'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email]
    )

    // TODO 5: 返回成功（不包含密码）
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 用户登录
 * POST /api/auth/login
 * Body: { username, password }
 */
const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // TODO 1: 查询用户
    // 提示: SELECT * FROM users WHERE username = ?
    // 如果用户不存在，返回401错误
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    )

    if (existingUsers.length == 0) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }
    // TODO 2: 验证密码
    // 提示: await bcrypt.compare(password, user.password)
    // 如果密码错误，返回401错误
    const isValidPassword = await bcrypt.compare(password, existingUsers[0].password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '密码错误'
      });
    }

    // TODO 3: 生成JWT Token
    // 提示: jwt.sign({ user_id: user.id }, secret, { expiresIn: '7d' })
    const token = jwt.sign({ user_id: existingUsers[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // TODO 4: 返回token和用户信息
    res.json({
      success: true,
      message: '登录成功',
      data: {
        accessToken: token,
        user: {
          id: existingUsers[0].id,
          username: existingUsers[0].username,
          email: existingUsers[0].email,
          nickname: existingUsers[0].nickname,
          avatar: existingUsers[0].avatar
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
