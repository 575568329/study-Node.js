# Composables 设计模式

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

Composable = 封装可复用响应式逻辑的函数。命名 `useXxx`，返回响应式数据和方法。

## 为什么替代 Mixin？

| Mixin 问题 | Composable 解决方案 |
|-----------|-------------------|
| 来源不明（模板里的变量不知道从哪来） | 显式解构 `const { count } = useCounter()` |
| 命名冲突（静默覆盖） | 可重命名 `const { count: c } = useCounter()` |
| TS 类型推导差 | 完美类型推导 |

## 实战示例

```typescript
// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial)
  const increment = () => count.value++
  return { count, increment }
}

// 组件中使用 — 清晰明确
const { count, increment } = useCounter()
```

---

**标签**: #Vue3 #Composables #高置信度
