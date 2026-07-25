# Day 12 - Spring 框架入门：IoC / DI / Spring MVC 路由

**日期**：2026-07-25
**主题**：Week 4 Spring 启动（IoC / DI / @RequestMapping）

---

## 一、课前复习成果（pre-session-review）

**昨天 3 个盲区全部解决！** 🎉

| KP | 昨天 | 今天 | 评价 |
|---|---|---|---|
| Maven 路径映射 | Again（高信心错误）| ✅ G（满分 5/5）| hypercorrection 金矿 |
| Maven 本地仓库 | Hard | ✅ G（ABC 全对）| 彻底理解统一缓存 |
| Flex 三属性 | Hard | ✅ G（三属性全对）| 前端复习线巩固 |

**FSRS 升级**：三个全部从 A/H 升到 G，下次复习间隔拉长到 8 天。

---

## 二、Spring 核心之 IoC（控制反转）

### 痛点：手动 new 的硬耦合

```java
// 没有 Spring：硬编码 new
public class OrderController {
    private UserService userService = new UserServiceImpl();  // 改实现要改所有地方
}
```

**问题**：换实现要改一堆代码、无法 Mock 测试、依赖缠成一团。

### IoC 定义

**对象的创建和管理权，从开发者代码反转到 Spring 容器**。

```java
// Spring 方式：声明需要，容器帮你 new + 注入
@Controller
public class HelpCenterController {
    @Resource
    private UserService userService;   // 不 new！等 Spring 注入
}
```

### "反转"反转了什么

| | 传统 | Spring |
|---|------|--------|
| 谁创建对象 | 你（new）| Spring 容器 |
| 谁管理依赖 | 你（手动组装）| Spring 容器（自动注入）|
| 控制权在 | 你的代码 | Spring 容器 |

### Spring 三个价值
1. **解耦**（学生说的"摇树原理"treeshaking）：组件通过容器中转，不直接 new
2. **可测试**：单测能注入 Mock（不是 new 死的）
3. **统一生命周期**：单例、初始化、销毁，Spring 管理

---

## 三、DI（依赖注入）- IoC 的实现

**IoC 是思想，DI 是实现方式**。
- IoC = "去餐厅吃饭"（不自己做饭）
- DI = "服务员把菜端上桌"（具体注入动作）

### 三种注入方式

| 方式 | 写法 | 推荐 |
|---|---|---|
| 字段注入 | `@Resource private UserService;`（公司用）| ⭐⭐ 简洁但不推荐 |
| **构造器注入** | 构造器 + `@Autowired` | ⭐⭐⭐⭐⭐ 现代推荐 |
| Setter 注入 | setXxx + @Autowired | ⭐ 很少用 |

**构造器注入优势**：可 final（不可变）、依赖明确、强制依赖、循环依赖早报错。

### @Resource vs @Autowired

| | @Resource | @Autowired |
|---|---|---|
| 来源 | JSR-250 标准 | Spring 原生 |
| 默认匹配 | 按名称 | 按类型 |
| 推荐 | 第三方/规范 | Spring 项目首选 |

---

## 四、Spring 容器

**容器 = 大工厂（帮你 new）+ 大仓库（保管对象，单例）**。

### 工作流程
```
1. 扫描带注解的类（@Controller/@Service/@Repository/@Component）
2. 实例化它们（new），放进容器
3. 解析依赖关系（谁需要谁）
4. 自动注入（@Resource/@Autowired）
5. 对象随时可用
```

### 注册 Bean 的注解（告诉 Spring "帮我管"）
- `@Controller`：Controller 层
- `@Service`：Service 层
- `@Repository`：数据访问层
- `@Component`：通用

### 类比
**Spring 容器 = 餐厅服务员**。`@Resource` 就是点菜，Spring 把对象端上桌。

### 公司真实用法（PaperServiceImpl）
```java
@Service("paperService")                    // 注册 Bean，命名 paperService
public class PaperServiceImpl implements PaperService {
    @Resource private PaperDao paperDao;     // 注入 Dao
    @Resource private ChoiceItemService choiceItemService;  // 注入其他 Service
    // 全部 @Resource，没有一处 new
}
```

---

## 五、Spring MVC 路由（@RequestMapping）

### 作用
**把 URL 绑定到 Java 方法**——前端访问 URL，Spring 调用对应方法。

### 对标 Express
```javascript
// Express
app.get('/api/helpCenter/getHelpCatalogs', (req, res) => { ... });
```
```java
// Spring MVC
@Controller
@RequestMapping("/api/helpCenter")           // 类前缀
public class HelpCenterController {
    @RequestMapping("/getHelpCatalogs")       // 方法路径
    public JsonResultHaveObj getHelpCatalogs() { ... }
}
```

### 完整 URL = 类前缀 + 方法路径

```
/api/helpCenter/getHelpCatalogs = "/api/helpCenter" + "/getHelpCatalogs"
/api/helpCenter/getHelpContents = "/api/helpCenter" + "/getHelpContents"
```

**每个方法注解是独立 URL，叠加类前缀，不是嵌套拼接！**

### 简写注解（RESTful，Spring 4.3+）

| 注解 | HTTP 方法 | 用途 |
|---|---|---|
| @GetMapping | GET | 查询 |
| @PostMapping | POST | 新增 |
| @PutMapping | PUT | 整体更新 |
| @DeleteMapping | DELETE | 删除 |
| @PatchMapping | PATCH | 局部更新 |

`@GetMapping("/x")` 是 `@RequestMapping(value="/x", method=GET)` 的语法糖。

### @ResponseBody
把方法返回值转 JSON 响应前端。
`@RestController = @Controller + @ResponseBody`（现代常用）。

---

## 六、错题本

### @RequestMapping 多接口 URL 拼接（概念模糊）
- **学生答案**：`api/user/list/create`（把 list 和 create 拼成一个）
- **正确**：两个独立 URL：`/api/user/list` 和 `/api/user/create`
- **误解**：以为方法注解是嵌套关系
- **正确规则**：每个方法注解 = 一个独立 URL，叠加类前缀，不互相拼接

---

## 七、能读懂的公司代码（完整闭环）

```java
@Controller                                    // ① IoC：注册 Bean
@RequestMapping("/api/helpCenter")             // ② Spring MVC：URL 前缀
public class HelpCenterController {

    @Resource                                  // ③ DI：Spring 注入依赖
    private ZmHelpCatalogService zmHelpCatalogService;

    @RequestMapping("/getHelpCatalogs")        // ④ 处理 GET /api/helpCenter/getHelpCatalogs
    public @ResponseBody                       // ⑥ 返回 JSON
        JsonResultHaveObj<List<ZmHelpCatalog>> getHelpCatalogs() {
        List<ZmHelpCatalog> result = zmHelpCatalogService.listCatalog(log);  // ⑤ 直接用
        JsonResultHaveObj<List<ZmHelpCatalog>> res = new JsonResultHaveObj<>();
        res.setResult(result);
        return res;
    }
}
```

**6 个注解全懂**：@Controller / @RequestMapping / @Resource / @ResponseBody。

---

## 八、Spring 核心三件套进度

```
IoC / DI ✅ 今天学了（灵魂）
   ├── Bean（被 Spring 管理的对象）✅
   └── 容器机制 ✅
AOP ⬜ 下次（事务、日志、权限）
Spring MVC ✅ 今天学了路由部分
   └── 完整请求流程 ⬜ 下次深入
```

---

## 九、下次学习计划
- AOP（事务、日志、权限）
- Bean 生命周期
- 或动手写 Spring Boot 接口实战
