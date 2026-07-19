# Day 6 学习记录

**日期**:2026-07-19
**主题**:异常处理(try-catch / throw / throws / 自定义异常)

---

## 一、异常是什么 + Java 异常体系

### 异常 = 程序运行的"意外情况"
对标 JS 的 `Error`。常见的:
- `NullPointerException` —— 对 null 调方法
- `ArrayIndexOutOfBoundsException` —— 数组越界
- `ArithmeticException` —— 除以零
- `IOException` / `SQLException` —— IO / 数据库

### 🔑 Java 异常体系(和 JS 最大的不同)

```
Throwable
├── Error                          ← JVM 级严重问题,不该 catch(OutOfMemoryError 等)
└── Exception
    ├── RuntimeException           ← 运行时异常(Unchecked,编译器不强制处理)
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── ClassCastException
    │   └── IllegalArgumentException
    └── 其他 Exception             ← 编译时异常(Checked,编译器强制处理!)★
        ├── IOException            (读写文件、网络)
        ├── SQLException           (数据库)
        └── ClassNotFoundException
```

### Checked vs Unchecked(JS 没有的概念,核心)

| 类型 | 是什么 | 不处理会怎样 | 例子 |
|------|--------|-------------|------|
| **Unchecked**(RuntimeException 子类) | 程序员的 bug | 能编译,**运行时才崩** | NPE、越界、除零 |
| **Checked**(其他 Exception) | 外部不可控因素 | **编译就过不了** | IO、SQL、网络 |

> **设计原因**:
> - NPE/越界是"代码写错了",应该修代码,不是 try-catch 掩盖 → 不强制
> - 文件不存在/数据库断开是"环境问题",编译器逼你**必须想好对策** → 强制
>
> **"Checked"名字由来**:编译器替你"检查"你有没有处理。JS 所有异常都是 Unchecked 行为,没有这个概念。

---

## 二、try-catch-finally(和 JS 像 90%)

```java
try {
    // 可能出错的代码
} catch (NullPointerException e) {          // 按类型捕获
    System.out.println("空指针:" + e.getMessage());
} catch (Exception e) {                      // 兜底(从具体到宽泛)
    System.out.println("其他异常");
} finally {
    // 不管有没有异常都执行(清理资源:关文件、关连接)
}
```

### 对比 JS

| | JS | Java |
|---|----|------|
| catch 个数 | **1 个**(接所有) | **多个**,按异常类型分别处理 |
| catch 参数 | 不分类型 `e` | **必须是异常类型** `NullPointerException e` |
| 顺序要求 | 无 | **从具体到宽泛**(子类在前,父类兜底在后) |

### 易错:catch 顺序不能反
```java
catch (Exception e) { ... }              // ❌ 父类在前
catch (NullPointerException e) { ... }   // 永远走不到,编译报错
```
**口诀:子类异常在前,父类(Exception)兜底在后。**

---

## 三、throw vs throws(只差个 s,完全不同)

| | `throw` | `throws` |
|---|---------|----------|
| 是什么 | **动作**:抛出一个异常对象 | **声明**:方法可能抛哪些异常 |
| 位置 | 方法体内 | 方法签名上 |
| 对标 JS | JS 有 `throw` | **JS 没有**(因为无 Checked) |

### 处理 Checked 异常的两个办法

```java
// 办法 1:try-catch(自己兜住)
public void read() {
    try {
        new FileInputStream("a.txt");
    } catch (IOException e) {
        System.out.println("文件读不了");
    }
}

// 办法 2:throws(往上抛,让调用者处理)
public void read() throws IOException {       // 谁调我谁处理
    new FileInputStream("a.txt");
}
```

> **throws 是"责任传递"**:你不处理就声明出去,逼调用者处理;调用者也可继续 throws 往上传,传到 main 还没处理 → 编译报错。JS 没这机制。

---

## 四、自定义异常

```java
// 继承 RuntimeException → Unchecked(公司主流,不强制处理)
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String msg) {
        super(msg);              // 消息传给父类,getMessage() 能拿到
    }
}
```

- `extends RuntimeException` → Unchecked(公司主流,代码干净)
- `extends Exception` → Checked(强制处理,啰嗦)
- **命名惯例**:`XxxException` 结尾

---

## 五、实战:UserService 改造(异常代替 null)

把昨天"返回 null"的 `findByName` 改成"抛异常":

```java
// UserNotFoundException.java
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String msg) { super(msg); }
}

// UserServiceImpl.findByName
public User findByName(String name){
    for (User user : userMap.values()) {
        if (user.getName().equals(name)) { return user; }
    }
    throw new UserNotFoundException("用户不存在:" + name);   // 不再 return null
}

// Main
try {
    User findData = userService.findByName("不存在");
    System.out.println(findData.getName());
} catch (UserNotFoundException e) {
    System.out.println("捕获到:" + e.getMessage());
}
```

### 异常 vs 返回 null(为什么异常更好)

| | 返回 null | 抛异常 |
|---|-----------|--------|
| 调用方判空 | **必须** `if (x != null)`,忘判就 NPE | 不用判,要么有效对象要么异常 |
| 出错隐蔽性 | null 可能传很远才 NPE,难追 | 立即暴露( Fail Fast) |
| 携带信息 | 只有 null | 消息、错误码、堆栈 |

> 改造后 Main 里原来的 `if (findData != null)` 判空变多余——印证了异常的最大好处:**调用方不用再判空**。

---

## 六、公司实际工作流(重要!打破"写异常很麻烦"的错觉)

### 真实 Spring 项目

```java
// ① 项目初期:定义几个通用基类(写一次,全项目复用)
public class BusinessException extends RuntimeException {
    private int code;
    public BusinessException(int code, String msg) { super(msg); this.code = code; }
}

// ② 日常 Service:不建新类,直接 new 已有的
if (u == null) {
    throw new BusinessException(40401, "用户不存在");
}

// ③ 框架全局接异常:几乎不写 try-catch
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BusinessException.class)
    public Result handle(BusinessException e) {
        return new Result(e.getCode(), e.getMessage(), null);
    }
}
```

| 你以为 | 实际 |
|--------|------|
| 每个业务错误都要写异常类 | 一个 `BusinessException` 基类全项目复用,日常只 `throw new` |
| 到处写 try-catch | 几乎不写,`@ControllerAdvice` 一处统一接住 |
| 异常都是自己造 | 大量是框架抛的(Spring/MyBatis 自抛) |

### 对比 Node.js

```js
// Express 全局错误中间件 = Java 的 @ControllerAdvice
app.use((err, req, res, next) => {
    res.status(err.code || 500).json({ msg: err.message })
})
// throw new ApiError(404, '用户不存在')  ← JS 也用自定义错误类
```
> 思路完全一样,Java 只是更"正式"(类 + 编译检查)。

---

## 七、错误类型要不要全记?

**不用,记策略**:

**必须认识的 6 个**(高频):NPE、数组越界、ClassCast、Arithmetic、IOException、SQLException。

**判断三步法**(遇到陌生的):
```
看名字猜含义 → IDEA 点进源码看 extends 谁
              → extends RuntimeException = Unchecked
              → extends Exception(非 Runtime) = Checked
```

> 记"分类逻辑 + 英文名含义",不记具体处理。IDE 会提示。

---

## 八、关键易错点 / 盲区

### 🔴 P0(已纠正)

1. **Checked 异常不处理 = 编译错误**(不是运行时)
   - 高信心错误:误以为"能编译运行时报错" → 实际编译就过不了
   - 这是 Checked vs Unchecked 的本质分界

2. **catch 顺序**:子类在前,父类(Exception)兜底在后,反了编译报错

### 🟡 P1

3. **throw vs throws**:`throw` 抛动作,`throws` 声明(签名上)
4. **异常 vs null**:业务错误优先抛异常(Fail Fast),调用方不用判空

---

## 九、Java vs JS 对照(本周累积)

| 概念 | JS | Java |
|------|-----|------|
| 异常基类 | `Error` | `Throwable` → `Exception` |
| try-catch | 一个 catch 接所有 | 按类型多个 catch |
| 抛异常 | `throw new Error()` | `throw new XxxException()` |
| 声明异常 | 无 | `throws`(因有 Checked) |
| Checked 异常 | **无此概念** | 有,编译强制处理 |
| 全局处理 | 错误中间件 | `@ControllerAdvice` |
| 自定义异常 | 自定义 Error 类 | `extends RuntimeException` |

---

## 十、遗留 / 下次学习

- **multi-catch**:`catch (IOException | SQLException e)`(Java 7+,一次接多种)
- **try-with-resources**:`try (FileReader r = new FileReader(...)) { }` 自动关资源(Java 7+)
- **异常链**:`throw new XxxException("...", e)` 保留原始异常
- Spring `@ControllerAdvice` 实战(到 Spring 阶段)

---

## 明天计划

- Week 1 收官:读公司代码(找 3 个 Controller 接口 + 异常处理用法)
- 输出《Java vs Node.js 语法对比.md》(Week 1 验收项)
- 或进入 Week 2:Stream API(map/filter/collect)
