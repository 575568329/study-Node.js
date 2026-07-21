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

**已完成**：3/10（盒模型 ✅、居中方案 ✅、Flex 布局 ✅）
**关键盲区**：（待总结）
**下次重点**：（待总结）
