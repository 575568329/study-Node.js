# React Hooks 使用规则与常见错误

> 学习日期: 2026-04-09 | 重要程度: ⭐⭐⭐⭐⭐ | 踩坑次数: 2

---

## 规则1：Hook 只能在组件顶层调用

```tsx
// ❌ 错误：在普通函数里调用 Hook
function handleLogout() {
  const router = useRouter()   // ❌ 报错：Hook 不能在非组件/非 Hook 函数中调用
  router.push('/login')
}

// ✅ 正确：在组件顶层调用，函数里直接使用
export default function Profile() {
  const router = useRouter()   // ✅ 组件顶层

  function handleLogout() {
    router.push('/login')      // ✅ 使用已声明的 router
  }
}
```

## 规则2：localStorage 不能在组件顶层直接访问

```tsx
// ❌ 错误：SSR 时 localStorage 不存在
'use client'
export default function Page() {
  const user = JSON.parse(localStorage.getItem('user'))  // ❌
}

// ✅ 正确：用 useState 懒初始化或 useEffect
const [user, setUser] = useState<User | null>(() => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  return stored ? (JSON.parse(stored) as User) : null
})
```

## 规则3：useEffect 依赖数组必须完整

```tsx
// ❌ 缺少依赖
useEffect(() => {
  if (!isAuth) router.push('/login')
}, [isAuth])  // ⚠️ ESLint 报黄：缺少 router

// ✅ 补全依赖
useEffect(() => {
  if (!isAuth) router.push('/login')
}, [isAuth, router])
```

## 规则4：React 19 新规则 — 慎用 setState in useEffect

```tsx
// ⚠️ React 19 不推荐（触发额外渲染）
useEffect(() => {
  setUser(data)  // lint 警告
}, [])

// ✅ 优先用 useState 懒初始化
const [user] = useState(() => computeInitialState())

// ⚠️ 但某些场景（如 AuthGuard 的水合后检查）必须用 useEffect + setState，可忽略警告
```

## 规则5：useState 懒初始化 vs useEffect

| | useState(() => {...}) | useEffect(() => {...}, []) |
|---|---|---|
| 执行时机 | 首次渲染（含 SSR） | 挂载后（仅客户端） |
| SSR 环境中 | ✅ 执行（但 window 不可用） | ❌ 不执行 |
| 水合时重新执行 | ❌ 不会 | N/A |
| 触发额外渲染 | ❌ 不会 | ⚠️ 会 |
| 适合场景 | 初始值计算 | 副作用（跳转、订阅、读 localStorage 后做逻辑） |

## 记忆口诀

> **Hook 顶层调，localStorage 客户端跑，依赖数组要写全。**

---

**标签**: #React #Hooks #useEffect #useState #规则 #踩坑
