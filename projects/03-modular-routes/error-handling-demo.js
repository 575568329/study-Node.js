/**
 * Express 错误处理中间件完整示例
 * 演示如何优雅地处理各种错误
 */

const express = require('express');
const app = express();

// 解析JSON（用于测试POST请求）
app.use(express.json());

// ============================================
// 1. 演示：没有错误处理时会发生什么
// ============================================

app.get('/crash', (req, res) => {
    // 直接抛出错误，没有try-catch，也没有next(err)
    // 这会导致整个服务器崩溃！
    throw new Error('服务器崩溃了！');
});

// ============================================
// 2. 正确的错误处理方式
// ============================================

// 方式A：使用next(err)传递错误
app.get('/error-next', (req, res, next) => {
    const error = new Error('这是一个错误！');
    error.status = 400;  // 自定义状态码
    error.code = 'BAD_REQUEST';  // 自定义错误码
    next(error);  // 传递给错误处理中间件
});

// 方式B：使用try-catch（推荐用于异步代码）
app.get('/error-try-catch', async (req, res, next) => {
    try {
        // 模拟一个可能出错的异步操作
        const data = await Promise.reject(new Error('异步操作失败！'));
        res.json(data);
    } catch (error) {
        // 捕获错误后传递给错误处理中间件
        next(error);
    }
});

// ============================================
// 3. 实际业务场景的错误处理
// ============================================

// 场景A：用户不存在（404）
app.get('/users/:id', (req, res, next) => {
    const userId = parseInt(req.params.id);

    // 模拟数据库查询
    const users = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' }
    ];

    const user = users.find(u => u.id === userId);

    if (!user) {
        // 创建一个404错误
        const error = new Error(`用户ID ${userId} 不存在`);
        error.status = 404;  // 设置HTTP状态码
        return next(error);  // 传递给错误处理中间件
    }

    res.json({ success: true, data: user });
});

// 场景B：参数验证失败（400）
app.post('/users', (req, res, next) => {
    const { username, email } = req.body;

    // 验证必填字段
    if (!username || !email) {
        const error = new Error('用户名和邮箱不能为空');
        error.status = 400;
        return next(error);
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        const error = new Error('邮箱格式不正确');
        error.status = 400;
        return next(error);
    }

    // 模拟创建用户
    res.status(201).json({
        success: true,
        message: '用户创建成功',
        data: { id: Date.now(), username, email }
    });
});

// 场景C：权限不足（403）
app.get('/admin/dashboard', (req, res, next) => {
    // 模拟检查用户权限
    const userRole = req.query.role || 'user';

    if (userRole !== 'admin') {
        const error = new Error('需要管理员权限');
        error.status = 403;
        return next(error);
    }

    res.json({
        message: '欢迎进入后台管理系统',
        stats: { users: 1523, posts: 3842 }
    });
});

// ============================================
// 4. 自定义错误类（高级用法）
// ============================================

// 创建一个自定义错误类
class AppError extends Error {
    constructor(message, status = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'AppError';
    }
}

app.get('/custom-error', (req, res, next) => {
    // 使用自定义错误类
    const error = new AppError('自定义错误消息', 400, 'VALIDATION_ERROR');
    next(error);
});

// ============================================
// 5. 404处理（必须在所有路由之后）
// ============================================

app.use((req, res, next) => {
    // 如果执行到这里，说明前面的路由都没有匹配
    const error = new Error(`API接口不存在: ${req.method} ${req.url}`);
    error.status = 404;
    next(error);
});

// ============================================
// 6. 统一的错误处理中间件（必须放在最后）
// ============================================

app.use((err, req, res, next) => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  错误被捕获');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('错误信息:', err.message);
    console.log('状态码:', err.status || 500);
    console.log('请求URL:', req.url);
    console.log('请求方法:', req.method);

    // 设置默认状态码
    const status = err.status || 500;

    // 返回错误响应
    res.status(status).json({
        success: false,
        message: err.message,
        error: {
            code: err.code || 'INTERNAL_ERROR',
            status: status,
            // 开发环境返回完整错误栈，生产环境不返回
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        }
    });
});

// ============================================
// 启动服务器
// ============================================

const PORT = 3002;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(70));
    console.log(`🚀 错误处理示例服务器运行在 http://localhost:${PORT}`);
    console.log('='.repeat(70));
    console.log('\n📖 测试各种错误场景:');
    console.log('━'.repeat(70));
    console.log('1. 服务器崩溃（没有错误处理）:');
    console.log('   curl http://localhost:3002/crash');
    console.log('\n2. next()传递错误:');
    console.log('   curl http://localhost:3002/error-next');
    console.log('\n3. try-catch捕获异步错误:');
    console.log('   curl http://localhost:3002/error-try-catch');
    console.log('\n4. 资源不存在（404）:');
    console.log('   curl http://localhost:3002/users/999');
    console.log('\n5. 参数验证失败（400）:');
    console.log('   curl -X POST http://localhost:3002/users \\');
    console.log('     -H "Content-Type: application/json" \\');
    console.log('     -d \'{"username":"test"}\'');
    console.log('\n6. 权限不足（403）:');
    console.log('   curl http://localhost:3002/admin/dashboard?role=user');
    console.log('   curl http://localhost:3002/admin/dashboard?role=admin');
    console.log('\n7. API不存在（404）:');
    console.log('   curl http://localhost:3002/api/xxxxx');
    console.log('='.repeat(70) + '\n');
});

// ============================================
// 补充：未捕获异常的全局处理（防止进程崩溃）
// ============================================

process.on('uncaughtException', (err) => {
    console.error('❌ 未捕获的异常:', err);
    console.error('进程即将退出...');
    // 在生产环境中，这里应该做清理工作（关闭数据库连接等）
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ 未处理的Promise拒绝:', reason);
    // 不要退出进程，只是记录日志
});
