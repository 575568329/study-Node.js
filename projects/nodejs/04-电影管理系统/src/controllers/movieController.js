const { Op } = require('sequelize');
const { Movie, MoviePerson, Person, Comment, User } = require('../models');
const { validationResult } = require('express-validator');

// 获取电影列表（分页+搜索+类型筛选）
exports.getMovies = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword, genre } = req.query;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }
    if (genre) {
      where.genre = { [Op.like]: `%${genre}%` };
    }

    const { count, rows } = await Movie.findAndCountAll({
      where,
      offset: +offset,
      limit: +pageSize,
      order: [['created_at', 'DESC']],
      attributes: { exclude: ['description'] }
    });

    res.json({ code: 200, data: { total: count, page: +page, pageSize: +pageSize, movies: rows } });
  } catch (error) {
    next(error);
  }
};

// 获取电影详情
exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ code: 404, message: '电影不存在' });
    }

    // 查导演
    const directors = await MoviePerson.findAll({
      where: { movieId: id, role: 'director' },
      include: [{ model: Person, as: 'person', attributes: ['id', 'name', 'nationality'] }]
    });

    // 查演员
    const actors = await MoviePerson.findAll({
      where: { movieId: id, role: 'actor' },
      include: [{ model: Person, as: 'person', attributes: ['id', 'name', 'nationality'] }]
    });

    // 查评论（最近5条）
    const comments = await Comment.findAll({
      where: { movieId: id },
      include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
      order: [['created_at', 'DESC']],
      limit: 5,
      attributes: ['id', 'content', 'score', 'created_at']
    });

    res.json({
      code: 200,
      data: {
        ...movie.toJSON(),
        directors: directors.map(mp => mp.person),
        actors: actors.map(mp => mp.person),
        comments
      }
    });
  } catch (error) {
    next(error);
  }
};

// 创建电影
exports.createMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { name, releaseDate, company, description, genre, rating, duration, cover, directorIds, actorIds } = req.body;

    // 创建电影
    const movie = await Movie.create({
      name,
      releaseDate: releaseDate || null,
      company: company || null,
      description: description || null,
      genre: genre || null,
      rating: rating || null,
      duration: duration || null,
      cover: cover || null
    });

    // 关联导演
    if (directorIds && directorIds.length > 0) {
      await MoviePerson.bulkCreate(
        directorIds.map(personId => ({ movieId: movie.id, personId, role: 'director' }))
      );
    }

    // 关联演员
    if (actorIds && actorIds.length > 0) {
      await MoviePerson.bulkCreate(
        actorIds.map(personId => ({ movieId: movie.id, personId, role: 'actor' }))
      );
    }

    res.status(201).json({ code: 201, message: '电影创建成功', data: { id: movie.id, name: movie.name } });
  } catch (error) {
    next(error);
  }
};

// 更新电影
exports.updateMovie = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { id } = req.params;
    const { name, releaseDate, company, description, genre, rating, duration, cover, directorIds, actorIds } = req.body;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ code: 404, message: '电影不存在' });
    }

    // 动态更新字段
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (releaseDate !== undefined) updateFields.releaseDate = releaseDate;
    if (company !== undefined) updateFields.company = company;
    if (description !== undefined) updateFields.description = description;
    if (genre !== undefined) updateFields.genre = genre;
    if (rating !== undefined) updateFields.rating = rating;
    if (duration !== undefined) updateFields.duration = duration;
    if (cover !== undefined) updateFields.cover = cover;
    await movie.update(updateFields);

    // 更新导演关联
    if (directorIds !== undefined) {
      await MoviePerson.destroy({ where: { movieId: id, role: 'director' } });
      if (directorIds.length > 0) {
        await MoviePerson.bulkCreate(
          directorIds.map(personId => ({ movieId: id, personId, role: 'director' }))
        );
      }
    }

    // 更新演员关联
    if (actorIds !== undefined) {
      await MoviePerson.destroy({ where: { movieId: id, role: 'actor' } });
      if (actorIds.length > 0) {
        await MoviePerson.bulkCreate(
          actorIds.map(personId => ({ movieId: id, personId, role: 'actor' }))
        );
      }
    }

    res.json({ code: 200, message: '电影更新成功' });
  } catch (error) {
    next(error);
  }
};

// 删除电影
exports.deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findByPk(id);
    if (!movie) {
      return res.status(404).json({ code: 404, message: '电影不存在' });
    }

    await movie.destroy();
    res.json({ code: 200, message: '电影删除成功' });
  } catch (error) {
    next(error);
  }
};
