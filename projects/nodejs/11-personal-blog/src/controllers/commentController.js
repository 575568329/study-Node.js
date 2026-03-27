// =============================================
// 评论控制器 - 评论管理
// =============================================
const { pool } = require('../config/database');

/**
 * 获取文章的所有评论
 * GET /api/posts/:id/comments
 */
const getCommentsByPostId = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO 1: 查询文章的所有评论（联表查询评论者信息）
    // 提示: SELECT c.*, u.username, u.nickname, u.avatar
    //       FROM comments c
    //       LEFT JOIN users u ON c.user_id = u.id
    //       WHERE c.post_id = ?
    //       ORDER BY c.created_at DESC
    const [comments] = await pool.query(
      'SELECT c.*, u.username, u.nickname, u.avatar FROM comments c LEFT JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at DESC',
      [id]
    );

    // TODO 2: 返回评论列表
    res.json({
      success: true,
      data: {
        comments: comments // TODO: 填充评论列表
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 发表评论
 * POST /api/posts/:id/comments
 * Body: { content }
 * 需要JWT认证
 */
const createComment = async (req, res, next) => {
  try {
    const { id } = req.params; // 文章ID
    const { content } = req.body;
    const userId = req.user.user_id; // 从JWT中间件获取

    // TODO 1: 参数验证
    // 提示: 检查content是否为空
    if (!content) return res.status(400).json({
      success: false,
      message: 'content不能为空'
    });

    // TODO 2: 检查文章是否存在
    // 提示: SELECT * FROM posts WHERE id = ?
    const [posts] = await pool.query(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    );
    if (posts.length == 0) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // TODO 3: 插入评论
    // 提示: INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)
    const [result] = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
      [id, userId, content]
    );

    // TODO 4: 返回新评论
    res.status(201).json({
      success: true,
      message: '评论发表成功',
      data: {
        id: result.insertId, // TODO: result.insertId
        content,
        postId: id
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除评论
 * DELETE /api/comments/:id
 * 需要JWT认证
 */
const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id; // 从JWT中间件获取

    // TODO 1: 查询评论
    // 提示: SELECT * FROM comments WHERE id = ?
    const [comments] = await pool.query(
      'SELECT * FROM comments WHERE id = ?',
      [id]
    );

    // 检查评论是否存在
    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: '评论不存在'
      });
    }

    // TODO 2: 验证是否是评论者
    // 提示: if (comment.user_id !== userId) return 403
    if (comments[0].user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权限删除此评论'
      });
    }

    // TODO 3: 删除评论
    // 提示: DELETE FROM comments WHERE id = ?

    await pool.query(
      'DELETE FROM comments WHERE id = ?',
      [id]
    );
    // TODO 4: 返回成功
    res.json({
      success: true,
      message: '评论删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  deleteComment
};
