// JWT认证中间件
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未提供认证token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.id, account: decoded.account };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 401, message: 'token已过期' });
    }
    return res.status(401).json({ code: 401, message: '无效的token' });
  }
};

module.exports = auth;
