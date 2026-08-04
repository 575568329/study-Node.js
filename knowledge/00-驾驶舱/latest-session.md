# 最近一次学习记录

**最后更新**:2026-08-04（Day 19 MyBatis 动态 UPDATE + 关联查询）

## Day 19 学习记录（2026-08-04）

**主题**：MyBatis `<set>` 标签（动态 UPDATE）+ ResultMap 关联查询（一对一/一对多）

### 课前小测（pre-session-review）

8 题：**通过率 1/8**，3 个 Again + 3 个 Hard + 1 个 Again 第 2 次
- Q1 Promise 手写：⚠️ Hard（核心对，then 返回值"永远返回新 Promise"没说清）→ H
- Q2 Flex flex:1：❌ Again（三属性名对，但 `flex-basis: 0%` 等分原理没打通）→ A
- Q3 1px 边框：✅ Good（DPR 原理全对，伪类+scale 方案正确）→ G
- Q4 Node 原生 http：❌ Again（req/res 方向搞反，流式读取原理错）→ A
- Q5 cluster 多进程：❌ Again（答偏到线程池，端口共享机制没答）→ A
- Q6 MyBatis `<if>`：⚠️ Hard（语法对，原因说偏"浪费资源"，应说"防空字符串污染查询条件"）→ H
- Q7 MyBatis `<where>`：⚠️ Hard（方向对，没说清去第一个 AND 的核心 + WHERE 1=1 缺点）→ H
- Q8 事务绑连接：❌ **Again 第 2 次**（核心原理对"不是同一个→回滚找不到"，但术语说"线程"应该说"连接"）→ A

### 学习成果

**`<set>` 标签（动态 UPDATE）**：
- 2 个智能行为：自动去掉最后一个逗号 / 条件全空时不加 SET（但会报错，需业务层校验）
- 与 `<where>` 对称：`<where>` 去第一个 AND/OR，`<set>` 去最后一个逗号
- 使用场景判断：有可选字段用 `<set>`，全是必填/固定直接 SET（不过度设计）
- 对比 `<where>` 全空时不加 WHERE（优雅），`<set>` 全空时不加 SET 会报错（需业务校验）

**OGNL 假值陷阱（⚠️ 高频坑）**：
- `test="status != null"` 传 `status=0` (int) → false（OGNL 把 0/false/"" 当假值）
- 解决：用包装类 Integer/Boolean（对象的 `!= null` 判引用不是值）
- 判空铁律：String 判 `!= null and != ''`，Integer/Boolean 只判 `!= null`
- 数字/布尔字段用包装类是铁律

**ResultMap 关联查询**：
- 两种方式：嵌套查询（Nested Select，简单但有 N+1）vs 嵌套结果（Nested Results，复杂但推荐）
- N+1 问题的 N = **父记录数**（不是子记录数），10 个用户 = 11 条 SQL
- JOIN 笛卡尔积：结果行数 = 父记录数 × 每条父记录的子记录数（10 用户 × 5 订单 = 50 行）
- LEFT JOIN 保留无子记录的父记录（填 NULL），INNER JOIN 过滤掉
- `<collection>` = 一对多（User → List\<Order\>），`<association>` = 一对一（Order → User）
- MyBatis 根据 `<id>` 标签分组，相同 id 的行合并成一个对象

### 错题本

**错题 1：Flex flex:1 等分原理 🔴**
- 错误原文："基准领零严格等分"
- 正确：**`flex-basis: 0%` 让所有空间变成剩余空间，`flex-grow: 1` 按比例等分剩余空间**
- 对比 `flex: auto`（flex-basis: auto → 保留内容宽度 → 不等分）

**错题 2：Node 原生 http req/res 🔴**
- 错误原文："一个是用户返回的数据一个是请求头数据"
- 正确：**req = 请求（客户端→服务端，可读流），res = 响应（服务端→客户端，可写流）**
- req.body 不存在的原因：req 是流，数据分块到达，需 `req.on('data')` 手动拼接

**错题 3：cluster 端口共享 🔴**
- 错误原文：描述了线程池的任务调度逻辑
- 正确：**主进程真监听端口，worker 假监听（内部拦截），主进程接收 socket 轮询分发给 worker**
- Round-Robin（默认，Linux）vs OS 调度（Windows）

**错题 4：事务绑连接 第 2 次 🔴🔴**
- 错误原文："获取的线程不是同一个线程"
- 正确：**事务绑的是 Connection（连接），不是 Thread（线程）**
- 08-02 同一个错误，08-04 仍然说"线程"→ 高频术语混淆

**错题 5：OGNL 假值陷阱（理解检查 2）🔴**
- 错误原文："没啥问题"
- 正确：`status=0` 在 OGNL `test` 里被当 false，条件不通过，不更新
- 解决：用 Integer 包装类，或只判 `!= null`

**错题 6：N+1 的 N 理解（理解检查 3）🔴**
- 错误原文：N+1 = 55 条（10 用户 × 5 订单）
- 正确：**N = 父记录数（10），N+1 = 11 条 SQL（1 主查 + 10 子查）**
- JOIN 笛卡尔积行数 = 10 × 5 = 50 行（不是 10 行）

### 今日面试题沉淀（4 道）

1. MyBatis `<set>` 标签作用？→ 动态 UPDATE，自动去最后一个逗号，与 `<where>` 去第一个 AND 对称
2. MyBatis `<if test="status != null">` 传 `status=0` 有什么坑？→ OGNL 把 0 当假值，用包装类 Integer
3. MyBatis N+1 问题？→ 嵌套查询查 N 个父记录发 N+1 条 SQL（1 主查 + N 子查），用嵌套结果 JOIN 一次查解决
4. LEFT JOIN vs INNER JOIN？→ LEFT 保留左表全记录（无匹配填 NULL），INNER 只保留两边都有匹配的

### 遗留问题 / 下次计划

- MyBatis 与 Spring 事务协调（SqlSession 如何参与 @Transactional）
- 🔴 Flex 等分原理 08-05 复查
- 🔴 Node http / cluster / 事务绑连接 08-05 复查
- 🔴 OGNL 假值陷阱 / ResultMap 08-05 复查

---

## 上次会话（存档）

**2026-08-03（Day 18 MyBatis 缓存机制）**

---

## 学习内容

### 一级缓存（SqlSession 级别）
- 默认开启，关不掉
- 同一个 SqlSession 内相同查询 → 命中缓存不发 SQL
- 缓存 Key = Statement ID + 参数值
- 清空 4 种场景：SqlSession 关闭 / INSERT/UPDATE/DELETE / 手动 clearCache

### 二级缓存（Mapper 级别）
- 默认关闭
- 跨 SqlSession 共享缓存
- 查询路径：一级缓存 → 二级缓存 → 数据库
- 3 项配置：全局 cacheEnabled=true + Mapper 加 <cache/> + 实体类 implements Serializable

### 缓存适用场景
- ✅ 字典表、配置表（查多改少）
- ❌ 订单、库存（频繁改动）
- 公司项目几乎不用 <cache/>

### SqlSession / Mapper / Spring 的关系
- SqlSession = 数据库连接 + 一级缓存的包装对象
- Mapper = 你写的接口（UserMapper.java），通过动态代理生成实现
- Spring 环境下不用手写 SqlSession / getMapper → @Autowired 自动注入

---

## 上次会话（存档）

**2026-08-03（前端复习线）**

### WebSocket（13/?）
- 独立协议（ws:// / wss://），HTTP Upgrade 握手后脱离 HTTP
- 全双工，同端口复用 80/443
- vs SSE：双向+手动重连 vs 单向+自动重连
- 生产三坑：broadcast 无 try-catch / 无自动重连 / Nginx 60s 超时

### Express 深入（14/?）
- Express = 中间件数组 + next() 循环驱动
- next() 和 res.send() 只能选一个
- 错误处理中间件靠参数个数（4 个）区分

### worker_threads（15/?）
- 单线程 CPU 密集任务阻塞事件循环
- cluster 多进程（安全重）vs worker_threads 多线程（轻量危险）
- 线程池模式（同 DB 连接池），SharedArrayBuffer 零拷贝
