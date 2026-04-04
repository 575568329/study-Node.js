# CSS Modules 与 Tailwind CSS

> 学习日期: 2026-04-04 | 置信度: 高

---

## CSS Modules

解决样式冲突。编译后类名变成唯一 hash，不会和其他组件冲突。

### 语法

```
文件命名：组件名.module.css
导入：import styles from './Button.module.css'
使用：className={styles.btn}
```

```css
/* Button.module.css */
.btn { padding: 8px 16px; }
.primary { background: blue; color: white; }
```

```tsx
import styles from './Button.module.css'
<button className={styles.btn}>按钮</button>
```

Vue3 等价：`<style scoped>` 一行搞定。

## Tailwind CSS

不写 CSS 文件，用工具类直接写在 className 里。

### 语法

```
安装：npm install tailwindcss
使用：className="bg-blue-500 text-white px-4 py-2 rounded"
```

### 命名规律

```
功能-方向-大小/颜色
px-4     → padding 水平 4
py-2     → padding 垂直 2
bg-blue-500 → background blue 500
text-lg  → text large
```

方向：x(水平) y(垂直) t(上) b(下) l(左) r(右)
大小：数字越大越强
颜色：数字越大越深

### 两个方案能同时用

Tailwind 处理大部分样式，CSS Modules 处理复杂自定义样式。

## 对比

| | CSS Modules | Tailwind |
|---|---|---|
| 写在哪 | 单独 CSS 文件 | className 里 |
| 命名 | 自己取类名 | 不需要 |
| 样式冲突 | hash 解决 | 不存在 |
| 学习成本 | 低 | 中（记工具类） |

---

**标签**: #React #样式 #Tailwind #已掌握
