---
tags:
  - Java
  - 易错点
创建时间: 2026-07-14
状态: 持续更新
---

# Java 易错点汇总

## Day1

### 1. long/float 必须加后缀
```java
long n = 10000000000;   // ❌ 编译错误，超出 int 范围
long n = 10000000000L;  // ✅

float f = 3.14;         // ❌ 编译错误，默认是 double
float f = 3.14f;        // ✅
```

### 2. 字符串比较永远用 equals()
```java
String s1 = new String("Alice");
String s2 = new String("Alice");
s1 == s2        // ❌ false（比较地址）
s1.equals(s2)   // ✅ true（比较内容）
```

### 3. if 条件必须是 boolean
```java
int x = 1;
if (x) { }         // ❌ 编译错误
if (x != 0) { }   // ✅
```

### 4. switch 不会自动 break
```java
switch (x) {
    case 1:
        System.out.println("1");
        // 忘写 break → 穿透到 case 2！
    case 2:
        System.out.println("2");
}
```

### 5. 强制类型转换是截断不是四舍五入
```java
int i = (int) 9.99;  // 结果是 9，不是 10
```

### 6. char 参与算术运算会提升为 int
```java
char c = 'A';
System.out.println(c + 1);         // 66（数字，不是 'B'）
System.out.println((char)(c + 1)); // B（要显式转回 char）
```

### 7. 文件名必须和 public 类名一致
```
// 文件名 Main.java，类名必须是 Main
public class Hello { }  // ❌ 编译错误（文件名不匹配）
public class Main { }   // ✅
```
