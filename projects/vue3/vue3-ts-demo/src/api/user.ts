import { get, post } from './request'
import type { User, CreateUserRequest } from '../types'

export const userApi = {
  // 获取用户列表
  getList: () => get<User[]>('/users'),
  
  // 获取单个用户
  getById: (id: number) => get<User>(`/users/${id}`),
  
  // 创建用户
  create: (data: CreateUserRequest) => post<User>('/users', data)
}