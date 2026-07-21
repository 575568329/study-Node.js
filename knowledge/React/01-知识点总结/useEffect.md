# useEffect 副作用处理

> 学习日期: 2026-03-31 | 置信度: 中（执行时机需巩固）

---

## 核心概念

`useEffect` 是 React 处理副作用的 Hook，相当于 Vue3 的 **`watch` + `onMounted` + `onUnmounted`** 的合体。

**关键：useEffect 在渲染之后执行（不是渲染之前）。**

## 代码示例

```tsx
// 等价于 watch — count 变化时执行
useEffect(() => {
  console.log('count 变了:', count)
}, [count])  // 依赖数组

// 等价于 onMounted — 只执行一次
useEffect(() => {
  console.log('组件挂载')
  return () => console.log('组件卸载')  // return = onUnmounted
}, [])  // 空依赖数组

// 清理副作用（定时器、事件监听等）
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000)
  return () => clearInterval(timer)  // 清理函数
}, [])
```

## Vue3 对比

| Vue3 | React | 说明 |
|------|-------|------|
| `onMounted(() => ...)` | `useEffect(() => ..., [])` | 挂载时 |
| `onUnmounted(() => ...)` | `useEffect(() => () => ..., [])` | 卸载时（return 函数） |
| `watch(count, cb)` | `useEffect(cb, [count])` | 监听变化 |
| watch 在 DOM 更新前 | useEffect 在 DOM 更新后 | 执行时机不同 |

## ❌ 常见错误与纠正（复习重点）⚠️

### 错误：useEffect 执行时机
- **学生原答**: "React 在组件渲染前就执行了"
- **错误原因**: 可能和 Vue3 的 watch（DOM 更新前执行）混淆了
- **正确理解**: useEffect 在**渲染后**执行（DOM 已更新完毕）
- **执行顺序**: 函数体执行 → DOM 更新 → useEffect 执行

## 关键要点
1. 渲染**后**执行，不是渲染前
2. 依赖数组控制何时重新执行：`[]` = 一次，`[dep]` = dep 变时
3. return 函数 = 清理副作用

---

**标签**: #React #Hooks #useEffect #需巩固
