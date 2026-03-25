// =============================================
// Comment模型 - 评论表
// =============================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  postId: {
    type: DataTypes.INTEGER,
    field: 'post_id',          // 映射到数据库字段名
    allowNull: false,
    comment: '文章ID'
  },
  userId: {
    type: DataTypes.INTEGER,
    field: 'user_id',          // 映射到数据库字段名
    allowNull: false,
    comment: '评论者ID'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容'
  }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,            // 评论表不需要updated_at字段
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Comment;
