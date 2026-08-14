# Day 25 · Spring Boot 自动配置

> **主题**：自动配置原理 / @ConditionalOnXxx / Starter 依赖 / 排除自动配置
> **日期**：2026-08-14 ｜ **背景**：从传统 Spring XML 迁移视角
> **前置**：Day 12 Spring IoC/DI、Day 16 MyBatis 入门、Day 21 Dubbo XML 配置

---

## 一、问题：传统 Spring 的配置地狱

### 公司项目（Spring 3.2.6 + XML）

光配一个 MyBatis 就要 20+ 行 XML：

```xml
<!-- 1. 数据源 -->
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
    <property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/mydb"/>
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
    <property name="maxActive" value="20"/>
    <property name="minIdle" value="5"/>
</bean>

<!-- 2. SqlSessionFactory -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <property name="mapperLocations" value="classpath:mapper/*.xml"/>
    <property name="typeAliasesPackage" value="com.iflytek.edu.rpp.entity"/>
</bean>

<!-- 3. Mapper 扫描 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="com.iflytek.edu.rpp.mapper"/>
    <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
</bean>
```

再加 Dubbo、事务、MVC……几百上千行 XML。而且**每个项目套路一样**，只换了 IP、用户名、包名。

---

## 二、Spring Boot 的解法

### 只写配置参数，不写 Bean 定义

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mydb
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.iflytek.edu.rpp.entity
```

**没有一行 `<bean>`。** 数据源、SqlSessionFactory、Mapper 扫描——Spring Boot 全部自动创建。

---

## 三、自动配置核心机制

### 两个条件缺一不可

| 条件 | 含义 | 示例 |
|------|------|------|
| **classpath 有类** | 你加了 starter 依赖 | `mybatis-spring-boot-starter` → classpath 有 `SqlSessionFactory.class` |
| **配置有参数** | yml 里写了对应前缀 | `spring.datasource.url=...` |

**类比**：条件 1 = 有食材，条件 2 = 有菜谱 → 自动开火做。

### `@ConditionalOnXxx` 条件注解（源码简化）

```java
@Configuration
@ConditionalOnClass(DataSource.class)          // 条件1：classpath有DataSource类
@ConditionalOnProperty("spring.datasource.url") // 条件2：配置里有这个属性
public class DataSourceAutoConfiguration {

    @Bean
    public DataSource dataSource() {
        // 自动创建数据源，用你配置的参数
        return new DruidDataSource(...);
    }
}
```

### 主要自动配置类

| 自动配置类 | 条件 | 帮你创建 |
|-----------|------|---------|
| `DataSourceAutoConfiguration` | classpath 有 DataSource + 配了 `spring.datasource.*` | DataSource Bean |
| `SqlSessionFactoryAutoConfiguration` | classpath 有 SqlSessionFactory + 有 DataSource Bean | SqlSessionFactory Bean |
| `MyBatisAutoConfiguration` | classpath 有 MyBatis 类 + 有 SqlSessionFactory | Mapper 扫描 |
| `DispatcherServletAutoConfiguration` | classpath 有 Spring MVC 类 | DispatcherServlet + 内嵌 Tomcat |
| `DubboAutoConfiguration` | classpath 有 Dubbo 类 | Dubbo Service/Reference |

---

## 四、Starter 依赖 = 一键引入所有相关类

```xml
<!-- 加一个 starter，classpath 上就有一整套类 -->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
</dependency>
```

Starter 内部帮你引入了：MyBatis、MyBatis-Spring、Spring JDBC、DataSource 等**所有相关依赖**。

传统方式要一个一个加，Starter 打包好一次全引入。

---

## 五、排除自动配置

```java
@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class Application { }
```

或 yml：

```yaml
spring:
  autoconfigure:
    exclude: DataSourceAutoConfiguration
```

---

## 六、对比总结

| | 公司 Spring 3.2.6 | Spring Boot |
|---|---|---|
| 配方式 | 手写 XML `<bean>` | 只写 yml 参数 |
| 创建 Bean | 自己写 | 自动（条件满足） |
| 加新组件 | 几十行 XML | 加 starter + 几行 yml |
| 套路重复 | 每个项目重复 | 框架写一次 |

### 对比 Node.js

- Vue `app.use(plugin)` → 只调一个 use，插件内部自动注册所有组件
- Vue CLI → 只配 `vue.config.js`，构建链自动配好
- **本质都是"约定优于配置"**

---

## 七、面试标准答案

> Spring Boot 自动配置通过 `@ConditionalOnXxx` 条件注解实现。两个条件：classpath 上有相关类（通过 starter 依赖引入）+ 配置文件里有对应参数。条件满足就自动创建 Bean，不满足跳过。不需要手写 XML `<bean>`。不需要背具体自动配置类名，面试只考机制。

---

## 🤖 AI 时代视角

**被 AI 贬值**：背 AutoConfiguration 类名、记条件注解名称、查 starter 坐标

**AI 时代更值钱**：
- **理解"为什么不需要配了"**——排查"加了依赖没生效"时能定位（条件不满足？类冲突？前缀写错？）
- **迁移判断力**：老项目要不要迁 Spring Boot、迁了能省多少
- **排除/覆盖能力**：自动配置不合用时怎么排除、怎么用自定义 Bean 替换

---

## 关联

- [[Day12-Spring入门-IoC-DI-MVC]] — IoC 容器 + Bean 定义（自动配置帮你省掉的）
- [[Day16-MyBatis入门]] — 手动配 XML 的样板（Spring Boot 自动帮你配好的）
- [[Day21-Dubbo-RPC微服务入门]] — 公司 XML 配置（对比 Spring Boot 的简化）

## 下次

- Spring Boot Web（@RestController / 内嵌 Tomcat）
- Spring Boot vs Spring Cloud
- 看公司代码 MQ 使用
