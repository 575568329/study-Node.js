# Zustand 状态管理

> 学习日期: 2026-04-04 | 置信度: 高

---

## 核心概念

React 轻量级状态管理库。类比 Pinia，但更轻量。

### 语法

```tsx
import { create } from 'zustand'

interface CounterState {
  count: number
  increment: () => void
  reset: () => void
}

const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}))

// 组件中使用
const { count, increment } = useCounterStore()
```

### set 三种写法

```tsx
// 函数式（能拿到旧 state）
set((state) => ({ count: state.count + 1 }))

// 直接赋值（不需要旧 state）
set({ count: 0 })

// 自动合并：只改指定字段，其余保留（不用写 ...state）
```

### 按需订阅

```tsx
// ❌ 任何字段变了都重新渲染
const { count, name } = useStore()

// ✅ 只有 count 变了才渲染
const count = useStore((state) => state.count)
```

## 重点记忆

1. **set 自动合并**：不用写 `...state`，和 React useState 不同
2. **按需订阅**：`useStore((state) => state.xxx)` 防止无意义渲染
3. **零配置**：不需要 Provider 包裹，不需要 main.ts 注册（区别于 Pinia）

## 项目结构

```
stores/
├── useCounterStore.ts
├── useUserStore.ts
└── useCartStore.ts
```

按功能拆分，和 Pinia 的 stores/ 目录结构一样。

## Vue3 对比

| | Pinia | Zustand |
|---|---|---|
| 定义 | `defineStore` | `create` |
| 改值 | `count.value++` 直接改 | `set()` 函数 |
| 响应式 | ref/reactive | set 自动触发 |
| 全局注册 | 需要 `app.use(pinia)` | 不需要 |

---

**标签**: #React #Zustand #状态管理 #已掌握
