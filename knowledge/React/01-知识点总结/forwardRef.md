# forwardRef

> 学习日期: 2026-04-03 | 置信度: 中

---

## 核心概念

让父组件能访问子组件内部的 DOM 元素。默认情况下 ref 传不进子组件。

### 语法

```tsx
const 组件 = forwardRef((props, ref) => {
  return <div ref={ref}>{/* ... */}</div>
})
```

### 示例

```tsx
// 子组件：用 forwardRef 包裹，接收 ref
const MyInput = forwardRef((props: { placeholder: string }, ref: Ref<HTMLInputElement>) => {
  return <input ref={ref} placeholder={props.placeholder} />
})

// 父组件
function App() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <MyInput ref={inputRef} placeholder="请输入" />
}
```

### 多个子组件的 ref

```tsx
// 固定数量：多个 ref
const input1 = useRef<HTMLInputElement>(null)
const input2 = useRef<HTMLInputElement>(null)

// 动态列表：ref 回调存到数组
const refs = useRef<(HTMLInputElement | null)[]>([])
<input ref={el => { refs.current[i] = el }} />
```

## 关键要点

1. 子组件必须用 `forwardRef` 包裹才能接收 ref
2. 很少用，常见场景：封装输入框（聚焦）或滚动容器（滚动控制）
3. Vue3 对应 `defineExpose` + 模板引用

## Vue3 对比

```
Vue3:  子组件 defineExpose({ method })  +  父组件 const child = ref(null)
React: 子组件 forwardRef 包裹           +  父组件 useRef + 传 ref
```

---

**标签**: #React #forwardRef #ref #已掌握
