# FSRS 复习队列

> 三线共享的间隔复习调度表。**只管"下次何时复习谁"，不管掌握度判定**——掌握度由 kp-verify 的 SOLO 判。
> 读写者：`pre-session-review`（读→出题→重打分→临时重排）、`update-progress`（写→FSRS-lite 精修 D/S/下次到期，唯一权威重排者）。
> 算法：FSRS-lite（方向性简化，非精确 FSRS）🟠；数值是起步点，以实际复习体验校准。

## 列说明

| 列 | 含义 |
|---|---|
| KP | 知识点名 |
| 线 | Java / 复习 / CCode |
| 类型 | 原理 / 技能（决定复习活动：原理→默写，技能→再写代码） |
| D | 难度 1-10（越大越难） |
| S(天) | 稳定性：下次到期 ≈ 上次 + S |
| 上次 | 上次复习日期 |
| 下次到期 | 下次该复习的日期 |
| ratings | 最近几次评分（A=Again / H=Hard / G=Good / E=Easy），**左新右旧** |

## 队列

| KP | 线 | 类型 | D | S(天) | 上次 | 下次到期 | ratings |
|---|---|---|---|---|---|---|---|
| BFC（块格式化上下文） | 复习 | 原理 | 5.0 | 4 | 07-22 | 07-26 | G |
| Promise 手写 | 复习 | 技能 | 5.5 | 4 | 07-22 | 07-26 | G |
| Flex 布局（flex:1 三属性） | 复习 | 原理 | 5.0 | 2 | 07-23 | 07-25 | G,H,G |
| this 绑定优先级 | 复习 | 原理 | 4.0 | 10 | 07-22 | 08-01 | G,G |
| position 定位（5取值 + absolute锚点） | 复习 | 原理 | 5.5 | 4 | 07-23 | 07-27 | G,G |
| z-index 层叠上下文 | 复习 | 原理 | 5.5 | 4 | 07-23 | 07-27 | G,G |
| 重排重绘（reflow/repaint + 布局抖动） | 复习 | 原理 | 5.5 | 4 | 07-23 | 07-27 | G |
| CSS 单位（em/rem/vw/vh/%） | 复习 | 原理 | 5.0 | 4 | 07-23 | 07-27 | G |
| 1px 边框（DPR/物理像素） | 复习 | 原理 | 4.5 | 4 | 07-23 | 07-27 | G |
| Maven 坐标 GAV | Java | 原理 | 4.4 | 4 | 07-23 | 07-27 | G |
| pom.xml 结构 | Java | 原理 | 4.4 | 4 | 07-23 | 07-27 | G |
| Maven 本地仓库机制 | Java | 原理 | 6.6 | 2 | 07-23 | 07-25 | H |
| Maven 标准目录结构 | Java | 技能 | 4.4 | 4 | 07-23 | 07-27 | G |

### Java 线历史补齐（Day 1-7 基础 + Day 10 Maven）

| Java 基础语法（变量、类型、流程控制） | Java | 原理 | 4.5 | 4 | 07-17 | 07-21 | G |
| Java 方法与重载（方法签名） | Java | 原理 | 4.5 | 4 | 07-17 | 07-21 | G |
| Java 数组与 ArrayList（固定 vs 动态） | Java | 原理 | 5.0 | 4 | 07-17 | 07-21 | G |
| Java 基本类型与包装类（自动装箱/拆箱） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 类与对象、封装（private/getter/setter） | Java | 原理 | 5.0 | 4 | 07-17 | 07-21 | G |
| Java 继承、super、方法重写（@Override） | Java | 原理 | 5.0 | 4 | 07-17 | 07-21 | G |
| Java 多态（向上转型、编译看左运行看右） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 接口、抽象类（is-a vs can-do） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 集合框架（List/Map/Set/泛型） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java 异常处理（try-catch/throw/throws/Checked vs Unchecked） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |
| Java Stream API（map/filter/collect/惰性求值） | Java | 原理 | 5.5 | 4 | 07-20 | 07-24 | G |
| Java Optional（orElse/orElseThrow/?.对比） | Java | 原理 | 5.0 | 4 | 07-20 | 07-24 | G |
| Java 面向接口编程（依赖倒置原则 DIP） | Java | 原理 | 5.5 | 4 | 07-17 | 07-21 | G |

### 复习线历史补齐（JS/TS 9/9 + Vue3 9/9 + CSS 10/10）

| JS/TS 闭包 | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS Vue3 ref 原理（类+get/set） | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS React useState 闭包陷阱 | 复习 | 原理 | 5.0 | 4 | 07-15 | 07-27 | G |
| JS/TS 原型与原型链 | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS new 的 4 步 | 复习 | 原理 | 4.5 | 4 | 07-15 | 07-27 | G |
| JS/TS 事件循环（宏任务/微任务） | 复习 | 原理 | 5.5 | 4 | 07-15 | 07-27 | G |
| JS/TS TS interface vs type、泛型 | 复习 | 原理 | 5.0 | 4 | 07-15 | 07-27 | G |
| Vue3 ref vs reactive + 为什么 .value | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |
| Vue3 为什么用 Proxy 替代 defineProperty | 复习 | 原理 | 5.0 | 4 | 07-20 | 07-27 | G |
| Vue3 依赖收集（track/trigger） | 复习 | 原理 | 6.0 | 4 | 07-20 | 07-27 | G |
| Vue3 Composition API vs Options API | 复习 | 原理 | 5.0 | 4 | 07-20 | 07-27 | G |
| Vue3 Composable + computed/watch/watchEffect | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |
| Vue3 生命周期钩子 | 复习 | 原理 | 4.5 | 4 | 07-20 | 07-27 | G |
| Vue3 组件通信（父子 + 跨层级） | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |
| Vue3 v-model 原理 | 复习 | 原理 | 5.0 | 4 | 07-20 | 07-27 | G |
| Vue3 v-if/v-show + key + nextTick | 复习 | 原理 | 5.5 | 4 | 07-20 | 07-27 | G |

> 真实 KP 由 `update-progress` 在"记录进度"时写入；`pre-session-review` 在"开始今日学习"时读取并重打分。
> 2026-07-22：pre-session-review 首填 4 行（队列原为空）+ update-progress 精修 + 新增 position/z-index 2 行。
> Flex 因课前小测 Hard（值记得、三属性名淡忘）→ S 缩短至 2 天，07-24 快速复查。
> 2026-07-23：补齐 JS/TS 7 题 + Vue3 8 题 + Java 13 题（历史学习，初始 Good，S=4）+ CSS 收官 3 题 + Maven 4 题。总计 50 KP。注意：this 绑定、Promise 手写、position、z-index 已在今日课前小测复查，以上次为准。
