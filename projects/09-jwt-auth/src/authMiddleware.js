/**
 * JWT认证中间件
 * 功能：验证请求是否携带有效的JWT token
 */

import { verifyToken } from './jwtUtils.js';

/**
 * 认证中间件
 * 使用：放在需要保护的路由之前
 * 例如：app.get('/api/profile', authMiddleware, handler)
 */
export function authMiddleware(req, res, next) {
  // 1️⃣ 获取token（从请求头的Authorization字段）
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: '未提供认证token'
    });
  }

  // 2️⃣ 解析token（格式：Bearer <token>）
  const token = authHeader.split(' ')[1]; // 分割后取第二部分

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token格式错误'
    });
  }

  // 3️⃣ 验证token
  try {
    const decoded = verifyToken(token); // 验证并解码token

    // 4️⃣ 将用户信息挂载到req对象上（后续中间件/路由可以使用）
    req.user = decoded; // 例如：{userId: 1, username: 'alice', iat: ..., exp: ...}

    console.log('✅ Token验证成功，用户信息：', decoded);
    next(); // 继续执行下一个中间件/路由
  } catch (error) {
    // token无效或过期
    return res.status(401).json({
      success: false,
      message: 'Token无效或已过期',
      error: error.message
    });
  }
}

/**
 * 使用示例：
 *
 * // 公开路由（不需要token）
 * app.post('/api/login', loginHandler);
 *
 * // 受保护路由（需要token）
 * app.get('/api/profile', authMiddleware, profileHandler);
 * app.put('/api/users/:id', authMiddleware, updateUserHandler);
 */
