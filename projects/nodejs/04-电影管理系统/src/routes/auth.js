const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', [
  body('account').trim().notEmpty().withMessage('账号不能为空')
    .isLength({ min: 3, max: 20 }).withMessage('账号长度3-20个字符'),
  body('password').notEmpty().withMessage('密码不能为空')
    .isLength({ min: 6 }).withMessage('密码至少6个字符'),
  body('name').optional().trim()
], authController.register);

// POST /api/auth/login
router.post('/login', [
  body('account').trim().notEmpty().withMessage('账号不能为空'),
  body('password').notEmpty().withMessage('密码不能为空')
], authController.login);

// GET /api/auth/profile（需要登录）
router.get('/profile', auth, authController.getProfile);

module.exports = router;
