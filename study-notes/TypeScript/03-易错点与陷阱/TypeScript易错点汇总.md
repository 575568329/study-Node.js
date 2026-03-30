# TypeScript 易错点汇总

> 最后更新: 2026-03-30

---

## 1. 联合类型数组括号优先级

```ts
let mixed: (number | string)[] = [1, "two"]  // ✅ 每个元素可以是 number 或 string
let wrong: number | string[]                  // ❌ 意思是"要么 number，要么字符串数组"
```

## 2. 可选参数不传时是 undefined 而非 null

```ts
function greet(name: string, title?: string) {
  console.log(title)  // 不传时输出 undefined，不是 null
}
```

## 3. typeof 判断用字符串

```ts
typeof value === "string"  // ✅ "string" 是字符串值
typeof value === string    // ❌ string 是类型，不是值
```

## 4. 元组 push 不受长度限制

```ts
let coord: [number, number] = [1, 2]
coord.push(3)  // ✅ 不报错（TypeScript 历史遗留坑）
coord[2] = 3   // ❌ 报错
```

## 5. 类型推断边界 — let vs const

```ts
let x = null    // 推断为 any
const x = null  // 推断为 null
```

## 6. protected vs private 在子类中的区别

```ts
class Parent {
  protected a = 1   // 子类 ✅ 能访问
  private b = 2     // 子类 ❌ 不能访问
}
```

## 7. Express res.status() 丢失泛型

```ts
// res.status() 返回的 Response 会丢失泛型参数
// 错误响应的 null 需要用 as any
res.status(404).json({ code: 404, data: null as any, message: "不存在" })
```

## 8. tsconfig.json 新版默认配置冲突

`npx tsc --init` 新版会自动加 `verbatimModuleSyntax`，和手写配置冲突。需要清理多余的配置项。
