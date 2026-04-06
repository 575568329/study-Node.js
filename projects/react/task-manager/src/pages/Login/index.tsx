/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-04-06 11:51:54
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-04-06 15:35:12
 * @FilePath: \Node.js-Study\projects\react\task-manager\src\pages\Login\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
//react登录表单使用react hook form + zod
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuthStore from '../../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import type { User } from '../../types/user'
import http from '../../api/request'
  
const schema = z.object({
    username: z.string().min(1, '用户名不能为空'),
    password: z.string().min(1, '密码不能为空'),
  })
type FormData = z.infer<typeof schema>


function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { token } = useAuthStore()
  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])
  
  const onSubmit = async (data: FormData) => {
    const { username, password } = data
    // json-server 没有 /login 接口，用查询 users 模拟登录
    const users = await http.get<User[]>('/users?username=' + username + '&password=' + password)
    if (!users || users.length === 0) {
      alert('用户名或密码错误')
      return
    }
    const user = users[0]
    login('mock-token-' + user.id, user)
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
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          登录
        </button>
      </form>
    </div>
  )
}

export default Login
