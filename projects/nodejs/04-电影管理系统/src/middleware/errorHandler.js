// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error('错误:', err.message);

  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({ code: 400, message: messages.join('; ') });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path || '字段';
    return res.status(409).json({ code: 409, message: `${field}已存在` });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    code: statusCode,
    message: process.env.NODE_ENV === 'development' ? err.message : '服务器内部错误'
  });
};

module.exports = errorHandler;
