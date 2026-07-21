# Day 4 学习记录

**日期**：2026-07-17
**主题**：面向对象（二）—— 继承、方法重写、多态

---

## 今日学习内容

### 1. 继承（Inheritance）

#### 为什么需要继承？
多个类有重复的属性和方法（如 Dog、Cat、Bird 都有 name、age、eat），继承可以：
- 抽取共同部分到父类，避免重复代码
- 新增/修改共性时，只改父类一处
- 层次结构清晰，符合现实分类

#### extends 语法

```java
// 父类（基类/超类）
public class Animal {
    private String name;
    private int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }

    public void eat() {
        System.out.println(name + "在吃东西");
    }
}

// 子类（派生类）
public class Dog extends Animal {
    public Dog(String name, int age) {
        super(name, age);  // 调用父类构造方法
    }

    public void bark() {  // Dog 特有方法
        System.out.println(getName() + "：汪汪");
    }
}
```

#### super 关键字（两个作用）

1. **super(...)**：调用父类构造方法（必须是子类构造方法第一行）
2. **super.方法名()**：调用父类被重写的方法

```java
public Dog(String name, int age) {
    super(name, age);  // 作用1：调用父类构造
}

@Override
public void eat() {
    super.eat();  // 作用2：调用父类的 eat()
    System.out.println("还啃了根骨头");
}
```

#### 为什么子类构造要用 super(...)?
父类的属性是 private，子类不能直接访问，必须通过父类构造方法初始化。

```java
public Dog(String name, int age) {
    // this.name = name;  ❌ name 是父类 private
    super(name, age);     // ✅ 通过父类构造初始化
}
```

#### 继承能继承什么？

| 成员 | 能否继承 | 子类能否直接访问 |
|------|---------|----------------|
| public | ✅ | ✅ |
| protected | ✅ | ✅ |
| default | ✅（同包） | ✅（同包） |
| private | ✅（继承但隐藏） | ❌（需通过 getter） |
| 构造方法 | ❌ | 通过 super() 调用 |

---

### 2. 方法重写（Override）

#### 定义
子类定义一个和父类**签名完全相同**的方法，覆盖父类实现。

```java
// 父类
public void eat() {
    System.out.println(name + "在吃东西");
}

// 子类重写
@Override
public void eat() {
    System.out.println(getName() + "啃骨头");
}
```

#### 重写 vs 重载（重要区别）

| | 重载（Overload） | 重写（Override） |
|---|-----------------|-----------------|
| 发生位置 | 同一个类 | 父类和子类 |
| 方法名 | 相同 | 相同 |
| 参数列表 | **必须不同** | **必须相同** |
| 返回值 | 可以不同 | 相同或子类型 |
| 目的 | 同名支持不同参数 | 子类修改父类行为 |

**口诀**：
- 重载：同一个类，不同参数（一名多用）
- 重写：父子类，相同签名（子改父）

#### @Override 注解

**作用**：编译期检查，确保真的重写了父类方法。

```java
@Override
public void eat() {  // 如果拼错方法名，编译器报错
    ...
}
```

不加 @Override 的风险：方法名拼错时，编译器以为是新方法，不报错，运行时调父类版本，bug 难查。

#### 重写规则（两同两小一大）
- **两同**：方法名、参数列表相同
- **两小**：返回值、异常范围可以更小
- **一大**：访问权限可以更大（不能更严格）

```java
// 父类 public
public void eat() { }

// 子类
@Override
public void eat() { }      // ✅ public（相同）
protected void eat() { }   // ❌ 更严格，报错
```

#### 重写是可选的
- 需要定制行为 → 重写
- 沿用父类行为 → 不重写
- 扩展父类行为 → super + 自己的逻辑

---

### 3. 多态（Polymorphism）

#### 定义
父类引用指向子类对象，调用方法时执行子类的版本。

```java
Animal animal = new Dog("旺财", 3);  // 父类引用 ← 子类对象
animal.eat();  // 调用 Dog 的 eat()，输出：旺财啃骨头
```

#### 核心口诀
- **编译看左边**（Animal）：能调用什么方法，看引用类型
- **运行看右边**（Dog）：实际执行哪个版本，看对象类型

```java
Animal animal = new Dog("旺财", 3);
animal.eat();   // ✅ Animal 有 eat，编译通过；实际调 Dog 版本
animal.bark();  // ❌ 编译报错，Animal 没有 bark 方法
```

#### 多态的三个条件
1. **继承**：有父子类关系
2. **重写**：子类重写父类方法
3. **向上转型**：父类引用指向子类对象

#### 向上转型 vs 向下转型

```java
Animal animal = new Dog(...);  // ✅ 向上转型（狗是动物）
Dog dog = new Animal(...);     // ❌ 向下转型（动物不一定是狗）
```

#### 多态的价值

```java
// 一个方法处理所有动物
public static void feedAll(Animal[] animals) {
    for (Animal animal : animals) {
        animal.eat();  // 每种动物按自己的方式吃
    }
}

// 新增动物类型，feedAll 不需要修改
```

没有多态：每种动物写一个方法（feedDog、feedCat...），维护成本高。

---

## 对比理解（Java vs TS）

### 继承与多态

```typescript
// TypeScript
class Animal {
  protected name: string;
  constructor(name: string) { this.name = name; }
  eat() { console.log("在吃东西"); }
}

class Dog extends Animal {
  constructor(name: string) { super(name); }
  eat() { console.log("啃骨头"); }  // 重写
}

const animal: Animal = new Dog("旺财");  // 多态
animal.eat();  // 输出：啃骨头
```

**区别**：
| | TypeScript | Java |
|---|-----------|------|
| 继承关键字 | extends | extends |
| 调用父类构造 | super(...) | super(...) |
| 重写注解 | 无（自动检查） | @Override（推荐） |
| 多继承 | ❌ | ❌（有接口） |

概念完全一致。

---

## 关键概念总结

1. **继承（extends）**：子类获得父类的属性和方法
2. **super**：调用父类构造方法 / 访问父类方法
3. **重写（@Override）**：子类覆盖父类方法，签名必须相同
4. **多态**：父类引用指向子类对象，编译看左运行看右
5. **重写可选**：需要定制才重写，否则用父类版本

---

## 面向对象三大特性回顾

```
封装（Day 3）
  └─ private 隐藏 + getter/setter 控制访问

继承（Day 4）
  └─ extends 复用 + super 调用父类

多态（Day 4）
  └─ 父类引用 + 方法重写 + 向上转型
```

---

## 常见错误

### 1. 混淆重写和重载
```java
// 重载（参数不同，同一个类）
public void eat(String food) { }

// 重写（参数相同，父子类）
@Override
public void eat() { }
```

### 2. 向下转型
```java
Dog dog = new Animal(...);  // ❌ 编译报错
```

### 3. 通过父类引用调用子类特有方法
```java
Animal animal = new Dog(...);
animal.bark();  // ❌ Animal 没有 bark，编译报错
```

### 4. 空指针（防御性编程）
```java
// ❌ animals 为 null 会报错
if (animals.length > 0) { }

// ✅ 先判断 null
if (animals != null && animals.length > 0) { }
```

---

## 实战代码

### 类结构
```
Animal（父类）
  ├── Dog（重写 eat：啃骨头）
  ├── Bird（重写 eat：啄米 + 特有 fly）
  └── Cat（不重写，用父类 eat）
```

### Zoo.java（多态应用）
```java
public class Zoo {
    public static void feedAll(Animal[] animals){
        if(animals != null && animals.length > 0) {
            for (Animal animal : animals) {
                animal.eat();  // 多态：各调各的版本
            }
        } else {
            System.out.println("输入有误");
        }
    }

    public static void main(String[] args){
        Animal[] animals = {
            new Dog("小狗", 10),
            new Bird("麻雀", 10),
            new Cat("小猫", 10),
        };
        feedAll(animals);
        // 输出：
        // 小狗啃骨头
        // 麻雀啄米
        // 小猫在吃东西
    }
}
```

---

## 遗留问题 / 下次学习

- 抽象类（abstract）：如果 Animal 本身不应该被实例化怎么办？
- 接口（interface）：如何定义"能飞"这种跨物种的行为契约？
- 抽象类 vs 接口的区别？

---

## 明天计划
- 学习抽象类（abstract class）
- 学习接口（interface）
- 理解抽象类和接口的区别与使用场景
