// =============================================
// 认证路由 - 注册、登录
// =============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const { register, login } = require('../controllers/authController');

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post(
  '/register',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 3, max: 20 }).withMessage('用户名长度3-20字符'),
    body('password')
      .trim()
      .notEmpty().withMessage('密码不能为空')
      .isLength({ min: 6 }).withMessage('密码至少6位'),
    body('email')
      .trim()
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('邮箱格式不正确')
  ],
  asyncHandler(register)
);

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('用户名不能为空'),
    body('password')
      .trim()
      .notEmpty().withMessage('密码不能为空')
  ],
  asyncHandler(login)
);

module.exports = router;
