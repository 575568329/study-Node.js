# Node.js 面试讲稿

**复习方法**：费曼学习法（合上资料自己讲 → 标红卡壳 → 补漏 → 产出讲稿）
**复习日期**：2026-07-24 启动
**状态**：进行中

---

## Q1：事件循环 ✅

（已完成，详见进度文档）

---

## Q2：模块化（CJS vs ESM）✅

（已完成，详见进度文档）

---

## Q3：Stream（流式处理）✅

### 3 分钟讲稿

**问题**：什么是 Stream？为什么要用 Stream？背压（backpressure）是什么？

**我的回答**：

**Stream 是分片处理数据的机制**，核心是"边读边处理"，不用等全部数据到齐。

**对比一次性读取**：
```js
// ❌ 一次性读取，内存峰值 = 文件大小
const data = fs.readFileSync('huge.mp4');  // 2GB 全塞进内存

// ✅ 流式读取，内存峰值 = 一个 chunk（默认 64KB）
fs.createReadStream('huge.mp4').pipe(res);
```

**核心价值**：
- **省内存**：不管文件多大，内存只占一个 chunk
- **低延迟**：第一片到了就能处理，不用等全部
- **可组合**：通过 pipe 串联多个处理步骤

---

### Stream 的 4 种类型

| 类型 | 作用 | 例子 |
|------|------|------|
| **Readable**（可读流） | 数据源 | `fs.createReadStream()`、HTTP 请求 |
| **Writable**（可写流） | 数据目的地 | `fs.createWriteStream()`、HTTP 响应 |
| **Duplex**（双工流） | 可读可写（两个独立通道） | TCP socket |
| **Transform**（转换流） | 可读可写 + 转换数据 | `zlib.createGzip()`（压缩） |

**记忆技巧**：
- Readable = 水源（只出水）
- Writable = 水池（只进水）
- Duplex = 双向管道（进出独立，如电话）
- Transform = 净水器（进水→过滤→出水，边流边变）

**Duplex vs Transform**（高频追问）：
- Duplex：读和写是两个独立通道（读的数据 ≠ 写的数据）
- Transform：读和写是同一份数据的转换（输入→处理→输出）

---

### 背压（backpressure）

**背压 = 生产速度 > 消费速度，导致数据堆积**

**经典场景**：读快（100MB/s）写慢（10MB/s），差值堆积在内存缓冲区 → 内存暴涨 → 崩溃。

**处理机制**：
```js
const canContinue = writeStream.write(chunk);
if (!canContinue) {
  readStream.pause();  // 缓冲区满，暂停读取
  writeStream.once('drain', () => {
    readStream.resume();  // 缓冲区排空，恢复读取
  });
}
```

**核心**：`write()` 返回 `false` → 暂停读取；`drain` 事件 → 恢复读取。这就是"流量控制"。

---

### pipe() vs pipeline()

**`pipe()`**：自动处理背压 + 简洁 + 链式
```js
readStream.pipe(writeStream);  // 自动 pause/resume/end
```

**`pipeline()`**（现代推荐）：
```js
const { pipeline } = require('stream');
pipeline(
  fs.createReadStream('input.txt'),
  zlib.createGzip(),
  fs.createWriteStream('output.txt.gz'),
  (err) => { if (err) console.error('失败', err); }
);
```

**为什么 pipeline 更好**：
1. 出错时**自动销毁所有流**（pipe 不会，可能内存泄漏）
2. **统一错误回调**（不用每个流都加 `on('error')`）
3. 同样自动处理背压

---

### 可能的追问及回答

- **追问1**：Stream 有哪 4 种类型？
  - Readable / Writable / Duplex / Transform

- **追问2**：什么时候会出现背压？怎么处理？
  - 生产快于消费时。用 pause/resume 控制流量（pipe/pipeline 自动处理）

- **追问3**：`pipe()` 最关键的优势是什么？
  - **自动处理背压**（不只是代码简洁），防止内存爆炸

---

### 我曾经的盲区

- ✅ 核心理解正确（分片处理、避免内存溢出）
- ⚠️ 一开始说"没拿到足够内容导致溢出"，其实是"主动只拿一小片"（分片 + 边读边处理）
- ⚠️ 4 种 Stream 类型忘了（Readable/Writable/Duplex/Transform）
- ⚠️ `pipe()` 优势漏了最关键的"自动处理背压"，只说了"简洁+链式"

---

## 复习总结

**已完成**：3/?（事件循环 ✅、模块化 ✅、Stream ✅）
**关键盲区**：（待总结）
**下次重点**：（待总结）
