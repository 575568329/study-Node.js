/**
 * 演示：为什么 try-catch 捕获不到 Promise / 异步错误
 *
 * 核心：try-catch 是【同步】的守卫，它只在【当前调用栈】展开的这一瞬间有效。
 * 异步错误（微任务/宏任务）是【调用栈清空之后】才抛出的，那时 try-catch 早已执行完毕、退出了作用域。
 *
 * 运行：node code-examples/nodejs/async-error-demo.js
 */

console.log('========== 演示 1：try-catch 捕不到 Promise 错误 ==========');

try {
  // Promise 内部的 reject 是异步的（微任务），不是当前调用栈上的同步抛出
  Promise.reject(new Error('Promise 里的错误'));
  console.log('[1] try 块同步代码执行完了'); // 这行会打印
} catch (err) {
  // ❌ 永远进不来！因为 reject 触发时，这个 try-catch 早就退出了
  console.log('[1] catch 捕获到:', err.message);
}
console.log('[1] try-catch 之后，程序继续往下走\n');


console.log('========== 演示 2：try-catch 捕不到 setTimeout 错误 ==========');

try {
  setTimeout(() => {
    // 这个 throw 发生在【将来】的宏任务里，当前调用栈早清空了
    throw new Error('setTimeout 里的错误');
  }, 0);
  console.log('[2] try 块同步代码执行完了'); // 这行会打印
} catch (err) {
  // ❌ 也进不来！（这个错误最终会导致进程崩溃，除非用 process.on 兜底）
  console.log('[2] catch 捕获到:', err.message);
}
console.log('[2] try-catch 之后，程序继续往下走\n');


console.log('========== 演示 3：await 让 try-catch 重新生效 ==========');

// 关键：await 会“暂停”async 函数，等 Promise 有结果后【在同一逻辑栈】恢复执行
// rejected 的结果会以 throw 的形式在 await 那一行抛出 → try-catch 就能接住了
async function demo3() {
  try {
    await Promise.reject(new Error('被 await 的 Promise 错误'));
    console.log('[3] 这行不会执行'); // await 抛错后跳过
  } catch (err) {
    // ✅ 能捕获！await 把异步错误“拉回”到同步的 try-catch 语境
    console.log('[3] catch 捕获到:', err.message);
  }
}


console.log('========== 演示 4：不 await 就抓不到（常见坑）==========');

async function demo4() {
  try {
    // ⚠️ 少写了 await！这里只是“启动”了 Promise，没等它
    // 于是 reject 变成游离的微任务，try-catch 管不着
    Promise.reject(new Error('忘记 await 的错误'));
    console.log('[4] try 块执行完了（没等 Promise）');
  } catch (err) {
    console.log('[4] catch 捕获到:', err.message); // ❌ 进不来
  }
}


// 用兜底钩子证明：那些没被 catch 的错误确实变成了“未处理拒绝”
process.on('unhandledRejection', (reason) => {
  console.log('\n>>> [兜底] 捕获到未处理的 Promise 拒绝:', reason.message);
});

// 依次执行 async 演示
(async () => {
  await demo3();
  await demo4();
})();
