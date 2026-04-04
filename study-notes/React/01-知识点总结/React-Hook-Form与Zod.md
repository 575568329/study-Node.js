# React Hook Form + Zod 表单处理

> 学习日期: 2026-04-04 | 置信度: 中

---

## 核心概念

React Hook Form 管理表单状态，Zod 定义校验规则。两者结合实现类型安全的表单。

### 语法

```bash
npm install react-hook-form zod @hookform/resolvers
```

### 完整示例

```tsx
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// 1. Zod 定义数据结构 + 校验规则
const userSchema = z.object({
  name: z.string().min(2, '名字至少2个字'),
  email: z.string().email('邮箱格式不对'),
  age: z.number().min(18, '必须满18岁'),
})

// 2. 自动推导 TS 类型
type UserForm = z.infer<typeof userSchema>

// 3. 使用
function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(userSchema)
  })

  const onSubmit = (data: UserForm) => {
    console.log(data)  // 校验通过才到这里
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="姓名" />
      {errors.name?.message && <p>{errors.name.message}</p>}

      <input {...register('email')} placeholder="邮箱" />
      {errors.email?.message && <p>{errors.email.message}</p>}

      <button type="submit">提交</button>
    </form>
  )
}
```

### 关键 API

```
register('name')        → 注册 input（自动管理值+校验）
handleSubmit(onSubmit)  → 包裹提交函数（校验不通过不执行）
errors.name?.message    → 用 ?. 安全访问（没错误时是 undefined）
zodResolver(schema)     → 接入 Zod 校验
z.infer<typeof schema>  → 从 schema 自动生成 TS 类型
```

### errors.name?.message 中的 ?.

可选链操作符。errors 对象在校验前只有已报错的字段，name 校验通过时 errors.name 是 undefined。用 ?. 防止对 undefined 取属性报错。

## Vue3 对比

```
Vue3：v-model 绑定 + watch/computed 手动校验
React：react-hook-form + zod 声明式校验，自动管理
```

---

**标签**: #React #表单 #ReactHookForm #Zod #已掌握
