const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/sequelize');

const Person = sequelize.define('Person',{
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  name:{
    type:DataTypes.STRING(50),
    allowNull:false
  },
  age:{
    type:DataTypes.INTEGER
  },
  nationality:{
    type:DataTypes.STRING(50)
  },
  gender:{
    type:DataTypes.ENUM('male', 'female'),
    defaultValue:'male',
  }
},{
  tableName:'person',
  timestamps:true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci'
})

module.exports = Person;