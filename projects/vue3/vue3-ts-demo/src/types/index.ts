/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-31 14:24:13
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-31 14:24:34
 * @FilePath: \Node.js-Study\projects\vue3\vue3-ts-demo\src\types\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 所有 API 相关类型集中管理
export interface User {
  id: number
  name: string
  email: string
  phone: string
}

export interface CreateUserRequest {
  name: string
  email: string
  phone: string
}

// 通用 API 响应结构
export interface ApiResponse<T> {
  data: T
  message: string
}