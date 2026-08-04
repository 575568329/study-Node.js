# Day 19 · MyBatis 动态 UPDATE + 关联查询

> **主题**：`<set>` 标签（动态 UPDATE）+ OGNL 假值陷阱 + ResultMap 关联查询（嵌套查询 vs 嵌套结果）
> **日期**：2026-08-04 ｜ **JDK**：Java 8 ｜ **公司框架**：MyBatis
> **前置**：Day 17 动态 SQL（`<if>`/`<where>`/`#{}` vs `${}`）、Day 18 缓存机制

---

## 一、`<set>` 标签（动态 UPDATE）

### 业务场景

用户编辑个人信息，可能只改昵称、可能只改头像、可能都改。只更新用户填写的字段。

### 问题：不用 `<set>` 的痛点

```xml
<!-- ❌ 每个条件后加逗号，最后一个逗号多余 -->
<update id="updateUser">
  UPDATE user SET
  <if test="name != null and name != ''">name = #{name},</if>
  <if test="avatar != null and avatar != ''">avatar = #{avatar},</if>
  age = age  <!-- ⚠️ 兜底字段，吸收最后一个逗号 -->
  WHERE id = #{id}
</update>
```

### 解决：`<set>` 标签

```xml
<update id="updateUser">
  UPDATE user
  <set>
    <if test="name != null and name != ''">name = #{name},</if>
    <if test="avatar != null and avatar != ''">avatar = #{avatar},</if>
    <if test="email != null and email != ''">email = #{email},</if>
  </set>
  WHERE id = #{id}
</update>
```

**`<set>` 的 2 个智能行为**：
1. 自动去掉最后一个逗号 `,`
2. 条件全空时不加 `SET`（但会 SQL 语法报错，需业务层校验至少传一个字段）

### 对比 `<where>` 和 `<set>`

| 标签 | 用途 | 自动修剪 | 全空时行为 |
|------|------|---------|-----------|
| `<where>` | 动态 WHERE | 去第一个 `AND`/`OR` | 不加 `WHERE` ✅ |
| `<set>` | 动态 UPDATE | 去最后一个 `,` | 不加 `SET` ❌（报错） |

### 使用场景判断

- **有可选字段** → `<set>` + `<if>`
- **全是必填/固定** → 直接 `SET`（不过度设计，YAGNI）

---

## 二、OGNL 假值陷阱（⚠️ 高频坑）

### 陷阱：`status = 0` 导致条件不通过

```xml
<if test="status != null">
  status = #{status},
</if>
```

**Java 传入 `status = 0`（下架）**：
- OGNL 表达式 `status != null` → `0 != null` → **false** ❌
- MyBatis OGNL 把 `0` / `false` / `""` 都当假值

### OGNL 假值表

| Java 值 | `test="value != null"` | 陷阱？ |
|---------|------------------------|-------|
| `null` | ❌ false | — |
| `0` (int) | ❌ false | ⚠️ 陷阱 |
| `0` (Integer) | ✅ true | 解决方案 |
| `false` (boolean) | ❌ false | ⚠️ 陷阱 |
| `false` (Boolean) | ✅ true | 解决方案 |
| `""` 空字符串 | ❌ false | — |

### 解决：用包装类

```java
// ❌ int 基本类型：0 在 OGNL 里被当 false
void updateStatus(@Param("id") Long id, @Param("status") int status);

// ✅ Integer 包装类：0 是对象，!= null 判引用不是值
void updateStatus(@Param("id") Long id, @Param("status") Integer status);
```

### 判空铁律

| 字段类型 | 判空写法 | 原因 |
|---------|---------|------|
| String | `name != null and name != ''` | 空字符串是合法 String，业务上要排除 |
| Integer/Long | `age != null` | 只判 null，`0` 是合法值 |
| Boolean | `enabled != null` | 只判 null，`false` 是合法值 |

---

## 三、ResultMap 关联查询

### 业务场景

查询用户信息时，同时带出该用户的所有订单（一对多）。

### Node.js 对比

```javascript
// Prisma：一行搞定
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { orders: true }  // 自动 JOIN + 映射
})
```

MyBatis 需要手写 SQL + 手写映射规则（白盒，灵活但繁琐）。

### 方式 1：嵌套查询（Nested Select，简单但有 N+1）

```xml
<resultMap id="UserWithOrders" type="User">
  <id property="id" column="id"/>
  <result property="name" column="name"/>
  <collection property="orders" ofType="Order"
    select="com.example.mapper.OrderMapper.findByUserId"
    column="id"/>
</resultMap>

<select id="findUserWithOrders" resultMap="UserWithOrders">
  SELECT id, name FROM user WHERE id = #{id}
</select>
```

**N+1 问题**：查 10 个用户 = 1 条主查询 + 10 条子查询 = **11 条 SQL**
- N = **父记录数**（用户数），不是子记录数（订单数）

### 方式 2：嵌套结果（Nested Results，推荐 ⭐）

```xml
<resultMap id="UserWithOrders" type="User">
  <id property="id" column="user_id"/>
  <result property="name" column="user_name"/>
  <collection property="orders" ofType="Order">
    <id property="id" column="order_id"/>
    <result property="productName" column="product_name"/>
    <result property="amount" column="amount"/>
  </collection>
</resultMap>

<select id="findUserWithOrders" resultMap="UserWithOrders">
  SELECT u.id AS user_id, u.name AS user_name,
         o.id AS order_id, o.product_name, o.amount
  FROM user u
  LEFT JOIN orders o ON u.id = o.user_id
  WHERE u.id = #{id}
</select>
```

**1 条 SQL，但结果有重复**（笛卡尔积）：
- 10 用户 × 5 订单 = **50 行**（用户信息重复）
- MyBatis 根据 `<id>` 标签自动分组，合并成嵌套对象

### 两种方式对比

| 维度 | 嵌套查询 | 嵌套结果 |
|------|---------|---------|
| SQL 数量 | 1 + N（N+1 问题） | 1 |
| 性能 | ❌ 大量数据慢 | ✅ 快 |
| 写法复杂度 | ✅ 简单 | ⚠️ 复杂（JOIN + 映射） |
| 适用场景 | 数据量小 / 懒加载 | **生产推荐** |

### LEFT JOIN vs INNER JOIN

| JOIN 类型 | 有子记录的父 | 没子记录的父 |
|-----------|------------|------------|
| **LEFT JOIN** | ✅ 返回 | ✅ 返回（子字段填 NULL） |
| **INNER JOIN** | ✅ 返回 | ❌ 过滤掉 |

**关联查询默认用 LEFT JOIN**（保留父记录）。

### 两个标签

```xml
<!-- 一对多：User → List<Order> -->
<collection property="orders" ofType="Order">...</collection>

<!-- 一对一：Order → User -->
<association property="user" javaType="User">...</association>
```

---

## 四、面试标准答案

> MyBatis 动态 UPDATE 用 `<set>` 标签，自动去掉最后一个逗号，和 `<where>` 去第一个 AND 对称。全空时不加 SET 会报错，需业务层校验。
>
> OGNL 假值陷阱：`test="status != null"` 传 `status=0`(int) 被当 false。用包装类 Integer 解决。判空铁律：String 判 null+空串，Integer 只判 null。
>
> ResultMap 关联查询：嵌套查询有 N+1 问题（N=父记录数），嵌套结果用 JOIN 一次查。LEFT JOIN 保留无子记录的父记录，INNER JOIN 过滤。`<collection>` 一对多，`<association>` 一对一。

---

## 🤖 AI 时代视角

**被 AI 贬值**：
- `<set>` / `<collection>` / `<association>` 标签样板代码
- `flex: 1` 的 CSS 写法

**AI 时代更值钱**：
- **OGNL 陷阱识别**："传 0 不更新"的 Debug 能力（AI 生成代码常踩）
- **N+1 问题判断**：Code Review 识别嵌套查询性能隐患
- **JOIN 类型选择**：LEFT vs INNER 的业务语义判断
- **笛卡尔积膨胀预判**：100×100=10000 行 → 内存压力
- **过度设计判断**：该不该用 `<set>`（看业务需求）

**学在刀刃上**：
- 标签语法忘了问 AI
- OGNN 陷阱 / N+1 / JOIN 选型 → 面试必问，AI 替代不了

---

## 关联

- [[Day17-MyBatis动态SQL与安全]] — `<if>`/`<where>` 是 `<set>` 的基础
- [[Day16-MyBatis入门]] — Mapper 接口绑定、动态代理"没里子"
- [[Day14-Spring事务-Transactional]] — @Transactional 事务绑 Connection，和关联查询的事务一致性问题

## 下次

- MyBatis 与 Spring 事务协调
- 公司代码中 ResultMap 关联查询实际用法
