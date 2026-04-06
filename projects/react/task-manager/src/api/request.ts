/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-04-06 11:09:49
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-04-06 11:36:35
 * @FilePath: \Node.js-Study\projects\react\task-manager\src\api\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse } from 'axios'

// 1. 创建 axios 实例
const request = axios.create({
  baseURL: '/api', // 你的接口基础地址（可配环境变量）
  timeout: 10000, // 超时时间
});

// 2. 请求拦截器：统一加 token、请求头
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 拿 token（如果需要）
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

// 3. 响应拦截器：统一处理返回数据、错误
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回后端 data（简化使用）
    return response.data;
  },
  (error: Error) => {
    // 统一错误处理
    console.error('请求错误：', error);
    // 可在这里做 401 跳转登录、消息提示等
    return Promise.reject(error);
  }
);

// 4. 封装通用请求方法（方便调用）
const http = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.get(url, config);
  },
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.post(url, data, config);
  },
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return request.put(url, data, config);
  },
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return request.delete(url, config);
  },
};

export default http;