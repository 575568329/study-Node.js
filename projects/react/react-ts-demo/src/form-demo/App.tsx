// ============================================================
// Form Demo 主页：axios + RHF + Zod 组合
// 包含登录表单 + 用户列表 + 新增/编辑用户（共用一套 UserForm）
// 演示 RHF 全部核心 API：register / handleSubmit / reset /
//   setValue / watch / defaultValues / formState.errors
// ============================================================

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiLogin, apiGetUsers, apiCreateUser, apiUpdateUser } from './mock-server'

// ---- Zod Schema：一份声明 = 校验规则 + TS 类型 ----

/** 登录表单 schema */
const loginSchema = z.object({
  username: z.string().min(2, '至少 2 个字符'),
  password: z
    .string()
    .min(6, '至少 6 位')
    .regex(/\d/, '必须包含数字'),
})

/** 用户表单 schema（新增和编辑共用） */
const userSchema = z.object({
  username: z.string().min(2, '至少 2 个字符'),
  email: z.string().email('邮箱格式不对'),
  role: z.enum(['admin', 'user'], { required_error: '请选择角色' }),
})

// z.infer 自动推断 TS 类型 —— 不用手写 interface
type LoginFormData = z.infer<typeof loginSchema>
type UserData = z.infer<typeof userSchema>

// ---- 登录表单组件 ----

function LoginForm({ onLogin }: { onLogin: (token: string, username: string) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const res = await apiLogin(data) as { token: string; user: { username: string } }
      localStorage.setItem('token', res.token)
      onLogin(res.token, res.user.username)
    } catch (err) {
      console.error((err as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>🔐 登录</h2>

      <input placeholder="用户名" {...register('username')} />
      {errors.username && <span style={{ color: 'red' }}>{errors.username.message}</span>}

      <input type="password" placeholder="密码" {...register('password')} />
      {errors.password && <span style={{ color: 'red' }}>{errors.password.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '登录中...' : '登录'}
      </button>
    </form>
  )
}

// ---- 用户表单（新增 + 编辑 共用）----
// 演示：defaultValues / setValue / reset / watch

interface UserFormProps {
  /** 编辑时传入用户数据，新增时传 null */
  editUser: { id: number; username: string; email: string; role: string } | null
  onSaved: () => void
  onCancel: () => void
}

function UserForm({ editUser, onSaved, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,          // ← 手动设某个字段的值（编辑回填）
    watch,             // ← 监听字段值变化（联动）
    reset,             // ← 重置整个表单
    formState: { errors, isSubmitting },
  } = useForm<UserData>({
    resolver: zodResolver(userSchema),
    // defaultValues：表单初始值
    // 新增时全空，编辑时由 useEffect + setValue 回填
    defaultValues: {
      username: '',
      email: '',
      role: undefined as unknown as 'admin' | 'user',
    },
  })

  // ========== useEffect + setValue：编辑回填 ==========
  // editUser 变化时（点击"编辑"按钮），用 setValue 逐字段填值
  useEffect(() => {
    if (editUser) {
      setValue('username', editUser.username)
      setValue('email', editUser.email)
      setValue('role', editUser.role as 'admin' | 'user')
    } else {
      reset()  // ← 取消编辑时 reset 清空表单
    }
  }, [editUser, setValue, reset])

  // ========== watch：监听角色变化做联动 ==========
  const watchedRole = watch('role')   // 只订阅 role 字段

  const onSubmit = async (data: UserData) => {
    try {
      if (editUser) {
        // 编辑模式：调更新接口
        await apiUpdateUser(editUser.id, data)
      } else {
        // 新增模式：调创建接口
        await apiCreateUser(data)
      }
      reset()     // ← 提交成功后 reset 清空表单
      onSaved()
    } catch (err) {
      console.error((err as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
      {/* 标题动态切换：新增 vs 编辑 */}
      <h2>{editUser ? `✏️ 编辑用户 #${editUser.id}` : '➕ 新增用户'}</h2>

      <input placeholder="用户名" {...register('username')} />
      {errors.username && <span style={{ color: 'red' }}>{errors.username.message}</span>}

      <input placeholder="邮箱" {...register('email')} />
      {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}

      <select {...register('role')}>
        <option value="">-- 选择角色 --</option>
        <option value="admin">管理员</option>
        <option value="user">普通用户</option>
      </select>
      {errors.role && <span style={{ color: 'red' }}>{errors.role.message}</span>}

      {/* ========== watch 联动演示 ========== */}
      {watchedRole && (
        <span style={{ color: '#666', fontSize: 13 }}>
          💡 watch 监听到角色变化：当前是「{watchedRole === 'admin' ? '管理员' : '普通用户'}」
        </span>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '提交中...' : editUser ? '保存修改' : '新增'}
        </button>
        {editUser && (
          <button type="button" onClick={() => { reset(); onCancel() }}>
            取消
          </button>
        )}
      </div>
    </form>
  )
}

// ---- 主组件 ----

function FormDemo() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState<{ id: number; username: string; email: string; role: string }[]>([])
  // 正在编辑的用户（null = 新增模式）
  const [editUser, setEditUser] = useState<{ id: number; username: string; email: string; role: string } | null>(null)

  // 模拟登录后请求拦截器效果
  const handleLogin = async (newToken: string, name: string) => {
    setToken(newToken)
    setUsername(name)
    const data = await apiGetUsers()
    setUsers(data)
  }

  // 登出
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUsername('')
    setUsers([])
  }

  // 刷新列表
  const refreshUsers = async () => {
    const data = await apiGetUsers()
    setUsers(data)
  }

  // 点击编辑按钮
  const handleEdit = (user: typeof users[number]) => {
    setEditUser(user)  // UserForm 的 useEffect 会自动 setValue 回填
  }

  // 取消编辑
  const handleCancelEdit = () => {
    setEditUser(null)  // UserForm 的 useEffect 会自动 reset 清空
  }

  // 未登录 → 显示登录表单
  if (!token) {
    return (
      <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  // 已登录 → 显示用户列表 + 新增/编辑表单
  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📋 用户管理</h2>
        <span>当前用户：{username} | <button onClick={handleLogout}>退出</button></span>
      </div>

      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', marginTop: 16 }}>
        <thead>
          <tr>
            <th>ID</th><th>用户名</th><th>邮箱</th><th>角色</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td><td>{u.username}</td><td>{u.email}</td><td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>编辑</button>
              </td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan={5}>加载中...</td></tr>}
        </tbody>
      </table>

      <UserForm
        editUser={editUser}
        onSaved={refreshUsers}
        onCancel={handleCancelEdit}
      />
    </div>
  )
}

export default FormDemo
