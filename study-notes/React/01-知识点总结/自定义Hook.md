# 自定义 Hook

> 学习日期: 2026-04-03 | 置信度: 高

---

## 核心概念

把组件里重复的逻辑抽出来复用。本质就是一个函数，内部可以使用其他 Hook。

### 语法

```tsx
function useXxx(参数) {
  // 内部使用 useState、useEffect 等 Hook
  return { 数据, 方法 }  // 返回组件需要的东西
}
```

### 示例

```tsx
// hooks/useTodos.ts
function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  const add = (text: string) => {
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }])
  }

  const toggle = (id: number) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const remove = (id: number) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  return { todos, add, toggle, remove }
}

// 组件中使用
const { todos, add, toggle, remove } = useTodos()
```

## 关键要点

1. 命名必须 `use` 开头（`useTodos`、`useCounter`）
2. 内部可以调用其他 Hook
3. 只在当前组件用 → 写组件里；多个组件用 → 抽到 `hooks/` 文件夹
4. 大写开头 → React 组件；`use` 开头 → 自定义 Hook

## Vue3 对比

完全等价于 Vue3 的 Composable：

```
Vue3: composables/useCounter.ts   → export function useCounter() { ... }
React: hooks/useCounter.ts        → export function useCounter() { ... }
```

---

**标签**: #React #自定义Hook #逻辑复用 #已掌握
