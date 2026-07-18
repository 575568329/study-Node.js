# Day 5 学习记录

**日期**:2026-07-18
**主题**:接口(interface)、抽象类(abstract class)、集合框架(List / Map / Set / 泛型)

---

## 一、接口与抽象类

### 1. 抽象类(abstract class)

**为什么需要**:像 `Animal` 这种"本就不该被直接实例化"的类——动物是个抽象概念,只有具体的狗、猫才能 new。用 `abstract` 修饰,禁止直接 `new Animal()`。

```java
public abstract class Animal {
    private String name;
    private int age;

    public Animal(String name, int age) { ... }   // 抽象类可以有构造方法(给子类 super 用)

    public String getName() { return name; }       // 普通方法,子类直接继承用

    public abstract void eat();                    // 抽象方法:只有声明,没有方法体
}
```

**两条规则**:
- 抽象类**不能 `new`**(编译报错)`Animal b = new Animal(...); // ❌`
- 抽象方法**没有方法体**,子类必须重写(除非子类也是抽象的)

> 抽象类 = 普通类 + 能放抽象方法。它可以有属性、构造方法、普通方法,和普通类几乎一样,只是多了"不能实例化"和"可以声明抽象方法"两个能力。

### 2. 接口(interface)

**为什么需要**:抽象"行为契约"。`AnimalService` 只规定"能 save、能 findById",不关心谁实现、怎么实现。

```java
public interface AnimalService {
    void save(Animal animal);          // 方法默认 public abstract,可省略
    Animal findById(String id);
}

public class AnimalServiceImpl implements AnimalService {
    @Override
    public void save(Animal animal) { ... }      // 实现接口,必须重写所有方法
    @Override
    public Animal findById(String id) { ... }
}
```

**关键用法**(面向接口编程):
```java
AnimalService service = new AnimalServiceImpl();   // 接口类型引用 = new 实现类对象
```

### 3. 抽象类 vs 接口(核心对照表)

| | 抽象类(abstract class) | 接口(interface) |
|---|---|---|
| 关键字 | `abstract class` | `interface` |
| 子类继承 | `extends`(单继承,只能一个) | `implements`(多实现,可以多个) |
| 构造方法 | ✅ 有 | ❌ 没有 |
| 属性 | 任意类型 | 只能 `public static final` 常量 |
| 方法 | 抽象方法 + 普通方法(有方法体) | 抽象方法(Java 8+ 可加 `default`/`static` 方法) |
| 表达关系 | **is-a**(是什么) | **can-do**(能做什么) |
| 何时用 | 有共同状态(属性)+ 代码复用 | 纯行为契约,跨类层级 |

**选择口诀**:
> **"是什么"(is-a,有共同属性)→ 抽象类**;**"能做什么"(can-do,纯行为)→ 接口**。

**举例**:
- `Animal` 用抽象类:狗/猫**是**动物,都有 name/age,**is-a + 有共同状态**
- "能飞的飞行器"(鸟、飞机、无人机)用接口:它们**没有**共同父类(鸟是动物、飞机是机械),但**都能飞**,**can-do → 接口**
- `AnimalService` 用接口:只规定"能 save/find",**纯行为契约**

---

## 二、面向接口编程(本日最重要的纠正)

### 🔴 课前小测的高信心错误(已纠正)

问:`AnimalServiceImpl service = new AnimalServiceImpl();`(变量声明成实现类)能不能跑?

**错误答案**(我之前以为的):不能跑 ❌
**正确答案**:**能跑,完全能跑** ✅。两种写法功能一样。

```java
// 写法 A:面向接口(推荐)
AnimalService service = new AnimalServiceImpl();
// 写法 B:面向实现(能跑,但退化)
AnimalServiceImpl service = new AnimalServiceImpl();
```

**区别在设计层面,不在能不能跑**。面向接口(A)的三个价值:

| 价值 | 说明 |
|------|------|
| ① 可替换 | 换实现类只改 `new` 那一处,左边声明和所有调用代码不动 |
| ② 解耦 | 调用方只依赖"契约"(接口),不依赖具体实现 |
| ③ Spring 根基 | `@Autowired AnimalService service;` 运行时注入实现类,**写法 B 根本没法注入** |

> **结论**:`AnimalService service = new AnimalServiceImpl()` 和公司 Spring 里 `@Autowired private XxxService xxxService;` 是同一件事——**面向接口编程**。这就是公司代码 Service 层永远是 `XxxService`(接口)+ `XxxServiceImpl`(实现)分层的原因。

### 集合框架里的同款模式

```java
List<String> list = new ArrayList<>();        // List 接口 = new ArrayList 实现
Map<String,User> userMap = new HashMap<>();   // Map 接口 = new HashMap 实现
```
`List`/`Map`/`Set` 都是**接口**,`ArrayList`/`HashMap`/`HashSet` 是实现类。**面向接口编程在 Java 标准 API 里无处不在。**

---

## 三、集合框架

### 1. 泛型(`<Type>`)

**本质**:把"运行时才发现的错"提前到"编译时就拦死"。

```java
// 不加泛型(早期 Java,和 JS 一样烂)
List list = new ArrayList();
list.add("hello");
String s = (String) list.get(0);   // 必须强转,转错运行时 ClassCastException

// 加泛型
List<String> list = new ArrayList<>();
list.add(123);                 // ❌ 编译就报错,程序跑不起来
String s = list.get(0);        // ✅ 直接是 String,不用强转
```

**三个好处**:
1. **编译期报错**(`add(123)` 按 run 前就红线)
2. **免去强转**(`get` 直接返回指定类型)
3. **自解释**(看 `Map<String,User>` 就知道存什么)

> **JS 对比**:JS 是弱类型,存的时候不检查,取的时候才发现错(运行时爆炸)。泛型是 Java 强类型的核心机制——**真正做类型验证的是泛型,不是接口**。

### 2. List(对标 JS Array)

`List` 是接口,`ArrayList` 是最常用实现(数组,对标 JS Array)。

| 操作 | JS Array | Java `List` |
|------|----------|-------------|
| 创建 | `const a = []` | `List<T> list = new ArrayList<>()` |
| 末尾添加 | `a.push(x)` | `list.add(x)` |
| 按索引取 | `a[0]` | `list.get(0)` |
| 按索引改 | `a[0] = x` | `list.set(0, x)` |
| 按索引删 | `a.splice(i,1)` | `list.remove(i)` |
| 长度 | `a.length`(属性) | `list.size()`(方法,**带括号**) |
| 是否包含 | `a.includes(x)` | `list.contains(x)` |
| 遍历 | `for (const x of a)` | `for (T x : list)` |

**易错点**:
- ❌ `list[0]` —— List 不能用中括号,必须 `list.get(0)`
- ❌ `list.length` —— 是方法,必须 `list.size()`

### 3. Map(对标 JS Object / Map)

`Map` 是接口,`HashMap` 是最常用实现。

| 操作 | JS Object | JS Map | Java `Map` |
|------|-----------|--------|------------|
| 创建 | `{}` | `new Map()` | `new HashMap<>()` |
| 放 | `obj[k]=v` | `m.set(k,v)` | `map.put(k, v)` |
| 取 | `obj[k]` | `m.get(k)` | `map.get(k)` |
| 删 | `delete obj[k]` | `m.delete(k)` | `map.remove(k)` |
| 有没有 key | `k in obj` | `m.has(k)` | `map.containsKey(k)` |
| 个数 | `Object.keys(obj).length` | `m.size` | `map.size()`(**带括号**) |

**关键差异**:
- `get` 找不到返回 **`null`**(JS 是 `undefined`);Java 没有 undefined,统一 null
- `Map.get()` 找不到天然返回 null,**不用先 `containsKey` 再 `get`**(那是两次查表)
- Java 8 **没有 `?.` 可选链**,取出值要手动判空:`if (x != null) { ... }`

**遍历(三种)**:
```java
// 要 key + value
for (Map.Entry<String, User> entry : map.entrySet()) {
    entry.getKey();      // 键
    entry.getValue();    // 值
}
// 只要 value
for (User u : map.values()) { ... }
// 只要 key
for (String k : map.keySet()) { ... }
```

**`Map.Entry` 是什么**:"一条键值对"的整体类型。对标 JS 遍历 Map 时的 `[k, v]` 解构元组。Java 没有解构语法,所以把键值对封装成 `Entry` 对象,用 `getKey()/getValue()` 访问。

### 4. Set(对标 JS Set)

`Set` 是接口,`HashSet` 是最常用实现。核心特性:**不重复**。

| 操作 | JS `Set` | Java `Set` |
|------|----------|------------|
| 创建 | `new Set()` | `new HashSet<>()` |
| 加 | `s.add(x)` | `set.add(x)` |
| 有没有 | `s.has(x)` | `set.contains(x)` |
| 删 | `s.delete(x)` | `set.remove(x)` |
| 个数 | `s.size` | `set.size()` |

**典型用途:去重**(对标 JS 的 `[...new Set(arr)]`):
```java
List<String> names = Arrays.asList("旺财", "小黑", "旺财");
Set<String> unique = new HashSet<>(names);   // List → Set 自动去重
```

---

## 四、Java vs JS/TS 关键差异(本周累积)

| 概念 | JS/TS | Java |
|------|-------|------|
| 字符串比较 | `===` | **必须 `.equals()`**,`==` 比的是地址 |
| 打印 | `console.log(\`${a}\`)` 模板字符串 | `println(a + b)` 拼接,或 `printf("%s%d", a, b)` 格式符 |
| 空值 | `undefined` / `null` | 只有 `null` |
| 可选链 | `a?.b` | 没有(Java 8),手动 `if (a != null)` |
| 数组取值 | `a[0]` | List 用 `list.get(0)` |
| 集合长度 | `.length` / `.size`(属性) | `.size()`(方法,带括号) |
| 类型检查 | TS 编译期(类型擦除) | 泛型编译期 + 接口运行时仍存在 |

---

## 五、关键易错点(盲区汇总,反复看)

### 🔴 P0 级(已踩坑,必须刻死)

1. **字符串比较 `==` vs `equals`**(Day1 易错点,Day5 重犯)
   - `==` 比内存地址,`equals` 比内容
   - 字符串常量池会让 `==` 碰巧成立,但来自 `new String`/数据库/IO 的字符串 `==` 必错
   - **铁律:Java 字符串比内容一律 `.equals()`**
   - 公司 MyBatis 查出来的字符串全是 new 出来的,`==` 必错

2. **接口引用 vs 实现类引用**
   - `AnimalService s = new AnimalServiceImpl()` 和 `AnimalServiceImpl s = new AnimalServiceImpl()` **都能跑**
   - 区别在"面向接口" vs "面向实现",后者锁死具体类、无法 Spring 注入

### 🟡 P1 级

3. **`printf` 第一参数是格式字符串**
   - 格式符:`%s` 字符串、`%d` 整数、`%f` 小数、`%n` 换行
   - 不要把变量拼接当 format:`printf(name + age)` ❌ → 用 `println` 或 `printf("%s%d%n", name, age)`
   - **新手默认 `println`,要控制格式才 `printf`**

4. **`Map.get` 找不到返回 `null`,不是 `undefined`**
   - 不用 `containsKey` + `get` 两次查表,直接 `return map.get(id)`

5. **`List` 不能用 `[]` 和 `.length`** → `get()` / `size()`

### ⚪ P2 级(待 Spring 阶段验证)

6. **接口运行时仍存在** → 能做依赖注入(`@Autowired`)、动态分派。TS interface 编译后消失,做不到(靠 reflect-metadata 装饰器补)。

---

## 六、实战代码(testList 包)

完整实现了一个面向接口 + 集合 的用户管理小项目:

```
testList/
  ├── User.java            // 实体:private 字段 + getter/setter(Day3 封装)
  ├── UserService.java     // 接口:add / findByName / get / printAll
  ├── UserServiceImpl.java // 实现:Map<String,User> 存储
  └── Main.java            // 演示:面向接口 + 判空
```

**学以致用的点**:
- `UserService userService = new UserServiceImpl()` —— 面向接口(Day5 核心)
- `Map<String,User> userMap = new HashMap<>()` —— 集合 + 泛型 + 面向接口三合一
- `findByName` 里 `user.getName().equals(name)` —— equals 修正
- `if (findData != null)` —— Java 防御性判空(对比 JS 的 `?.`)

---

## 七、遗留问题 / 下次学习

- **异常处理**:`try-catch-finally`、`NullPointerException`(今天已撞见)、自定义异常
- **迭代器 Iterator**:增强 for 的底层(暂略)
- **泛型进阶**:`<T extends X>` 泛型边界、`<?>` 通配符(用到再学)
- **Java 8 接口的 default 方法**:为什么接口也能有方法体了

---

## 明天计划

- 异常处理(try-catch / throw / 自定义异常)
- 把 `testList` 改造:加"用户不存在"的自定义异常(替代返回 null)
- 读公司代码:找 3 处 `List<>` / `Map<>` 的实际用法
