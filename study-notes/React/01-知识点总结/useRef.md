# useRef 引用管理

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

`useRef` 返回一个可变容器 `{ current: value }`，类似 Vue3 的模板引用。修改 `.current` **不会触发重新渲染**。

## 代码示例

```tsx
// DOM 引用
const inputRef = useRef<HTMLInputElement>(null)
useEffect(() => {
  inputRef.current?.focus()  // 自动聚焦
}, [])
// JSX: <input ref={inputRef} />

// 存储可变值（不触发渲染）
const timerRef = useRef<number>(0)
timerRef.current = setInterval(...)  // 改 .current 不触发渲染
```

## Vue3 对比

| Vue3 | React | 说明 |
|------|-------|------|
| `ref<HTMLInputElement>(null)` | `useRef<HTMLInputElement>(null)` | 声明 |
| `inputRef.value` | `inputRef.current` | 访问值 |
| `inputRef.value?.focus()` | `inputRef.current?.focus()` | 使用方式 |

## 为什么是 .current？

`useRef` 内部返回的就是 `{ current: initialValue }`。包在对象里才能通过修改属性来保留引用——如果直接返回值本身，函数重新执行时会被覆盖。

```typescript
// 简化原理
function useRef<T>(initial: T) {
  return { current: initial }  // 可变容器
}
```

## 关键要点
1. `.current` 可读写，修改不触发渲染
2. 适合存 DOM 引用、定时器 ID、上一次值等
3. 与 useState 区别：useState 改了会重新渲染，useRef 不会

---

**标签**: #React #Hooks #useRef #高置信度
