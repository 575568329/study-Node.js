const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const personController = require('../controllers/personController');
const auth = require('../middleware/auth');

// GET /api/persons
router.get('/', personController.getPersons);

// GET /api/persons/:id
router.get('/:id', [
  param('id').isInt().withMessage('人员ID必须是整数')
], personController.getPersonById);

// POST /api/persons（需要登录）
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('姓名不能为空'),
  body('age').optional().isInt({ min: 1 }).withMessage('年龄必须大于0')
], personController.createPerson);

// PUT /api/persons/:id（需要登录）
router.put('/:id', auth, [
  param('id').isInt().withMessage('人员ID必须是整数'),
  body('name').optional().trim().notEmpty().withMessage('姓名不能为空')
], personController.updatePerson);

// DELETE /api/persons/:id（需要登录）
router.delete('/:id', auth, [
  param('id').isInt().withMessage('人员ID必须是整数')
], personController.deletePerson);

module.exports = router;
