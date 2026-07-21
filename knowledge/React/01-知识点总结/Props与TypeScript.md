# Props 与 TypeScript 接口定义

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

React Props 通过**函数参数**接收，用 TypeScript interface 定义类型。事件也是普通函数 props，没有 Vue3 的 `defineEmits` 概念。

## 代码示例

```tsx
interface TodoItemProps {
  text: string
  index: number
  onRemove: (index: number) => void  // 事件就是函数 props
}

function TodoItem({ text, index, onRemove }: TodoItemProps) {
  return (
    <li>
      {text}
      <button onClick={() => onRemove(index)}>删除</button>
    </li>
  )
}
```

## Vue3 对比

```typescript
// Vue3 — 事件用 defineEmits 单独定义
const props = defineProps<{ text: string; index: number }>()
const emit = defineEmits<{ remove: [index: number] }>()

// React — 事件就是普通 props，更简单直接
function TodoItem({ text, index, onRemove }: Props) { ... }
```

## 关键要点
1. 用 `interface` 定义 Props 类型，解构接收
2. 事件回调就是普通函数 props，无需 emit
3. 子组件想传数据给父组件 → 父组件传一个回调函数下来

---

**标签**: #React #Props #TypeScript #高置信度
