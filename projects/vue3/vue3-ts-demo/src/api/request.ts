/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 14:24:39
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:25:45
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\types\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import type { ApiResponse } from '../types'

// 创建实例，统一配置
const request = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
})

// 响应拦截器
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('请求失败:', error.message)
    return Promise.reject(error)
  }
)

// 封装类型安全的请求方法
export async function get<T>(url: string): Promise<T> {
  return request.get(url)
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  return request.post(url, data)
}

export default request