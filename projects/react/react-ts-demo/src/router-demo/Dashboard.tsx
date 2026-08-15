function Dashboard() {
  return (
    <div>
      <h2>Dashboard（受保护页面）</h2>
      <p>✅ 你看到了这个页面，说明"路由守卫"没拦截你。</p>
      <p>在实际项目中，RequireAuth 组件会检查登录状态，未登录会自动跳转到 /login。</p>
    </div>
  )
}

export default Dashboard
