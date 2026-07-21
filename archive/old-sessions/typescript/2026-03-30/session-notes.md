# TypeScript 学习会话 - 2026-03-30

## 会话概述
- **主题**: TS.1 基础类型与类型注解
- **时长**: ~30分钟
- **状态**: 进行中

---

## 学习内容

### 1. 类型注解与类型推断（TS.1）
- **类型注解语法**: `变量名: 类型`
- **类型推断**: TypeScript 根据初始值自动推断类型，不需要每个变量都写注解
- **实践原则**: 能推断就不手写，推断不出来或不符合预期时才显式标注

### 2. 基本类型（TS.1）
- `string`, `number`, `boolean` —— 最常用
- `null`, `undefined` —— 很少单独使用，通常作为联合类型 `string | null`
- `bigint`, `symbol` —— 用得少，了解即可
- null vs undefined：null 主动赋空值，undefined 表示未定义/未传

### 3. 数组与元组（TS.1）
- 数组: `number[]` 或 `Array<number>`（前者更常用）
- 联合类型数组: `(number | string)[]` —— 括号不能省，否则语义不同
- 元组 (Tuple): `[string, number]` —— 精确控制每个位置的类型和长度
- 元组坑点: `push` 方法不受长度限制，但索引赋值会报错

### 4. 特殊类型（TS.1）
- `any` —— 放弃类型检查，尽量避免使用
- `unknown` —— 安全版的 any，使用前必须做类型检查
- `void` —— 函数无返回值（常用于回调函数类型定义）
- `never` —— 函数永远不会正常结束（抛异常或死循环）

### 5. interface 定义与继承（TS.2）
- **interface**: 定义对象的形状（有哪些属性、什么类型）
- **继承**: `interface Dog extends Animal { ... }`
- **可选属性**: `age?: number`
- **只读属性**: `readonly id: number`
- 类似 Vue2 的 props 验证，但更强大

### 6. type 定义与 type vs interface（TS.2）
- **type**: 给类型起别名，如 `type Callback = (data: string) => void`
- **关键区别**:
  - type 能定义联合类型、元组、基本别名 → interface 做不到
  - interface 支持声明合并（同名自动合并） → type 做不到
  - interface 用 `extends` 继承，type 用 `&` 交叉
- **选择原则**: 对象形状用 interface，联合/元组用 type，其余都行

### 7. 索引签名（TS.2）
- `[key: string]: number` —— 任意字符串 key，值必须是 number
- 适用于动态 key 的对象

---

## 学生提问记录

| 问题 | 回答要点 |
|------|---------|
| null 和 undefined 什么时候用？ | 很少单独使用，通常作为联合类型表示"可能为空" |
| `null = null` 是什么意思？ | 左边是类型注解，右边是赋值 |
| 混合数组类型怎么写？ | `(number \| string)[]`，括号不能省 |
| 箭头函数中 void 怎么用？ | `: void` 标注无返回值，实际多自动推断，常用于定义回调类型 |
| never 什么意思？ | 函数永远不会正常结束（throw 或死循环），对比 void 是正常结束但没返回值 |
| `type Callback` 是什么写法？ | 类型别名，给类型取名字方便复用 |
| `let back: Callback = () => {}` 对吗？ | 对，Callback 就是类型，和 string/number 一样可标注变量 |
| interface 是什么？ | 定义对象形状（蓝图/模板），类似 Vue2 props 验证 |
| interface vs type 效果一样吗？ | 简单场景一样，但 type 能做联合/元组，interface 能声明合并 |

---

## 理解检查结果

| 概念 | 结果 | 备注 |
|------|------|------|
| 类型注解与类型推断 | ✅ 掌握 | 初始判断有误（未考虑推断），纠正后理解 |
| 基本类型 | ✅ 掌握 | 对 null/undefined 的实际用法有疑问，已解答 |
| 联合类型数组 | ⚠️ 需巩固 | 混淆了 `number[] \| string[]` 和 `(number \| string)[]` |
| 元组 | ✅ 掌握 | push 陷阱已了解 |
| any vs unknown | ✅ 掌握 | 一句话概括准确 |
| void 与 never | ✅ 掌握 | 通过对比理解了区别 |
| type 类型别名 | ✅ 掌握 | 主动提问 Callback 复用方式，理解准确 |
| interface 定义 | ✅ 掌握 | 快速关联到 Vue2 props 验证 |
| interface vs type | ✅ 掌握 | 正确判断简单场景等价，区别理解清晰 |
| 索引签名 | ✅ 掌握 | 理解动态 key 场景 |
| readonly 与可选属性 | ✅ 掌握 | 检查题答对 |

---

## 🔄 待巩固重点

> 以下内容理解不牢固，需定期复习验证。

1. **联合类型数组括号优先级**
   - `(number | string)[]` → 每个元素可以是 number 或 string ✅
   - `number | string[]` → 要么一个 number，要么字符串数组 ❌
   - 练习：写一个混合数组，分别用正确和错误写法，观察报错差异

2. **类型推断边界情况**
   - `let x = null` 推断为 `any`（而非 `null`）
   - `const x = null` 推断为 `null`
   - 练习：对比 let/const 对类型推断的影响

## 掌握主题
- 类型注解语法
- 类型推断概念
- 基本类型（string, number, boolean, null, undefined）
- 数组与元组
- 特殊类型（any, unknown, void, never）
- null/undefined 在联合类型中的实际用法
- type 类型别名与函数类型定义
- interface 定义、继承、可选属性、readonly
- interface vs type 区别与选择
- 索引签名

## 表现评估
- **提问质量**: 高 —— 每个概念都主动提问，问题直击痛点
- **理解速度**: 快 —— 大部分概念一次讲解即理解
- **参与度**: 高 —— 主动思考，不是被动接受
