// =============================================
// 文章路由 - 文章管理
// =============================================
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const authMiddleware = require('../middleware/auth');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

/**
 * 获取文章列表（公开接口）
 * GET /api/posts
 * Query: ?page=1&pageSize=10
 */
router.get('/', asyncHandler(getPosts));

/**
 * 获取文章详情（公开接口）
 * GET /api/posts/:id
 */
router.get('/:id', asyncHandler(getPostById));

/**
 * 发表文章（需要认证）
 * POST /api/posts
 * Body: { title, content, coverImage?, status? }
 */
router.post(
  '/',
  authMiddleware, // 🔒 需要JWT认证
  [
    body('title')
      .trim()
      .notEmpty().withMessage('标题不能为空')
      .isLength({ max: 200 }).withMessage('标题最多200字符'),
    body('content')
      .trim()
      .notEmpty().withMessage('内容不能为空')
  ],
  asyncHandler(createPost)
);

/**
 * 编辑文章（需要认证）
 * PUT /api/posts/:id
 * Body: { title?, content?, coverImage?, status? }
 */
router.put(
  '/:id',
  authMiddleware, // 🔒 需要JWT认证
  asyncHandler(updatePost)
);

/**
 * 删除文章（需要认证）
 * DELETE /api/posts/:id
 */
router.delete(
  '/:id',
  authMiddleware, // 🔒 需要JWT认证
  asyncHandler(deletePost)
);

module.exports = router;
