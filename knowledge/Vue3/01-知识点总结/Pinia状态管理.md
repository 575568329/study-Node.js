# Pinia 状态管理

> 学习日期: 2026-03-31 | 置信度: 高

---

## 核心概念

Pinia 是 Vuex 的替代品。核心简化：**去掉 mutations，actions 直接改 state**。

```
Vuex:  state → mutations (同步) → actions (异步)  三层
Pinia: state → actions (同步异步都行)              一层
```

## Setup Store 写法

```typescript
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)                          // state
  const doubleCount = computed(() => count.value * 2) // getter
  const increment = () => count.value++               // action (同步)
  const fetchRandom = async () => {                   // action (异步)
    const res = await fetch(url)
    count.value = (await res.text()).length           // 直接改 state
  }
  return { count, doubleCount, increment, fetchRandom }
})
```

## storeToRefs（关键！）

```typescript
const store = useCounterStore()

// ❌ 直接解构 — 丢失响应性
const { count } = store

// ✅ storeToRefs — 保持响应性
const { count, doubleCount } = storeToRefs(store)

// 方法不需要 storeToRefs
const { increment } = store
```

---

**标签**: #Vue3 #Pinia #高置信度
