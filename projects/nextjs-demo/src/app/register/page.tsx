'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
const schema = z.object({
    username: z.string().min(1, '用户名不能为空'),
    password: z.string().min(1, '密码不能为空'),
    nickname : z.string().min(1, '昵称不能为空'),
  })
type FormData = z.infer<typeof schema>


function Register() {
  const router = useRouter()   // 在组件顶部调用
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const onSubmit = async (data: FormData) => {
    const { username, password } = data
    const res = await fetch('/api/auth/register',
      {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    const result = await res.json()
    if (!res.ok) {
      alert('用户名已存在')
      return
    }
    router.push('/login')        // 在需要跳转的地方调用
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">任务管理系统</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">用户名</label>
          <input
            {...register('username')}
            id="username"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入用户名"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-1">密码</label>
          <input
            {...register('password')}
            id="password"
            type="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入密码"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div className="mb-6">
          <label htmlFor="nickname" className="block text-sm font-medium mb-1">昵称</label>
          <input
            {...register('nickname')}
            id="nickname "
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入昵称"
          />
          {errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          注册
        </button>
        <Link href={'/login'}>
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            去登录
          </button>
        </Link>
      </form>
    </div>
  )
}

export default Register
