# TypeScript 学习进度

**Last Updated**: 2026-03-31
**学习目标**: 掌握 TypeScript 核心特性，为 Vue3/React/Next.js 打基础

---

## 📊 快速统计

📈 **Overall Progress**: 37/37 topics = **100%**
📚 **学习天数**: 1
🎯 **状态**: ✅ 已完成

---

## 知识领域

### TS.1 基础类型与类型注解
- [x] 基本类型（string, number, boolean, null, undefined, symbol, bigint） ✅ 2026-03-30 置信度:高
- [x] 数组类型与元组（tuple） ✅ 2026-03-30 置信度:高
- [x] 对象类型与 any/unknown/never/void ✅ 2026-03-30 置信度:高
- [x] 类型推断（Type Inference） ✅ 2026-03-30 置信度:高（边界情况 03-31 已验证）
- [x] 类型断言（Type Assertion） ✅ 2026-03-30 置信度:高

### TS.2 接口与类型别名
- [x] interface 定义与继承 ✅ 2026-03-30 置信度:高
- [x] type 定义 ✅ 2026-03-30 置信度:高
- [x] interface vs type 区别与选择 ✅ 2026-03-30 置信度:高
- [x] 索引签名与映射类型 ✅ 2026-03-30 置信度:高
- [x] 声明合并 ✅ 2026-03-30 置信度:高

### TS.3 函数类型
- [x] 参数类型与返回值类型 ✅ 2026-03-30 置信度:高
- [x] 可选参数与默认参数 ✅ 2026-03-30 置信度:高
- [x] 剩余参数 ✅ 2026-03-30 置信度:高
- [x] 函数重载（Overload） ✅ 2026-03-30 置信度:高
- [x] 函数表达式类型 ✅ 2026-03-30 置信度:高

### TS.4 泛型（Generics）
- [x] 基本泛型函数与泛型类 ✅ 2026-03-30 置信度:高
- [x] 泛型约束（extends） ✅ 2026-03-30 置信度:高
- [x] 泛型接口 ✅ 2026-03-30 置信度:高
- [x] 常用工具类型（Partial, Required, Pick, Omit, Record, Readonly, Exclude, Extract） ✅ 2026-03-30 置信度:高
- [x] 条件类型与 infer ✅ 2026-03-30 置信度:中（了解即可，实战时深入）

### TS.5 类与装饰器
- [x] 类的类型定义 ✅ 2026-03-30 置信度:高
- [x] 访问修饰符（public, private, protected） ✅ 2026-03-30 置信度:高
- [x] 抽象类 ✅ 2026-03-30 置信度:高
- [x] 装饰器基础（@decorator） ✅ 2026-03-30 置信度:高
- [x] 属性装饰器与方法装饰器 ✅ 2026-03-30 置信度:高

### TS.6 高级类型
- [x] 联合类型（|）与交叉类型（&） ✅ 2026-03-30 置信度:高
- [x] 类型守卫（typeof, instanceof, in） ✅ 2026-03-30 置信度:高
- [x] 可辨识联合（Discriminated Union） ✅ 2026-03-30 置信度:高
- [x] 模板字面量类型 ✅ 2026-03-30 置信度:中（了解即可）
- [x] 映射类型（Mapped Types） ✅ 2026-03-30 置信度:中（了解原理即可）

### TS.7 模块与配置
- [x] tsconfig.json 常用配置 ✅ 2026-03-30 置信度:高
- [x] strict 模式详解 ✅ 2026-03-30 置信度:高
- [x] 模块引入（import/export） ✅ 2026-03-30 置信度:高
- [x] 声明文件（.d.ts） ✅ 2026-03-30 置信度:高
- [x] @types 包 ✅ 2026-03-30 置信度:高

### TS.8 实践
- [x] TypeScript + Node.js 项目配置 ✅ 2026-03-30 置信度:高
- [x] TypeScript + Express 类型安全的 API ✅ 2026-03-30 置信度:高
- [x] 使用 JSDoc 补充类型 ✅ 2026-03-30 置信度:中（了解即可）
- [x] 类型安全的数据库操作 ✅ 2026-03-30 置信度:中（原理已掌握，实战时深入）

---

## 🔄 待巩固复习清单

> 每次学习结束记录薄弱点，定期回顾验证。掌握后标记 ✅ 并注明日期。

- [x] 联合类型数组括号优先级：`(number | string)[]` vs `number | string[]` 的区别 ✅ 2026-03-31 置信度:高
- [x] 类型推断边界情况：`let x = null` 推断为什么类型 ✅ 2026-03-31 置信度:高
- [x] 可选参数不传时是 undefined 而非 null ✅ 2026-03-31 置信度:高
- [ ] protected 子类可访问 vs private 子类不可访问（外部也不可访问，仍需巩固）
- [ ] Omit 手写实现：`Pick<T, Exclude<keyof T, K>>`（keyof 语法需巩固）

---

## 学习记录

### 2026-03-30 - TS.1 基础类型与类型注解
- **掌握**: 类型注解语法、类型推断、基本类型、数组与元组、特殊类型(any/unknown/void/never)
- **待巩固**: 联合类型数组括号优先级、类型推断边界情况
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`

### 2026-03-30 - TS.2 接口与类型别名
- **掌握**: interface定义与继承、type定义、两者区别与选择、索引签名、声明合并、可选属性与readonly
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`

### 2026-03-30 - TS.3 函数类型
- **掌握**: 参数类型、返回值推断、可选参数(?)、默认参数、剩余参数、函数重载
- **待巩固**: 可选参数不传时是undefined而非null（已纠正）
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`

### 2026-03-30 - TS.7 模块与配置
- **掌握**: tsconfig常用配置、strict模式、import/export类型导出、声明文件、@types包
- **待巩固**: number没有length属性（string和数组才有）
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`
- **掌握**: 联合/交叉类型、四种类型守卫(typeof/instanceof/in/自定义is)、可辨识联合、模板字面量类型、映射类型原理
- **待巩固**: typeof判断时用字符串"string"而非类型string
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`
- **掌握**: 类的类型定义、构造器简写、访问修饰符(public/private/protected)、抽象类、装饰器原理
- **待巩固**: protected子类可访问（与private的区别）
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`
- **掌握**: 泛型函数、泛型约束(extends)、泛型接口、工具类型(Partial/Pick/Omit/Record)、条件类型与infer
- **笔记**: `sessions/typescript/2026-03-30/session-notes.md`
