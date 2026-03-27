const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const MoviePerson = sequelize.define('MoviePerson',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    allowNull:false
  },
  movieId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    field:'movie_id'
  },
  personId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    field:'person_id'
  },
  role:{
    type:DataTypes.ENUM('director', 'actor'),
    allowNull:false,
    defaultValue:'actor'
  }
},{
  tableName:'movie_person',
  timestamps:true,
  createdAt:'created_at',
  updatedAt:'updated_at',
  charset:'utf8mb4',
  collate:'utf8mb4_unicode_ci'
})

module.exports = MoviePerson