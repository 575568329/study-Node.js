import { Outlet, NavLink, useNavigate } from 'react-router-dom'

function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
        <div className="flex gap-6">
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}>
            任务列表
          </NavLink>
          <NavLink to="/tags" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}>
            标签管理
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-blue-600 font-bold' : 'text-gray-600'}>
            个人中心
          </NavLink>
        </div>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
          退出登录
        </button>
      </nav>

      {/* 子路由渲染位置 */}
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
