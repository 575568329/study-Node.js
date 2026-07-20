# Day 7 学习记录

**日期**：2026-07-20
**主题**：读公司代码 + Week 2 Stream API + Optional

---

## 今日学习内容

### 1. 读公司代码（连接学习与工作）

#### HelpCenterController（帮助中心，63 行精简样本）

精读了公司真实 Controller，把 Week 1 学的知识用到真实代码上。

**核心结构**：
```java
@Controller                                    // Spring 注解：标记为控制器
@RequestMapping("/api/helpCenter")             // 路由前缀（等价 Express app.use）
public class HelpCenterController {

    @Resource                                  // Spring 自动注入（不用 new）
    private ZmHelpCatalogService zmHelpCatalogService;  // 接口类型引用！

    @RequestMapping("/getHelpCatalogs")
    public @ResponseBody JsonResultHaveObj<List<ZmHelpCatalog>> getHelpCatalogs() {
        ZmHelpCatalog log = new ZmHelpCatalog();
        log.setIsShow("0");                    // setter（封装）
        List<ZmHelpCatalog> result = this.zmHelpCatalogService.listCatalog(log);
        JsonResultHaveObj<List<ZmHelpCatalog>> res = new JsonResultHaveObj<>();
        res.setResult(result);
        return res;                            // 统一返回结构
    }
}
```

**对应已学知识**：
- `@Resource private XxxService` → 接口 + 依赖注入（多态）
- `List<Xxx>` / `JsonResultHaveObj<T>` → 泛型 + 集合
- `log.setIsShow("0")` → 封装（setter）
- `if (null != content)` → 空指针防御（Day 6）

#### 三个关键理解

**① Controller 看不到 Dao（分层隔离）**
```
Controller → Service 接口 → ServiceImpl → Dao → MySQL
```
每层只跟相邻层打交道。Controller 只认识 Service，不关心数据库。这就是 CLAUDE.md 的"禁止跨层调用"。

**② 统一返回结构 JsonResultHaveObj**
不直接返回 List，包一层 `{code, message, result}`，前端统一处理成功/失败。等价 Node.js 的 `{code, message, data}`。

**③ 查询条件对象**
`new ZmHelpCatalog(); setIsShow("0")` 用对象传查询条件，比一堆参数清晰。

#### PaperServiceImpl 异常处理（实战）

```java
// ① 校验失败 → 抛业务异常（带上下文）
if (CollectionUtils.isEmpty(papers)) {
    throw new ELPBizException("需要标注的试卷集合不能为空");
}

// ② 重复数据校验 → 带具体数据
throw new ELPBizException(String.format("paperId:%s...已存在!", ...));

// ③ try-catch + 包装异常（企业级标准套路）
try {
    // 业务逻辑
} catch (Exception e) {                          // 接住底层异常
    logger.error(...);                           // 记日志
    throw new ELPBizException("paper增加工资源异常", e);  // 包装成业务异常重抛
}
```

**异常包装**：`new 异常(消息, 原始异常)` 把底层技术异常（SQLException 等）转成业务异常，不暴露技术细节给前端。

**全局异常处理器**（@ControllerAdvice）：
ServiceImpl 抛 ELPBizException → Controller 没 catch → Spring 交给全局处理器 → 包装成 JsonResultHaveObj 返回前端。这就是 Day 6 说的"@ControllerAdvice 全局接，日常只 throw new"。

---

### 2. Stream API（Week 2 核心）

#### 4 个步骤（对标 JS 链式调用）

```java
List<String> adultNames = users.stream()           // ① 开启流
    .filter(u -> u.getAge() >= 18)                 // ② 过滤（JS filter）
    .map(User::getName)                            // ③ 转换（JS map）
    .collect(Collectors.toList());                 // ④ 收集（JS 没有的步骤）
```

#### JS vs Java 对照

| 操作 | JavaScript | Java Stream |
|------|-----------|-------------|
| 开启 | 直接用 | `.stream()` |
| 过滤 | `.filter(u => ...)` | `.filter(u -> ...)` |
| 转换 | `.map(u => ...)` | `.map(u -> ...)` 或 `.map(User::getXxx)` |
| 收集 | 自动是数组 | `.collect(Collectors.toList())` |
| Lambda | `=>` | `->` |

**方法引用**：`User::getName` 是 `u -> u.getName()` 的简写。

#### 惰性求值（Lazy Evaluation）⭐ 关键

操作分两类：
- **中间操作**（filter/map/peek）：**不立即执行**，只记录"要做什么"
- **终端操作**（collect/findFirst/forEach）：**触发整个流水线执行**

**没有终端操作，中间操作一行都不执行！**

```java
stream.filter(...).map(...);   // 不执行
stream.peek(println);          // 不执行（peek 是中间操作）
stream.peek(println).collect(toList());  // 执行（有终端）
```

#### 短路终端操作（findFirst）

`findFirst` 找到第一个就停，**不会遍历全部**，和 for 循环"找到立即 return"效率一样。

**踩坑记录**：
```java
userService.groupByAge().values().stream().peek(System.out::println);
// ↑ 这行不打印！peek 是中间操作，没有终端不执行
```
正确打印用 `forEach`（终端操作）或直接 `System.out.println(map)`。

---

### 3. collect 的多种收集方式

| Collector | 作用 | JS 对应 |
|-----------|------|---------|
| `toList()` | 收集成 List | `array.map()` |
| `toSet()` | 收集成 Set（去重）| `[...new Set(array)]` |
| `toMap()` | 收集成 Map | `Object.fromEntries()` |
| `joining(",")` | 拼接字符串 | `array.join(",")` |
| `groupingBy()` | **分组**（常用）| lodash `_.groupBy()` |
| `counting()` | 计数 | `array.length` |

#### groupingBy 分组（公司超常用）

```java
// 基础分组：按年龄分
Map<Integer, List<User>> byAge = users.stream()
    .collect(Collectors.groupingBy(User::getAge));

// 分组 + 计数
Map<Integer, Long> count = users.stream()
    .collect(Collectors.groupingBy(User::getAge, Collectors.counting()));

// 分组 + 取属性
Map<Integer, List<String>> names = users.stream()
    .collect(Collectors.groupingBy(User::getAge,
        Collectors.mapping(User::getName, Collectors.toList())));
```

**公司真实用法**（FactoryVocabularyBizSupportServiceImpl）：
```java
.collect(Collectors.groupingBy(v -> v.getParaphraseId().getPkgId()))
// 按教材包 ID 分组词汇
```

---

### 4. Optional（优雅解决 null）

#### 本质：一个"盒子"，可能有值也可能没有

```
Optional.of("张三")  → 盒子里装 "张三"
Optional.empty()     → 空盒子
```

**比 null 好在哪**：
- 返回类型 `Optional<User>` 明确告诉调用方"可能没值"
- 空盒子是对象，能调方法（null 调方法会崩）
- 强制面对"没值怎么办"

#### 核心方法（对标 JS）

| 方法 | 作用 | JS 对应 |
|------|------|---------|
| `Optional.ofNullable(x)` | 装进盒子（x 可为 null）| - |
| `.map(...)` | 安全转换（空了就停）| `?.` 可选链 |
| `.isPresent()` | 有没有值 | `!= null` |
| `.orElse(默认)` | 没值给默认 | `??` 空值合并 |
| `.orElseThrow()` | 没值抛异常 | 手写 throw |
| `.ifPresent(...)` | 有值才执行 | `if (x != null) {}` |

#### 实战对比

```java
// 传统 null 防御（嵌套丑陋）
public int getNameLength(User user) {
    if (user != null) {
        String name = user.getName();
        if (name != null) {
            return name.length();
        }
    }
    return 0;
}

// Optional 链式（优雅）
public int getNameLength(User user) {
    return Optional.ofNullable(user)
        .map(User::getName)
        .map(String::length)
        .orElse(0);
}
```

#### 已经用过 Optional（findFirst）

```java
userMap.values().stream()
    .filter(u -> u.getName().equals(name))
    .findFirst()                                              // 返回 Optional<User>
    .orElseThrow(() -> new UserNotFoundException("用户不存在"));
```

#### 使用边界
- ✅ 方法返回值（查询可能查不到）：findById、findFirst
- ❌ 字段（序列化、性能问题）
- ❌ 方法参数（多此一举）
- ❌ `Optional<List>`（返回空 List 就行）

#### 两种"找不到"的处理方式

```java
// 找不到是异常（必须报错）→ orElseThrow
.orElseThrow(() -> new UserNotFoundException(...));

// 找不到是正常（给默认）→ orElse
.orElse("未知用户");
```

---

### 5. toString 重写

#### 为什么打印 `User@30dae81`？

没重写 toString，用 Object 默认实现：`类名@哈希码十六进制`。

#### 解决：重写 toString

```java
@Override
public String toString() {
    return "User{name='" + name + "', age=" + age + "}";
}
```

**Object 三大方法**（同类知识）：
| 方法 | 默认行为 | 重写后 |
|------|---------|-------|
| equals | 比较地址（==）| 比较内容 |
| toString | 打印 `类名@哈希码` | 打印可读内容 |
| hashCode | 内存地址算哈希 | 配合 equals |

实际开发用 Lombok `@Data` 自动生成，不用手写。

---

## 实战代码

### UserServiceImpl（企业级水准，串联所有知识）

```java
public class UserServiceImpl implements UserService {
    private Map<String, User> userMap = new HashMap<>();

    public void add(String id, User user) { userMap.put(id, user); }

    // Stream + filter + findFirst + Optional.orElseThrow + 自定义异常
    public User findByName(String name) {
        return userMap.values().stream()
            .filter(u -> u.getName().equals(name))
            .findFirst()
            .orElseThrow(() -> new UserNotFoundException("用户不存在：" + name));
    }

    // Optional + map + orElse
    public String findNameById(String id) {
        return Optional.ofNullable(userMap.get(id))
            .map(User::getName)
            .orElse("未知动物");
    }

    // Stream + groupingBy
    public Map<Integer, List<User>> groupByAge() {
        return userMap.values().stream()
            .collect(Collectors.groupingBy(User::getAge));
    }

    public void printAll() { /* entrySet 遍历 */ }
    public User get(String id) { return userMap.get(id); }
}
```

**一个类串联**：OOP、接口、异常、Stream、Optional、Map。

---

## 对比理解（Java vs JS）

### 数组/集合处理
```javascript
// JS
const names = users.filter(u => u.age >= 18).map(u => u.name);
const grouped = _.groupBy(users, 'age');
const name = user?.name ?? "匿名";
```

```java
// Java
List<String> names = users.stream()
    .filter(u -> u.getAge() >= 18)
    .map(User::getName)
    .collect(Collectors.toList());

Map<Integer, List<User>> grouped = users.stream()
    .collect(Collectors.groupingBy(User::getAge));

String name = Optional.ofNullable(user)
    .map(User::getName).orElse("匿名");
```

---

## 关键概念总结

1. **公司分层**：Controller → Service → ServiceImpl → Dao（禁止跨层）
2. **Stream 4 步**：stream → filter/map → collect
3. **惰性求值**：中间操作不执行，终端操作才触发
4. **短路终端**：findFirst 找到就停，效率等同 for 循环
5. **groupingBy**：一行实现分组（公司高频）
6. **Optional**：优雅解决 null，对标 JS `?.` 和 `??`
7. **toString**：重写后才能打印可读内容

---

## 遗留问题 / 下次学习

- 日期时间 LocalDate（审计字段、日志时间）
- 字符串 StringBuilder（拼接性能）
- 文件 I/O（Files/Path）
- Spring 注解（@Controller/@Resource/@RequestMapping）的原理

---

## 明天计划

- Week 2 剩余：LocalDate、StringBuilder、文件 I/O
- 或继续读公司代码找 Stream/Optional 真实用例
