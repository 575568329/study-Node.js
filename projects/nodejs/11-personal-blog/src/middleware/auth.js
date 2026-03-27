/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-23 10:28:09
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-23 15:09:32
 * @FilePath: \Node.js-Study\projects\11-personal-blog\src\middleware\auth.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// =============================================
// JWT认证中间件
// 用途: 验证JWT Token，提取用户信息
// =============================================
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // TODO: 从请求头获取token
  // 提示: req.headers.authorization
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '未提供认证token'
    });
  }

  //解析token
  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'token格式错误'
    });
  }
  try {
    // TODO: 验证token
    // 提示: jwt.verify(token, secret)
    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    // TODO: 将用户信息挂载到req.user
    // 提示: decoded包含user_id
    req.user = decoded
    next();
  } catch (error) {
    // Token无效或过期
    return res.status(401).json({
      success: false,
      message: 'Token无效或已过期，请重新登录'
    });
  }
};

module.exports = authMiddleware;
