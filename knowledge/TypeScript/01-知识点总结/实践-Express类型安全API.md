# TS.8 实践 — TypeScript + Express 类型安全 API

> 学习日期: 2026-03-30 | 置信度: 高
> 项目路径: `projects/typescript/ts-api-demo/`

---

## 项目搭建

```bash
mkdir ts-api-demo && cd ts-api-demo
npm init -y
npm install express
npm install -D typescript @types/node @types/express ts-node
npx tsc --init
```

## 类型设计

```ts
// src/types.ts
export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user"
}

export interface CreateUserRequest {
  name: string
  email: string
  role?: "admin" | "user"
}

export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}
```

## 用到的知识点

| 知识点 | 体现 |
|--------|------|
| interface | User、CreateUserRequest、ApiResponse |
| 联合类型 | `role: "admin" \| "user"` |
| 泛型 | `ApiResponse<T>` |
| 可选参数 | `role?` |
| 类型守卫 | `if (!name \|\| !email)` |
| null 处理 | `find()` 可能返回 undefined |
| @types 包 | `@types/node`、`@types/express` |

## 踩过的坑

1. **tsconfig.json 冲突** — `npx tsc --init` 新版自动加 `verbatimModuleSyntax`，需要手动清理
2. **Express 类型丢失** — `res.status()` 会丢失泛型，错误响应的 data 用 `null as any`
3. **import 路径** — 不写后缀 `.ts`，文件名要和路径一致（`users` 不是 `user`）

## JSDoc 补充类型（了解）

在 `.js` 文件里通过注释写类型，适合不想迁移 TS 的老项目：

```js
/** @param {string} name @returns {number} */
function getLength(name) { return name.length }
```
