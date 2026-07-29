/**
 * 手写 JWT：从零实现 sign（签发）+ verify（验证）
 * 目的：彻底理解 JWT 的三段结构与签名防篡改机制
 * 运行：node jwt-handwrite.js
 */
const crypto = require('crypto');

const SECRET = 'my-secret-key'; // 密钥：只在服务器，绝不外泄

// ---------- 工具函数：Base64URL 编码 ----------
// 注意：JWT 用的是 base64url（把 + / = 替换掉），不是普通 base64
function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// ========== 你来填空：sign 签发 ==========
function sign(payload, secret) {
  // 第1步：准备 header，Base64URL 编码
  //   header = { alg: 'HS256', typ: 'JWT' }
  //   提示：对象要先 JSON.stringify 再 base64url
  const header = base64url(JSON.stringify({alg:'HS256', typ:'JWT'}))
  // 第2步：把 payload 也 Base64URL 编码
  const payloadStr = base64url(JSON.stringify(payload))
  // 第3步：算签名
  //   待签内容 = 编码后的header + '.' + 编码后的payload
  //   signature = crypto.createHmac('sha256', secret).update(待签内容).digest('base64')
  //   再把 signature 转成 base64url（同样替换 + / =）
  const signature = crypto.createHmac('sha256', secret).update(header + '.' + payloadStr).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  // 第4步：三段用 '.' 拼接返回
  //   return `${header}.${payload}.${signature}`
return `${header}.${payloadStr}.${signature}`
  // TODO: 在这里实现
}

// ---------- base64url 解码：还原成原始字符串 ----------
function base64urlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(base64, 'base64').toString('utf8');
}

// ---------- 验证：verify ----------
function verify(token, secret) {
  // 第1步：拆三段（你已写好）
  const [header, payload, signature] = token.split('.');

  // 第2步：重新算签名（方式必须和 sign 完全一样！）
  //   const expected = crypto.createHmac('sha256', secret)
  //     .update(???).digest('base64').replace(...三个replace...)
  const expected = crypto.createHmac('sha256', secret).update(header+'.'+payload).digest('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  // 第3步：对比 signature 和 expected，不一致就 throw
  if (!(signature === expected)) {
     throw new Error('鉴权不通过：token 被篡改');
  }
  // 第4步：通过后解码 payload 返回对象
  //   return JSON.parse(base64urlDecode(payload))
  return JSON.parse(base64urlDecode(payload))
  // TODO: 填第2-4步
}

// ---------- 测试 ----------
const token = sign({ userId: '张三', role: 'admin' }, SECRET);
console.log('签发的 token:\n', token);

console.log('\n--- 测试1：正常验证 ---');
console.log(verify(token, SECRET)); // 期望：{ userId: '张三', role: 'admin' }

console.log('\n--- 测试2：篡改 payload 提权 ---');
const [h, p, s] = token.split('.');
const fakePayload = base64url(JSON.stringify({ userId: '张三', role: 'superadmin' }));
const fakeToken = `${h}.${fakePayload}.${s}`; // 改了内容，签名还是旧的
try {
  verify(fakeToken, SECRET);
  console.log('❌ 不该通过！安全漏洞！');
} catch (e) {
  console.log('✅ 成功拦截:', e.message);
}
 