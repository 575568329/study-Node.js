/**
 * 演示：没有错误处理时会发生什么
 */

const express = require('express');
const app = express();

// 一个会出错的路由
app.get('/error', (req, res) => {
    console.log('访问 /error 路由');

    // 模拟一个错误
    throw new Error('这是一个测试错误！');

    // 这行代码永远执行不到
    res.json({ message: '成功' });
});

// 一个正常的路由
app.get('/ok', (req, res) => {
    res.json({ message: '正常响应' });
});

// 注意：这里没有错误处理中间件！

app.listen(3001, () => {
    console.log('测试服务器运行在 http://localhost:3001');
    console.log('尝试访问：');
    console.log('  - http://localhost:3001/error   (会出错)');
    console.log('  - http://localhost:3001/ok      (正常)');
});
