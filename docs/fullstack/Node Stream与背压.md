# Node Stream 与背压

更新时间：2026-05-11

## 学习目标

把 Node.js 中大文件处理、Stream 类型、背压、`pipe()` 和 `pipeline()` 的区别讲清楚，并能关联到文件上传、文档解析和 AI 流式输出场景。

## 大文件为什么不能直接 readFileSync

```js
const fs = require('fs')

const data = fs.readFileSync('./large-file.txt', 'utf-8')
console.log(data.length)
```

如果文件有 500MB，这种写法有两个核心问题：

- `readFileSync` 会阻塞事件循环，当前 Node.js 主线程无法继续处理其他请求或回调。
- 文件会一次性进入内存，后续如果转字符串、拼接、切片、JSON 序列化，实际内存占用可能远超文件本身，严重时会 OOM。

`OOM` 是 `Out Of Memory`，意思是进程内存耗尽，可能导致 Node 进程崩溃。

更合理的方式是用 Stream 分块处理：

```js
const fs = require('fs')

const stream = fs.createReadStream('./large-file.txt', {
  highWaterMark: 64 * 1024,
})

stream.on('data', (chunk) => {
  console.log(chunk.length)
})
```

默认情况下，`chunk` 是 `Buffer`。如果传入 `encoding: 'utf-8'`，`chunk` 才会是字符串。

## 背压是什么

背压指的是：上游读取速度快于下游写入速度，导致数据在内存缓冲区中不断堆积。

有隐患的写法：

```js
const fs = require('fs')

const readStream = fs.createReadStream('./big.txt')
const writeStream = fs.createWriteStream('./copy.txt')

readStream.on('data', (chunk) => {
  writeStream.write(chunk)
})
```

这段代码能复制文件，但没有处理 `write()` 的返回值。如果写入端来不及处理，缓冲区会持续堆积，内存压力会上升。

手动处理背压：

```js
readStream.on('data', (chunk) => {
  const canContinue = writeStream.write(chunk)
  if (!canContinue) {
    readStream.pause()
  }
})

writeStream.on('drain', () => {
  readStream.resume()
})
```

含义：

- `writeStream.write(chunk)` 返回 `true`：写入端还能继续接收数据。
- `writeStream.write(chunk)` 返回 `false`：写入缓冲区压力较大，上游应该暂停。
- `readStream.pause()`：暂停读取，避免继续产生数据。
- `drain`：写入端缓冲区被处理得差不多，可以继续接收数据。
- `readStream.resume()`：恢复读取。

## pipe 做了什么

```js
readStream.pipe(writeStream)
```

`pipe()` 不是只少写几行代码，它会自动处理背压：

```text
读取 chunk
  -> 写入目标流
  -> 如果 write() 返回 false，暂停读取
  -> 等 drain 后恢复读取
  -> 源流结束时，默认结束目标流
```

所以简单文件复制、HTTP 转发、流式传输中，优先使用 `pipe()` 比手写 `data` 事件更稳。

## pipeline 和 pipe 的区别

`pipeline()` 是后来新增的高层 API，Node.js v10.0.0 引入。它在 `pipe()` 的基础上，增强了整条流链路的错误处理和资源清理。

```js
const fs = require('fs')
const { pipeline } = require('stream')

pipeline(
  fs.createReadStream('./big.txt'),
  fs.createWriteStream('./copy.txt'),
  (err) => {
    if (err) {
      console.error('copy failed', err)
    } else {
      console.log('copy done')
    }
  }
)
```

可以这样区分：

- `pipe()`：负责连接流，内部处理背压。
- `pipeline()`：连接流 + 统一错误收口 + 更完整的资源清理。

生产代码中，多段流组合或需要可靠错误处理时，优先考虑 `pipeline()`。

## 四种 Stream

### Readable

只负责输出数据。

常见例子：

- 文件读取：`fs.createReadStream`
- HTTP 请求体

### Writable

只负责接收数据。

常见例子：

- 文件写入：`fs.createWriteStream`
- HTTP 响应体

### Duplex

既能读又能写，但读写两边通常是相对独立的通道。

常见例子：

- TCP socket
- 网络连接

### Transform

也是双向流，但输入和输出之间存在加工转换。

常见例子：

- 压缩
- 加密
- 文本转码
- 日志过滤

```js
const { Transform } = require('stream')

const upper = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase())
  },
})
```

`Duplex` 是能读能写，`Transform` 是能读能写且会改数据。

## 面试回答

如果面试官问 Node.js 怎么处理大文件，可以这样回答：

> 大文件不适合用 `readFileSync` 或一次性 `readFile` 读入内存，因为会阻塞事件循环或造成内存峰值过高，严重时可能 OOM。Node.js 更适合用 Stream 分块处理。读取流会按 chunk 产出数据，默认 chunk 是 Buffer。复制或转发时可以用 `pipe()`，它会自动处理背压。如果是生产代码，尤其是多段流组合，我会优先使用 `pipeline()`，因为它能统一处理错误和资源清理。

## 项目关联

RAG 项目中可以关联到：

- 文档上传后的文件读取。
- PDF / DOCX / XLSX 解析前的文件处理。
- SSE / AI 流式输出。
- 大文件上传时避免一次性占用过高内存。
- 后续可优化上传解析链路，把大文件处理改为更标准的流式设计。
