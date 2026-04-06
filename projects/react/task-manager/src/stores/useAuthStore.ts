import { create } from 'zustand'
import type { User } from '../types/user'

export interface AuthStore {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

const useAuthStore = create<AuthStore>((set) => ({
  // 初始化时从 localStorage 读取
  user: null,
  token: localStorage.getItem('token'),
  login: (token: string, user: User) => {
    localStorage.setItem('token', token)  // 持久化
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('token')      // 清除持久化
    set({ user: null, token: null })
  },
}))

export default useAuthStore