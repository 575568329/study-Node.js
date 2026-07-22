# CSS 面试讲稿

**复习方法**：费曼学习法（合上资料自己讲 → 标红卡壳 → 补漏 → 产出讲稿）
**复习日期**：2026-07-21
**状态**：进行中

---

## Q1：盒模型（Box Model）✅

### 3 分钟讲稿

**问题**：`content-box` vs `border-box` 区别？

**我的回答**：

CSS 盒模型描述元素占据的空间。每个元素由 4 层组成：content（内容）、padding（内边距）、border（边框）、margin（外边距）。

**`content-box`**（默认）：
- `width: 200px` 只指**内容区**的宽度
- 实际占据宽度 = `width + padding + border`
- 例如：width 200px + padding 20px×2 + border 10px×2 = **260px**

**`border-box`**（推荐）：
- `width: 200px` 包含 **content + padding + border** 的总和
- 实际占据宽度 = `width`（就是你设的值，200px）
- 内容区会自动压缩

**关键**：两种模式下 **margin 都不算在 width 里**，只影响元素间距。

**为什么推荐 border-box**：符合直觉，设 200px 就是 200px，不会因为加 padding 撑开布局。

---

### 可能的追问及回答

- **追问1**：设置 `width: 200px` 后，两种盒模型实际占据的宽度各是多少？
  - content-box：200 + padding + border
  - border-box：200（固定）

- **追问2**：为什么现代 CSS 框架都用 `border-box`？
  - 因为 content-box 反人类：加 padding 会撑开布局，border-box 符合预期

- **追问3**：怎么给整个页面设置 `border-box`？
  ```css
  *, *::before, *::after {
    box-sizing: border-box;
  }
  ```

---

### 我曾经的盲区

- ❌ 一开始完全不知道盒模型是什么
- ✅ 理解后核心概念全对（margin 不参与 width 计算）
- ⚠️ 计算题小失误（260 算成 230，粗心）

---

## Q2：居中方案 ✅

### 3 分钟讲稿

**问题**：水平垂直居中你能说出几种方案？

**我的回答**：

### 方案1：Flexbox（最推荐，现代首选）
```css
.container {
  display: flex;
  justify-content: center;  /* 水平居中 */
  align-items: center;      /* 垂直居中 */
}
```
**优点**：简单、不需要知道子元素宽高、兼容性好（IE10+）

---

### 方案2：Grid
```css
.container {
  display: grid;
  place-items: center;  /* 水平垂直居中的缩写 */
}
```
**优点**：代码最简洁、适合复杂布局

---

### 方案3：absolute + transform（最常用的定位方案）
```css
.container {
  position: relative;
}
.box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);  /* 往回拉自身宽高的一半 */
}
```
**原理**：`left/top: 50%` 把左上角移到中心，`transform` 往回拉自身的 50%
**优点**：不需要知道子元素宽高

---

### 方案4：absolute + margin auto（需要固定宽高）
```css
.container {
  position: relative;
}
.box {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  margin: auto;
  width: 200px;   /* 必须有固定宽高 */
  height: 100px;
}
```

---

### 方案5：margin auto（仅水平居中）
```css
.box {
  width: 200px;      /* 必须有固定宽度 */
  margin: 0 auto;    /* 垂直方向无效 */
}
```
**局限**：只能水平居中，垂直方向无效

---

### 方案对比

| 方案 | 需要知道宽高 | 兼容性 | 推荐度 |
|------|-------------|--------|--------|
| Flexbox | ❌ 不需要 | IE10+ | ⭐⭐⭐⭐⭐ |
| Grid | ❌ 不需要 | IE11部分支持 | ⭐⭐⭐⭐ |
| absolute + transform | ❌ 不需要 | IE9+ | ⭐⭐⭐⭐⭐ |
| absolute + margin auto | ✅ 需要 | IE8+ | ⭐⭐⭐ |
| margin auto | ✅ 需要 | 全兼容 | ⭐⭐（仅水平）|

---

### 可能的追问及回答

- **追问1**：`margin: auto` 为什么垂直方向不生效？
  - 水平方向：块级元素有固定宽度 → 浏览器知道剩余空间 → `auto` 自动分配
  - 垂直方向：容器高度通常不固定 → 浏览器不知道怎么分配 → `auto` 失效
  - 唯一例外：`absolute` 定位 + 四个方向都设值时可以垂直居中

- **追问2**：`transform: translate(-50%, -50%)` 的百分比相对于什么？
  - 相对于**元素自身**的宽高，不是父容器

- **追问3**：什么场景用 Flexbox？什么场景用 absolute？
  - Flexbox：容器内元素居中（导航栏、卡片内容）
  - absolute：弹窗/遮罩层居中（脱离文档流）

- **追问4**：`position: relative` 和 `absolute` 的文档流区别？
  - relative：仍然占据原位置（不脱离文档流）
  - absolute：不占据空间（脱离文档流）

---

### 我曾经的盲区

- ❌ 一开始只知道 `margin: auto` 和 `position`
- ⚠️ 场景1 选了 `absolute + transform`（能实现但不是最优，Flexbox 更好）
- ⚠️ 场景3 选了 `margin: auto`（垂直方向无效）
- ✅ 理解 `transform` 百分比相对于自身
- ✅ 理解 `relative` 不脱离文档流

---

## Q3：Flex 布局 ✅

### 3 分钟讲稿

**问题**：`flex: 1` 是哪三个属性的缩写？各是什么意思？

**我的回答**：

`flex: 1` 是缩写属性，完整展开：
```css
flex: 1;
/* 等价于 */
flex-grow: 1;      /* 放大比例 */
flex-shrink: 1;    /* 缩小比例 */
flex-basis: 0%;    /* 基准大小 */
```

---

### 三个属性详解

#### 1. `flex-grow`（放大比例）
控制当容器有**剩余空间**时，子元素按什么比例**分配剩余空间**。

**示例**：
```css
.container { width: 600px; }
.item1 { flex-grow: 1; width: 100px; }  /* 分 1 份 */
.item2 { flex-grow: 2; width: 100px; }  /* 分 2 份 */
```
- 已占：200px，剩余：400px
- item1 分：400 × (1/3) = 133.33px → 最终 233.33px
- item2 分：400 × (2/3) = 266.67px → 最终 366.67px

---

#### 2. `flex-shrink`（缩小比例）
控制当容器**空间不足**时，子元素按什么比例**收缩**。

**示例**：
```css
.container { width: 400px; }
.item1 { flex-shrink: 1; width: 300px; }
.item2 { flex-shrink: 2; width: 300px; }
```
- 需收缩：200px
- item1 收缩：200 × (1/3) = 66.67px → 最终 233.33px
- item2 收缩：200 × (2/3) = 133.33px → 最终 166.67px

---

#### 3. `flex-basis`（基准大小）
子元素在**分配剩余/收缩空间之前**的初始大小。

**优先级**：`flex-basis` > `width`

**特殊值**：
- `flex-basis: 0` → 从 0 开始，完全按 flex-grow 分配（忽略 width）
- `flex-basis: auto` → 使用 width/height 或内容宽度

---

### 为什么 `flex: 1` 能平分空间？

因为 `flex-basis: 0%` 让所有子元素从 0 开始，**忽略原本的 width**，容器的全部空间都成为"剩余空间"，完全按 `flex-grow` 比例分配。

**示例**：
```css
.container { width: 900px; }
.item1 { flex: 1; width: 100px; }
.item2 { flex: 1; width: 200px; }
.item3 { flex: 1; width: 300px; }
/* width 全部忽略，每个分到 900 ÷ 3 = 300px */
```

---

### 常见缩写值对比

| 缩写 | 展开 | 基准大小 | 分配方式 | 适用场景 |
|------|------|---------|---------|---------|
| `flex: 1` | `1 1 0%` | 0 | 完全平分容器空间 | 导航栏、表格列 |
| `flex: auto` | `1 1 auto` | content/width | 基于内容 + 分配剩余 | 弹性卡片 |
| `flex: none` | `0 0 auto` | content/width | 固定大小，不伸缩 | 固定列 |
| `flex: 2` | `2 1 0%` | 0 | 分 2 份空间 | 不等比分配 |

---

### `flex: 1` vs `flex: auto` 实例

#### `flex: 1`（强制平分）
```css
.container { width: 900px; }
.item1 { flex: 1; width: 100px; }
.item2 { flex: 1; width: 200px; }
.item3 { flex: 1; width: 300px; }
```
**结果**：300px, 300px, 300px（完全平分，忽略 width）

---

#### `flex: auto`（内容优先）
```css
.container { width: 900px; }
.item1 { flex: auto; width: 100px; }
.item2 { flex: auto; width: 200px; }
.item3 { flex: auto; width: 300px; }
```
**计算**：
1. 基准：100 + 200 + 300 = 600px
2. 剩余：900 - 600 = 300px
3. 分配：每个 100px（1:1:1）
4. **结果**：200px, 300px, 400px

---

### 计算公式

```
最终宽度 = flex-basis（或 width）+ (剩余空间 × flex-grow 比例)
```

---

### 可能的追问及回答

- **追问1**：`flex-basis: 0` 和 `flex-basis: auto` 的区别？
  - `0`：从 0 开始，忽略 width，完全按 grow 分配
  - `auto`：使用 width 或内容宽度作为基准，再分配剩余空间

- **追问2**：`flex: 1` 为什么比 `width: 33.33%` 更好？
  - `flex: 1` 自动适应容器变化，代码更简洁
  - 百分比需要手动计算，且不能灵活调整比例

- **追问3**：`flex-shrink` 什么时候生效？
  - 当子元素总宽度 > 容器宽度时生效（空间不足）
  - 设为 0 可以防止元素被压缩

---

### 我曾经的盲区

- ❌ 一开始完全不知道 `flex: 1` 是什么
- ✅ 理解三个属性后能正确计算（`flex: 1` 平分、`flex: auto` 基于内容）
- ✅ 发现老师计算错误并主动质疑（批判性思维）
- ✅ 能用总和验证答案合理性

---

## Q4：Grid vs Flex ✅

### 3 分钟讲稿

**问题**：Grid 和 Flex 各自擅长什么？在实际项目中怎么选择？

**我的回答**：

**核心区别**：
- **Flex**：一维布局系统，只控制主轴方向（水平或垂直）
- **Grid**：二维布局系统，同时控制行和列

---

### 选择标准（黄金法则）

| 判断维度 | 用 Flexbox | 用 Grid |
|---------|-----------|---------|
| **维度** | 只关心一个方向 | 需要同时控制行和列 |
| **元素数量** | 不确定，可能动态增减 | 固定或可预测 |
| **布局复杂度** | 简单线性排列 | 复杂网格、区域定位 |
| **对齐需求** | 主轴方向对齐即可 | 需要精确的行列对齐 |
| **响应式** | 靠 `flex-wrap` 换行 | 靠 `repeat(auto-fill)` 自动计算 |

---

### 典型场景

| 场景 | 选择 | 原因 |
|------|------|------|
| 导航栏（横向排列） | Flex | 一维（水平） |
| 整页布局（头/侧边栏/主/底） | Grid | 二维（行列） |
| 仪表板（3×4 网格） | Grid | 明确的行列结构 |
| 文章内容（纵向排列） | Flex | 一维（垂直） |
| 响应式卡片墙 | Grid | `repeat(auto-fill, minmax())` |

---

### 记忆口诀

- **Flex**："一条线上排排站"（导航栏、菜单、表单）
- **Grid**："棋盘上定位置"（整页布局、仪表板、相册网格）

---

### 可以混用吗？

**完全可以，而且应该混用！**

经典组合：
- Grid 定义页面骨架（头部、侧边栏、主内容）
- Flex 定义内部组件（导航栏、卡片内容）

---

### 🤖 AI 时代视角

**已被 AI 接管**：
- 写 Grid/Flex 代码：告诉 AI 需求，它秒出
- 语法细节：`repeat()`、`minmax()`、`fr` 单位的具体写法

**反而更值钱**：
- **场景判断**：5 个场景全选对了 —— 这是 AI 做不到的（它不知道你的业务场景）
- **布局调试**：AI 生成的 Grid 在某个屏幕尺寸下炸了，你能看出是 `minmax` 最小值设太大
- **混用设计**：判断"这个页面哪一层该 Grid、哪一层该 Flex"

**学习深度调整**：
- 不用死记语法：`grid-template-areas` 的写法忘了？让 AI 写
- 必须建立直觉：看到"导航栏"条件反射 Flex，看到"仪表板"条件反射 Grid
- 练判断而非打字：今天 5 道场景题就是练判断

---

### 我曾经的盲区

- ❌ 一开始完全不了解 Grid vs Flex 的区别
- ✅ 学习后 5 个场景全选对（导航栏 Flex、仪表板 Grid、卡片墙 Grid）
- ✅ 理解一维 vs 二维的本质区别
- ✅ 理解可以混用（Grid 定骨架、Flex 定组件）

---

## Q5：BFC ✅

### 3 分钟讲稿

**问题**：BFC 是什么？能解决什么问题？

**我的回答**：

**BFC（Block Formatting Context，块级格式化上下文）是一个独立的渲染区域，内部元素的布局不会影响外部，外部元素也不会影响内部。**

通俗理解：给元素加一个"隔离罩"，里面的布局规则独立运作。

---

### BFC 能解决的 4 个问题

#### 1. 高度塌陷（浮动元素撑不开父元素）

**问题**：
```html
<div class="container">
  <div class="float-child" style="float: left;">浮动子元素</div>
</div>
```
父元素高度为 0，边框包不住浮动子元素。

**解决**：
```css
.container {
  overflow: hidden;       /* 触发 BFC */
  /* 或 */
  display: flow-root;     /* 现代推荐 */
}
```

---

#### 2. margin 重叠（相邻元素的 margin 合并）

**问题**：
```html
<div style="margin-bottom: 30px;">Box 1</div>
<div style="margin-top: 20px;">Box 2</div>
```
间距只有 30px（取较大值），不是 50px。

**解决**：给其中一个元素（或它的容器）创建 BFC。

---

#### 3. 被浮动元素覆盖（两栏布局）

**问题**：
```html
<div class="sidebar" style="float: left; width: 200px;">侧边栏</div>
<div class="main">主内容区</div>
```
主内容区的文字环绕了侧边栏。

**解决**：
```css
.main {
  overflow: hidden;  /* 给主内容区触发 BFC */
}
```

---

#### 4. margin 穿透（子元素的 margin 穿透到父元素外）

**问题**：
```html
<div class="parent">
  <div class="child" style="margin-top: 50px;">子元素</div>
</div>
```
子元素的 `margin-top` 把父元素整体往下推了。

**解决**：
```css
.parent {
  overflow: hidden;       /* 触发 BFC */
  /* 或 */
  display: flow-root;
}
```

---

### 怎么触发 BFC？

| 方法 | 副作用 | 推荐度 |
|------|--------|--------|
| `overflow: hidden` | 会裁剪溢出内容 | ⭐⭐⭐⭐（最常用） |
| `display: flow-root` | 无副作用 | ⭐⭐⭐⭐⭐（现代首选） |
| `display: flex/grid` | 改变布局模式 | ⭐⭐⭐⭐（本身就是为了布局） |
| `float: left/right` | 元素浮动，脱离文档流 | ⭐（不推荐） |
| `position: absolute/fixed` | 绝对定位，脱离文档流 | ⭐（不推荐） |

---

### 记忆口诀

**"给受害者加 BFC"**
- 高度塌陷？父元素是受害者 → 给父元素加
- margin 重叠？两个都是受害者 → 给其中一个加
- 被浮动覆盖？被覆盖的是受害者 → 给被覆盖的加
- margin 穿透？父元素是受害者 → 给父元素加

---

### 🤖 AI 时代视角

**已被 AI 接管**：
- 写 BFC 代码：告诉 AI "清除浮动"，它会给你加 `overflow: hidden`
- 语法细节：`display: flow-root` 怎么写、兼容性如何

**反而更值钱**：
- **问题诊断**：看到"高度塌陷"、"文字环绕"、"margin 穿透"，你能立刻识别"这是 BFC 能解决的问题"
- **方案选择**：AI 可能给你 `overflow: hidden`，但你知道这会裁剪阴影，应该改用 `display: flow-root`
- **调试能力**：线上出现"卡片高度异常"，你 3 秒定位"浮动元素没清除"

**学习深度调整**：
- 不用死记规则：BFC 的 10 条规范不用背，记住"独立渲染区域"就够
- 必须建立场景库：看到 4 类问题条件反射想到 BFC
- 练诊断而非打字：今天 4 道题就是练诊断

---

### 我曾经的盲区

- ❌ 一开始不了解 BFC 是什么
- ⚠️ 场景 3（被浮动覆盖）选错了：给侧边栏加 BFC，应该给主内容区加
- ⚠️ 场景 4（margin 穿透）多此一举：说"包一层"，应该直接给父元素加
- ✅ 理解"给受害者加 BFC"的原则
- ✅ 理解 4 个核心应用场景

---

## Q4：Grid vs Flex

### 3 分钟讲稿

**问题**：什么场景用 Grid？什么场景用 Flex？

**我的回答**：

（待填写）

---

## Q5：BFC

### 3 分钟讲稿

**问题**：BFC 是什么？能解决什么问题？

**我的回答**：

（待填写）

---

## Q6：position 定位

### 3 分钟讲稿

**问题**：position 的 5 个值，`sticky` 的触发条件？

**我的回答**：

（待填写）

---

## Q7：层叠上下文

### 3 分钟讲稿

**问题**：z-index 为什么有时不生效？

**我的回答**：

（待填写）

---

## Q8：重排与重绘

### 3 分钟讲稿

**问题**：重排（reflow）和重绘（repaint）区别？怎么优化？

**我的回答**：

（待填写）

---

## Q9：移动端 1px 边框

### 3 分钟讲稿

**问题**：移动端 1px 边框问题的原因和解决方案？

**我的回答**：

（待填写）

---

## Q10：CSS 单位

### 3 分钟讲稿

**问题**：rem / em / vw / vh 区别？响应式方案怎么选？

**我的回答**：

（待填写）

---

## 复习总结

**已完成**：5/10（盒模型 ✅、居中方案 ✅、Flex 布局 ✅、Grid vs Flex ✅、BFC ✅）
**关键盲区**：（待总结）
**下次重点**：（待总结）
