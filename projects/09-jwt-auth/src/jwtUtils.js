/**
 * JWT工具函数
 * 功能：生成token、验证token
 */

import jwt from 'jsonwebtoken';

// 🔑 JWT密钥（实际项目中应该放在环境变量里！）
const JWT_SECRET = 'your-secret-key-change-in-production'; // ⚠️ 生产环境必须改！

/**
 * 生成Access Token（短期，15分钟）
 * @param {Object} payload - 要编码的数据（例如：{userId: 1, username: 'alice'}）
 * @returns {String} Access Token
 */
export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }); // ⏰ 15分钟过期
}

/**
 * 生成Refresh Token（长期，7天）
 * @param {Object} payload - 要编码的数据（例如：{userId: 1, username: 'alice'}）
 * @returns {String} Refresh Token
 */
export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // 📅 7天过期
}

/**
 * 生成JWT token（通用函数，保留向后兼容）
 * @param {Object} payload - 要编码的数据（例如：{userId: 1, username: 'alice'}）
 * @param {String} expiresIn - 过期时间（默认：7天）
 * @returns {String} JWT token
 * @deprecated 推荐使用 generateAccessToken 和 generateRefreshToken
 */
export function generateToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * 验证JWT token（同时支持Access Token和Refresh Token）
 * @param {String} token - 要验证的token
 * @returns {Object} 解码后的payload
 * @throws {Error} 如果token无效或过期
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * JWT_SECRET说明：
 * - 这是生成和验证token的密钥
 * - 只有服务器知道，前端不知道
 * - 生产环境必须放在环境变量：process.env.JWT_SECRET
 * - 密钥越复杂，越安全
 */
