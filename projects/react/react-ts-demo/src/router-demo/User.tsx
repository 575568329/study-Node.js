import { useParams, useSearchParams, useNavigate } from 'react-router-dom'

function User() {
  // useParams() → 拿动态参数 /user/:id 里的 :id
  const { id } = useParams()

  // useSearchParams() → 拿查询参数 ?keyword=xxx
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('keyword')

  const navigate = useNavigate()

  const dividerStyle: React.CSSProperties = {
    borderTop: '1px solid #ddd',
    margin: '16px 0',
  }

  return (
    <div>
      <h2>用户详情</h2>
      <p><strong>动态参数 id:</strong> {id}</p>
      {keyword && <p><strong>查询参数 keyword:</strong> {keyword}</p>}
      <div style={dividerStyle} />
      <p>试试改 URL：</p>
      <ul>
        <li>把 id 改成 <code>456</code> → 看页面变化</li>
        <li>加 <code>?keyword=react</code> → 看查询参数</li>
      </ul>
      <div style={dividerStyle} />
      <button onClick={() => navigate('/')}>navigate('/') 回首页</button>
      <button onClick={() => navigate(-1)} style={{ marginLeft: 8 }}>
        navigate(-1) 后退
      </button>
    </div>
  )
}

export default User
