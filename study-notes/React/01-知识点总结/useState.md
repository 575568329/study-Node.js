# useState 状态管理

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

React 的基础状态 Hook，等价于 Vue3 的 `ref`。返回 `[状态值, setter函数]` 的元组。

**核心原则：状态不可变（Immutable）**，必须通过 setter 创建新值，不能直接修改。

## 代码示例

```tsx
// 基本用法
const [count, setCount] = useState(0)
setCount(count + 1)         // ✅
count++                      // ❌ 不会触发渲染

// 对象/数组状态 — 必须创建新引用
const [todos, setTodos] = useState<string[]>([])
setTodos([...todos, newItem])     // ✅ 展开创建新数组
todos.push(newItem)               // ❌ 直接修改原数组

// 函数式更新（基于前一个状态）
setCount(prev => prev + 1)        // ✅ 安全更新
```

## Vue3 对比

| Vue3 | React | 说明 |
|------|-------|------|
| `ref(0)` | `useState(0)` | 状态声明 |
| `count.value++` | `setCount(n => n+1)` | 更新方式 |
| 自动追踪变化 | 必须调 setter | 更新机制 |
| 精确更新 | 函数整体重新执行 | 渲染策略 |

## ❌ 常见错误与纠正（复习重点）⚠️

### 错误：直接修改状态
- **错误示例**: `todos.push(newItem)` 或 `count++`
- **错误原因**: 只改了局部变量，React 不知道状态变了
- **正确做法**: `setTodos([...todos, newItem])` — 创建新数组
- **如何避免**: 永远用 setter，永远创建新引用（展开运算符、filter 等）

## 关键要点
1. 解构 `[state, setState]` 是固定模式
2. 不能直接修改状态，必须创建新值
3. setter 可以接收函数：`setState(prev => newValue)`

---

**标签**: #React #Hooks #useState #高置信度
