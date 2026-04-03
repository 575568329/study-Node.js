# useMemo 与 useCallback

> 学习日期: 2026-04-03 | 置信度: 高

---

## 核心概念

两个 Hook 都是**性能优化工具**，用于缓存值避免不必要的重新计算/创建。

### useMemo — 缓存计算值

**语法**: `useMemo(() => 计算结果, [依赖数组])`

```tsx
const filteredItems = useMemo(() => {
  return items.filter(item => item.includes(keyword))
}, [items, keyword])
// 只有 items 或 keyword 变了才重新计算
```

### useCallback — 缓存函数

**语法**: `useCallback(() => { 函数体 }, [依赖数组])`

```tsx
const handleClick = useCallback(() => {
  setCount(c => c + 1)
}, [])  // 空依赖 → 函数引用永远不变
```

## 关键要点

1. **useCallback 是 useMemo 的语法糖**：`useCallback(fn, deps)` = `useMemo(() => fn, deps)`
2. **useMemo 缓存任意值**（变量、对象、计算结果）
3. **useCallback 缓存函数**（让函数引用稳定）
4. 依赖数组手动声明（和 useEffect 一样），不像 Vue3 computed 自动追踪
5. **页面上看不出区别**，解决的是性能问题（减少无用渲染）

## 使用场景

| 场景 | 用哪个 |
|------|--------|
| 昂贵的计算结果缓存 | `useMemo` |
| 函数传给子组件（防止子组件无意义渲染） | `useCallback` |
| 函数作为 useEffect 依赖 | `useCallback` |
| 只在当前组件内用的函数 | 不需要 |

## Vue3 对比

```
Vue3:  const double = computed(() => count.value * 2)   // 自动追踪依赖
React: const double = useMemo(() => count * 2, [count]) // 手动声明依赖
```

---

**标签**: #React #useMemo #useCallback #性能优化 #已掌握
