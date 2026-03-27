const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const User = sequelize.define('User',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  account:{
    type:DataTypes.STRING(50),
    allowNull:false,
    unique:true,
    comment:'账号'
  },
  name:{
    type:DataTypes.STRING(50),
    allowNull:false,
    comment:'用户名'
  },
  password:{
    type:DataTypes.STRING(255),
    allowNull:false,
    comment:'密码'
  },
  gender:{
    type:DataTypes.ENUM('male','female'),
    defaultValue:'male',
    comment:'性别'
  },
  bio:{
    type:DataTypes.TEXT,
    allowNull:true,
    comment:'简介'
  },
},{
  tableName:'user',
  timestamps:true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = User;