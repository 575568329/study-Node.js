// ============================================================
// axios 封装：生产级四层（配置收口 / token / 错误出口 / 剥壳）
// ============================================================

import axios from 'axios'

// ① 创建实例：隔离默认配置
const request = axios.create({
  baseURL: '/api',    // 真实项目填后端地址，demo 里不走真实 HTTP
  timeout: 10000,
})

// ② 请求拦截器：出门前塞 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ③ 响应拦截器：成功 → 剥壳 / 失败 → 统一处理
request.interceptors.response.use(
  (response) => {
    const res = response.data as { code: number; msg: string; data: unknown }
    if (res.code !== 0) {
      console.error(`[API Error] ${res.msg}`)
      return Promise.reject(new Error(res.msg))
    }
    return res.data // ← 组件拿到的是纯业务数据（剥了两层壳）
  },
  (error) => {
    // HTTP 层错误（4xx/5xx/断网/超时）
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      console.warn('Token 失效，跳转登录')
      // window.location.href = '/login'
    } else {
      console.error(`[HTTP Error] ${error.message || '网络异常'}`)
    }
    return Promise.reject(error)
  },
)

export default request
