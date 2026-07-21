# Next.js vs React Router 区别

> 学习日期: 2026-04-09 | 重要程度: ⭐⭐⭐⭐ | 误解次数: 1

---

## 核心区别

Next.js **不使用 react-router-dom**，有自己的一套路由系统。

## API 对照表

| 功能 | React (react-router-dom) | Next.js (next/navigation) |
|------|--------------------------|---------------------------|
| 导航链接 | `<NavLink to="/xxx">` | `<Link href="/xxx">` |
| 高亮当前路由 | `className={({ isActive }) => ...}` | `usePathname()` 手动比较 |
| 编程式跳转 | `useNavigate()` → `navigate('/xxx')` | `useRouter()` → `router.push('/xxx')` |
| 路由守卫 | `<Navigate to="/login" replace />` | `router.push('/login')` in useEffect |
| 动态路由参数 | `useParams()` | `params` (需 await) |

## 代码对比

### 导航链接 + 高亮

```tsx
// ❌ React Router 写法（Next.js 会报错）
import { NavLink } from 'react-router-dom'
<NavLink to="/tasks" className={({ isActive }) => isActive ? 'text-blue-600' : ''}>
  任务列表
</NavLink>

// ✅ Next.js 写法
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const pathname = usePathname()
<Link href="/tasks" className={pathname === '/tasks' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
  任务列表
</Link>
```

### 编程式跳转

```tsx
// ❌ React Router
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/login')

// ✅ Next.js
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push('/login')
```

## 记忆口诀

> **Next.js 路由：Link 配 href，push 换 navigate，usePathname 手动高亮。**

---

**标签**: #Next.js #React-Router #路由 #迁移 #易混淆
