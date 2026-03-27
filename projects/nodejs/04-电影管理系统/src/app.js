require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use('/uploads', express.static('uploads'));

// API文档
app.get('/api', (req, res) => {
  res.json({
    message: '电影管理系统 API',
    endpoints: {
      auth: 'POST /api/auth/register | POST /api/auth/login | GET /api/auth/profile',
      movies: 'GET /api/movies | GET /api/movies/:id | POST /api/movies | PUT /api/movies/:id | DELETE /api/movies/:id',
      persons: 'GET /api/persons | GET /api/persons/:id | POST /api/persons | PUT /api/persons/:id | DELETE /api/persons/:id',
      comments: 'GET /api/comments/:movieId | POST /api/comments/:movieId | PUT /api/comments/:id | DELETE /api/comments/:id'
    }
  });
});

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/persons', require('./routes/persons'));
app.use('/api/comments', require('./routes/comments'));

// 404
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// 错误处理
app.use(errorHandler);

module.exports = app;
