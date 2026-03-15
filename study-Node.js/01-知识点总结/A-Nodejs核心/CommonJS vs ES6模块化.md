---
tags:
  - 概念
  - 重要
  - 高频
创建时间: 2025-03-15
状态: 已掌握
置信度: High
---

# CommonJS vs ES6模块化

## 📝 定义

**CommonJS**: Node.js默认的模块系统，使用`require()`和`module.exports`
**ES6模块**: 现代JavaScript标准，使用`import`和`export`

## 🎯 核心区别

### 1. 加载时机

| 特性 | CommonJS | ES6模块 |
|------|----------|---------|
| 加载时机 | **运行时加载**（同步） | **编译时加载**（异步） |
| 是否阻塞 | 阻塞主线程 | 不阻塞主线程 |
| 放置位置 | 任意位置 | 必须在文件顶部 |

### 2. 值的本质

**CommonJS - 值拷贝**:
```javascript
// counter.js
let count = 0;
module.exports = {
  count,
  increment: () => count++
};

// main.js
const counter = require('./counter.js');
console.log(counter.count);  // 0
counter.increment();
console.log(counter.count);  // 0 ← 还是0（拷贝的值）
```

**ES6模块 - 值引用**:
```javascript
// counter.js
export let count = 0;
export const increment = () => count++;

// main.js
import { count, increment } from './counter.js';
console.log(count);  // 0
increment();
console.log(count);  // 1 ← 变成1了（动态引用）
```

### 3. Tree-shaking

**CommonJS**: ❌ 不支持（运行时加载，无法静态分析）
**ES6模块**: ✅ 支持（编译时加载，可以删除未使用的代码）

## 💻 代码示例

### CommonJS用法

```javascript
// 导出
// utils.js
const add = (a, b) => a + b;
module.exports = { add };

// 或者
exports.add = add;

// 导入
// main.js
const { add } = require('./utils.js');
console.log(add(1, 2));  // 3
```

### ES6模块用法

```javascript
// 导出
// utils.js
export const add = (a, b) => a + b;
export default { add };

// 导入
// main.js
import { add } from './utils.js';
import utils from './utils.js';
```

## 🔍 如何在Node.js中启用ES6模块

### 方法1: 使用.mjs扩展名

```javascript
// utils.mjs
export const add = (a, b) => a + b;

// main.mjs
import { add } from './utils.mjs';  // 必须加扩展名
```

### 方法2: package.json设置type: "module"

```json
{
  "type": "module"
}
```

```javascript
// utils.js - 现在是ES6模块
export const add = (a, b) => a + b;

// main.js - ES6模块
import { add } from './utils.js';  // 必须加扩展名
```

### 模块混用

```json
{
  "type": "module"  // 默认ES6
}
```

- `.js` → ES6模块
- `.cjs` → 强制CommonJS
- `.mjs` → 强制ES6模块

## ⚠️ 注意事项

1. **ES6模块导入必须加扩展名**:
   ```javascript
   // ❌ 错误
   import { add } from './utils';

   // ✅ 正确
   import { add } from './utils.js';
   ```

2. **不能混用语法**:
   ```javascript
   // ❌ 错误
   import { add } from './utils.js';
   const fs = require('fs');  // 不能在ES6模块里用require
   ```

3. **动态导入**（ES2020）:
   ```javascript
   // 可以在CommonJS中动态导入ES6模块
   import('./utils.cjs').then(module => {
     console.log(module.add(1, 2));
   });
   ```

## 🔗 关联概念

- [[npm包管理]] - dependencies vs devDependencies
- [[模块加载机制]] - require()的内部机制
- [[Event Loop]] - 模块加载与Event Loop的关系
- [[package.json详解]] - type字段设置

## 🆚 前后端对比

| 前端 | 后端Node.js | 说明 |
|------|------------|------|
| `import` | `require()` | 不同模块系统 |
| webpack自动处理 | 需要配置type | 启用ES6模块的方式 |
| .js就是ES6 | 可能是CommonJS | 取决于package.json |

## ❓ 理解检查

### 问题1: 为什么ES6模块支持Tree-shaking？
**答案**: ES6模块是编译时加载，打包工具可以静态分析哪些导出被使用了，哪些没用到，从而删除未使用的代码。

### 问题2: 如果你修改了ES6模块导出的对象属性，另一个模块能看到吗？
**答案**: 能！因为ES6模块导出的是引用，不是值的拷贝。

### 问题3: `"type": "module"`和`"type": "commonjs"`可以混用吗？
**答案**: 可以！通过文件扩展名区分（.js, .cjs, .mjs）。

## 📚 参考资料

- [Node.js ES Modules](https://nodejs.org/api/esm.html)
- [MDN - export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)
- 课程视频: P074-P080

---

## 💡 学习笔记

**关键理解**:
1. CommonJS运行时加载（同步），ES6模块编译时加载（异步）
2. CommonJS值拷贝，ES6模块值引用
3. Tree-shaking只支持ES6模块
4. 生产环境优先使用ES6模块，老项目可以用CommonJS

**实际应用**:
- 新项目 → 使用ES6模块（type: "module"）
- 老项目 → 可以继续使用CommonJS
- 库开发 → 考虑发布两个版本（CommonJS + ES6）
