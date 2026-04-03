# useContext

> 学习日期: 2026-04-03 | 置信度: 高

---

## 核心概念

解决 **props 层层传递**（prop drilling）的问题。祖先组件提供数据，任意深层子组件直接取用，中间层不需要转发。

### 语法

```tsx
// 1. 创建 Context
const ThemeContext = createContext<string>('light')

// 2. 祖先组件：Provider 提供数据
<ThemeContext.Provider value="dark">
  <Child />
</ThemeContext.Provider>

// 3. 任意深层子组件：useContext 取数据
const theme = useContext(ThemeContext)
```

## 关键要点

1. `createContext()` 创建管道（只需创建一次）
2. `<Context.Provider value={xxx}>` 包裹子组件，往管道塞数据
3. `useContext(Context)` 在任意深层子组件中取数据
4. 中间层组件完全不需要知道 Context 的存在

## 使用场景

只适合**跨层级传递**的全局数据：
- 主题（dark/light）
- 用户登录信息
- 语言国际化

**不适合**替代所有 props，普通父子组件直接用 props 更清晰。

## Vue3 对比

| Vue3 | React |
|------|-------|
| `provide('key', value)` | `<Context.Provider value={value}>` |
| `inject('key')` | `useContext(Context)` |
| 字符串 key | 对象引用 |

---

**标签**: #React #useContext #跨组件通信 #已掌握
