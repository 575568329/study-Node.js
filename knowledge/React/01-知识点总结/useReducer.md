# useReducer

> 学习日期: 2026-04-03 | 置信度: 高

---

## 核心概念

用于管理**复杂状态**。当状态操作多、逻辑复杂时，比 useState 更清晰。

### 语法

```tsx
const [state, dispatch] = useReducer(reducer函数, 初始值)
```

- `reducer函数`：定义各种操作的处理逻辑（switch-case）
- `初始值`：state 的初始数据
- `state`：当前状态数据
- `dispatch`：触发器，调用它发送操作指令

### 完整示例

```tsx
// 1. 定义 Action 类型
type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'delete'; id: number }

// 2. 定义 reducer 函数（所有操作逻辑集中在这里）
function todoReducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }]
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t)
    case 'delete':
      return state.filter(t => t.id !== action.id)
  }
}

// 3. 使用
const [todos, dispatch] = useReducer(todoReducer, [])

// 4. 触发操作
dispatch({ type: 'add', text: '学习React' })
```

## 执行流程

```
组件调用 dispatch({ type: 'add', text: '...' })
        ↓
reducer 函数根据 type 执行对应逻辑
        ↓
返回新 state
        ↓
组件拿到新的 state，重新渲染
```

## useState vs useReducer

| | useState | useReducer |
|---|---|---|
| 适用场景 | 简单状态（数字、字符串） | 复杂状态（多种操作） |
| 更新方式 | `setCount(1)` 直接设值 | `dispatch({ type: 'xxx' })` 描述意图 |
| 逻辑位置 | 分散在各处 | 集中在 reducer 函数中 |
| 类比 Vue3 | `ref()` | Pinia store |

## Vue3 对比

```
Vue3 Pinia:   state → actions (同步异步)     一层
React:        useReducer → reducer + dispatch 一层
```

---

**标签**: #React #useReducer #状态管理 #已掌握
