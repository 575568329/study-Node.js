---
tags:
  - Java
  - 基础语法
  - Day1
创建时间: 2026-07-14
状态: 已掌握
置信度: High
---

# Day1 - Java 程序结构与基础语法

## 一、Java 程序骨架

### 强制规则
- **文件名必须和 public 类名完全一致**（大小写敏感）
- 所有代码必须在类里，不能有"游离"的顶层代码

```java
// 文件名：Main.java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}
```

### 对比 Node.js
```javascript
// Node.js：直接写顶层代码
console.log("Hello World");
```

---

## 二、main 方法逐字解析

```
public static void main(String[] args)
  │      │     │    │        │
  │      │     │    │        └─ 命令行参数数组（类比 process.argv）
  │      │     │    └─ JVM 规定的固定入口名，不能改
  │      │     └─ 不返回值
  │      └─ 属于类本身，不需要创建对象就能调用
  └─ 任何地方都能访问（JVM 要调用它）
```

**为什么 static？** 程序启动时没有任何对象，JVM 需要一个不依赖对象就能调用的入口。

---

## 三、访问修饰符（4种）

| 修饰符 | 访问范围 | 类比 |
|--------|----------|------|
| `public` | 任何地方 | 完全公开 |
| `protected` | 同包 + 子类 | 家族内部 |
| `default`（不写） | 同包内 | 同部门 |
| `private` | 仅本类 | 完全私有 |

---

## 四、编译与执行

```
.java 源文件  →(javac 编译)→  .class 字节码  →(JVM 解释)→  运行结果
```

- IDEA 自动完成编译步骤，点运行按钮会自动 javac + java
- 字节码（.class）跨平台：一次编译，到处运行

对比 Node.js：
```bash
node index.js     # 解释执行，无需编译

javac Main.java   # 先编译
java Main         # 再运行
```

---

## 五、基本数据类型（8种）

### 整数类型

| 类型 | 字节 | 范围 | 常用场景 |
|------|------|------|----------|
| `byte` | 1 | -128 ~ 127 | 年龄等小整数 |
| `short` | 2 | -32768 ~ 32767 | 年份等中等整数 |
| `int` | 4 | ±21亿 | **默认整数类型（最常用）** |
| `long` | 8 | ±9.2×10^18 | 大数（需加 `L` 后缀） |

```java
int age = 25;
long bigNum = 10000000000L;  // 注意 L 后缀
```

### 浮点类型

| 类型 | 字节 | 精度 | 使用建议 |
|------|------|------|----------|
| `float` | 4 | 6-7位 | 加 `f` 后缀，不推荐 |
| `double` | 8 | 15-16位 | **默认浮点类型（推荐）** |

```java
double pi = 3.14159;
float price = 9.99f;   // 必须加 f
```

### 其他类型

```java
char grade = 'A';       // 单字符，单引号，本质是数字（Unicode）
boolean active = true;  // 只有 true/false，不能用 0/1 代替
```

---

## 六、String（引用类型，不是基本类型）

```java
String name = "Alice";            // 字面量写法（推荐）
String name2 = new String("Alice"); // 对象写法
```

**⚠️ 比较必须用 equals()，不能用 ==**

```java
String s1 = new String("Alice");
String s2 = new String("Alice");

s1 == s2        // false（比较地址）
s1.equals(s2)   // true（比较内容）✅ 永远用这个
```

**字符串常量池**：字面量赋值会复用同一对象，所以 `"Alice" == "Alice"` 偶尔是 true，但不要依赖这个，永远用 equals()。

---

## 七、类型转换

```java
// 自动转换：小类型 → 大类型（不丢数据）
int i = 100;
long l = i;       // 自动
double d = i;     // 自动

// 转换顺序（→ 方向自动转）：
// byte → short → int → long → float → double
//          ↑
//         char

// 强制转换：大类型 → 小类型（可能丢数据）
double d2 = 9.99;
int i2 = (int) d2;   // 结果是 9（截断，不是四舍五入）
```

---

## 八、类型提升（算术运算）

**规则**：`byte/short/char` 参与算术运算时，自动提升为 `int`。

```java
char c = 'A';                       // 本质是数字 65
System.out.println(c + 1);          // 66（int，不是字符 'B'）
System.out.println((char)(c + 1));  // B（强制转回 char）

// + 左边或右边有 String → 字符串拼接，char 显示字符
System.out.println("c = " + c);    // c = A
```

**判断规则**：
- `+` 两边都是数值类型 → 算术运算，char 提升为 int
- `+` 任意一边是 String → 字符串拼接，char 显示字符

---

## 九、变量与常量

```java
// 变量
int count = 0;
count = 10;   // 可以修改

// 常量（final）：类比 JS 的 const
final double PI = 3.14159;
// PI = 3.14;  ❌ 编译错误

// 命名规范：常量全大写 + 下划线
final int MAX_SIZE = 100;
```

---

## 十、流程控制要点

### if：必须是 boolean，没有 truthy/falsy

```java
int x = 1;
if (x) { }         // ❌ 编译错误
if (x != 0) { }   // ✅

String s = null;
if (s != null) { } // ✅ 判断 null 的标准写法
```

### switch：⚠️ 不会自动 break（穿透特性）

```java
switch (x) {
    case 1:
        System.out.println("1");
        // 没有 break → 会继续执行 case 2、case 3...
    case 2:
        System.out.println("2");
        break;
}
```

### 增强 for（类比 JS 的 for...of）

```java
String[] names = {"Alice", "Bob"};
for (String name : names) {
    System.out.println(name);
}
```

---

## 十一、包（Package）

**作用**：组织代码，避免类名冲突，类比文件系统的文件夹。

```java
// 文件顶部声明包名
package com.company.user;

// 使用其他包的类需要 import（类比 JS 的 import）
import com.company.order.OrderService;
```

**命名规范**：域名反转，如 `com.company.module`。

---

## ⚠️ 易错点汇总

| 错误写法 | 原因 | 正确写法 |
|----------|------|----------|
| `long n = 10000000000;` | 超出 int 范围 | `long n = 10000000000L;` |
| `float f = 3.14;` | 默认是 double | `float f = 3.14f;` |
| `s1 == s2`（字符串比较） | 比较地址不是内容 | `s1.equals(s2)` |
| `if (x) { }` | 条件必须是 boolean | `if (x != 0) { }` |
| `(int) 9.99` 期望得到 10 | 截断不是四舍五入 | 结果是 9 |

---

## 🆚 Java vs JavaScript/TypeScript 核心差异

| 特性 | Java | JavaScript/TypeScript |
|------|------|----------------------|
| 类型检查 | 编译期 + 运行期 | TS 仅编译期，JS 运行期 |
| 代码必须在类里 | ✅ 强制 | ❌ 可选 |
| 字符串比较 | `.equals()` | `===` |
| 整数除法 | `10/3 = 3` | `10/3 = 3.33` |
| truthy/falsy | ❌ 不支持 | ✅ 支持 |
| 格式化输出 | `printf("%s", name)` | `` `${name}` `` |
| 常量 | `final` | `const` |
| 无换行输出 | `System.out.print()` | `process.stdout.write()` |
| 格式化输出 | `System.out.printf()` | `console.log()` |

---

## 下一步

- [ ] 方法（Method）定义与重载
- [ ] 数组操作
- [ ] 面向对象入门（类、对象、构造方法）
