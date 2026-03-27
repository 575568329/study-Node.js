const { Comment, Movie, User } = require('../models');
const { validationResult } = require('express-validator');

// 获取电影的评论列表
exports.getComments = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (page - 1) * pageSize;

    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ code: 404, message: '电影不存在' });
    }

    const { count, rows } = await Comment.findAndCountAll({
      where: { movieId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      offset: +offset,
      limit: +pageSize,
      order: [['created_at', 'DESC']]
    });

    res.json({ code: 200, data: { total: count, page: +page, pageSize: +pageSize, comments: rows } });
  } catch (error) {
    next(error);
  }
};

// 发表评论（需要登录）
exports.createComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { movieId } = req.params;
    const { content, score } = req.body;

    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ code: 404, message: '电影不存在' });
    }

    const comment = await Comment.create({
      userId: req.user.id,
      movieId: +movieId,
      content,
      score: score || null
    });

    res.status(201).json({
      code: 201,
      message: '评论成功',
      data: { id: comment.id, content: comment.content, score: comment.score, createdAt: comment.created_at }
    });
  } catch (error) {
    next(error);
  }
};

// 修改评论（只能修改自己的）
exports.updateComment = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { id } = req.params;
    const { content, score } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ code: 404, message: '评论不存在' });
    }

    // 权限验证
    if (comment.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权修改他人的评论' });
    }

    const updateFields = {};
    if (content !== undefined) updateFields.content = content;
    if (score !== undefined) updateFields.score = score;
    await comment.update(updateFields);

    res.json({ code: 200, message: '评论更新成功' });
  } catch (error) {
    next(error);
  }
};

// 删除评论（只能删除自己的）
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ code: 404, message: '评论不存在' });
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ code: 403, message: '无权删除他人的评论' });
    }

    await comment.destroy();
    res.json({ code: 200, message: '评论删除成功' });
  } catch (error) {
    next(error);
  }
};
