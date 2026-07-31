# Day 17 · MyBatis 动态 SQL + 安全

> **主题**：动态 SQL 条件查询（`<if>`/`<where>`/`<choose>`）、`#{}` vs `${}`（SQL 注入防御）
> **日期**：2026-07-31 ｜ **JDK**：Java 8 ｜ **公司框架**：MyBatis
> **前置**：Day 16 已学 MyBatis 基础（Mapper 绑定、动态代理、resultMap、foreach）

---

## 一、为什么需要动态 SQL？

### 场景：用户搜索功能（可选条件）

页面上有 3 个输入框：

```
姓名：[____]  状态：[____]  邮箱：[____]  [搜索]
```

用户可能：
- 只填姓名 → 只按姓名查
- 只填状态 → 只按状态查
- 三个都填 → 三个条件都要
- 一个都不填 → 查全部

### 问题：纯 SQL 怎么写？

**方案 1：写死所有条件（❌）**
```sql
SELECT * FROM user WHERE name = ? AND status = ? AND email = ?
```
如果用户只填了姓名，`status` 和 `email` 传 `null` → 查不出来（`status = null` 永远是 false）。

**方案 2：Java 代码拼字符串（❌ 太丑）**
```java
String sql = "SELECT * FROM user WHERE 1=1";
if (name != null) sql += " AND name = ?";
if (status != null) sql += " AND status = ?";
```
- 手写拼接易错
- `WHERE 1=1` hack 很丑
- 参数位置和 `?` 对不上就炸

**MyBatis 动态 SQL 标签 = 解决方案**：把"拼 SQL 的逻辑"写在 XML 里。

---

## 二、`<if>` 标签（条件拼接）

```xml
<select id="search" resultType="User">
    SELECT * FROM user WHERE 1=1
    <if test="name != null and name != ''">
        AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    <if test="status != null">
        AND status = #{status}
    </if>
    <if test="email != null and email != ''">
        AND email = #{email}
    </if>
</select>
```

**`<if test="条件">`**：
- `test` 里写 **OGNL 表达式**（对象导航语言）
- `name != null` 判断参数是否为空
- `name != ''` 判断字符串是否空串
- 条件为真 → 拼进 SQL；为假 → 跳过

**为什么要 `!= null and != ''` 两个条件？**
- 空字符串 `""` 不是 `null`
- 只写 `!= null`，用户清空输入框提交空字符串 → `"" != null` 成立 → SQL 变成 `AND name LIKE ''` → 查不到数据或查错
- 两个条件都判断 → 只有真正有值才拼进 SQL

**用户只填姓名时**，生成 SQL：
```sql
SELECT * FROM user WHERE 1=1 AND name LIKE '%张三%'
```

**用户三个都填时**，生成 SQL：
```sql
SELECT * FROM user WHERE 1=1 AND name LIKE '%张三%' AND status = 1 AND email = 'a@b.com'
```

**Node.js 对比**：
```javascript
let sql = 'SELECT * FROM user WHERE 1=1';
let params = [];
if (name) {
  sql += ' AND name LIKE ?';
  params.push(`%${name}%`);
}
```

---

## 三、`<where>` 标签（智能 WHERE）

上面的 `WHERE 1=1` 很丑，`<where>` 可以去掉它：

```xml
<select id="search" resultType="User">
    SELECT * FROM user
    <where>
        <if test="name != null and name != ''">
            AND name LIKE CONCAT('%', #{name}, '%')
        </if>
        <if test="status != null">
            AND status = #{status}
        </if>
        <if test="email != null and email != ''">
            AND email = #{email}
        </if>
    </where>
</select>
```

**`<where>` 做三件事**：

1. **空条件不加 WHERE**：所有 `<if>` 都不成立（用户一个都没填）→ 不生成 `WHERE` → SQL：`SELECT * FROM user`（查全部，合法）

2. **自动加 WHERE**：有 `<if>` 成立 → 自动加 `WHERE` 关键字

3. **去掉第一个 AND/OR**：`<where>` 里的内容开头如果是 `AND`/`OR` → 自动去掉

**用户只填姓名时**：
```sql
SELECT * FROM user WHERE name LIKE '%张三%'  -- 自动去掉了开头的 AND
```

**用户一个都不填时**：
```sql
SELECT * FROM user  -- 没有 WHERE，查全部
```

**重要**：`<where>` **只去掉整块内容开头的 AND/OR**，不去掉中间的。

**例子**：
```xml
<where>
    <if test="name != null">
        name LIKE #{name}   <!-- 没写 AND -->
    </if>
    <if test="status != null">
        AND status = #{status}
    </if>
</where>
```

两个都成立时，内容是：
```
name LIKE ?
AND status = ?
```

第一个词是 `name`（不是 AND）→ `<where>` 不去掉任何东西 → `WHERE name LIKE ? AND status = ?`（完全合法）

只有第二个成立时，内容是：
```
AND status = ?
```

第一个词是 `AND` → `<where>` 去掉它 → `WHERE status = ?`（合法）

---

## 四、`<choose>` / `<when>` / `<otherwise>`（多路分支）

**场景**：按优先级选一个条件（if-else if-else）

```xml
<select id="searchByPriority" resultType="User">
    SELECT * FROM user
    <where>
        <choose>
            <when test="id != null">
                AND id = #{id}
            </when>
            <when test="email != null">
                AND email = #{email}
            </when>
            <otherwise>
                AND status = 1
            </otherwise>
        </choose>
    </where>
</select>
```

**执行逻辑**：
- 有 `id` → 只查 `id`（后面全跳过）
- 没 `id` 但有 `email` → 查 `email`
- 都没有 → 默认查 `status = 1`

**对比 Java**：
```java
if (id != null) {
    sql += "AND id = ?";
} else if (email != null) {
    sql += "AND email = ?";
} else {
    sql += "AND status = 1";
}
```

`<choose>` 就是 XML 版的 `if-else if-else`。

---

## 五、动态 SQL 三大标签总结

| 标签 | 作用 | 对应 Java |
|------|------|----------|
| `<if>` | 条件拼接（多个条件独立判断）| `if (x) sql += ...` |
| `<where>` | 智能 WHERE（去第一个 AND、空不加 WHERE）| 手写 `WHERE 1=1` hack |
| `<choose>`/`<when>`/`<otherwise>` | 多路分支（第一个成立就执行）| `if-else if-else` |

**记忆锚点**：这些不是 SQL 关键字，是 MyBatis 发明的"XML 拼 SQL 工具"，最终生成标准 SQL。

---

## 六、`#{}` vs `${}`（SQL 注入防御）

### `#{}` 是预编译占位符（安全，默认用这个）

```xml
WHERE name = #{name}
```

**MyBatis 做的事**：
1. SQL 变成：`WHERE name = ?`（占位符）
2. 参数值单独传给数据库
3. 数据库用 **PreparedStatement** 预编译执行

**底层代码**（简化）：
```java
String sql = "WHERE name = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, name);  // 参数单独设置，不拼进 SQL
```

**关键**：**SQL 结构和参数值分开**。数据库先编译 SQL 结构（`WHERE name = ?`），再把参数值填进占位符。

---

### `${}` 是字符串直接拼接（危险）

```xml
WHERE name = '${name}'
```

**MyBatis 做的事**：
1. 参数值**直接拼进 SQL 字符串**
2. 变成：`WHERE name = '张三'`
3. 把整个字符串发给数据库

**底层代码**（简化）：
```java
String sql = "WHERE name = '" + name + "'";  // 直接拼接！
Statement stmt = conn.createStatement();
stmt.executeQuery(sql);
```

**关键**：**参数值直接拼进 SQL**，变成了 SQL 语句的一部分。

---

### SQL 注入攻击原理

假设用 `${}` 写查询：

```xml
WHERE name = '${name}'
```

**正常用户**输入：`name = "张三"`  
→ SQL：`WHERE name = '张三'` ✅ 正常

**黑客**输入：`name = "' OR '1'='1"`  
→ SQL：`WHERE name = '' OR '1'='1'`

**发生了什么**：
- `name = ''`：假条件（空字符串）
- `OR '1'='1'`：永远成立
- **结果**：`WHERE` 条件永远为真 → **返回所有用户**（数据泄露）

**更危险的注入（删库）**：

**黑客输入**：`name = "'; DELETE FROM user; --"`

拼接后的 SQL：
```sql
WHERE name = ''; 
DELETE FROM user; 
--'
```

**分解**：
- `';` 结束第一条 SQL
- `DELETE FROM user;` 删除整张表
- `--` 注释掉后面（让语法合法）

**结果**：**数据库被清空**。

---

### 为什么 `#{}` 能防注入？

用 `#{}` 重写：

```xml
WHERE name = #{name}
```

**黑客输入**：`name = "' OR '1'='1"`

**MyBatis 生成的预编译 SQL**：
```sql
WHERE name = ?
```

**参数值传递**：
```java
ps.setString(1, "' OR '1'='1");  // 整个字符串作为一个值
```

**数据库理解成**：
```sql
WHERE name = '\' OR \'1\'=\'1\''  -- 单引号被转义
```

数据库把整个 `' OR '1'='1'` 当成**一个字符串值**（不是 SQL 代码）→ 查询条件变成"查名字等于这串字符的用户"（不存在）→ 返回空。

**核心**：**预编译让 SQL 结构固定，参数只能是"值"，不能变成"代码"**。

---

## 七、`${}` 的合法使用场景（仅 3 种）

### 场景 1：动态表名
```xml
SELECT * FROM ${tableName}  <!-- 表名必须用 ${} -->
```

预编译占位符 `?` 只能替换**值**，不能替换**表名/列名**（SQL 语法不允许）。

### 场景 2：动态列名
```xml
SELECT * FROM user ORDER BY ${column}  <!-- 列名必须用 ${} -->
```

### 场景 3：动态 SQL 片段
```xml
SELECT * FROM user ORDER BY name ${direction}  <!-- ASC/DESC -->
```

**但必须白名单校验**：

```java
// ✅ 白名单验证
List<String> allowedColumns = Arrays.asList("id", "name", "age", "createTime");
if (!allowedColumns.contains(column)) {
    throw new IllegalArgumentException("非法列名: " + column);
}
// 通过了才能用 ${column}
```

**否则仍有注入风险**！

---

## 八、`#{}` vs `${}` 对比表

| | `#{}` | `${}` |
|---|---|---|
| **本质** | 预编译占位符（`?`） | 字符串直接拼接 |
| **底层** | PreparedStatement | Statement |
| **SQL 注入** | ✅ 防注入（参数和 SQL 分离） | ❌ 有注入风险（参数拼进 SQL） |
| **使用场景** | **所有参数值**（默认） | 表名/列名/SQL 关键字（极少数） |
| **白名单** | 不需要 | **必须白名单验证** |
| **记忆锚点** | **永远用这个**，除非真的不能用 | 能不用就不用，用了必须白名单 |

---

## 九、公司代码实战

公司 Mapper 里用 `${}` 的场景：

```xml
<!-- OrderMapper.xml -->
limit ${(pageParam.pageIndex - 1) * pageParam.pageSize}, #{pageParam.pageSize}
```

**分析**：
- offset 用 `${}` 做表达式计算：`(pageIndex - 1) * pageSize`
- **有注入风险**：如果 `pageIndex`/`pageSize` 来自用户输入且没校验 → 黑客可注入

**更安全的写法**（应该在 Java 里算好）：
```java
// Service 层
int offset = (pageParam.getPageIndex() - 1) * pageParam.getPageSize();
mapper.queryPage(offset, pageParam.getPageSize());
```

```xml
<!-- Mapper XML -->
LIMIT #{offset}, #{limit}  <!-- 全用 #{} -->
```

---

## 十、面试题（3 道）

**Q1：`#{}` vs `${}`？**
> `#{}` 是预编译占位符（PreparedStatement），防 SQL 注入，用于所有参数值；`${}` 是字符串拼接（Statement），有注入风险，只用于表名/列名/SQL 关键字，且必须白名单验证。

**Q2：为什么 `#{}` 能防 SQL 注入？**
> 预编译让 SQL 结构固定，参数和 SQL 分离。数据库先编译 `WHERE name = ?` 的结构，再把参数值填入。参数只能是"值"，不能变成"代码"，所以黑客注入的 `' OR '1'='1'` 会被当成一个字符串值，而不是 SQL 逻辑。

**Q3：`<where>` 标签做什么？**
> 智能 WHERE：① 自动去掉第一个 AND/OR（不是中间的）② 所有条件都不成立时不加 WHERE（查全部合法）③ 去掉 `WHERE 1=1` hack。

---

## 🤖 AI 时代视角

**被 AI 贬值（交给 AI）**：
- 手写 `<if>`/`<where>`/`<foreach>` XML 语法 → AI 秒生成
- 记 OGNL 表达式怎么写 → 用时问 AI

**AI 时代反而更值钱（值得深挖）**：
- **SQL 注入原理**：AI 可能生成 `${}` 的代码，但不会告诉你"这段会被删库"。能一眼看出 `${}` 的安全风险、知道什么时候必须用 `#{}`——这是审查 AI 代码、保护线上系统的核心能力。
- **预编译 vs 字符串拼接的底层区别**：理解"为什么 SQL 结构固定就能防注入"——这层理解让你能判断任何 ORM 框架（MyBatis/Hibernate/JPA）、任何语言（Java/Node/Python）的 SQL 安全问题。
- **白名单校验思维**：AI 给你生成 `ORDER BY ${column}`，但可能忘记加白名单。**知道"动态表名/列名必须白名单"这个安全铁律**，是人类不可替代的判断力。

**学在刀刃上**：
- XML 标签语法忘了就问 AI
- 但"用 `${}` 会被删库"这个安全意识，必须刻在脑子里——AI 不能替你背锅，线上被黑是你的责任

---

## 关联

- [[Day16-MyBatis入门]] — Mapper 绑定、动态代理、resultMap、foreach
- [[Day14-Spring事务-Transactional]] — @Transactional 本身就是 AOP，安全问题同样重要

## 下次

- MyBatis 一级/二级缓存
- `<set>` 标签（动态 UPDATE）
- Spring 事务与 MyBatis 协调
