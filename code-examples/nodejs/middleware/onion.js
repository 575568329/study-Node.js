/**
 * 洋葱模型中间件 - 手写实现练习
 *
 * 目标：实现 use() 和 run()，让下面的中间件按洋葱顺序执行
 *
 * 期望输出：
 *   1 前
 *   2 前
 *   3 核心
 *   2 后
 *   1 后
 */

class App {
  constructor() {
    this.middlewares = []; // 存放所有中间件
  }

  // 注册中间件
  use(fn) {
    this.middlewares.push(fn)
    // TODO 1: 把 fn 存进 middlewares 数组
  }

  // 启动：从第一个中间件开始执行
  run() {
    const ctx = {}; // 上下文对象（这里简化，先不管内容）

    // TODO 2: 实现 dispatch(index)
    //   - dispatch(i) 负责执行第 i 个中间件
    //   - 给中间件传两个参数：ctx 和 next
    //   - next 的作用：调用 dispatch(i + 1)，触发下一个中间件
    //   - 想一想：next 应该返回什么，才能让 await next() 生效？

    const dispatch = (index) => {
      // 你的代码
      const fn = this.middlewares[index]
      if (!fn) {
        return
      }
      return fn(ctx, () => dispatch(index+1))
    };

    return dispatch(0); // 从第 0 个开始
  }
}

// ---------- 测试代码（不要改）----------
const app = new App();

app.use(async (ctx, next) => {
  console.log('1 前');
  await next();
  console.log('1 后');
});

app.use(async (ctx, next) => {
  console.log('2 前');
  await next();
  console.log('2 后');
});

app.use(async (ctx, next) => {
  console.log('3 核心');
});

app.run();
