# Day 18 · MyBatis 缓存机制

> **主题**：一级缓存（SqlSession 级）+ 二级缓存（Mapper 级）+ 适用场景判断
> **日期**：2026-08-03 ｜ **JDK**：Java 8 ｜ **公司框架**：MyBatis
> **前置**：Day 16-17 已学 MyBatis 基础（Mapper 绑定、动态代理、resultMap、动态 SQL、`#{}` vs `${}`）

---

## 一、为什么需要缓存？

**场景**：同一个会话内，多次查同一条数据

```java
User u1 = userMapper.findById(1L);  // 第 1 次：发 SQL
User u2 = userMapper.findById(1L);  // 第 2 次：又发 SQL？？？
User u3 = userMapper.findById(1L);  // 第 3 次：再发 SQL？？？
```

**问题**：数据库查询有成本（网络往返 + 磁盘 I/O），查了 3 次完全一样的数据。

**缓存解决**：第一次查完把结果存内存，下次相同查询直接返回。

---

## 二、一级缓存（SqlSession 级别）

### 核心规则

- **默认开启，关不掉**
- 存在 **SqlSession 内部**
- **同一个 SqlSession 内有效**（跨 SqlSession 不共享）

### SqlSession 是什么？

不是进程，是 **数据库操作上下文**。类比 Node.js：

```javascript
// Node.js：手动管理
const conn = pool.getConnection();  // 借连接
conn.query('SELECT ...');           // 执行 SQL
conn.release();                    // 归还

// Java + MyBatis：SqlSession 帮你管
SqlSession session = sqlSessionFactory.openSession();  // 自动借连接 + 包装
UserMapper mapper = session.getMapper(UserMapper.class);   // 生成代理
// 用 mapper 查询...
session.close();  // 归还连接 + 清空缓存
```

**Spring 环境不用手写**：`@Autowired` 自动注入 Mapper，Spring 自动管理 SqlSession。

### 一级缓存结构

```
SqlSession {
    Connection（数据库连接）
    Map<缓存Key, 查询结果> 一级缓存
    Configuration（MyBatis 全局配置）
}
```

### 缓存 Key 的组成

**两个维度缺一不可**：Statement ID + 参数值

```
Key = "UserMapper.findById" + [1L]  →  User(id=1, name="张三")
Key = "UserMapper.findById" + [2L]  →  User(id=2, name="李四")
```

所以：
- `findById(1L)` 两次 → 第一次查 DB，第二次命中缓存 ✅
- `findById(1L)` 然后 `findById(2L)` → 第二次未命中，查 DB（参数不同，Key 不同）

### Node.js 类比

```javascript
const cache = new Map();
function findById(id) {
  const key = `findById:${id}`;
  if (cache.has(key)) return cache.get(key);  // 命中
  const user = db.query('SELECT * FROM user WHERE id = ?', [id]);
  cache.set(key, user);
  return user;
}
```
MyBatis 一级缓存就是自动帮你管这个 Map。

### 一级缓存什么时候清空？

| 场景 | 清空？ |
|------|:---:|
| SqlSession 关闭 | ✅ 全部清空 |
| 执行 INSERT / UPDATE / DELETE | ✅ 自动清空（数据可能变了，旧缓存脏了） |
| 手动 `sqlSession.clearCache()` | ✅ 手动清空 |
| 只执行 SELECT（多次查同一条） | ❌ 不清空（缓存生效） |

**为什么增删改要清空？** 因为 INSERT/UPDATE/DELETE 可能改了数据库数据，缓存里的旧数据就脏了。宁多查一次，不返回旧数据。

---

## 三、一级缓存的局限 → 为什么需要二级缓存？

**一级缓存只在同一个 SqlSession 内有效**：

```java
SqlSession s1 = factory.openSession();
SqlSession s2 = factory.openSession();

UserMapper m1 = s1.getMapper(UserMapper.class);
UserMapper m2 = s2.getMapper(UserMapper.class);

User u1 = m1.findById(1L);  // s1：查 DB，存入 s1 的一级缓存
User u2 = m2.findById(1L);  // s2：又查 DB！s2 有自己独立的缓存，看不到 s1 的
```

**Spring 里每个请求一个 SqlSession（默认）**→ 同一用户连续两次请求查同一数据 → 查了 2 次。

---

## 四、二级缓存（Mapper 级别）

### 核心规则

- **默认关闭**（和一级缓存相反！重要区别）
- 跨 SqlSession 共享
- 存在 Mapper 级别（同一个 Mapper 的所有 SqlSession 共享）

### 架构图

```
SqlSession1 ──┐
              ├── 二级缓存（全局共享）
SqlSession2 ──┤    Key: "UserMapper.findById" + [1L]
              │    → User(id=1, name="张三")
SqlSession3 ──┘
```

### 查询路径（核心）

```
查 findById(1L)
   ↓
① 先查自己的一级缓存（SqlSession 内的 Map）
   ↓ 未命中
② 查二级缓存（Mapper 级别的全局 Map）← 命中就直接返回
   ↓ 未命中
③ 查数据库
   ↓
④ 结果存入二级缓存
   ↓
⑤ 结果存入自己的一级缓存
   ↓
⑥ 返回结果
```

**下次同一个 session 再查**：命中 ① → 直接返回
**另一个 session 再查**：① 未命中 → 命中 ② → 直接返回（省了数据库查询）

---

## 五、二级缓存的 3 项配置

### 1. 全局开关（默认 false！）

```xml
<!-- mybatis-config.xml -->
<settings>
    <setting name="cacheEnabled" value="true"/>  <!-- 全局开启 -->
</settings>
```

### 2. Mapper 级开关（逐个开）

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <cache/>   <!-- 给这个 Mapper 开启二级缓存 -->
    
    <select id="findById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

### 3. 实体类必须实现 Serializable

```java
public class User implements Serializable {
    private Long id;
    private String name;
    // getter/setter...
}
```

**为什么？** 二级缓存可能序列化到磁盘（如 Redis/Encache 外部缓存），必须支持序列化。MyBatis 强制要求。

---

## 六、二级缓存什么时候清空

| 操作 | 一级缓存 | 二级缓存 |
|------|---------|---------|
| SELECT | ❌ 不清空 | ❌ 不清空 |
| INSERT / UPDATE / DELETE | ✅ 清空自己 | ✅ 清空**整个 Mapper** |

**关键区别**：某个 session 执行 INSERT → 自己的一级缓存清空 + 这个 Mapper 的**全部二级缓存也清空**（保证所有 session 的一致性）。

---

## 七、什么时候该用、什么时候不该用？

### ✅ 适合

| 场景 | 适合？ | 原因 |
|------|-------|------|
| 字典表（省市区、性别、状态码） | ✅ 非常适合 | 几乎不改动 |
| 配置表（系统参数） | ✅ 非常适合 | 很少改动 |

### ❌ 不适合

| 场景 | 不适合？ | 原因 |
|------|--------|------|
| 订单列表（频繁变动） | ❌ | 每次改动清空缓存，命中率极低 |
| 库存数据 | ❌ | 同上 |
| 需要实时性的数据 | ❌ | 缓存有延迟，查到的是旧数据 |

### 公司项目实践

**几乎看不到 `<cache/>`**——因为业务数据频繁变更，缓存命中率低 + 一致性难保证。这不是 MyBatis 的错，是业务特点决定的。

---

## 八、面试标准答案

> MyBatis 有两级缓存：
> - **一级缓存**：SqlSession 级别，默认开启，同 SqlSession 内有效。Key = Statement ID + 参数值。session 关闭 / 增删改时清空。
> - **二级缓存**：Mapper 级别，默认关闭，需手动开启（`cacheEnabled=true` + `<cache/>`）。跨 SqlSession 共享。实体类必须 `implements Serializable`。增删改清空整个 Mapper。
> - 查询路径：一级缓存 → 二级缓存 → 数据库。
> - 适用场景：查多改少的字典表/配置表。频繁变动的业务数据不适合。
> - 公司项目几乎不用二级缓存（业务数据频繁变更，一致性代价 > 查询收益）。

---

## 🤖 AI 时代视角

**被 AI 贬值（交给 AI）**：
- `cacheEnabled=true` 配置、实体类加 `implements Serializable` → AI 生成代码时自动处理

**AI 时代反而更值钱（值得深挖）**：
- **缓存一致性判断力**：哪些表适合缓存——这是架构决策，AI 不了解业务变更频率。AI 给你加了 `<cache/>`，该不该加是你的判断。
- **面试区分度**：答"两级缓存"是背答案，但答"为什么公司项目不用"才是真理解。
- **后续关联**：缓存击穿（大量请求同时缓存未命中→全打到 DB）、缓存雪崩（缓存失效→大量请求打 DB）——这些是后端核心能力。

**学在刀刃上**：
- 缓存配置忘了问 AI
- 但"该不该缓存"的判断力 + 缓存击穿/雪崩的理解 → 面试必问

---

## 关联

- [[Day16-MyBatis入门]] — Mapper 代理、SqlSession 的基础
- [[Day14-Spring事务-Transactional]] — 事务绑 Connection，和缓存清空场景关联
- Day 17 Node.js 复习学了"连接池"（conn 借还），理解 SqlSession 关闭 = 归还连接

## 下次

- `<set>` 标签（动态 UPDATE）
- Spring 事务与 MyBatis 协调
- 缓存击穿 / 缓存雪崩（可选深入）
