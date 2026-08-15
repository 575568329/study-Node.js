import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div>
      <h2>404 - 页面不存在</h2>
      <p>你访问的路径没有匹配到任何路由。</p>
      <p>这就是 <code>path="*"</code> 通配符的作用 —— 对标 Vue Router 的 <code>/:pathMatch(.*)*</code></p>
      <Link to="/">回首页</Link>
    </div>
  )
}

export default NotFound
