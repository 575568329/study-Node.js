/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-23 17:00:27
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-23 17:41:02
 * @FilePath: \Node.js-Study\projects\11-personal-blog\src\controllers\userController.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// =============================================
// 用户控制器 - 个人中心
// =============================================
const { pool } = require('../config/database');

/**
 * 获取个人信息
 * GET /api/users/profile
 * 需要JWT认证
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id; // 从JWT中间件获取

    // TODO 1: 查询用户信息（排除password字段）
    // 提示: SELECT id, username, email, nickname, avatar, bio, created_at
    //       FROM users WHERE id = ?
    const [user] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, created_at FROM users WHERE id = ?',
      [userId]
    );

    // 检查用户是否存在
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // TODO 2: 返回用户信息
    res.json({
      success: true,
      data: user[0]  // ✅ 返回第一个用户对象
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 更新个人信息
 * PUT /api/users/profile
 * Body: { nickname?, bio?, email? }
 * 需要JWT认证
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { nickname, bio, email } = req.body;

    // 构建更新SQL（只更新提供的字段）
    const updateFields = [];
    const updateValues = [];

    // 检查email是否被其他用户使用
    if (email !== undefined) {
      const [user] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      if (user.length > 0 && user[0].id !== userId) {
        return res.status(400).json({
          success: false,
          message: '邮箱已被其他用户使用'
        });
      }
    }

    // 使用 !== undefined 检查字段是否提供
    if (nickname !== undefined) {
      updateFields.push('nickname = ?');
      updateValues.push(nickname);
    }
    if (bio !== undefined) {
      updateFields.push('bio = ?');
      updateValues.push(bio);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    // 检查是否有字段需要更新
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有提供需要更新的字段'
      });
    }

    const updateSql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    updateValues.push(userId);

    // 执行更新
    await pool.query(updateSql, updateValues);

    // 查询并返回更新后的用户信息
    const [updatedUser] = await pool.query(
      'SELECT id, username, email, nickname, avatar, bio, created_at FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: '个人信息更新成功',
      data: updatedUser[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
