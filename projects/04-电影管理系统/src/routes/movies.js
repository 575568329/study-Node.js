const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const movieController = require('../controllers/movieController');
const auth = require('../middleware/auth');

// GET /api/movies
router.get('/', movieController.getMovies);

// GET /api/movies/:id
router.get('/:id', [
  param('id').isInt().withMessage('电影ID必须是整数')
], movieController.getMovieById);

// POST /api/movies（需要登录）
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('电影名称不能为空'),
  body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('评分范围0-10'),
  body('duration').optional().isInt({ min: 1 }).withMessage('时长必须大于0'),
  body('directorIds').optional().isArray().withMessage('导演ID必须是数组'),
  body('actorIds').optional().isArray().withMessage('演员ID必须是数组')
], movieController.createMovie);

// PUT /api/movies/:id（需要登录）
router.put('/:id', auth, [
  param('id').isInt().withMessage('电影ID必须是整数'),
  body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('评分范围0-10')
], movieController.updateMovie);

// DELETE /api/movies/:id（需要登录）
router.delete('/:id', auth, [
  param('id').isInt().withMessage('电影ID必须是整数')
], movieController.deleteMovie);

module.exports = router;
