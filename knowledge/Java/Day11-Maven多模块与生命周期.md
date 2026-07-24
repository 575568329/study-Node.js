# Day 11 - Maven 多模块 + 生命周期 + 读公司 pom

**日期**：2026-07-24
**主题**：Week 3 Maven 进阶（多模块 / 生命周期 / 传递依赖 / 读公司代码）

---

## 一、课前复习（pre-session-review 5 题小测）

| 题 | 结果 |
|---|---|
| 本地仓库作用（AC vs ABCD）| ⚠️ 漏选，误以为远程依赖不在本地仓库 |
| Maven 路径映射 | ❌ 高信心错误：com.alibaba→com/alibaba/（点变斜杠分层）|
| 父 pom modules 声明 | ✅ 方向对 |
| 模块间依赖 GAV | ✅ 格式正确 |
| parent 继承作用 | ✅ 理解正确 |

---

## 二、Maven 多模块项目

### 父 pom 的两个角色

1. **聚合器（Aggregator）**：用 `<modules>` 声明所有子模块，`<packaging>pom</packaging>`
2. **配置继承者（Parent）**：用 `<dependencyManagement>` 统一版本

### dependencyManagement vs dependencies

| 标签 | 作用 | 子模块要再声明吗 |
|---|---|---|
| `<dependencyManagement>` | 只管版本，不真引入 | ✅ 要（但不写 version）|
| `<dependencies>` | 真引入 | ❌ 不用（自动继承）|

### 子模块 pom 结构
```xml
<parent>
    <groupId>...</groupId>
    <artifactId>...</artifactId>
    <version>...</version>
</parent>
<artifactId>子模块名</artifactId>
<!-- groupId/version 继承，只写 artifactId -->
```

### 本地模块互相引用（纠正 Day 10 盲区）

**流程**：
1. 父项目 `mvn clean install`
2. 每个模块 jar 安装到 `~/.m2/repository/`
3. 其他模块从本地仓库引用（**不需要发布到远程**）

**关键**：本地模块和远程依赖都存本地仓库，Maven 只认 GAV 坐标。

---

## 三、Maven 生命周期（Lifecycle）

### 三套生命周期

```
clean:    pre-clean → clean → post-clean
default:  validate → compile → test → package → verify → install → deploy
site:     site → site-deploy
```

### 阶段自动联动（核心）

执行后面的阶段会**自动执行它之前的所有阶段**：
```
mvn compile  → validate → compile
mvn test     → validate → compile → test
mvn install  → validate → compile → test → package → install
```

**对比 npm**：npm scripts 手动定义、各自独立；Maven 内置有序、自动联动。

### install vs deploy

| | install | deploy |
|---|---|---|
| 目标 | 本地仓库 ~/.m2 | 远程仓库（私服/Central）|
| 谁能用 | 只有你 | 团队所有人 |
| npm 对标 | （无）| `npm publish` |

### Reactor 模式

一次构建编排多模块——分析依赖关系、决定构建顺序、依次构建（类比 npm monorepo 拓扑排序）。

---

## 四、jar vs war vs pom

| 类型 | 装什么 | 运行方式 | 场景 |
|---|---|---|---|
| **jar** | Java 类库/应用 | `java -jar` | 工具库、Spring Boot |
| **war** | Web 应用 | 部署到 Tomcat | 传统 Spring MVC（含 WEB-INF/web.xml）|
| **pom** | 管理子模块 | - | 父项目/聚合器 |

**为什么 Web 打 war**：传统 Java Web 必须部署到 Tomcat，Tomcat 只认 war 结构。
**Spring Boot 改进**：内置 Tomcat，可打 jar 直接 `java -jar` 运行。

---

## 五、读公司 pom.xml（crowdsourced-new-web）

### 关键发现

1. **parent 继承 ZX-root**（公司根 pom，统一 Spring 版本等）
2. **properties 版本管理**：`<spring.version>3.2.6.RELEASE</spring.version>`，后面 `${spring.version}` 引用
3. **packaging=war**：传统 Spring MVC，部署 Tomcat
4. **省略 groupId**：继承 parent 的
5. **SCM 配置**：Git（code.iflytek.com）+ Artifactory 私服

---

## 六、传递依赖 + exclusions（重点）

### 传递依赖（Transitive Dependency）

引入 A，A 依赖 B → Maven 自动带 B。类比 npm 的 node_modules。

### exclusions（排除传递依赖）

```xml
<dependency>
    <groupId>com.iflytek</groupId>
    <artifactId>seclib</artifactId>
    <exclusions>
        <exclusion>
            <artifactId>log4j</artifactId>
            <groupId>log4j</groupId>
        </exclusion>
    </exclusions>
</dependency>
```

**公司大量用**：多个 api 模块带不同版本的 jackson-databind → 全部排除 + 父 pom 统一引入一个版本，避免冲突。

### 依赖调解规则（⚠️ 纠正盲区）

**错误理解**：Maven 选最高版本  
**正确规则**：
1. **最近者优先（Nearest Definition）** ⭐ 核心——选依赖树里路径最短的
2. 同距离时 **先声明者优先**

**为什么公司用 exclusions**：不信任 Maven 自动调解（最近者优先可能选到旧版本），手动控制版本。

---

## 七、mvn dependency:tree（实操利器）

```
com.fjyu.edu:hello-impl:jar:1.0-SNAPSHOT
+- com.fjyu.edu:hello-api:jar:1.0-SNAPSHOT:compile    ← 直接依赖（模块间）
\- junit:junit:jar:4.12:test                           ← 直接依赖
   \- org.hamcrest:hamcrest-core:jar:1.3:test          ← 传递依赖（junit 带的）
```

**符号**：`+-` 兄弟节点，`\-` 最后节点，缩进=层级。

### scope 作用域

| scope | 什么时候可用 | 打进产物吗 |
|---|---|---|
| compile（默认）| 编译+运行 | ✅ |
| test | 只测试 | ❌ |
| provided | 编译，运行时容器提供 | ❌ |
| runtime | 运行，不编译 | ✅ |

---

## 八、实战成果

- ✅ hello-maven 多模块项目（父 pom + hello-api + hello-impl）
- ✅ 父 pom 完善（dependencyManagement + maven-compiler-plugin Java 1.8）
- ✅ `mvn clean install` BUILD SUCCESS（3 模块）
- ✅ 命令行配置成功（PATH + mvn -version）
- ✅ `mvn clean install -DskipTests` 跳过测试
- ✅ `mvn dependency:tree` 查看依赖树
- ✅ 读懂公司 pom.xml 167 行

---

## 九、错题本（重点）

### 🔴 依赖调解规则（高信心错误）
- **学生答案**：Maven 保留版本最高的一个
- **正确**：最近者优先（路径最短），同距离先声明者优先
- **归类**：概念模糊（想当然以为是最高版本）

### 🔴 Maven 路径映射（高信心错误）
- **学生答案**：`com.alibaba/fastjson-1.2.83.jar`
- **正确**：`com/alibaba/fastjson/1.2.83/fastjson-1.2.83.jar`
- **规则**：groupId 每个点是一层文件夹，artifactId/version 也是文件夹，jar 在最深层

### ⚠️ 本地仓库存储范围
- **学生答案**：AC（只本地模块）
- **正确**：ABCD（本地模块 + 远程依赖都存本地仓库）

---

## 十、常用命令速查

```bash
mvn clean                    # 清理 target/
mvn compile                  # 只编译
mvn test                     # 跑测试
mvn package                  # 打包
mvn install                  # 装本地仓库
mvn clean install            # 最常用：清理+编译+测试+打包+安装
mvn clean install -DskipTests # 跳过测试加速
mvn dependency:tree          # 查看依赖树（排查冲突）
mvn deploy                   # 发布到远程仓库（CI/CD）
```

---

## 遗留 / 下次

- 复习两个盲区：本地仓库机制、路径映射规则
- 继续 Week 3：读公司 Service/Controller 代码
- 或进入 Spring 框架（Week 4）
