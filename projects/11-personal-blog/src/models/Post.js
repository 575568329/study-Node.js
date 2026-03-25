/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-25 14:37:47
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-25 16:31:41
 * @FilePath: \Node.js-Study\projects\11-personal-blog\src\models\Post.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// =============================================
// Post模型 - 文章表
// =============================================
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: '文章标题'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '文章内容(Markdown)'
  },
  coverImage: {
    type: DataTypes.STRING(255),
    field: 'cover_image',      // 映射到数据库字段名（蛇形命名）
    allowNull: true,
    defaultValue: null,
    comment: '封面图URL'
  },
  authorId: {
    type: DataTypes.INTEGER,
    field: 'author_id',        // 映射到数据库字段名
    allowNull: false,
    comment: '作者ID'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    field: 'view_count',       // 映射到数据库字段名
    defaultValue: 0,
    comment: '浏览次数'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published'),
    defaultValue: 'draft',
    comment: '状态: 草稿/已发布'
  }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Post;
