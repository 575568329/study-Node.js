# Java 学习快速开始指南

**创建时间**：2026-07-14
**当前状态**：准备开始第 1 周学习

---

## 📌 快速状态

### 当前阶段
- **阶段一**：Java 基础（Week 1/3）
- **主题**：Java 语法 + 面向对象
- **目标**：能读懂公司 Controller 层代码

### 今日任务
- [ ] 安装 JDK 8
- [ ] 安装 Maven
- [ ] 安装 IntelliJ IDEA
- [ ] 创建第一个 Hello World 项目
- [ ] 学习 Java 基础语法

---

## 🗂️ 核心文档快速入口

### 必读文档（按优先级）
1. **本文件** - 快速开始和状态检查
2. [`docs/00-工作入口.md`](./00-工作入口.md) - 学习主线和里程碑
3. [`docs/fullstack/Java学习路径-稳扎稳打版.md`](./fullstack/Java学习路径-稳扎稳打版.md) - 完整 4-5 个月计划
4. [`docs/fullstack/技能优先级-运维技能版.md`](./fullstack/技能优先级-运维技能版.md) - Linux/Docker/K8s 优先级判断
5. [`memory/todo.md`](../memory/todo.md) - 待办清单
6. [`memory/latest-session.md`](../memory/latest-session.md) - 上次学习记录

### 公司代码
- **路径**：`D:\xunfei\zyjg`
- **说明**：[`D:\xunfei\zyjg\CLAUDE.md`](D:\xunfei\zyjg\CLAUDE.md)
- **重点模块**：`crowdsourced-new-web`（Controller 层）

---

## 📅 学习路径总览（4-5 个月）

| 阶段 | 周数 | 主题 | 验收标准 |
|------|------|------|----------|
| **阶段一** | 2-3周 | Java 基础 | 能读懂公司代码 |
| **阶段二** | 3-4周 | Spring 框架 | 理解 IoC/DI/AOP |
| **阶段三** | 2-3周 | 数据库与 MyBatis | 能写复杂 SQL |
| **阶段四** | 3-4周 | 微服务（Dubbo + Spring Boot） | 理解微服务架构 |
| **阶段五** | 2-3周 | 运维基础（Linux/Docker/CI/CD） | 能部署排查问题 |
| **阶段六** | 3-4周 | 实战项目（Java 版 RAG） | 简历核心项目 |

**总计**：15-21 周

---

## 🎯 第 1 周详细计划

### Week 1：Java 基础语法（当前周）

#### Day 1-2：环境搭建 + Hello World
**任务**：
- [ ] 安装 JDK 8
  - 下载地址：https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html
  - 配置 `JAVA_HOME` 环境变量
  - 验证：`java -version`
- [ ] 安装 Maven
  - 下载地址：https://maven.apache.org/download.cgi
  - 配置 `PATH` 环境变量
  - 验证：`mvn -version`
- [ ] 安装 IntelliJ IDEA
  - 下载地址：https://www.jetbrains.com/idea/download/
  - Community 版（免费）即可
- [ ] 创建第一个 Java 项目
  - IDEA: File → New → Project → Java
  - 写一个 `HelloWorld.java`
  - 运行并看到输出

**对比学习**：
```java
// Java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World");
    }
}

// Node.js
console.log('Hello World');

// 关键区别：
// 1. Java 需要类和 main 方法作为入口
// 2. Java 强类型，必须声明返回值类型（void）
// 3. Java 用 System.out 而非直接的 console
```

**验收**：能独立创建并运行一个 Java 程序

---

#### Day 3-5：Java 基础语法
**任务**：
- [ ] 变量与数据类型（int、double、String、boolean）
- [ ] 运算符（算术、比较、逻辑）
- [ ] 流程控制（if/else、switch、for、while）
- [ ] 数组操作
- [ ] 方法定义与调用

**对比学习重点**：
- `let/const` vs `final`
- `===` vs `==` 的区别
- 数组固定长度 vs JS 动态数组

**练习**：
- [ ] 写一个数组去重函数
- [ ] 写一个字符串反转函数
- [ ] 写一个冒泡排序

**验收**：能用 Java 写基本算法

---

#### Day 6-7：面向对象
**任务**：
- [ ] 类与对象（class、new、构造方法）
- [ ] 封装（private、getter/setter）
- [ ] 继承（extends、super）
- [ ] 多态（方法重写、向上转型）
- [ ] 接口（interface、implements）
- [ ] 抽象类（abstract）

**对比学习重点**：
- Java class vs TS class
- Java interface（行为契约）vs TS interface（类型定义）
- Java 单继承 vs JS 原型链

**练习**：
- [ ] 设计一个 User 类（属性、方法、构造函数）
- [ ] 设计 User-Order 继承关系
- [ ] 理解接口和抽象类的区别

**验收**：能向别人讲解 Java OOP 与 TS 的区别

---

#### 周末：读公司代码 + 总结
**任务**：
- [ ] 打开 `D:\xunfei\zyjg\crowdsourced-new-web\src\main\java`
- [ ] 找 3 个 Controller 类，读懂：
  - 类的定义和注解
  - 方法的参数和返回值
  - 业务逻辑（不用深究，先看结构）
- [ ] 找 3 处集合操作（List、Map、Set）
- [ ] 输出《Java vs Node.js 语法对比.md》到 `docs/fullstack/`

**验收标准**：
- [ ] 能读懂公司 Controller 的方法签名
- [ ] 能解释 List、Map、Set 的使用场景
- [ ] 能向别人讲解 Java 面向对象的设计思想

---

## ✅ 第 1 周验收清单

### 环境验收
- [ ] `java -version` 输出 Java 8
- [ ] `mvn -version` 输出 Maven 版本
- [ ] IDEA 能创建并运行 Java 项目

### 知识验收
- [ ] 能解释 Java 强类型的意义
- [ ] 能解释 Java 类和对象的关系
- [ ] 能对比 Java interface 和 TS interface 的区别
- [ ] 能解释为什么 Java 要用 getter/setter

### 代码验收
- [ ] 能独立写一个类（包含属性、方法、构造函数）
- [ ] 能写一个接口并实现它
- [ ] 能写一个数组操作算法

### 实战验收
- [ ] 能读懂公司 3 个 Controller 的方法签名
- [ ] 能在公司代码里找到 3 处集合操作
- [ ] 输出了《Java vs Node.js 语法对比.md》

---

## 🔧 开发环境配置速查

### JDK 8 安装（Windows）
```bash
# 1. 下载 JDK 8 安装包并安装

# 2. 配置环境变量
JAVA_HOME=C:\Program Files\Java\jdk1.8.0_xxx
PATH=%JAVA_HOME%\bin;%PATH%

# 3. 验证
java -version
javac -version
```

### Maven 安装（Windows）
```bash
# 1. 下载 Maven 并解压到 C:\Program Files\Maven

# 2. 配置环境变量
MAVEN_HOME=C:\Program Files\Maven\apache-maven-3.x.x
PATH=%MAVEN_HOME%\bin;%PATH%

# 3. 验证
mvn -version
```

### IDEA 常用快捷键
```
Ctrl + Space       # 代码补全
Ctrl + /           # 注释/取消注释
Ctrl + Shift + F10 # 运行当前类
Ctrl + Alt + L     # 格式化代码
Shift + F6         # 重命名
Alt + Enter        # 快速修复
```

---

## 📚 学习资源

### 官方文档（首选）
- Java 官方教程：https://docs.oracle.com/javase/tutorial/
- Java 8 API 文档：https://docs.oracle.com/javase/8/docs/api/

### 在线教程（辅助）
- 菜鸟教程 Java：https://www.runoob.com/java/
- 廖雪峰 Java 教程：https://www.liaoxuefeng.com/wiki/1252599548343744

### 视频课程（可选）
- B站搜"Java 基础入门"
- 推荐：尚硅谷 Java 基础（只看前 10 集）

---

## 💡 学习建议

### 第 1 周重点
1. **不求快**：重点是理解概念，不是赶进度
2. **多对比**：每学一个概念都对比 Node.js/TS
3. **多动手**：每天至少写 1 小时代码
4. **读公司代码**：最好的教材是实际代码

### 常见问题
**Q: 为什么 Java 这么啰嗦？**
A: Java 设计时注重企业级开发的稳定性和可维护性，强类型和显式声明能在编译期发现错误。

**Q: 为什么要先学语法再学 Spring？**
A: Spring 是建立在 Java 基础之上的框架，不理解 Java 语法和 OOP 就无法理解 Spring 的设计思想。

**Q: 第 1 周能读懂公司代码吗？**
A: 能读懂结构和方法签名，但业务逻辑需要后续学完 Spring 才能完全理解。

---

## 📝 学习记录模板

每天学习完记录到 `memory/latest-session.md`：

```markdown
## 2026-07-XX 学习记录

### 今日主题
Java 基础语法 - 变量与数据类型

### 学习内容
- int、double、String、boolean 基本类型
- final 关键字 = const
- 数组固定长度，需要提前声明大小

### 对比理解
- Java: `int[] arr = new int[5];`
- JS: `const arr = [];`
- 区别：Java 数组长度固定，JS 动态

### 练习代码
[附上代码片段]

### 遗留问题
- 为什么 String 是引用类型但不可变？

### 明天计划
- 学习流程控制（if/for/while）
```

---

## 🎯 下一步行动

1. **立即开始**：安装 JDK 8 + Maven + IDEA
2. **本周目标**：完成 Day 1-7 所有任务
3. **周末总结**：输出对比文档，通过验收清单
4. **下周预告**：Java 核心 API + Stream

---

**最后更新**：2026-07-14
**当前进度**：第 1 周 Day 1（环境搭建）
