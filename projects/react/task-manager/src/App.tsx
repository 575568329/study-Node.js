/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-04-06 10:58:00
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-04-06 11:51:10
 * @FilePath: \Node.js-Study\projects\react\task-manager\src\App.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import TagManage from './pages/TagManage'
import TaskList from './pages/TaskList'
import Layout from './components/Layout'

// 路由守卫：未登录跳转到登录页
function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 登录页（不需要布局） */}
        <Route path="/login" element={<Login />} />

        {/* 需要登录的页面，共享 Layout 布局 */}
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<Navigate to="/tasks" replace />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="tags" element={<TagManage />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App