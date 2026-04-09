'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar(){
  const router = useRouter()
  const pathname = usePathname()
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }
  if (pathname === '/login' || pathname === '/register') return null
  return (
    
    <div>
    <div className="flex gap-6">
      <Link href="/tasks" className={pathname==='/tasks' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
        任务列表
      </Link>
      <Link href="/tags" className={pathname==='/tags' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
        标签管理
      </Link>
      <Link href="/profile" className={pathname==='/profile' ? 'text-blue-600 font-bold' : 'text-gray-600'}>
        个人中心
      </Link>
    </div>
    <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
      退出登录
    </button>
    </div>
  )
}