// =============================================
// 错误处理中间件
// 用途: 统一处理所有错误，返回标准格式
// =============================================
const errorHandler = (err, req, res, next) => {
  console.error('错误详情:', err);

  // 默认错误信息
  let statusCode = err.statusCode || 500;
  let message = err.message || '服务器内部错误';

  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = '数据已存在（如用户名、邮箱已注册）';
  }

  // 验证错误
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token无效';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token已过期';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
