---
tags: [面试, Python, 突击]
创建时间: 2026-07-11
状态: 突击中
---

# Python 面试高频清单(突击版)

> 来源:对比知乎 / CSDN / 百度智能云 / 阿里云 / 面试鸭等 2025-2026 题库整理。每题「一句话答案 + 关键点 + 追问」,能背能用。

## ⭐ 必问 4 件套(GIL / asyncio / 装饰器 / 生成器)

### 1. GIL(全局解释器锁)
- **一句话**:CPython 的锁,**同一时刻只允许一个线程执行 Python 字节码**。
- **为什么**:引用计数内存管理非线程安全,GIL 保护。
- **影响**:CPU 密集多线程**不能真并行**;I/O 密集多线程**可以**(I/O 时释放 GIL)。
- **绕开**:CPU 密集 → **多进程**(multiprocessing)或 C 扩展/NumPy;I/O 密集 → **多线程/asyncio**。
- **追问**:Python 3.13+ PEP 703 可选禁用 GIL(实验性)。

### 2. asyncio / 事件循环 / 协程
- **协程**:`async def` 定义,`await` 挂起,单线程内协作式并发。
- **事件循环(Event Loop)**:调度器,轮询就绪任务,遇 I/O 挂起切别的。
- **协程 vs 线程**:协程用户态切换(轻量、单线程);线程系统调度(抢占、开销大)。协程适合 I/O 密集。
- **`asyncio.run(coro)`**:启动事件循环跑协程(顶层入口)。
- **追问**:Python 无顶层 await,必须事件循环驱动 → 所以要 `asyncio.run()`。

### 3. 装饰器(必会写)
- **本质**:接收函数、返回函数的高阶函数,不改原函数加功能。
```python
def log(func):
    def wrapper(*args, **kwargs):
        print(f"调用 {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log               # = greet = log(greet)
def greet(name): return f"hi {name}"
```
- **带参装饰器**:三层嵌套(外层收参,中层收函数,内层 wrapper)。
- **`@functools.wraps`**:保留原函数元信息(否则 `__name__` 变 wrapper)。
- **场景**:日志、权限、缓存(`@lru_cache`)、路由(Flask `@app.route`)。
- **关联**:AgentScope 的 `@tool` 注册工具、`@contextmanager` 都是装饰器。

### 4. 生成器 / 迭代器
- **生成器**:`yield` 的函数,惰性求值(用时才算),省内存。
- **迭代器**:实现 `__iter__` + `__next__` 的对象。
- **生成器 vs 列表**:生成器不一次算完(省内存);列表一次算完(快但占内存)。
- **生成器表达式**:`(x*2 for x in nums)` vs 列表推导 `[x*2 for x in nums]`。
- **场景**:读大文件、无限序列、流式(LLM 流式输出本质就是生成器)。

## 🔴 高频 6 件套

### 5. 闭包
- 嵌套函数,内层引用外层变量,外层返回后内层仍能访问。装饰器的基础。
- **陷阱**:延迟绑定(循环里创建闭包,变量是最后值)。

### 6. 深浅拷贝
- **浅拷贝(`copy.copy`)**:只复制外层,嵌套对象仍共享(改了影响原)。
- **深拷贝(`copy.deepcopy`)**:递归复制所有层,完全独立。
- **默认参数陷阱**:`def f(x=[])` 多次调用共享同一个 `[]`(累积)!用 `None` 替代:
```python
def f(x=None):
    if x is None: x = []
```

### 7. 垃圾回收(GC)
- **引用计数**(主):引用归 0 立即回收。缺点:循环引用。
- **标记清除**(辅):解决循环引用(从根遍历,不可达的回收)。
- **分代回收**(辅):新对象死得快、老对象活得久,分代不同频率回收(提效)。

### 8. 可变 vs 不可变
- **可变**:list/dict/set(改了 id 不变)。
- **不可变**:int/str/tuple/frozenset(改了创建新对象,id 变)。
- **追问**:tuple 里装 list?(tuple 引用不变,内部 list 可改 —— "不可变"指引用)。

### 9. *args / **kwargs
- `*args`:位置参数 → tuple。`**kwargs`:关键字参数 → dict。
- 顺序:普通参数 → `*args` → `**kwargs`。

### 10. 上下文管理器(with)
- 自动管理资源(文件/连接/锁)。
- 实现:类(`__enter__`/`__exit__`)或 `@contextlib.contextmanager` + 生成器。
- 场景:`with open(...) as f`。

## 🟡 中高级(被深问才补)

### 11. MRO / super
- **MRO**(方法解析顺序):多继承找方法的顺序(C3 线性化)。
- **super()**:按 MRO 链调下一个(不一定是直接父类)。

### 12. Pythonic
- 推导式、`enumerate`、`zip`、切片、三元、鸭子类型(看方法不看类型)、PEP 8。

## 📚 参考来源(对比过)

- [Python 面试题汇总 2025(知乎)](https://zhuanlan.zhihu.com/p/1917296623387672608)
- [100 个高频考点(百度智能云)](https://cloud.baidu.com/article/4208396)
- [Python 三大器(阿里云)](https://developer.aliyun.com/article/1099654)
- [面试鸭 2026 真题](https://www.mianshiya.com/bank/1810643768400019458)
- [170 道面试题 PDF](https://drago1234.github.io/Surviving_kits/data/2021_summer/(Q&A)Python--170_most_common_coding_questions.pdf)

## 🎯 突击建议

1. **必问 4 件套**(GIL/asyncio/装饰器/生成器):会**写**装饰器、能讲清 GIL 影响、asyncio 事件循环 —— 1-2 天死磕。
2. **高频 6 件套**:能背一句话答案 + 避坑(默认参数陷阱、深浅拷贝)—— 半天。
3. **关联你的实战**:装饰器↔AgentScope @tool、生成器↔LLM 流式、asyncio↔AgentScope reply_stream —— 用学过的锚定,记得牢。
