# JS/TS 面试讲稿

> 用法：合上此文档，看着「问题」自己讲一遍，再对照。
> 状态：✅ 已过关　⚠️ 待巩固　❌ 未开始

---

## Q1：什么是闭包？✅

**3 分钟讲稿**：

闭包就是——外部函数的变量，被内部函数引用或返回，导致外部函数执行完后
这个变量仍然无法销毁，此时就形成了闭包。

三要素：内层函数引用外层变量 + 外层已执行完 + 变量因被引用而"续命"。

有意义的闭包，一定是内层函数**逃逸**了（被 return、被赋值到外部、被注册成回调），
才会让变量真正活过外层函数的生命周期。

**工作里真实用过的场景（面试就答这几个）**：

1. **setTimeout 回调**：回调函数引用了外层变量 → 闭包
2. **事件监听**：`addEventListener('click', fn)`，fn 引用外层变量 → 闭包
3. **防抖/节流**：返回的函数持有外层的 timer 变量来控制执行 → 闭包
4. **Vue3 的 ref、React 的 useState**：底层机制相关

**防抖代码（能默写）**：
```javascript
function debounce(fn, delay) {
  let timer;                    // 被返回的函数续命
  return function(...args) {    // ...args 收集调用时的参数
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
    // apply(this, args)：原样转发 this 和参数给真正的 fn
  }
}
```
防抖两层：第一层定义"要防抖的函数 + 间隔时间"，第二层调用时只传业务入参。

**可能的追问**：
- 追问：`function outer(){ let x=1; function inner(){console.log(x)}; inner(); }`
  算闭包吗？→ 技术上算，但 inner 没逃出去，x 照样能回收，是"无意义的闭包"。
- 追问：闭包会内存泄漏吗？→ 会。变量被长期持有无法回收，要手动解绑（如 removeEventListener）。

**我曾经的盲区（今天踩的坑）**：
- ❌ 一开始说反了，以为闭包是"把变量锁起来不让外面碰"——错，是"内层访问外层"。
- ❌ 代词模糊，说"这个函数无法释放"——应该是"外层的**变量**无法释放"。
- ❌ 干 6 年却答不出用在哪——其实 setTimeout/事件监听/防抖天天在用，只是不知道那叫闭包。

---

## Q2：Vue3 ref 的原理？✅（关联闭包）

**讲稿**：
ref 底层不是闭包，是一个类实例（RefImpl），通过 get/set 拦截 `.value` 的读写。

```javascript
class RefImpl {
  constructor(value) { this._value = value; }  // new 时自动初始化
  get value() { track(this); return this._value; }   // 读 → 依赖收集
  set value(v) { this._value = v; trigger(this); }    // 写 → 触发更新
}
```

- **为什么要 `.value`**：基本类型是值传递，没法监听裸变量的读写，必须包成对象，
  通过对象的 get/set 才能拦截"读"和"写"两个时机。
- **get/set 是什么**：不是 class 自带，是手写的**访问器属性（accessor）**语法。
  把方法伪装成属性，`r.value` 用起来像属性，背后偷偷执行逻辑。Vue 靠它做依赖收集。
- **ref vs reactive**：ref 用 RefImpl 类；reactive 用 Proxy 拦截整个对象。（重点考点）

---

## Q3：React useState 闭包陷阱（stale closure）✅

**讲稿**：
`handleClick` 是在"某次渲染"时创建的，它的闭包捕获的是**那一次渲染的 state 快照**。
之后 state 变了会重新渲染、生成新函数，但已排队的旧函数还抱着旧值。

```javascript
const handleClick = () => {
  setTimeout(() => console.log(count), 3000); // 打印点击那刻的 count,不是最新的
};
```

**解决**：
- 函数式更新：`setCount(prev => prev + 1)` —— 不读闭包旧值，让 React 给最新值。
- useRef：`{ current: x }` 盒子，重渲染不换新，任何闭包读 `.current` 都是最新值。

**useState vs useRef**：
- useState → 变了会重新渲染，但闭包锁旧快照
- useRef → 变了不重新渲染，但永远读到最新值（共用同一个盒子）

---

## Q4：原型与原型链 ✅

**3 分钟讲稿**：

一句话钉死：**`prototype` 是函数才有的属性；`__proto__` 是每个对象都有的属性。**

- `Person.prototype` = 图纸（原型对象），方法挂在这里给所有实例共享
- `p.__proto__` = 实例手里牵回图纸的那根线
- 二者指向同一个东西：`p.__proto__ === Person.prototype`

**完整原型链**：
```
p  →  Person.prototype  →  Object.prototype  →  null
  (__proto__)         (__proto__)         (__proto__)
```

**找属性的规则**：写 `p.sayHi()` 时，p 自己没有 → **JS 引擎自动顺着 `__proto__` 一站站往上找**，
找到就返回，摸到 `null` 还没有就返回 `undefined`。这个"顺线往上找"的过程就是原型链。

**为什么任何对象都能调 `toString()` / `hasOwnProperty()`**：
它们挂在 `Object.prototype`（所有对象的老祖宗）上，任何对象顺着原型链都能摸到。

**精确表述（面试显专业）**：是"**JS 引擎**顺着 `__proto__` 往上找"，
不是"对象/我用 `__proto__` 去找"。发起调用的是你，摸线的是引擎。

**可能的追问**：
- `new` 做了哪 4 件事？→ ①造空对象 ②把对象的 `__proto__` 指向构造函数的 prototype
  ③执行构造函数（this 指向新对象） ④返回该对象（除非构造函数返回了对象）
- 手写 instanceof？→ 顺着左边对象的 `__proto__` 往上找，看能不能找到右边函数的 prototype

**我曾经的盲区**：
- ❌ 完全不知道 prototype 和 __proto__ 的区别（一开始答"不知道"）。
- ⚠️ 习惯性把"引擎摸线"说成"对象/我用 __proto__ 去找"——发起者和执行者要分清。

---

## Q5：new 的 4 步 ✅

`new Person('张三')` 背后做了 4 件事：
1. **造空对象**：`const obj = {}`
2. **接上原型链**：`obj.__proto__ = Person.prototype`（就是原型链那根线接上的时刻）
3. **执行构造函数、绑 this**：`Person.call(obj, '张三')`，让 this 指向 obj，
   于是 `this.name = name` 变成 `obj.name = '张三'`
4. **返回对象**：`return obj`（除非构造函数自己 return 了一个对象）

**为什么第 3 步要 call**：不用 new/call 直接 `Person('张三')`，this 会指向 window，
`this.name` 就污染全局、根本没造出对象。call 强行把 this 焊到 obj 上。

---

## Q6：this 指向 + call/apply/bind ✅

**核心区分（别和原型链混）**：
- **原型链** = 找属性时顺着 `__proto__` **向上找**
- **this** = 看函数**被调用的那一刻**当场决定，**不向上找**

**4 种绑定，优先级：new > 显式(call/bind) > 隐式(点调用) > 默认**
1. **new 绑定**：`new Foo()` → this = 新对象
2. **显式绑定**：`fn.call/apply/bind(obj)` → this = 指定的 obj
3. **隐式绑定**：`obj.fn()` → this = 点前面的 obj
4. **默认绑定**：`fn()` 直接调 → this = window（严格模式 undefined）

**判断口诀**：调用那一刻，有 new？→ 新对象；有 call/bind？→ 指定的；
是 xxx.fn()？→ xxx；都不是直接 fn()？→ window。

**箭头函数**：没有自己的 this，用**定义时**外层的 this（写代码那刻定死，不随调用变）。
所以 setTimeout/事件回调里爱用箭头函数——省得 this 丢。

**call / apply / bind 区别**：
| 方法 | 传参 | 是否立即执行 |
|------|------|------|
| **c**all | 逗号分隔（一个个）| 立即 |
| **a**pply | **a**rray 数组 | 立即 |
| **b**ind | 逗号分隔（一个个）| **不执行**，返回新函数 |

记忆：apply→array（数组）；bind→绑定但不发射（返回新函数，要再调一次）。

**典型场景**：
- apply：`Math.max.apply(null, [1,2,3])` 求数组最大值
- bind：`this.handleClick = this.handleClick.bind(this)`（React 类组件焊死 this，
  防止函数被当值传给 onClick 后 this 丢失；新代码改用箭头函数解决同样问题）
- call：`Array.prototype.slice.call(arguments)` 类数组转真数组

**我曾经的盲区**：
- ❌ 把 this 说成"向上找"——错，"向上找"是原型链，this 是调用方式当场决定。
- ❌ 不懂 `Person.call(obj, '张三')` 里为什么带 '张三'——第一个参数指定 this，
  从第二个开始才是函数参数。

---

## Q7：事件循环（宏任务/微任务）✅

**核心机制（记死）**：
JS 是单线程，任务分三类，按优先级处理：

```
1. 同步代码      → 立即执行（主线程）
2. 微任务队列    → 本轮事件循环结束前清空（Promise.then、queueMicrotask）
3. 宏任务队列    → 下一轮事件循环才执行（setTimeout、setInterval、I/O）
```

**执行顺序（一句话）**：
同步代码 → 清空微任务队列 → 取**一个**宏任务 → 清空微任务队列 → 取一个宏任务...

**关键点**：
- 微任务"插队"：每轮都要清空，一个都不剩
- 宏任务"排队"：一次只取一个
- **每个宏任务后必清空微任务**（核心循环）

**宏任务 vs 微任务分类**：
| 类型 | 常见 API |
|------|----------|
| 宏任务 | setTimeout、setInterval、setImmediate(Node)、I/O |
| 微任务 | Promise.then/catch/finally、queueMicrotask、process.nextTick(Node 最高优先级) |

**口诀**：Promise 系列 = 微任务；定时器系列 = 宏任务

**坑**：`new Promise(executor)` 里的 executor 是**同步**的，只有 `.then` 才是微任务：
```javascript
new Promise((resolve) => {
  console.log('A');   // 同步
  resolve();
}).then(() => {
  console.log('B');   // 微任务
});
console.log('C');
// A C B
```

**经典题 1**（基础）：
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出：1 4 3 2
```

**经典题 2**（进阶 - 宏任务里嵌套微任务）：
```javascript
console.log('1');
setTimeout(() => {
  console.log('2');
  Promise.resolve().then(() => console.log('3'));
}, 0);
Promise.resolve().then(() => {
  console.log('4');
  setTimeout(() => console.log('5'), 0);
});
console.log('6');
// 输出：1 6 4 2 3 5
```
关键：宏任务 A（打印2）后，先清空它产生的微任务（打印3），再取下一个宏任务（打印5）。

**为什么微任务要"插队"？**
设计意图：让"紧急的异步"（如接口回来后的 `.then` 处理）尽快执行，不用排在一堆定时器后面。

**async/await 和事件循环**：
`await` 后面的代码相当于 `.then` 里的回调 → 微任务。
```javascript
async function foo() {
  console.log('A');        // 同步
  await Promise.resolve(); // await 这行同步，但"暂停"函数
  console.log('B');        // 相当于 .then(() => console.log('B'))，微任务
}
foo();
console.log('C');
// A C B
```
`await` 本质：把后续代码变成微任务。

**我曾经的盲区**：
- （首次学习，过程顺利）

---

## Q8：Promise 手写（进行中 - 已完成 70%）

**目标**：理解 Promise 原理，自己实现一个基础版。

### 已完成部分

**第一步：状态机（pending/fulfilled/rejected）**
```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;

    const resolve = (value) => {
      if (this.state === 'pending') {  // 状态不可逆
        this.state = 'fulfilled';
        this.value = value;
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
      }
    };

    executor(resolve, reject);  // 立即同步执行
  }
}
```

**关键点**：
- 状态只能从 pending → fulfilled/rejected，**不可逆**
- `executor` 是同步执行的（`new Promise(() => console.log('A'))` 里的 A 立即打印）
- `resolve/reject` 判断 `state === 'pending'` 防止重复改状态

**第二步：支持异步 resolve + 回调数组**
```javascript
class MyPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];  // 存成功回调
    this.onRejectedCallbacks = [];   // 存失败回调

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        // resolve 时，执行所有存的回调
        this.onFulfilledCallbacks.forEach(fn => queueMicrotask(fn));
      }
    };

    const reject = (reason) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => queueMicrotask(fn));
      }
    };

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    if (this.state === 'fulfilled') {
      queueMicrotask(() => onFulfilled(this.value));  // 已成功，包微任务
    }
    if (this.state === 'rejected') {
      queueMicrotask(() => onRejected(this.reason));
    }
    if (this.state === 'pending') {
      // 还在 pending，存起来等 resolve
      this.onFulfilledCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}
```

**为什么回调用数组**：一个 Promise 可以被多次 `.then`，所有回调都要执行。

**第三步：回调变微任务**
- 用 `queueMicrotask` 包回调，让 `.then` 的回调异步执行（符合规范）
- 测试：`new MyPromise(resolve => resolve()).then(() => console.log('then')); console.log('sync');` 输出 `sync then` ✅

### 待完成部分（下次继续）

- [ ] 链式调用（`.then` 返回新 Promise）
- [ ] 错误处理（executor 抛错要 reject）
- [ ] 值穿透（`.then()` 不传参数时的默认行为）

---

## 待复习（下一题起）

- [ ] Q9：TS interface vs type、泛型、unknown/any/never

---

**最后更新**：2026-07-15（闭包、原型链、new、this、call/apply/bind、事件循环过关；Promise 进行中 70%）
