/**
 * 测试中间件执行顺序的脚本
 */

const express = require('express');
const app = express();

// 定义3个中间件
app.use((req, res, next) => {
  console.log('🔵 中间件1 - 开始');
  next();
  console.log('🔵 中间件1 - 结束');
});

app.use((req, res, next) => {
  console.log('🟢 中间件2 - 开始');
  next();
  console.log('🟢 中间件2 - 结束');
});

app.use((req, res, next) => {
  console.log('🟡 中间件3 - 开始');
  next();
  console.log('🟡 中间件3 - 结束');
});

// 路由
app.get('/test', (req, res) => {
  console.log('⭐ 路由处理');
  res.send('查看控制台输出');
});

app.listen(3001, () => {
  console.log('测试服务器运行在 http://localhost:3001/test');
  console.log('访问后查看控制台的输出顺序');
});
