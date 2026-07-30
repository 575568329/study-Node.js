# Day 16 · MyBatis 入门

> **主题**：MyBatis 是什么、Mapper 接口+XML 映射、动态代理机制、读公司代码
> **日期**：2026-07-30 ｜ **JDK**：Java 8 ｜ **公司框架**：MyBatis
> **前置**：Day 14.5 已学 JDK 动态代理（Spring AOP 代理机制）

---

## 一、为什么需要 MyBatis（纯 JDBC 的痛点）

纯 JDBC 查一个用户，要写这么多：

```java
public User findById(Long id) {
    Connection conn = null; PreparedStatement ps = null; ResultSet rs = null;
    try {
        conn = DriverManager.getConnection(url, user, pwd);   // 1. 获取连接
        String sql = "SELECT id, name, email FROM user WHERE id = ?";
        ps = conn.prepareStatement(sql);                       // 2. 写 SQL
        ps.setLong(1, id);                                     // 3. 设参数
        rs = ps.executeQuery();                                // 4. 执行
        if (rs.next()) {                                       // 5. 手动映射
            User u = new User();
            u.setId(rs.getLong("id"));
            u.setName(rs.getString("name"));
            u.setEmail(rs.getString("email"));
            return u;
        }
        return null;
    } catch (SQLException e) {
        throw new RuntimeException("查询失败", e);
    } finally {                                                // 6. 手动关资源
        try { if (rs != null) rs.close(); } catch (SQLException e) {}
        try { if (ps != null) ps.close(); } catch (SQLException e) {}
        try { if (conn != null) conn.close(); } catch (SQLException e) {}
    }
}
```

**4 大痛点**：样板代码多、SQL 散落代码中、手动逐字段映射、资源泄漏风险。

**Node.js 对比**：
- JDBC ≈ `mysql2` 原始 callback API
- MyBatis ≈ `Knex.js` / `Prisma`（查询构建器 / ORM）

---

## 二、MyBatis 三大核心

1. **SQL 外置化**：SQL 写在 XML（或注解），和 Java 代码分离
2. **自动映射**：ResultSet → Java 对象自动填充
3. **动态代理**：只写接口，MyBatis 生成实现

### MyBatis 版（对比上面 JDBC）

```java
// Mapper 接口（只声明，不实现）
public interface UserMapper {
    User findById(Long id);
}
```

```xml
<!-- UserMapper.xml -->
<mapper namespace="com.example.mapper.UserMapper">
    <select id="findById" resultType="com.example.entity.User">
        SELECT id, name, email FROM user WHERE id = #{id}
    </select>
</mapper>
```

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;   // 注入的是 MyBatis 生成的代理对象
    public User getUser(Long id) {
        return userMapper.findById(id);
    }
}
```

没有连接管理、没有 `rs.next()`、没有 `close()`——全被 MyBatis 接管。

---

## 三、Mapper 接口 + XML 绑定机制（核心）

**绑定规则**：

```
XML namespace  ↔  接口全限定名（com.example.mapper.UserMapper）
XML <select id>  ↔  接口方法名（findById）
```

**拼成唯一 Statement ID**：

```
namespace + "." + id
= com.example.mapper.UserMapper.findById
```

MyBatis 内部维护一个 `Map<String, MappedStatement>`，**key 就是 Statement ID**，value 是这条 SQL 的全部信息。

**执行流程**：

```
调 userMapper.findById(1L)
   ↓ 代理拦截，拿到 接口名 + 方法名
拼出 key = "com.example.mapper.UserMapper.findById"
   ↓ 用 key 查 Map
找到对应 <select> SQL → 执行 → ResultSet 映射成 User
```

> ⚠️ 所以 namespace 必须和接口全限定名**一字不差**，id 必须和方法名**完全一致**，差一个字母就找不到。

---

## 四、动态代理机制（继 Spring AOP 后再现）

### 关键问题：接口没实现类，`@Autowired` 注入的是什么？

答：MyBatis 用 **JDK 动态代理**运行时生成接口代理对象（`$Proxy`）。

```java
// MyBatis 内部逻辑（简化）
UserMapper mapper = (UserMapper) Proxy.newProxyInstance(
    classLoader, new Class[]{ UserMapper.class },
    (proxy, method, args) -> {
        String statementId = "com.example.mapper.UserMapper." + method.getName();
        MappedStatement ms = configuration.getMappedStatement(statementId);
        ResultSet rs = executeQuery(ms.getSql(), args);
        return mapResultSetToObject(rs, User.class);
    }
);
```

### ★ MyBatis 代理 vs Spring AOP 代理（本质区别）

| | Spring AOP 代理 | MyBatis 代理 |
|---|---|---|
| **有无真实对象** | **有里子**：包装真实 Bean | **没里子**：接口无实现类 |
| **核心动作** | `method.invoke(target)` 调原方法 | 自己查 SQL、执行、映射 |
| **代理职责** | 前后加料（事务/日志），核心交给里子 | 全部逻辑（因为没别人干） |
| **底层技术** | JDK 动态代理 / CGLIB | JDK 动态代理 |

**记忆锚点**：
- **AOP 代理 = 保安**：门口检查（前置）→ 放你进去办事（里子）→ 出来登记（后置）
- **MyBatis 代理 = 外卖员**：你说"要宫保鸡丁"（接口方法）→ 它自己跑腿买回（查 SQL 执行）→ 后厨（实现类）根本不存在

**同底层技术的框架**：Spring 事务、Spring AOP、MyBatis Mapper、Dubbo RPC —— 全是动态代理。**同一把锤子敲不同钉子，区别只在 InvocationHandler 的实现。**

---

## 五、@Param 参数命名

```java
List<TopicRecord> getByPage(@Param("taskId") String taskId,
                            @Param("pageNo") int pageNo,
                            @Param("pageSize") int pageSize);
```

```xml
<select id="getByPage" resultMap="TopicRecordMap">
    ... where task_id = #{taskId} limit #{pageNo}, #{pageSize}
</select>
```

**为什么要 @Param**：Java 编译后方法参数名默认丢失（变 `arg0/arg1`），多参数时 MyBatis 不知道 `#{taskId}` 对应哪个 → `@Param` 手动贴标签补回来。

去掉会报错：
```
BindingException: Parameter 'taskId' not found.
Available parameters are [arg0, arg1, arg2, param1, param2, param3]
```

> 单参数可省略，公司规范是都写。
> **Node 对比**：像 JS 的具名传参 `fn({taskId, pageNo})`，Java 编译丢名字所以要 @Param 补。

---

## 六、resultMap vs resultType

| | 用途 |
|---|---|
| **resultType** | 简单类型（Integer/String/Long）或列名=属性名的**自动映射** |
| **resultMap** | 自定义映射：列名≠属性名、一对多/嵌套对象、标记主键 |

```xml
<!-- resultMap：列名 → 属性名手动映射 -->
<resultMap id="TopicRecordMap" type="...TopicRecord">
    <id     column="id"       property="id"/>       <!-- 主键 -->
    <result column="topic_id" property="topicId"/>  <!-- 下划线转驼峰 -->
    <result column="task_id"  property="taskId"/>
</resultMap>

<select id="getByTaskId" resultMap="TopicRecordMap">...</select>   <!-- 返回对象 -->
<select id="getCountByTaskId" resultType="java.lang.Integer">...</select>  <!-- 返回数字 -->
```

**`<id>` vs `<result>`**：`<id>` 标主键（缓存/去重判断"是否同一行"），`<result>` 普通列。

**一句话**：resultType 是"给类型自动填"，resultMap 是"手动告诉每列填哪"。

---

## 七、动态 SQL：foreach 批量插入

```xml
<insert id="batchAdd">
    insert into tb_brush_topic_record(
    <include refid="Topic_Record_Column_List"/>   <!-- 复用列名片段 -->
    )
    values
    <foreach collection="topicRecordList" item="topic" separator=",">
        (#{topic.id},#{topic.topicId},#{topic.status},#{topic.taskId},#{topic.remark})
    </foreach>
</insert>
```

生成的是**一条 SQL 插多行**（不是多次插入）：

```sql
INSERT INTO tb_brush_topic_record(...) VALUES (...),(...),(...)
```

- `collection` ← 对应 `@Param` 名
- `item` ← 每次循环临时变量
- `separator=","` ← 组间分隔

**性能铁律**：一条 SQL 一次网络往返 vs N 条 SQL N 次往返，差 N 倍（CLAUDE.md「禁止单条循环操作」）。

**Node 等价**：
```javascript
// Knex —— 同思路，一条多值 SQL
await knex('table').insert([{...}, {...}]);
// mysql2 —— ? + 二维数组自动展开
await conn.query('INSERT INTO table(...) VALUES ?', [values]);
```

**`<sql>` + `<include>`**：抽公共列名复用（DRY）。

---

## 八、公司代码实战（TopicRecordMapper）

- **接口**：`crowdsourced-new/impl/.../factory/brush/mapper/TopicRecordMapper.java`（6 方法）
- **XML**：`crowdsourced-new/service/.../mapping/brush/TopicRecordMapper.xml`（6 SQL）
- 6 方法 ↔ 6 SQL 一一对应（delById/getByTaskId/getCount/getByPage/add/batchAdd）

### 🐛 发现的 Bug（标记未改）

```xml
<delete id="delByTaskId">
    delete *                       <!-- ❌ DELETE 不能带 * -->
    FROM tb_brush_topic_record WHERE task_id = #{taskId}
</delete>
```

标准 SQL 的 DELETE 不带 `*`，正确是 `DELETE FROM ... WHERE ...`。可能该方法未被调用或手误。
遵守 CLAUDE.md「不顺手重构周边代码」，仅标记不改。

---

## 九、面试题（3 道）

**Q1：Mapper 接口没实现类，为什么能注入并调用？**
> JDK 动态代理运行时生成接口代理对象。调用时代理拦截，用 `namespace.方法名` 作唯一 key 找 SQL，执行后映射返回。与 Spring AOP 同底层（动态代理），区别是 MyBatis 代理"没真实对象"，代理本身完成全部 SQL 执行。

**Q2：`#{}` vs `${}`？**
> `#{}` 预编译占位符（PreparedStatement 的 `?`），自动设参数，**防 SQL 注入**，默认永远用它；`${}` 字符串直接拼接，有注入风险，只在动态表名/列名等特殊场景用。

**Q3：resultMap vs resultType 如何选？**
> 简单类型或列名=属性名的自动映射用 resultType；列名≠属性名、嵌套对象、需标主键等自定义场景用 resultMap。

---

## 🤖 AI 时代视角

**被 AI 贬值（交给 AI）**：
- 手写 Mapper XML、拼 `<foreach>`/`<resultMap>` 标签、生成 CRUD 样板 SQL —— AI 秒出且更规范

**AI 时代反而更值钱（值得深挖）**：
- **动态代理机制的理解**：AI 能写 Mapper，但"为什么接口能被注入""事务自调用为何失效"这类原理判断，是审查 AI 代码、排查线上问题的地基
- **读代码 / 审代码能力**：今天读公司 Mapper 发现 `delete *` bug —— AI 生成的代码也可能有这种坑，能一眼看出的人才敢提交
- **性能判断**：批量 vs 循环、`#{}` vs `${}` 的注入风险 —— 这些是 AI 可能忽略、人类必须把关的决策点

**学在刀刃上**：MyBatis 标签语法忘了就问 AI；但"MyBatis/Spring/Dubbo 底层都是动态代理"这层理解，是面试高频题、也是转型护城河，AI 替代不了。

---

## 关联

- [[Day13-Spring-AOP与Bean生命周期]] — AOP 代理机制
- [[Day14-Spring事务-Transactional]] — @Transactional 是 AOP 事务切面，自调用失效同根因
- Day 14.5（JDK 动态代理深挖）— 本篇"有里子/没里子"对比的基础

## 下次

- `#{}` vs `${}` 深入（SQL 注入原理）
- 动态 SQL `<if>` / `<where>` / `<choose>`（条件查询）
- MyBatis 一级/二级缓存
- Spring 事务与 MyBatis 协调
