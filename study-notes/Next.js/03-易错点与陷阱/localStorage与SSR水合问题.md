# localStorage 与 SSR 水合问题

> 学习日期: 2026-04-09 | 重要程度: ⭐⭐⭐⭐⭐ | 踩坑次数: 3

---

## 核心问题

Next.js 的 `'use client'` 组件**仍然会在服务端预渲染**。服务端没有 `window`、`localStorage`、`document` 等浏览器 API，直接调用会报错。

## 三种错误写法

### ❌ 错误1：组件顶层直接访问 localStorage

```tsx
'use client'
export default function Profile() {
  const user = JSON.parse(localStorage.getItem('user'))  // ❌ SSR 时 localStorage 不存在
}
```

### ❌ 错误2：useState 懒初始化（水合不重新执行）

```tsx
'use client'
export default function AuthGuard({ children }) {
  const [isAuth] = useState(() => {
    if (typeof window === 'undefined') return false   // SSR 返回 false
    return !!localStorage.getItem('token')             // 客户端返回 true
  })
  // 问题：水合时 useState 不会重新执行初始化函数
  // 服务端 isAuth=false → 客户端水合后 isAuth 仍然是 false → 永远加载中
}
```

### ❌ 错误3：React 19 lint 警告 setState in useEffect

```tsx
// React 19 不推荐在 useEffect 中直接 setState，会触发额外渲染
useEffect(() => {
  setUser(data)  // ⚠️ lint 警告
}, [])
```

## ✅ 正确写法

### 场景1：只读取一次数据（Profile 页面）

```tsx
const [user, setUser] = useState<User | null>(() => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem('user')
  return stored ? (JSON.parse(stored) as User) : null
})
// 这个场景不需要 useEffect，因为不需要触发额外逻辑
```

### 场景2：读取后需要触发跳转等副作用（AuthGuard）

```tsx
const [isAuth, setIsAuth] = useState(false)

useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) {
    setIsAuth(true)            // 必须用 useEffect，因为水合后才执行
  } else if (pathname !== '/login') {
    router.push('/login')      // 副作用（跳转）
  } else {
    setIsAuth(true)            // 白名单页面放行
  }
}, [router, pathname])
// 注意：这里的 setState in useEffect 是必要的，忽略 lint 警告
```

## 记忆口诀

> **localStorage 必须在客户端执行：useEffect 或 typeof window 检查后。useState 懒初始化在水合时不会重新执行。**

---

## 踩坑记录

| 场景 | 错误 | 修复 |
|------|------|------|
| Profile 页面 | 组件顶层直接读 localStorage | useState 懒初始化 + typeof window |
| AuthGuard | useState 懒初始化判断 token → 水合后不重新执行 | 改用 useEffect + setState |
| React 19 lint | useEffect 中 setState 报黄 | AuthGuard 是必要场景，忽略警告 |

---

**标签**: #Next.js #SSR #水合 #localStorage #React19 #踩坑
