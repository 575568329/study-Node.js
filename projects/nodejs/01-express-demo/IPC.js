const cluster = require('node:cluster')
const os = require('node:os')
const http = require('node:http')

if (cluster.isPrimary) {
  const cpus = os.availableParallelism()   // 拿 CPU 核数（Node 19+；旧版用 os.cpus().length）
  console.log(`主进程 ${process.pid} 启动，fork ${cpus} 个 worker`)

  for (let i = 0; i < cpus; i++) {
    cluster.fork()                          // 复制出一个子进程
  }

  // 子进程挂了自动补一个，保证核数不减
  cluster.on('exit', (worker) => {
    console.log(`worker ${worker.process.pid} 挂了，重启`)
    cluster.fork()
  })

} else {
  // 每个 worker 执行这段——注意它们也写了 listen(3000)
  http.createServer((req, res) => {
    res.end(`handled by pid ${process.pid}`)
  }).listen(3000)

  console.log(`worker ${process.pid} 就绪`)
}
