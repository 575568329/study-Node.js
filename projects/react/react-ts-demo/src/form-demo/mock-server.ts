// ============================================================
// mock 服务器：模拟后端 API（纯内存，延迟 300ms）
// ============================================================

let nextId = 10
const users = [
  { id: 1, username: 'zhangsan', email: 'zhang@example.com', role: 'admin' },
  { id: 2, username: 'lisi', email: 'li@example.com', role: 'user' },
  { id: 3, username: 'wangwu', email: 'wang@example.com', role: 'user' },
]

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---- 模拟接口 ----

/** 登录 */
export async function apiLogin(body: { username: string; password: string }) {
  await delay(300)
  const user = users.find((u) => u.username === body.username)
  if (!user) throw new Error('用户不存在')
  if (body.password.length < 6) throw new Error('密码错误')
  return { token: 'mock-jwt-token-' + user.id, user: { id: user.id, username: user.username, role: user.role } }
}

/** 获取用户列表 */
export async function apiGetUsers() {
  await delay(300)
  return [...users]
}

/** 新增用户（Zod 校验同前端） */
export async function apiCreateUser(body: { username: string; email: string; role: string }) {
  await delay(300)
  if (users.some((u) => u.username === body.username)) throw new Error('用户名已存在')
  const newUser = { id: nextId++, ...body }
  users.push(newUser)
  return newUser
}

/** 编辑用户 */
export async function apiUpdateUser(id: number, body: { username: string; email: string; role: string }) {
  await delay(300)
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) throw new Error('用户不存在')
  if (users.some((u) => u.id !== id && u.username === body.username)) throw new Error('用户名已存在')
  users[idx] = { ...users[idx], ...body }
  return users[idx]
}
