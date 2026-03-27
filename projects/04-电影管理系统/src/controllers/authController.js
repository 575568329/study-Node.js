const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { validationResult } = require('express-validator');

// 注册
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { account, password, name, gender, bio } = req.body;

    const existingUser = await User.findOne({ where: { account } });
    if (existingUser) {
      return res.status(409).json({ code: 409, message: '账号已存在' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      account,
      password: hashedPassword,
      name: name || null,
      gender: gender || null,
      bio: bio || null
    });

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: { id: user.id, account: user.account, name: user.name }
    });
  } catch (error) {
    next(error);
  }
};

// 登录
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, message: errors.array()[0].msg });
    }

    const { account, password } = req.body;

    const user = await User.findOne({ where: { account } });
    if (!user) {
      return res.status(401).json({ code: 401, message: '账号或密码错误' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '账号或密码错误' });
    }

    const token = jwt.sign(
      { id: user.id, account: user.account },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: { id: user.id, account: user.account, name: user.name, gender: user.gender, bio: user.bio }
      }
    });
  } catch (error) {
    next(error);
  }
};

// 获取个人信息
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }

    res.json({ code: 200, data: user });
  } catch (error) {
    next(error);
  }
};
