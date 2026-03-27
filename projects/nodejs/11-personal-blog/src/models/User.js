// =============================================
// User模型 - 用户表
// =============================================
const { DataTypes } = require('sequelize');
const { sequelize }  = require('../config/sequelize');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: '密码(bcrypt加密)'
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: '邮箱'
  },
  nickname: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
    comment: '昵称'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: '头像URL'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: null,
    comment: '个人简介'
  }
}, {
  tableName: 'users',           // 指定表名
  timestamps: true,             // 自动管理created_at和updated_at
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = User;
