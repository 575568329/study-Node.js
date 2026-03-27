const sequelize = require('../config/sequelize');
const User = require('./User');
const Comment = require('./Comment');
const Movie = require('./Movie');
const MoviePerson = require('./MoviePerson');
const Person = require('./Person');

// User一对多Comment
User.hasMany(Comment, {
  foreignKey: 'userId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE'
});

// 电影一对多评论
Movie.hasMany(Comment, {
  foreignKey: 'movieId',
  as: 'comments',
  onDelete: 'CASCADE'
});
Comment.belongsTo(Movie, {
  foreignKey: 'movieId',
  as: 'movie',
  onDelete: 'CASCADE'
});

// 电影多对多人员（通过中间表）
Movie.hasMany(MoviePerson, {
  foreignKey: 'movieId',
  as: 'moviePerson',
  onDelete: 'CASCADE'
});
MoviePerson.belongsTo(Movie, {
  foreignKey: 'movieId',
  as: 'movie',
  onDelete: 'CASCADE'
});

Person.hasMany(MoviePerson, {
  foreignKey: 'personId',
  as: 'moviePerson',
  onDelete: 'CASCADE'
});
MoviePerson.belongsTo(Person, {
  foreignKey: 'personId',
  as: 'person',
  onDelete: 'CASCADE'
});

module.exports = {
  User,
  Comment,
  Movie,
  MoviePerson,
  Person,
  sequelize
};
