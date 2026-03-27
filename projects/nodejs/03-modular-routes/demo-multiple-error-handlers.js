/**
 * 演示：多个错误处理中间件的执行顺序
 */

const express = require('express');
const app = express();

// 一个会出错的路由
app.get('/error', (req, res, next) => {
    const error = new Error('测试错误');
    error.status = 400;
    next(error);  // 传递错误
});

// ========================================
// 第一个错误处理中间件（日志记录）
// ========================================
app.use((err, req, res, next) => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 错误处理中间件 #1：日志记录');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('错误信息:', err.message);
    console.log('状态码:', err.status);
    console.log('时间:', new Date().toISOString());

    // 重要！继续传递给下一个错误处理中间件
    next(err);
});

// ========================================
// 第二个错误处理中间件（返回响应）
// ========================================
app.use((err, req, res, next) => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('💬 错误处理中间件 #2：返回响应');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('返回错误响应给客户端');

    res.status(err.status || 500).json({
        success: false,
        message: err.message,
        handled_by: '中间件#2'
    });
});

// ========================================
// 启动服务器
// ========================================
const PORT = 3003;
app.listen(PORT, () => {
    console.log(`\n✅ 演示服务器运行在 http://localhost:${PORT}`);
    console.log(`\n📖 测试URL: http://localhost:${PORT}/error`);
    console.log(`\n💡 观察控制台输出，理解多个错误处理中间件的执行顺序\n`);
});
