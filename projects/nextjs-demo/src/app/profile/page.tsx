/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-04-09 15:55:43
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-04-09 16:32:03
 * @FilePath: \Node.js-Study\projects\nextjs-demo\src\app\profile\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'
import { useState } from "react"
import { useRouter } from 'next/navigation'
import type { User } from "@/types/user"
export default function Profile(){
  const router = useRouter()
  const [user, setUser] = useState<User|null>(() => {
    if (typeof window === 'undefined') return null  // SSR 时返回 null
      const stored = localStorage.getItem('user')
      return stored ? (JSON.parse(stored)) : null
    })
  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('login')
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