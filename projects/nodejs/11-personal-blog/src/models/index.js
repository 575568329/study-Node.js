// =============================================
// 模型关联关系定义
// =============================================
const sequelize = require('../config/sequelize');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// =============================================
// 定义关联关系
// =============================================

// 1. User ↔ Post（一对多）
// User.hasMany(Post): 一个用户有多篇文章
// Post.belongsTo(User): 一篇文章属于一个用户
User.hasMany(Post, {
  foreignKey: 'authorId',
  as: 'posts',                // 查询时用 user.posts
  onDelete: 'CASCADE'         // 用户删除时，级联删除文章
});

Post.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',               // 查询时用 post.author
  onDelete: 'CASCADE'
});

// 2. User ↔ Comment（一对多）
// User.hasMany(Comment): 一个用户有多条评论
// Comment.belongsTo(User): 一条评论属于一个用户
User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',             // 查询时用 user.comments
  onDelete: 'CASCADE'         // 用户删除时，级联删除评论
});

Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',                 // 查询时用 comment.user
  onDelete: 'CASCADE'
});

// 3. Post ↔ Comment（一对多）
// Post.hasMany(Comment): 一篇文章有多条评论
// Comment.belongsTo(Post): 一条评论属于一篇文章
Post.hasMany(Comment, {
  foreignKey: 'postId',
  as: 'comments',             // 查询时用 post.comments
  onDelete: 'CASCADE'         // 文章删除时，级联删除评论
});

Comment.belongsTo(Post, {
  foreignKey: 'postId',
  as: 'post',                 // 查询时用 comment.post
  onDelete: 'CASCADE'
});

// =============================================
// 导出模型和sequelize实例
// =============================================
module.exports = {
  sequelize,
  User,
  Post,
  Comment
};
