/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 14:30:42
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:33:58
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\composables\useUserList.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref } from 'vue'
import { userApi } from '../api/user'
import type { User, CreateUserRequest } from '../types'

export function useUserList() {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref('')

  const fetchUsers = async () => {
    loading.value = true
    error.value = ''
    try {
      users.value = await userApi.getList()
    } catch (e) {
      error.value = '加载失败'
    } finally {
      loading.value = false
    }
  }

  const addUser = async (data: CreateUserRequest) => {
    try {
      const newUser = await userApi.create(data)
      users.value.unshift(newUser)
    } catch (e) {
      error.value = '创建失败'
    }
  }

  return { users, loading, error, fetchUsers, addUser }
}