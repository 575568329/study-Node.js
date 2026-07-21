# React Hooks 速查表（Vue3 开发者版）

> 学习日期: 2026-03-31

---

## 状态管理

```tsx
// Vue3: const count = ref(0)    → count.value++
// React:
const [count, setCount] = useState(0)
setCount(count + 1)          // 直接设值
setCount(prev => prev + 1)   // 函数式更新（推荐）
```

## 副作用

```tsx
// Vue3: watch + onMounted + onUnmounted
// React: useEffect 一把梭

// = onMounted（挂载时）
useEffect(() => { ... }, [])

// = watch([count])（count 变化时）
useEffect(() => { ... }, [count])

// = onUnmounted（卸载时）
useEffect(() => {
  return () => { /* 清理 */ }
}, [])
```

## 引用

```tsx
// Vue3: const el = ref<HTMLInputElement>(null)  → el.value
// React:
const el = useRef<HTMLInputElement>(null)  → el.current
```

## 组件 Props

```tsx
// Vue3: defineProps<{...}>() + defineEmits<{...}>()
// React: 全在函数参数里

interface Props {
  title: string
  onRemove: (id: number) => void  // 事件 = 函数 props
}
function Comp({ title, onRemove }: Props) { ... }
```

## 列表渲染

```tsx
// Vue3: <li v-for="item in list" :key="item.id">
// React:
{list.map(item => <li key={item.id}>{item.name}</li>)}
```

## 条件渲染

```tsx
// Vue3: <Comp v-if="show" />
// React:
{show && <Comp />}
{type === 'a' ? <A /> : <B />}
```
