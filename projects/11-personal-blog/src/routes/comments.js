// =============================================
// 评论路由 - 评论管理
// =============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/auth');
const {
  getCommentsByPostId,
  createComment,
  deleteComment
} = require('../controllers/commentController');

/**
 * 获取文章的所有评论（公开接口）
 * GET /api/posts/:id/comments
 */
router.get(
  '/posts/:id/comments',
  asyncHandler(getCommentsByPostId)
);

/**
 * 发表评论（需要认证）
 * POST /api/posts/:id/comments
 * Body: { content }
 */
router.post(
  '/posts/:id/comments',
  authMiddleware, // 🔒 需要JWT认证
  [
    body('content')
      .trim()
      .notEmpty().withMessage('评论内容不能为空')
      .isLength({ max: 1000 }).withMessage('评论最多1000字符')
  ],
  asyncHandler(createComment)
);

/**
 * 删除评论（需要认证）
 * DELETE /api/comments/:id
 */
router.delete(
  '/comments/:id',
  authMiddleware, // 🔒 需要JWT认证
  asyncHandler(deleteComment)
);

module.exports = router;
