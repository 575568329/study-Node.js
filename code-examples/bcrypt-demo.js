/**
 * bcrypt 密码加密演示
 *
 * 运行方式：
 * 1. npm install bcrypt
 * 2. node bcrypt-demo.js
 */

const bcrypt = require('bcrypt');

// ==================== 演示1：相同密码，不同哈希 ====================
console.log('=== 演示1：盐的随机性 ===\n');

const password = '123456';

// 加密3次，观察结果
bcrypt.hash(password, 10)
  .then(hash1 => {
    console.log('第1次加密:', hash1);
    return bcrypt.hash(password, 10);
  })
  .then(hash2 => {
    console.log('第2次加密:', hash2);
    return bcrypt.hash(password, 10);
  })
  .then(hash3 => {
    console.log('第3次加密:', hash3);
    console.log('\n💡 结论：相同密码，每次哈希都不同！\n');

    // ==================== 演示2：验证密码 ====================
    console.log('=== 演示2：密码验证 ===\n');

    const storedHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'; // "123456"的哈希

    return bcrypt.compare('123456', storedHash);
  })
  .then(isMatch => {
    console.log('验证 "123456":', isMatch); // true
    return bcrypt.compare('wrongpass', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');
  })
  .then(isMatch => {
    console.log('验证 "wrongpass":', isMatch); // false
    console.log('\n💡 bcrypt.compare() 会自动从哈希中提取盐进行验证！\n');

    // ==================== 演示3：不同salt rounds的耗时对比 ====================
    console.log('=== 演示3：不同加密强度的耗时对比 ===\n');

    console.time('bcrypt(8)');
    return bcrypt.hash('123456', 8);
  })
  .then(hash8 => {
    console.timeEnd('bcrypt(8)');
    console.log('哈希值长度:', hash8.length);

    console.time('bcrypt(10)');
    return bcrypt.hash('123456', 10);
  })
  .then(hash10 => {
    console.timeEnd('bcrypt(10)');
    console.log('哈希值长度:', hash10.length);

    console.time('bcrypt(12)');
    return bcrypt.hash('123456', 12);
  })
  .then(hash12 => {
    console.timeEnd('bcrypt(12)');
    console.log('哈希值长度:', hash12.length);
    console.log('\n💡 salt rounds每增加2，耗时增加约4倍！\n');

    // ==================== 演示4：哈希值结构解析 ====================
    console.log('=== 演示4：哈希值结构 ===\n');

    const exampleHash = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
    console.log('完整哈希:', exampleHash);
    console.log('算法版本:', exampleHash.split('$')[1]); // 2b
    console.log('Salt Rounds:', exampleHash.split('$')[2]); // 10
    console.log('盐+哈希:', exampleHash.split('$')[3]); // 实际的盐和哈希值
    console.log('\n💡 哈希值结构: $算法$成本$盐+哈希\n');
  })
  .catch(err => {
    console.error('错误:', err);
  });
