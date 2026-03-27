const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// GET /api/comments/:movieId
router.get('/:movieId', [
  param('movieId').isInt().withMessage('电影ID必须是整数')
], commentController.getComments);

// POST /api/comments/:movieId（需要登录）
router.post('/:movieId', auth, [
  param('movieId').isInt().withMessage('电影ID必须是整数'),
  body('content').trim().notEmpty().withMessage('评论内容不能为空'),
  body('score').optional().isFloat({ min: 0, max: 10 }).withMessage('评分范围0-10')
], commentController.createComment);

// PUT /api/comments/:id（需要登录）
router.put('/:id', auth, [
  param('id').isInt().withMessage('评论ID必须是整数'),
  body('content').optional().trim().notEmpty().withMessage('评论内容不能为空'),
  body('score').optional().isFloat({ min: 0, max: 10 }).withMessage('评分范围0-10')
], commentController.updateComment);

// DELETE /api/comments/:id（需要登录）
router.delete('/:id', auth, [
  param('id').isInt().withMessage('评论ID必须是整数')
], commentController.deleteComment);

module.exports = router;
