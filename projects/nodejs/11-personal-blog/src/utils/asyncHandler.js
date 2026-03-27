// =============================================
// 异步错误处理包装器
// 用途: 自动捕获async函数中的错误，传递给错误处理中间件
// =============================================

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
