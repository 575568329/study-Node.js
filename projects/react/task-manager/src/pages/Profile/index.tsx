import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">个人中心</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-4">
          <label className="text-gray-500 text-sm">用户名</label>
          <p className="font-medium">{user?.username ?? '未登录'}</p>
        </div>
        <div className="mb-4">
          <label className="text-gray-500 text-sm">昵称</label>
          <p className="font-medium">{user?.nickname ?? '-'}</p>
        </div>
        <div className="mb-6">
          <label className="text-gray-500 text-sm">注册时间</label>
          <p className="font-medium">{user?.created_at ?? '-'}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

export default Profile
