import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    // 模拟登录：实际项目会调 API 拿 token 存 localStorage
    // 登录成功后跳转到 dashboard
    navigate('/dashboard')
  }

  return (
    <div>
      <h2>登录页</h2>
      <p>这个页面不需要登录就能访问（没有被 RequireAuth 包裹）。</p>
      <button onClick={handleLogin}>模拟登录 → 跳转 Dashboard</button>
    </div>
  )
}

export default Login
