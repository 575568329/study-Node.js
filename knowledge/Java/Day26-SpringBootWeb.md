# Day 26 · Spring Boot Web

> **主题**：@RestController / @GetMapping / 内嵌 Tomcat / 启动方式简化
> **日期**：2026-08-15 ｜ **背景**：从传统 Spring MVC 迁移视角
> **前置**：Day 12 Spring MVC、Day 25 Spring Boot 自动配置

---

## 一、接口写法简化

### 公司项目（传统 Spring MVC）

```java
@Controller
@RequestMapping("/core/machining")
public class MachiningController {

    @RequestMapping(value = "/getCurUserPhases", method = RequestMethod.GET)
    @ResponseBody
    public JsonResultHaveObj<...> getCurUserPhases(HttpServletRequest request) {
        // ...
        return result;
    }
}
```

### Spring Boot

```java
@RestController
@RequestMapping("/core/machining")
public class MachiningController {

    @GetMapping("/getCurUserPhases")
    public JsonResultHaveObj<...> getCurUserPhases(HttpServletRequest request) {
        // ...
        return result;
    }
}
```

### 差异

| | 传统 | Spring Boot |
|---|---|---|
| 类注解 | `@Controller` | `@RestController` |
| 返回 JSON | 每个方法加 `@ResponseBody` | **不用加**（类级别自带） |
| GET 请求 | `method = RequestMethod.GET` | `@GetMapping`（简写） |

- `@RestController` = `@Controller` + `@ResponseBody`（全家桶）
- `@GetMapping` = `@RequestMapping(method = GET)`（简写，还有 `@PostMapping`/`@PutMapping`/`@DeleteMapping`）

---

## 二、启动方式简化（内嵌 Tomcat）

### 公司项目

```
写代码 → 打包 war → 运维手动部署到 Tomcat → 启动 Tomcat → Tomcat 加载 war
```

### Spring Boot

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        // 做了三件事：
        // 1. 启动 Spring 容器（IoC）
        // 2. 启动内嵌 Tomcat（8080 端口监听）
        // 3. 自动配置所有 Bean
    }
}
```

```
main() → 启动 Spring → 启动内嵌 Tomcat → 直接能访问
```

### 原理

`spring-boot-starter-web` 依赖引入了 Tomcat 的 jar 包。`main()` 启动时，Spring Boot 自动创建 Tomcat 实例、监听 8080 端口、把 DispatcherServlet 注册进去。

### 对比

| | 传统 | Spring Boot |
|---|---|---|
| 启动方式 | 部署 war 到外部 Tomcat | 内嵌 Tomcat + `main()` 直接启动 |
| 部署 | 运维手动配 Tomcat | `java -jar app.jar` 一行命令 |
| 端口配置 | 改 Tomcat `server.xml` | `server.port: 3000` yml 一行 |
| 开发体验 | 改代码要手动重启 | 支持热重载（改代码自动重启） |

### 对比 Node.js

`java -jar app.jar` = `node app.js`，不需要外部服务器。Spring Boot 让 Java 也变成了"跑一个 main 就能用"的体验。

---

## 三、面试标准答案

> `@RestController` = `@Controller` + `@ResponseBody`，所有方法默认返回 JSON，不用每个方法单独加。Spring Boot 通过 `spring-boot-starter-web` 内嵌 Tomcat，`main()` 启动时自动创建 Tomcat 实例监听端口，不需要外部 Tomcat 部署。端口通过 `server.port` 在 yml 里改。

---

## 🤖 AI 时代视角

**被 AI 贬值**：`@RestController`/`@GetMapping` 写法、端口配置

**AI 时代更值钱**：
- **理解内嵌容器原理**（排查端口冲突、内存溢出时知道去哪调）
- **迁移判断力**：老项目要不要迁 Spring Boot，迁了开发效率提升多少

---

## 关联

- [[Day12-Spring入门-IoC-DI-MVC]] — @Controller / @RequestMapping / @ResponseBody 基础
- [[Day25-SpringBoot自动配置]] — 自动配置机制（今天 Web 的简化也是自动配置的一部分）

## 下次

- Spring Cloud vs Dubbo 选型
- 看公司代码 MQ 使用
