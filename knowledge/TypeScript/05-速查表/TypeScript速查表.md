# TypeScript 速查表

> 最后更新: 2026-03-30

---

## 类型注解

```ts
let name: string = "张三"
let age: number = 25
let isDone: boolean = true
let list: number[] = [1, 2]
let tuple: [string, number] = ["a", 1]
```

## 特殊类型

```ts
let x: any = ...           // 放弃检查
let y: unknown = ...       // 安全 any，需类型检查后使用
function f(): void {}      // 无返回值
function f(): never {}     // 永远不会结束（throw/死循环）
```

## interface / type

```ts
interface User { name: string; age?: number }
type Status = "active" | "inactive"
type Callback = (data: string) => void
```

## 泛型

```ts
function identity<T>(value: T): T { return value }
function getLen<T extends { length: number }>(v: T): number { return v.length }
interface ApiResponse<T> { code: number; data: T }
```

## 工具类型

```ts
Partial<T>        // 所有属性变可选
Required<T>       // 所有属性变必选
Pick<T, K>        // 选取部分属性
Omit<T, K>        // 排除部分属性
Record<K, V>      // 键值对
Readonly<T>       // 所有属性变只读
```

## 类型守卫

```ts
typeof x === "string"
x instanceof Date
"prop" in obj
function isFish(animal): animal is Fish { ... }
```

## 访问修饰符

```ts
public    // 默认，任何地方
protected // 类内部 + 子类
private   // 仅类内部
```

## tsconfig 关键配置

```json
{ "strict": true, "target": "ES2020", "module": "CommonJS", "esModuleInterop": true }
```
