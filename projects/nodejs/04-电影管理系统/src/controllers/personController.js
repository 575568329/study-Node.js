const { Op } = require('sequelize');
const { Person, MoviePerson, Movie } = require('../models');
const { validationResult } = require('express-validator');

// 获取人员列表
exports.getPersons = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword, role } = req.query;
    const offset = (page - 1) * pageSize;

    const where = {};
    if (keyword) {
      where.name = { [Op.like]: `%${keyword}%` };
    }

    // 按角色筛选：先从中间表查出符合条件的personId
    if (role) {
      const moviePersons = await MoviePerson.findAll({
        where: { role },
        attributes: ['personId'],
        group: ['personId']
      });
      const personIds = moviePersons.map(mp => mp.personId);

      if (personIds.length === 0) {
        return res.json({ code: 200, data: { total: 0, page: +page, pageSize: +pageSize, persons: [] } });
      }
      where.id = { [Op.in]: personIds };
    }

    const { count, rows } = await Person.findAndCountAll({
      where,
      offset: +offset,
      limit: +pageSize,
      order: [['created_at', 'DESC']]
    });

    res.json({ code: 200, data: { total: count, page: +page, pageSize: +pageSize, persons: rows } });
  } catch (error) {
    next(error);
  }
};

// 获取人员详情（含参与的电影）
exports.getPersonById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id);
    if (!person) {
      return res.status(404).json({ code: 404, message: '人员不存在' });
    }

    const moviePersons = await MoviePerson.findAll({
      where: { personId: id },
      include: [{ model: Movie, as: 'movie', attributes: ['id', 'name', 'releaseDate', 'genre', 'rating'] }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      code: 200,
      data: {
        ...person.toJSON(),
        movies: moviePersons.map(mp => ({ ...mp.movie.toJSON(), role: mp.role }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// 创建人员
exports.createPerson = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { name, gender, age, nationality } = req.body;

    const person = await Person.create({
      name,
      gender: gender || null,
      age: age || null,
      nationality: nationality || null
    });

    res.status(201).json({ code: 201, message: '人员创建成功', data: { id: person.id, name: person.name } });
  } catch (error) {
    next(error);
  }
};

// 更新人员
exports.updatePerson = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { id } = req.params;
    const { name, gender, age, nationality } = req.body;

    const person = await Person.findByPk(id);
    if (!person) {
      return res.status(404).json({ code: 404, message: '人员不存在' });
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (gender !== undefined) updateFields.gender = gender;
    if (age !== undefined) updateFields.age = age;
    if (nationality !== undefined) updateFields.nationality = nationality;

    await person.update(updateFields);
    res.json({ code: 200, message: '人员更新成功' });
  } catch (error) {
    next(error);
  }
};

// 删除人员
exports.deletePerson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const person = await Person.findByPk(id);
    if (!person) {
      return res.status(404).json({ code: 404, message: '人员不存在' });
    }

    await person.destroy();
    res.json({ code: 200, message: '人员删除成功' });
  } catch (error) {
    next(error);
  }
};
