// =============================================
// 用户路由 - 个人中心
// =============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/auth');
const { getProfile, updateProfile } = require('../controllers/userController');

/**
 * 获取个人信息（需要认证）
 * GET /api/users/profile
 */
router.get(
  '/profile',
  authMiddleware, // 🔒 需要JWT认证
  asyncHandler(getProfile)
);

/**
 * 更新个人信息（需要认证）
 * PUT /api/users/profile
 * Body: { nickname?, bio?, email? }
 */
router.put(
  '/profile',
  authMiddleware, // 🔒 需要JWT认证
  [
    body('email').optional().isEmail().withMessage('邮箱格式不正确'),
    body('nickname').optional().isLength({ max: 50 }).withMessage('昵称最多50字符')
  ],
  asyncHandler(updateProfile)
);

module.exports = router;
