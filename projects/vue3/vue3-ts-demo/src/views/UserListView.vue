<!--
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 14:36:18
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:37:19
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\views\UserListView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { useUserList } from '../composables/useUserList'
import type { CreateUserRequest } from '../types'

const { users, loading, error, fetchUsers, addUser } = useUserList()

// 表单数据
const form = reactive<CreateUserRequest>({
  name: '',
  email: '',
  phone: ''
})

// 表单验证 — computed 派生
const formErrors = computed(() => {
  const errors: Partial<Record<keyof CreateUserRequest, string>> = {}
  if (!form.name.trim()) errors.name = '姓名必填'
  if (!form.email.trim()) errors.email = '邮箱必填'
  else if (!form.email.includes('@')) errors.email = '邮箱格式不正确'
  return errors
})

const isFormValid = computed(() => Object.keys(formErrors.value).length === 0)

const handleSubmit = async () => {
  if (!isFormValid.value) return
  await addUser(form)
  form.name = ''
  form.email = ''
  form.phone = ''
}

onMounted(fetchUsers)
</script>

<template>
  <div>
    <h1>用户管理</h1>

    <!-- 加载状态 -->
    <p v-if="loading">加载中...</p>
    <p v-else-if="error" style="color: red">{{ error }}</p>

    <!-- 用户列表 -->
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>

    <!-- 新增用户表单 -->
    <h2>新增用户</h2>
    <form @submit.prevent="handleSubmit">
      <div>
        <input v-model="form.name" placeholder="姓名" />
        <span v-if="formErrors.name" style="color: red">{{ formErrors.name }}</span>
      </div>
      <div>
        <input v-model="form.email" placeholder="邮箱" />
        <span v-if="formErrors.email" style="color: red">{{ formErrors.email }}</span>
      </div>
      <div>
        <input v-model="form.phone" placeholder="手机号" />
      </div>
      <button type="submit" :disabled="!isFormValid">提交</button>
    </form>
  </div>
</template>