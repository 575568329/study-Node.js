const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Comment = sequelize.define('Comment',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    field:'user_id'
  },
  movieId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    field:'movie_id'
  },
  content:{
    type:DataTypes.TEXT,
    allowNull:false
  },
  score:{
    type:DataTypes.DECIMAL(2,1),
  }
},{
  tableName:'comment',
  timestamps:true,
  createdAt:'created_at',
  updatedAt:'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Comment;