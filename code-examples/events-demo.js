/**
 * events 模块示例 - 事件发射器
 * Node.js 核心模块之一，用于实现事件驱动架构
 */

const EventEmitter = require('events');

// ============================================
// 1. 基本使用
// ============================================

console.log('=== 1. 基本使用 ===\n');

// 创建事件发射器实例
const emitter = new EventEmitter();

// 监听事件 (on / addListener)
emitter.on('greet', (name) => {
  console.log(`你好，${name}！`);
});

// 触发事件 (emit)
emitter.emit('greet', '小明');
// 输出: 你好，小明！

// ============================================
// 2. 一个事件，多个监听器
// ============================================

console.log('\n=== 2. 一个事件，多个监听器 ===\n');

const logger = new EventEmitter();

// 注册多个监听器
logger.on('log', (message) => {
  console.log(`[控制台] ${message}`);
});

logger.on('log', (message) => {
  // 模拟写入文件
  console.log(`[文件] 已保存: ${message}`);
});

logger.on('log', (message) => {
  // 模拟发送到远程服务器
  console.log(`[远程] 已发送: ${message}`);
});

// 触发一次，所有监听器都会执行
logger.emit('log', '用户登录成功');
// 输出:
// [控制台] 用户登录成功
// [文件] 已保存: 用户登录成功
// [远程] 已发送: 用户登录成功

// ============================================
// 3. 只执行一次的事件 (once)
// ============================================

console.log('\n=== 3. 只执行一次 (once) ===\n');

const connection = new EventEmitter();

connection.once('connected', () => {
  console.log('连接成功！这条消息只会显示一次');
});

connection.emit('connected'); // 输出: 连接成功！
connection.emit('connected'); // 不会输出
connection.emit('connected'); // 不会输出

// ============================================
// 4. 实际应用：自定义类继承 EventEmitter
// ============================================

console.log('\n=== 4. 实际应用：用户登录系统 ===\n');

class UserManager extends EventEmitter {
  constructor() {
    super();
    this.users = [];
  }

  login(username, password) {
    console.log(`\n[系统] 用户 ${username} 尝试登录...`);

    // 模拟登录验证
    if (password === '123456') {
      this.users.push(username);
      // 触发登录成功事件
      this.emit('loginSuccess', username);
    } else {
      // 触发登录失败事件
      this.emit('loginFail', username, '密码错误');
    }
  }
}

// 创建用户管理器
const userManager = new UserManager();

// 监听登录成功事件
userManager.on('loginSuccess', (username) => {
  console.log(`✅ 登录成功！欢迎 ${username}`);
  console.log(`   - 发送欢迎邮件`);
  console.log(`   - 记录登录日志`);
  console.log(`   - 更新在线用户列表`);
});

// 监听登录失败事件
userManager.on('loginFail', (username, reason) => {
  console.log(`❌ 登录失败：${reason}`);
  console.log(`   - 记录失败日志`);
  console.log(`   - 发送安全提醒`);
});

// 执行登录
userManager.login('admin', '123456');
userManager.login('guest', 'wrong');

// ============================================
// 5. 移除监听器
// ============================================

console.log('\n=== 5. 移除监听器 ===\n');

const myEmitter = new EventEmitter();

function handler1() {
  console.log('处理器1');
}

function handler2() {
  console.log('处理器2');
}

myEmitter.on('test', handler1);
myEmitter.on('test', handler2);

console.log('第一次触发:');
myEmitter.emit('test');
// 输出: 处理器1
//       处理器2

// 移除 handler1
myEmitter.removeListener('test', handler1);

console.log('\n移除 handler1 后再次触发:');
myEmitter.emit('test');
// 输出: 处理器2

// ============================================
// 6. 获取监听器数量和列表
// ============================================

console.log('\n=== 6. 监听器信息 ===\n');

const infoEmitter = new EventEmitter();

infoEmitter.on('data', () => {});
infoEmitter.on('data', () => {});
infoEmitter.on('data', () => {});
infoEmitter.on('end', () => {});

console.log(`'data' 事件的监听器数量: ${infoEmitter.listenerCount('data')}`); // 3
console.log('所有事件名称:', infoEmitter.eventNames()); // [ 'data', 'end' ]

// ============================================
// 总结
// ============================================

console.log('\n=== 总结 ===\n');
console.log('核心 API:');
console.log('  - on(eventName, handler)     监听事件');
console.log('  - emit(eventName, ...args)    触发事件');
console.log('  - once(eventName, handler)    只监听一次');
console.log('  - removeListener(eventName, handler)  移除监听器');
console.log('  - listenerCount(eventName)    获取监听器数量');
console.log('\n应用场景:');
console.log('  - 异步操作完成通知');
console.log('  - 模块间解耦通信');
console.log('  - 状态变化通知');
console.log('  - Stream、HTTP 等核心模块的基础');
