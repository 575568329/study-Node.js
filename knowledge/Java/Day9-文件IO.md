# Day 9 学习记录

**日期**：2026-07-21
**主题**：文件 I/O（Files / Path / BufferedReader / try-with-resources）

---

## 今日学习内容

### 1. Java 文件 I/O 的新旧两套 API

| 时代 | API | 特点 |
|------|-----|------|
| Java 1.0 | `File` + `FileInputStream/FileReader` | 老，繁琐，样板代码多 |
| **Java 7（NIO.2）** | **`Path` + `Files`** | ⭐ 新，简洁，推荐 |

学习以新 API（Files + Path）为准，旧的了解即可。

---

### 2. ⚠️ 版本差异（公司 Java 8 必须注意）

| 操作 | Java 8 | Java 11+ |
|------|--------|----------|
| 创建 Path | `Paths.get("路径")` | `Path.of("路径")` |
| 读整个文件 | `new String(Files.readAllBytes(path), "UTF-8")` | `Files.readString(path)` |
| 读所有行 | `Files.readAllLines(path)` | 一样（Java 8 就有）|

**踩坑**：`Path.of()` 和 `Files.readString()` 是 Java 11+ 的，Java 8 报"找不到方法"。
**公司用 Java 8，一律用 `Paths.get()`。**

---

### 3. 读文件（三种方式）

```java
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

Path path = Paths.get("C:/Users/xxx/test.txt");

// 方式1：读所有行为 List（中小文件）
List<String> lines = Files.readAllLines(path);
for (String line : lines) {
    System.out.println(line);
}

// 方式2：读整个文件为字符串（Java 8 写法，小文件）
String content = new String(Files.readAllBytes(path), "UTF-8");

// 方式3：BufferedReader 逐行读（大文件）⭐ 见第6节
```

| 方式 | 内存占用 | 适用 |
|------|---------|------|
| readAllBytes | 全部 | 小配置文件 |
| readAllLines | 全部（List）| 中小文件 |
| BufferedReader 逐行 | 只有当前行 | 大文件、日志 |

---

### 4. 写文件（覆盖 / 追加）

```java
import java.nio.file.StandardOpenOption;

// 覆盖写入（默认）：清空原内容重新写
List<String> content = Arrays.asList("姓名,年龄", "张三,25", "李四,30");
Files.write(path, content);

// 追加（不覆盖）：保留原内容，末尾添加 ⭐ 写日志用
Files.write(path, Collections.singletonList("王五,28"), StandardOpenOption.APPEND);

// 写字符串
Files.write(path, "Hello".getBytes("UTF-8"));
```

**覆盖 vs 追加**：
- 覆盖（无参数）：每次运行只有最新内容
- 追加（APPEND）：每次运行末尾累积（日志的本质）

---

### 5. ⭐ try-with-resources（Java 特有，核心）

```java
// 语法：try (创建资源) { 使用 }  → 自动关闭
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line;
    while ((line = reader.readLine()) != null) {   // 逐行读，null 结束
        System.out.println(line);
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
// 离开 try 块，reader 自动 close()（即使抛异常也关闭）
```

**为什么资源必须关闭？**

| 资源类型 | 不关闭的后果 |
|---------|------------|
| 文件流 | 文件句柄泄漏，达系统上限无法打开新文件 |
| 数据库连接 | 连接池耗尽，新请求卡死 |
| Socket | 端口泄漏，服务挂掉 |

**三个关键点**：
1. 资源写在 `try(...)` 括号里
2. 自动关闭（不用写 finally），即使抛异常也关闭
3. Java 7 引入的语法糖，专门解决"忘记关闭资源"

---

### 6. BufferedReader 逐行读大文件（日志处理核心）

```java
// 为什么？readAllLines 读 2GB 日志会 OOM，逐行读内存只有当前行
try (BufferedReader reader = Files.newBufferedReader(path)) {
    String line;
    while ((line = reader.readLine()) != null) {
        if (line.contains("ERROR")) {       // 日志筛选
            System.out.println(line);
        }
    }
} catch (IOException e) {
    throw new RuntimeException(e);
}
```

---

## 对比 Node.js

| 操作 | Node.js | Java |
|------|---------|------|
| 读文件 | `fs.readFileSync('f', 'utf-8')` | `Files.readAllLines(path)` |
| 写文件 | `fs.writeFileSync('f', data)` | `Files.write(path, content)` |
| 追加 | `fs.appendFileSync('f', data)` | `Files.write(path, c, APPEND)` |
| 逐行读大文件 | `readline + createReadStream` | `BufferedReader + try-with-resources` |
| 关闭资源 | 高级 API 自动，流式需 close | **try-with-resources 自动关闭** |

**核心差异**：
- Node.js `fs.readFile` 高级封装，不用管关闭
- Java 高级 API（Files）也不用管，但流式（BufferedReader）**必须关闭**
- Java 用 try-with-resources 优雅解决关闭问题（Node.js 没有对应语法）

---

## throws Exception vs try-catch（异常处理权衡）

| 写法 | 场景 | 优缺点 |
|------|------|--------|
| `throws Exception` | 学习/练习/main | ✅ 简洁 ❌ 太笼统、生产不用 |
| `throws IOException` | 需调用方处理 | ✅ 精确 ❌ 会传染签名 |
| `try-catch 转 RuntimeException` | 生产代码 | ✅ 不污染签名，配合全局异常处理 |

**实战**：文件操作抛 Checked 的 IOException，生产代码 try-catch 转 RuntimeException（不污染方法签名）。

---

## Collections.singletonList vs Arrays.asList

| 场景 | 推荐 | 原因 |
|------|------|------|
| 1 个元素 | `Collections.singletonList(x)` | 只存一个引用，无数组，更轻量 |
| 多个元素 | `Arrays.asList(a, b, c)` | 通用 |
| 需要增删 | `new ArrayList<>()` | 前两个都不能增删 |

**共同点**：两者都不能增删（add 抛 UnsupportedOperationException）。
**区别**：Arrays.asList 能 set，singletonList 完全不可变。
**注意**：性能差异极小，用哪个都不算错。

---

## 关键概念总结

1. **用新 API**：Files + Path（Java 7 NIO.2）
2. **Java 8 用 Paths.get**（不是 Path.of，那是 Java 11+）
3. **大文件逐行读**：BufferedReader 避免 OOM
4. **try-with-resources**：资源自动关闭（Java 特有核心语法）
5. **覆盖 vs 追加**：APPEND 参数，日志用追加

---

## 明天计划
- Week 2 收官，进入 Week 3：Maven + 工程结构
- 或深度读公司代码（串联 Stream/日期/字符串/文件）
