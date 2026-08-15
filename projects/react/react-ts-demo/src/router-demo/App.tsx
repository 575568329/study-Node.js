import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Home from './Home'
import About from './About'
import User from './User'
import Login from './Login'
import Dashboard from './Dashboard'
import NotFound from './NotFound'
import QueryDemo from './QueryDemo'

// ============================================================
// 简单的登录状态 hook（演示用）
// 实际项目用 Zustand / Context / localStorage
// ============================================================
function useAuth() {
  return { isLoggedIn: true }  // 改成 false 可测试守卫跳转
}

// ============================================================
// 路由守卫组件（替代 Vue Router 的 beforeEach）
// 原理：普通组件 + useEffect 检查登录状态
// 未登录 → Navigate 跳转 /login
// 已登录 → 渲染 children（子路由）
// ============================================================
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

// ============================================================
// Layout 组件（嵌套路由的父级）
// <Outlet /> = Vue Router 的 <router-view />
// 子路由（Home / About / User）渲染在 Outlet 的位置
// ============================================================
function Layout() {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
      {/* 导航栏 —— 对标 Vue 的 <router-link> */}
      <nav style={{
        display: 'flex',
        gap: 12,
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
        flexWrap: 'wrap',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>🏠 首页</Link>
        <Link to="/about" style={{ textDecoration: 'none' }}>📖 关于</Link>
        <Link to="/user/123" style={{ textDecoration: 'none' }}>👤 用户123</Link>
        <Link to="/user/456?keyword=react" style={{ textDecoration: 'none' }}>🔍 用户456+查询</Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>🔒 Dashboard（受保护）</Link>
        <Link to="/query-demo" style={{ textDecoration: 'none' }}>⚡ Query演示</Link>
      </nav>

      {/* Outlet：子路由在此渲染 */}
      <div style={{ padding: '20px 0' }}>
        <Outlet />
      </div>
    </div>
  )
}

// ============================================================
// 根组件：路由配置（对标 Vue Router 的 routes 数组）
// QueryClientProvider 必须包在路由外层（Context Provider，同 ① 站概念）
// ============================================================
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* ---- 公开路由（不需要登录）---- */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="user/:id" element={<User />} />
        </Route>

        {/* ---- 受保护路由（需要登录）---- */}
        <Route element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* ---- 登录页（不需要守卫）---- */}
        <Route path="/login" element={<Login />} />

        {/* ---- TanStack Query 演示 ---- */}
        <Route path="/query-demo" element={<QueryDemo />} />

        {/* ---- 404 兜底（path="*" 对标 Vue 的 /:pathMatch(.*)*）---- */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
