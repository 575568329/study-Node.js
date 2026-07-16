# Day 3 学习记录

**日期**：2026-07-16
**主题**：面向对象（一）—— 类、对象、封装

---

## 今日学习内容

### 1. 类与对象

#### 类是模板，对象是实例
- **类**：模板/蓝图（图纸）
- **对象**：用模板创建的实例（用图纸盖的房子）

```java
public class Dog {  // 类定义
    // ...
}

Dog dog = new Dog("旺财", 3);  // 创建对象（实例）
```

#### 构造方法 vs 普通方法

| 维度 | 构造方法 | 普通方法 |
|------|---------|---------|
| **何时调用** | `new` 时自动调用一次 | 手动调用，可多次 |
| **调用方式** | `new Dog(...)` | `dog.bark()` |
| **主要用途** | 初始化对象（给属性赋初值） | 执行业务逻辑（行为） |
| **返回值** | 没有（连 void 都不写） | 有（void 或具体类型） |
| **方法名** | 必须和类名相同 | 自己起名，动词开头 |

**构造方法三大特征**：
1. 方法名 = 类名
2. 不写返回值类型（连 void 都不写）
3. `new` 时自动调用

```java
public class Dog {
    private String name;
    
    // ✅ 正确的构造方法
    public Dog(String name) {
        this.name = name;
    }
    
    // ❌ 错误：加了 void 就变成普通方法了
    public void Dog(String name) {
        this.name = name;
    }
}
```

**常见错误**：构造方法加了 `void`，会导致：
- 它不再是构造方法，而是普通方法
- `new Dog(...)` 时会报错：找不到匹配的构造方法

#### this 关键字
- `this` 指向**当前对象实例**
- 不是指向类，而是指向"正在创建/操作的这个对象"

```java
Dog d1 = new Dog("旺财");  // 这次 this 指向 d1
Dog d2 = new Dog("小黑");  // 这次 this 指向 d2
```

---

### 2. Java 程序入口：main 方法

#### 为什么需要 main？

**Java 规则**：程序必须有 `main` 方法作为入口，JVM 只从 main 开始执行。

```java
public class Main {
    public static void main(String[] args) {  // JVM 认的唯一入口
        Dog dog = new Dog("旺财", 3);
        dog.bark();
    }
}
```

**类本身不能跑**：
- `Dog` 类只是模板，没有 main 方法，不能直接运行
- 必须在某个有 main 的类里 `new Dog()` 才能让它"动起来"

#### 对比 Node.js

| | Node.js | Java |
|---|---------|------|
| 入口 | 文件顶层代码直接执行 | 必须有 `main` 方法 |
| 运行 | `node dog.js` | JVM 找 `main` 执行 |
| 类文件 | 可以直接跑 | 只是模板，需要 main 调用 |

Node.js 是脚本语言，文件从上到下执行；Java 是编译型语言，必须有明确入口。

---

### 3. 封装（Encapsulation）

#### private 的作用

**private 属性不能被外部直接访问**：

```java
public class Dog {
    private String name;  // 只能在 Dog 类内部访问
}

// 在 Main 类里
Dog dog = new Dog("旺财", 3);
System.out.println(dog.name);  // ❌ 编译报错：name has private access
```

**类内部可以自由访问**：
```java
public class Dog {
    private String name;
    
    public void bark() {
        System.out.println(name);  // ✅ 类内部可以访问
    }
}
```

#### getter/setter：受控访问

外部想读/改私有属性，必须通过 getter/setter：

```java
public class Dog {
    private int age;
    
    // getter：读取
    public int getAge() {
        return age;
    }
    
    // setter：修改（可以加校验）
    public void setAge(int age) {
        if (age < 0 || age > 30) {
            System.out.println("年龄输入错误");
            return;
        }
        this.age = age;
    }
}
```

使用：
```java
Dog dog = new Dog("旺财", 3);
dog.getAge();        // 通过 getter 读
dog.setAge(5);       // 通过 setter 改
dog.setAge(-5);      // 被拦住：年龄输入错误
```

#### 为什么需要封装？

**直接 public 的问题**：
```java
public int age;  // 任何人都能随便改
dog.age = -5;    // 😱 负数年龄进去了，没人拦
```

**private + setter 的好处**：
```java
private int age;

public void setAge(int age) {
    if (age < 0) {  // 在门口加校验
        System.out.println("年龄不能为负");
        return;
    }
    this.age = age;  // 只有合法值才进来
}
```

**封装的核心价值**：
1. 控制数据的访问和修改
2. 在 setter 里加校验，保证对象状态始终合法
3. 隐藏实现细节，暴露安全接口

**类比银行账户**：
- 余额是 `private`，不能随便改
- 只能通过 `deposit()`（存钱）、`withdraw()`（取钱）操作
- 方法里会校验"取钱不能超过余额"

---

### 4. 包与 import

#### 包的作用
防止类名冲突，类似 Node.js 的模块路径。

```java
package test.com.fjyu.edu.animal;  // Dog 在 animal 包

package test2.com.fjyu.edu.plant;  // Main 在 plant 包
```

#### 跨包引用需要 import

```java
package test2.com.fjyu.edu.plant;

import test.com.fjyu.edu.animal.Dog;  // 引入 Dog 类

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("旺财", 3);  // 现在可以用了
    }
}
```

#### 对比 Node.js

| | Node.js | Java |
|---|---------|------|
| 引入依据 | 文件路径（`./animal/dog.js`） | 包名（`test.com.fjyu.edu.animal`） |
| 引入什么 | 文件里 export 的东西 | 包里的类 |
| 语法 | `import { Dog } from './dog'` | `import test.com.fjyu.edu.animal.Dog;` |

---

## 对比理解（Java vs TS）

### 类定义对比

```typescript
// TypeScript
class Dog {
  private name: string;
  private age: number;

  constructor(name: string, age: number) {  // TS 用 constructor
    this.name = name;
    this.age = age;
  }

  bark() {
    console.log(`${this.name}：汪汪`);
  }
}
```

```java
// Java
public class Dog {
    private String name;
    private int age;

    public Dog(String name, int age) {  // Java 用类名
        this.name = name;
        this.age = age;
    }

    public void bark() {
        System.out.println(name + "：汪汪");
    }
}
```

**关键区别**：
| 维度 | TypeScript | Java |
|------|-----------|------|
| 构造函数名 | `constructor` | 类名（`Dog`） |
| 构造函数返回值 | 无 | 不写返回值类型 |
| 类型位置 | `name: string`（类型后置） | `String name`（类型前置） |
| private 检查 | 编译期（编译成 JS 后还能访问） | 运行时（JVM 强制，真的访问不到） |

---

## 关键概念总结

1. **类 = 模板，对象 = 实例**
2. **构造方法**：名字=类名，无返回值类型，new 时自动调用
3. **main 方法**：Java 程序的唯一入口
4. **封装**：private 隐藏，getter/setter 受控访问
5. **包与 import**：不同包的类要 import 引入

---

## 常见错误

### 1. 构造方法加了 void ❌
```java
public void Dog(String name) { }  // 变成普通方法了
```

### 2. 泛型用圆括号 ❌
```java
ArrayList(String) list;  // 应该是 ArrayList<String>
```

### 3. 直接访问 private 属性 ❌
```java
dog.name;  // 编译报错，要用 dog.getName()
```

### 4. 忘记 import 跨包类 ❌
```java
Dog dog = new Dog(...);  // 报错：找不到 Dog
// 需要先 import test.com.fjyu.edu.animal.Dog;
```

---

## 实战代码

### Dog.java（完整版）
```java
package test.com.fjyu.edu.animal;

public class Dog {
    private String name;
    private int age;

    // 构造方法
    public Dog(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // 普通方法
    public void bark() {
        System.out.println("我是" + name);
    }

    // getter
    public int getAge() {
        return this.age;
    }

    public String getName() {
        return this.name;
    }

    // setter（带校验）
    public void setAge(int age) {
        if (age >= 0 && age <= 30) {
            this.age = age;
        } else {
            System.out.println("年龄输入错误");
        }
    }
}
```

### Main.java（测试）
```java
package test2.com.fjyu.edu.plant;

import test.com.fjyu.edu.animal.Dog;

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog("旺财", 3);
        
        dog.bark();
        System.out.println("名字：" + dog.getName());
        System.out.println("年龄：" + dog.getAge());
        
        dog.setAge(-5);   // 年龄输入错误
        dog.setAge(100);  // 年龄输入错误
        dog.setAge(5);    // 成功
        System.out.println("修改后年龄：" + dog.getAge());
    }
}
```

---

## 遗留问题

- 如果有多个动物类（Dog、Cat、Bird），共同属性怎么避免重复？（明天学继承）
- 为什么有的属性用 `protected` 而不是 `private`？（明天学继承会讲）
- `super` 关键字是什么？（明天学继承会讲）

---

## 明天计划

- 学习继承（extends）
- 学习方法重写（Override）
- 学习 super 关键字
- 学习多态的初步概念
