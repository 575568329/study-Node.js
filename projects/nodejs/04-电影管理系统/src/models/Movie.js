/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-27 10:58:39
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-27 11:48:50
 * @FilePath: \Node.js-Study\projects\04-电影管理系统\src\models\Movie.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Movie = sequelize.define('Movie',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING(50),
    allowNull:false
  },
  company:{
    type:DataTypes.STRING(50)
  },
  releaseDate:{
    type:DataTypes.DATEONLY,
    field: 'release_date'
  },
  description:{
    type:DataTypes.TEXT
  },
  genre:{
    type:DataTypes.STRING(50)
  },
  rating:{
    type:DataTypes.DECIMAL(2,1)
  },
  duration:{
    type:DataTypes.INTEGER
  },
  cover:{
    type:DataTypes.STRING(200)
  }
},{
  tableName:'movie',
  timestamps:true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
});

module.exports = Movie;