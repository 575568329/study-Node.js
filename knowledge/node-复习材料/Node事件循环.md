# Node 事件循环

更新时间：2026-05-08

## 学习目标

把 `同步代码 / process.nextTick / Promise 微任务 / 宏任务` 的关系讲清楚，并能回答 Node.js 为什么适合高并发 I/O。

## 核心模型

入口脚本可以理解成一个初始宏任务。

每个宏任务内部都遵循同一套执行规则：

```text
执行当前宏任务
  -> 执行同步代码
  -> 清空 process.nextTick 队列
  -> 清空 Promise 微任务队列
  -> 进入下一个宏任务
```

所以不要理解成“同步代码一次、微任务一次、宏任务一次”。事件循环会持续运行，只要进程里还有定时器、I/O、网络连接或其他未完成任务。

## 同步代码

同步代码永远先执行。`Promise.then` 和 `process.nextTick` 都不会打断当前调用栈。

```js
console.log("A");

process.nextTick(() => {
  console.log("B");
});

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

输出：

```text
A
D
B
C
```

原因：

- `A`、`D` 是同步代码。
- `process.nextTick` 晚于同步代码，但早于 Promise 微任务。
- `Promise.then` 是微任务。

## 微任务

常见微任务：

- `Promise.then`
- `Promise.catch`
- `Promise.finally`
- `queueMicrotask`

Node.js 特殊队列：

- `process.nextTick`

Node.js 中可以先记成：

```text
同步代码
  -> process.nextTick
  -> Promise 微任务
  -> 宏任务
```

如果微任务执行过程中继续创建微任务，新微任务会追加到当前微任务队列尾部，并在本轮继续执行。

```js
Promise.resolve().then(() => {
  console.log("A");

  Promise.resolve().then(() => {
    console.log("B");
  });
});

Promise.resolve().then(() => {
  console.log("C");
});
```

输出：

```text
A
C
B
```

原因：

- 第一轮微任务队列先有 `A` 和 `C`。
- 执行 `A` 时创建 `B`，`B` 追加到队尾。
- 所以顺序是 `A -> C -> B`。

## 宏任务

常见宏任务：

- `setTimeout`
- `setInterval`
- `setImmediate`
- I/O 回调
- 网络请求回调

如果宏任务执行过程中继续创建宏任务，新宏任务不会立刻执行，而是进入后续宏任务队列。

```js
setTimeout(() => {
  console.log("A");

  setTimeout(() => {
    console.log("B");
  }, 0);

  Promise.resolve().then(() => {
    console.log("C");
  });

  console.log("D");
}, 0);

setTimeout(() => {
  console.log("E");
}, 0);
```

常见输出：

```text
A
D
C
E
B
```

原因：

- `A`、`D` 是第一个宏任务里的同步代码。
- `C` 是第一个宏任务产生的微任务，所以当前宏任务结束后立即执行。
- `E` 是之前已经排队的宏任务。
- `B` 是第一个宏任务执行过程中新增的宏任务，所以排到后面。

## 解决的痛点

JavaScript 事件循环解决的是：

```text
保持 JS 主线程单线程、顺序执行的简单模型，同时又能处理耗时 I/O。
```

浏览器里，它用于协调：

- 用户点击
- 网络请求
- 定时器
- 页面渲染
- JS 执行

Node.js 里，它用于协调：

- HTTP 请求
- 文件读写
- 数据库访问
- 第三方接口调用
- SSE / WebSocket
- AI 流式输出

Node.js 适合高并发 I/O，不是因为 JS 变成了多线程，而是因为慢的 I/O 交给底层处理，JS 主线程主要负责调度和执行回调。

## Node.js 和 Java 的选型理解

Node.js 的优势：

- 适合 I/O 密集型服务。
- 适合 BFF、接口聚合、网关层。
- 适合 SSE / WebSocket / AI 流式输出。
- 适合前后端统一 TypeScript 生态。
- 适合 CLI、开发者工具和本地编排层。

Java 仍然是企业核心后端主流，原因是：

- Spring 生态成熟。
- 事务、权限、审计、监控、服务治理体系完整。
- 多线程、线程池、并发工具能力强。
- 大型团队长期维护经验成熟。
- 存量系统和人才生态庞大。

所以当前求职表达不要说“Node 替代 Java”，而是说：

```text
我用 Node.js / Next.js 承担 BFF、接口编排、RAG 问答、SSE 流式输出和 AI 应用层能力。
```

## CLI 工具为什么常用 Node.js

Claude Code、Codex 等 CLI 工具选择 Node.js，主要因为它们本质是开发者本地工具和编排层。

这类工具常见任务：

- 读写文件
- 扫描目录
- 执行 shell 命令
- 调用 git
- 调用模型 API
- 处理流式输出
- 操作 `package.json`、`tsconfig.json`、`vite.config.ts`
- 集成 npm / pnpm / TypeScript / ESLint / Prettier 生态

这些都是 I/O 密集型和工程生态集成任务，Node.js 很合适。

## 面试回答

可以把入口脚本理解为一个初始宏任务。每个宏任务执行时，都会先执行其中的同步代码；同步代码执行完之后，会先清空 `process.nextTick` 队列，再清空 Promise 微任务队列。微任务清空后，事件循环才会进入下一个宏任务，比如 `setTimeout`、`setImmediate`、I/O 或网络请求回调。

如果微任务执行过程中继续创建微任务，新微任务会追加到当前微任务队列尾部，并在本轮继续执行；如果宏任务执行过程中创建新的宏任务，新宏任务不会立即执行，而是进入后续宏任务队列，等待前面的宏任务及它们产生的微任务处理完之后再执行。

Node.js 能处理高并发 I/O，不是因为 JS 本身变成了多线程，而是因为耗时 I/O 交给底层处理，JS 主线程通过事件循环调度回调。但如果主线程执行大量 CPU 密集型计算，仍然会阻塞事件循环。

## 易错点

- `process.nextTick` 不会比同步代码先执行。
- `Promise.then` 是微任务，不是宏任务。
- 微任务不会等所有宏任务执行完才执行，而是在每个宏任务结束后清空。
- 宏任务里创建的宏任务不会立刻执行，会进入后续队列。
- 事件循环不是最多循环三次，而是只要还有任务就会持续运行。
- Node.js 适合高并发 I/O，不代表适合在主线程做大量 CPU 计算。
