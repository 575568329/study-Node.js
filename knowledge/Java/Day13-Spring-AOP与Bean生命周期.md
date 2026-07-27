# Day 13 - Spring AOP + Bean 生命周期

**日期**：2026-07-27
**主题**：Week 4 Spring 进阶（AOP 面向切面编程 / Bean 生命周期）

---

## 一、AOP 核心——解决什么问题

### 痛点：横切关注点散落各处

```java
// 100 个 Service 每个方法都要写日志 + 权限 + 事务 → 灾难
```

### 类比 Express 中间件

```javascript
app.use(logger);  // 不侵入路由代码，自动在请求前后插逻辑
app.use(auth);
```

AOP = Java 版中间件，目标从"HTTP 请求"变成"方法调用"。

---

## 二、5 个核心术语

| 术语 | 含义 | 类比 Express |
|------|------|-------------|
| **Aspect**（切面）| `@Aspect` 注解的类 | 一个中间件函数 |
| **Pointcut**（切入点）| `execution()` 或 `@annotation()` 表达式 | `app.use('/api/*')` |
| **Advice**（通知）| `@Before`/`@Around`/`@After` 等 | 中间件函数体 |
| **Join Point**（连接点）| 被切到的具体方法 | 请求对象 |
| **Weaving**（织入）| Spring 运行时用**动态代理**把切面包进目标对象 | Express 把中间件放进管道 |

### Pointcut 两种写法

```java
// 方式 1：按包路径匹配
@Pointcut("execution(* com.fjyu.service.*.*(..))")
//              ①返回类型 ②包.类 ③方法(参数)

// 方式 2：按注解匹配（更灵活，加注解就生效）
@Pointcut("@annotation(com.fjyu.annotation.RateLimit)")
```

---

## 三、5 种 Advice 执行时序

```
正常路径：
@Around(before-proceed) → @Before → 方法体 → @Around(after-proceed) → @AfterReturning → @After

异常路径：
@Around(before-proceed) → @Before → 方法体抛异常 → @AfterThrowing → @After
（@Around 不会走到 after-proceed——proceed() 抛异常了）
```

| Advice | 时机 | 能阻止执行吗 | 能改返回值吗 | 常见用途 |
|---------|------|:---:|:---:|----------|
| **@Before** | 方法前 | ❌ | ❌ | 打日志 |
| **@AfterReturning** | 正常返回后 | ❌ | ❌（只读） | 记成功日志 |
| **@AfterThrowing** | 抛异常后 | ❌ | ❌ | 错误告警 |
| **@After** | 最后（finally 位置）| ❌ | ❌ | 清理资源 |
| **@Around** | 包裹整个方法 | ✅ | ✅ | **权限、缓存、事务、计时** |

### @Around vs @Before 选型

- 需要**短路方法执行**或**改返回值** → `@Around`
- 只需**前置校验/日志/权限** → `@Before` 就够

---

## 四、Bean 生命周期（10 步）

```
1. 实例化（new）
2. 属性填充（@Resource 注入）
3. Aware 回调（BeanNameAware/BeanFactoryAware）
4. BeanPostProcessor.postProcessBeforeInitialization  ← BPP 前钩子
5. @PostConstruct 方法
6. InitializingBean.afterPropertiesSet()
7. BeanPostProcessor.postProcessAfterInitialization   ← BPP 后钩子（★AOP 代理在这里生成）
8. Bean 就绪，可以使用
9. @PreDestroy
10. Bean 销毁
```

### @PostConstruct vs 构造方法

| | 构造方法 | @PostConstruct |
|---|---|---|
| 时机 | 第 1 步 | 第 5 步 |
| 依赖注入了吗 | ❌ `@Resource` 全是 null | ✅ 全部到位 |
| 用途 | 初始化自己字段 | 校验依赖、预热缓存 |

---

## 五、AOP 代理机制

### BeanPostProcessor = AOP 的入口

`AbstractAutoProxyCreator` 实现 `BeanPostProcessor`，在 `postProcessAfterInitialization` 中：
- 检查 Bean 是否有匹配的 Advisor
- 有 → 创建 JDK/CGLIB 代理对象，替换原始 Bean
- 无 → 返回原始 Bean

### JDK 动态代理 vs CGLIB

| | JDK 动态代理 | CGLIB |
|---|---|---|
| 要求 | 目标类必须实现接口 | 可代理普通类 |
| 原理 | 反射 + InvocationHandler | 字节码生成子类 |
| 限制 | 只能代理接口方法 | private/final 方法无法代理 |
| Spring Boot 2.0+ | 非默认 | **默认**（实际项目更常用） |

### 自调用陷阱

```java
// 类内部 this.methodB() → 绕过代理 → 切面不生效！
this.methodB();  // ❌ 不会触发 AOP

// 两种修复：
// 方案 1：AopContext.currentProxy()
((MyClass) AopContext.currentProxy()).methodB();

// 方案 2：抽到独立 Bean + @Autowired 注入
@Autowired private OtherService otherService;
otherService.methodB();  // ✅ 注入的就是代理对象
```

---

## 六、公司代码实战

### LimitFrequencyAspect（限流，@Before）

```java
@Aspect
@Component
public class LimitFrequencyAspect {
    @Pointcut("@annotation(...LimitFrequency)")
    public void annotationPointCut() {}

    @Before("annotationPointCut()")
    public void doBefore(JoinPoint joinPoint) {
        // 读注解 → 拼 key（IP/账号/方法）→ RateLimiter.tryAcquire() → 超限记录异常
    }
}
```

### HttpSensitiveAspect（加解密 + 掩码，@Around）

```java
@Around("@annotation(sensitiveOperation)")
public Object processHttpRequest(ProceedingJoinPoint joinPoint, SensitiveOperation annotation) {
    // ① 方法前：RSA 解密请求参数
    Object[] args = decryptArgs(joinPoint.getArgs(), method);
    // ② 执行原方法（传解密后的参数）
    Object result = joinPoint.proceed(args);
    // ③ 方法后：掩码脱敏 + 生成查看 Token
    return processResult(result, annotation.value());
}
```

**掩码规则**：正则捕获组保留头尾，中间换星号（138****5678）

---

## 七、错题本

### 🔴 Maven 依赖调解（高信心错误重犯，Day 11 + Day 13 连续错）
- 错误：选 B1.0（"层级更低"）
- 正确：**最近者优先**——A→B(v1.0) 距离 1，A→C→B(v2.0) 距离 2 → 选 v1.0

### BPP 认知不对称
- 错误：说 BeanPostProcessor 只在"后置钩子"执行
- 正确：有 before + after 两个钩子，`@PostConstruct` 夹在中间

### isBlank() Java 版本不兼容（未自检）
- `String.isBlank()` 是 Java 11 API，公司 JDK 8 → 应用 `!"".equals(str.trim())`

---

## 八、下次学习计划
- Spring AOP 深入：JDK vs CGLIB 源码级 / 自调用陷阱验证
- 或 Spring 事务（@Transactional = AOP 的经典应用）
- 优先复习：Maven 依赖调解（Again）
