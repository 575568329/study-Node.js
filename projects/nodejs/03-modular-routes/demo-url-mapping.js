/**
 * 演示 app.use() 的URL映射原理
 * 让你看到请求是如何从 app.js 流转到 router 的
 */

const express = require('express');
const app = express();

// ============================================
// 演示1：URL映射过程
// ============================================

// 原始请求：GET /api/users/profile

// 步骤1：app.use() 匹配前缀
app.use('/api/users', (req, res, next) => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📌 步骤1：app.use() 匹配前缀');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('原始URL:', req.url);
    console.log('前缀: /api/users');
    console.log('是否匹配:', req.url.startsWith('/api/users') ? '✅ YES' : '❌ NO');

    // 步骤2：剥离前缀
    const remainingPath = req.url.slice('/api/users'.length);
    console.log('\n📌 步骤2：剥离前缀');
    console.log('原始URL:', req.url);
    console.log('去掉前缀后:', remainingPath);
    console.log('这个剩余路径会传递给router处理');

    next();
});

// 现在用真实的路由器演示
const router = express.Router();

router.get('/profile', (req, res, next) => {
    console.log('\n📌 步骤3：router处理剩余路径');
    console.log('router收到的路径:', req.url);
    console.log('路由定义: router.get("/profile", ...)');
    console.log('是否匹配:', req.url === '/profile' ? '✅ YES - 执行回调!' : '❌ NO');

    res.json({
        message: '理解了！',
        flow: [
            '原始请求: GET /api/users/profile',
            'app.use匹配前缀: /api/users',
            '剥离前缀得到: /profile',
            'router处理剩余路径: /profile',
            '匹配成功，执行回调函数!'
        ]
    });
});

// 挂载路由器
app.use('/api/users', router);

// ============================================
// 演示2：多个前缀的匹配顺序
// ============================================

console.log('\n' + '='.repeat(60));
console.log('URL映射原理演示');
console.log('='.repeat(60));

console.log('\n📖 请访问: http://localhost:3000/api/users/profile');
console.log('查看控制台输出，理解完整的URL流转过程\n');

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ 演示服务器运行在 http://localhost:${PORT}\n`);
});
