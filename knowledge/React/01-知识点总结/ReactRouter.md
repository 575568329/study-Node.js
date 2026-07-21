# React Router v6

> 学习日期: 2026-04-04 | 置信度: 高

---

## 核心概念

React 的路由方案，管理页面跳转和 URL 参数。类似 Vue Router 4。

### 语法

```tsx
// 路由配置
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/user/:id" element={<User />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>

// 页面跳转
import { Link, useNavigate } from 'react-router-dom'
<Link to="/about">关于</Link>
const navigate = useNavigate()
navigate('/about')
navigate(-1)  // 后退

// 获取参数
import { useParams, useSearchParams } from 'react-router-dom'
const { id } = useParams()  // 动态参数 /user/:id
const [searchParams] = useSearchParams()
const keyword = searchParams.get('keyword')  // 查询参数 ?keyword=xxx
```

### 导航守卫

React Router 没有内置守卫，用组件包裹实现：

```tsx
function RequireAuth({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])
  return isLoggedIn ? <>{children}</> : null
}

// 包裹一组路由
<Route element={<RequireAuth><Outlet /></RequireAuth>}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/settings" element={<Settings />} />
</Route>
```

- `<Outlet />` = Vue3 的 `<router-view />`，子路由渲染位置
- `<>{children}</>` = Vue3 的 `<slot />`，插槽

## Vue3 对比

| Vue Router 4 | React Router v6 |
|---|---|
| routes 数组 | `<Routes><Route>` JSX |
| `<router-link to>` | `<Link to>` |
| `router.push()` | `navigate()` |
| `useRoute().params.id` | `useParams().id` |
| `useRoute().query.k` | `useSearchParams().get('k')` |
| `router.back()` | `navigate(-1)` |
| `beforeEach` 全局守卫 | 组件包裹守卫 |
| `/:pathMatch(.*)*` | `path="*"` |

---

**标签**: #React #路由 #已掌握
