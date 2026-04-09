'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuth(true)                    // eslint 警告可忽略，这是必要的水合后检查
    } else if (pathname !== '/login' && pathname !== '/register') {
      router.push('/login')
    } else {
      setIsAuth(true)                    // 白名单页面也放行
    }
  }, [router, pathname])

  if (!isAuth) return <p>加载中...</p>
  return <>{children}</>
}