# 2026-04-03 React+TS 学习会话

## 会话概述
- **时长**: ~60 分钟
- **范围**: R1 剩余 ~ R4 全部（8/28 → 16/28, 57%）
- **方式**: Vue3 对比教学 + 苏格拉底式提问

---

## 课前小测结果

| 题号 | 类型 | 结果 | 置信度 | 备注 |
|------|------|------|--------|------|
| Q1 | 预测试（条件/列表渲染） | ⚠️ | 中 | 思路对但写了 console.log 而非 JSX |
| Q2 | 预测试（useMemo） | ❌ | 低 | 零基础（正常） |
| Q3 | 盲区（useEffect 时机） | ✅ | 高 | B→A 正确，P0 盲区解除 |
| Q4 | 盲区（状态不可变） | ⚠️ | 中 | 知道写法A有问题但说不清原因 |
| Q5 | 随机（子传父） | ❌ | 低 | 已掌握内容出现遗忘 |
| Q6 | 跨技能（Composable vs Hook） | ❌ | 低 | 不确定（正常） |

---

## 学习内容

### R1 条件渲染 + 列表渲染
- 三元运算符替代 v-if，&& 替代 v-if（无else），.map() 替代 v-for
- `{}` 中只能放表达式，不能放 if/for 语句
- key 优先用唯一 ID 而非 index

### R2 useMemo / useCallback
- useMemo = Vue3 computed，缓存计算值，手动声明依赖
- useCallback = useMemo 的函数专用语法糖，缓存函数引用
- 页面看不出区别，解决的是性能问题

### R3 useContext
- 解决 props 层层传递（prop drilling）
- 三步：createContext → Provider value → useContext 取值
- = Vue3 provide/inject，只适合跨层级全局数据

### R3 useReducer
- 复杂状态管理，多个操作集中在 reducer 函数中
- 语法：`const [state, dispatch] = useReducer(reducer, 初始值)`
- reducer = 操作逻辑集合，dispatch = 触发器
- useState 直接给结果，dispatch 描述意图

### R3 自定义 Hook
- = Vue3 Composable，逻辑复用
- 命名 use 开头，返回组件需要的数据和方法
- 单组件用写组件内，多组件用抽到 hooks/ 文件夹

### R4 React 事件类型
- `React.ChangeEvent<HTMLInputElement>` 等 TS 类型标注
- 绑定事件和类型标注是两件事：onChange=绑定，类型=TS检查
- 多数情况让 TS 自动推导

### R4 泛型组件
- 让组件支持多种数据类型
- `function List<T>({ items }: { items: T[] })`
- React.ReactNode = 所有可渲染类型

### R4 forwardRef
- 让父组件访问子组件内部 DOM
- 子组件 forwardRef 包裹，父组件 useRef + 传 ref
- 很少用，常见场景：输入框聚焦

---

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| useCallback 在页面上的表现是什么？ | 页面看不出区别，是性能优化（减少无意义渲染） |
| useCallback 就是 useMemo 的语法糖？ | 对，专门为缓存函数设计，写法更简洁 |
| useMemo 针对变量，useCallback 针对函数？ | 准确，useMemo 缓存任意值，useCallback 缓存函数 |
| useContext 和 useReducer 为什么放一起讲？ | 其实不该放一起，解决不同问题 |
| 自定义 Hook 要抽到单独文件吗？ | 看复用需求，多组件用就抽 |
| React 事件类型绑定了就能监听吗？ | 类型和绑定是两件事，onChange 才是绑定 |
| React.ReactNode 一定要用吗？ | 不一定，JSX.Element 更窄，React.ReactNode 更安全 |
| 多个子组件怎么区分 ref？ | 固定数量用多个 ref，动态列表用 ref 回调存数组 |
| 大写开头就是组件？ | 对，React 看首字母区分组件和 HTML 标签 |

## 教学反馈（用户要求）

1. **介绍新内容时先讲语法格式**：比如 useReducer(reducer, []) 要先解释参数含义
2. **不相关的概念要明确告知**：避免学生硬找关联
3. **教学时说明"和XX无关/有关"**：避免混淆

---

## ❌ 错误记录（复习重点）

### 错误1：条件渲染用 console.log
- **错误内容**: `isLoggedIn ? console.log('欢迎') : console.log('登录')`
- **错误原因**: 混淆 JS 逻辑和 JSX 渲染，React 返回 JSX 不是执行函数
- **纠正**: 返回 JSX 元素 `{isLoggedIn ? <div>欢迎</div> : <div>登录</div>}`

### 错误2：子传父通信遗忘
- **错误内容**: 课前小测完全忘了怎么实现
- **错误原因**: 上次学过但间隔 3 天出现遗忘
- **纠正**: React 事件就是函数 props，子组件直接调用

---

## 下次学习计划
- [ ] R5 路由与数据获取（React Router v6）
- [ ] R6 状态管理（Zustand）
- [ ] R7 样式方案（Tailwind CSS）
- [ ] R8 实战项目
