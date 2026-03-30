/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-30 16:43:52
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-30 17:15:00
 * @FilePath: \Node.js-Study\projects\typescript\ts-api-demo\src\routes\user.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Request, Response } from 'express';
import { User, CreateUserRequest, ApiResponse } from '../types'

let users: User[] = [
  {id: 1, name: '张三', email: "zhangsan@qq.com" , role: "admin"},
  {id: 2, name: '李四', email: "lisi@qq.com" , role: "user"},
]

let nextId = 3

export function getUsers(req: Request, res: Response<ApiResponse<User[]>>) {
  res.json({
    code: 200,
    data: users,
    message: 'success'
  })
}

export function getUser(requ: Request, res: Response<ApiResponse<User>>){
  const id = Number(requ.params.id)
  const user = users.find(u=> u.id === id) ?? null
  if (!user) {
    res.status(404).json({code: 404,data:null as any, message: '用户不存在'})
    return
  }
  res.json({ code:200, data: user, message: 'success' })
}

export function createUser(req: Request, res:Response<ApiResponse<User>>) {
  const { name, email, role = "user" }: CreateUserRequest = req.body

  if(!name || !email) {
    res.status(400).json({  code: 400, data: null as any, message: '参数缺失'})
    return
  }

  const newUser: User = {id: nextId++, name, email, role}
  users.push(newUser)
  res.json({ code: 200, data: newUser, message: '创建成功'})
}