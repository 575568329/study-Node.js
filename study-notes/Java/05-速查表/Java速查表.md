# Java 速查表

**最后更新**：2026-07-14

---

## 基本数据类型

| 类型 | 字节 | 范围/说明 | 示例 |
|------|------|-----------|------|
| `byte` | 1 | -128 ~ 127 | `byte age = 25;` |
| `short` | 2 | -32768 ~ 32767 | `short year = 2024;` |
| `int` | 4 | ±21亿（默认整数类型） | `int count = 100;` |
| `long` | 8 | 超大整数 | `long n = 100L;` |
| `float` | 4 | 单精度浮点 | `float f = 3.14f;` |
| `double` | 8 | 双精度浮点（默认） | `double d = 3.14;` |
| `char` | 2 | 单字符（Unicode） | `char c = 'A';` |
| `boolean` | 1 | true/false | `boolean b = true;` |

---

## 访问修饰符

| 修饰符 | 本类 | 同包 | 子类 | 任意 |
|--------|------|------|------|------|
| `private` | ✅ | ❌ | ❌ | ❌ |
| `default` | ✅ | ✅ | ❌ | ❌ |
| `protected` | ✅ | ✅ | ✅ | ❌ |
| `public` | ✅ | ✅ | ✅ | ✅ |

---

## 类型转换顺序（→ 自动转换）

```
byte → short → int → long → float → double
         ↑
        char
```

大 → 小：需要强制转换 `(目标类型) 值`

---

## 输出方法

| 方法 | 换行 | 格式化 | 示例 |
|------|------|--------|------|
| `System.out.println()` | ✅ | ❌ | `println("Hello")` |
| `System.out.print()` | ❌ | ❌ | `print("Hello")` |
| `System.out.printf()` | ❌ | ✅ | `printf("%s=%d\n", k, v)` |

### printf 格式化占位符

| 占位符 | 含义 | 示例 |
|--------|------|------|
| `%d` | 整数 | `printf("%d", 42)` |
| `%f` | 浮点数 | `printf("%.2f", 3.14)` |
| `%s` | 字符串 | `printf("%s", "hi")` |
| `%c` | 字符 | `printf("%c", 'A')` |
| `%b` | 布尔 | `printf("%b", true)` |
| `%%` | 百分号 | `printf("80%%")` |
| `%-10s` | 左对齐宽度10 | 对齐用 |
| `%5d` | 右对齐宽度5 | 对齐用 |

---

## 流程控制

```java
// if（条件必须是 boolean）
if (x > 0) { } else if (x == 0) { } else { }

// switch（记得 break，否则穿透）
switch (x) {
    case 1: ...; break;
    default: ...;
}

// 标准 for
for (int i = 0; i < n; i++) { }

// 增强 for（遍历数组/集合）
for (String s : array) { }

// while
while (condition) { }

// do-while（至少执行一次）
do { } while (condition);
```

---

## 字符串常用方法

```java
String s = "Hello World";
s.length()              // 11
s.toUpperCase()         // "HELLO WORLD"
s.toLowerCase()         // "hello world"
s.contains("World")     // true
s.startsWith("Hello")   // true
s.endsWith("World")     // true
s.indexOf("o")          // 4
s.substring(0, 5)       // "Hello"
s.replace("World", "Java") // "Hello Java"
s.trim()                // 去首尾空格
s.split(" ")            // ["Hello", "World"]
s.equals("Hello World") // true（比较内容用 equals）
```

---

## Java vs JavaScript 核心对比

| 特性 | Java | JavaScript |
|------|------|------------|
| 字符串比较 | `s1.equals(s2)` | `s1 === s2` |
| 整数除法 | `10/3 = 3` | `10/3 = 3.33` |
| 常量 | `final` | `const` |
| if 条件 | 必须 boolean | truthy/falsy |
| 类 | 强制 | 可选 |
| 格式化 | `printf("%s", x)` | `` `${x}` `` |
| import | `import com.a.B;` | `import B from './B'` |
