/**
 * Express 模块化路由示例 - 博客系统后端
 * 演示如何使用express.Router()组织大型项目
 */

const express = require('express');
const app = express();

// ============================================
// 0. 基础中间件配置
// ============================================

// 解析JSON请求体
app.use(express.json());

// 解析URL编码的请求体（表单数据）
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`\n${req.method} ${req.url}`);
    next();
});

// ============================================
// 1. 模块化路由 - 核心优势展示
// ============================================

// ✅ 方式1：传统方式（所有路由写在一个文件）- 不推荐
// 如果你有90+个路由，app.js会有几千行代码！
/*
app.post('/api/users/register', ...);
app.post('/api/users/login', ...);
app.get('/api/users/profile', ...);
app.post('/api/posts', ...);
app.get('/api/posts', ...);
... (90+个路由)
*/

// ✅ 方式2：模块化路由（推荐）
// 每个路由模块都是独立的文件，清晰、易维护！

// 导入路由模块
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const adminRouter = require('./routes/admin');

// 挂载路由模块
// app.use('URL前缀', 路由模块)
app.use('/api/users', usersRouter);      // 用户路由
app.use('/api/posts', postsRouter);      // 文章路由
app.use('/admin', adminRouter);          // 后台管理路由

console.log('\n✅ 路由模块加载完成:');
console.log('   /api/users/*   → routes/users.js');
console.log('   /api/posts/*   → routes/posts.js');
console.log('   /admin/*       → routes/admin.js');

// ============================================
// 2. 模块化路由的优势
// ============================================

/*
✅ 优势1：代码清晰
   - 每个文件只关注一个领域的路由
   - 主文件（app.js）只有几十行，一目了然

✅ 优势2：易于维护
   - 修改用户功能，只打开users.js
   - 不用在几千行代码中找半天

✅ 优势3：团队协作
   - 张三负责users.js
   - 李四负责posts.js
   - 王五负责admin.js
   - 几乎不会冲突！

✅ 优势4：代码复用
   - 可以在多个项目中复用同一个路由模块
   - 例如：users模块可以在博客、电商、论坛中使用

✅ 优势5：易于测试
   - 每个路由模块可以单独测试
   - 不用启动整个项目

✅ 优势6：权限控制
   - 可以为每个路由模块单独添加权限验证
   - 例如：admin路由自动检查管理员权限
*/

// ============================================
// 3. API文档路由（示例）
// ============================================

app.get('/', (req, res) => {
    res.json({
        message: '欢迎使用博客系统API',
        version: '1.0.0',
        endpoints: {
            users: {
                base: '/api/users',
                routes: [
                    'POST   /api/users/register     - 用户注册',
                    'POST   /api/users/login        - 用户登录',
                    'GET    /api/users/profile      - 获取个人资料',
                    'PUT    /api/users/profile      - 更新个人资料',
                    'GET    /api/users               - 获取用户列表',
                    'DELETE /api/users/:id           - 删除用户'
                ]
            },
            posts: {
                base: '/api/posts',
                routes: [
                    'GET    /api/posts               - 获取文章列表',
                    'GET    /api/posts/:id           - 获取文章详情',
                    'POST   /api/posts               - 创建文章',
                    'PUT    /api/posts/:id           - 更新文章',
                    'DELETE /api/posts/:id           - 删除文章',
                    'GET    /api/posts/:id/comments  - 获取文章评论'
                ]
            },
            admin: {
                base: '/admin',
                routes: [
                    'GET    /admin/stats             - 系统统计',
                    'GET    /admin/users             - 用户管理',
                    'PUT    /admin/users/:id/status  - 封禁/解封用户',
                    'GET    /admin/posts             - 文章管理',
                    'PUT    /admin/posts/:id/review  - 审核文章',
                    'GET    /admin/logs              - 系统日志',
                    'GET    /admin/settings          - 系统设置',
                    'PUT    /admin/settings          - 更新设置'
                ]
            }
        },
        documentation: 'https://github.com/your-repo/wiki'
    });
});

// ============================================
// 4. 404处理
// ============================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API接口不存在',
        path: req.url,
        method: req.method
    });
});

// ============================================
// 5. 错误处理中间件（后面会详细讲）
// ============================================

app.use((err, req, res, next) => {
    console.error('错误:', err.stack);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// 6. 启动服务器
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(70));
    console.log(`🚀 博客系统API服务器运行在 http://localhost:${PORT}`);
    console.log('='.repeat(70));
    console.log('\n📖 模块化路由示例');
    console.log('━'.repeat(70));
    console.log('\n✨ 核心优势:');
    console.log('   1. 代码分离：每个模块独立文件');
    console.log('   2. 易于维护：修改功能只需打开对应文件');
    console.log('   3. 团队协作：多人开发不冲突');
    console.log('   4. 代码复用：路由模块可在多项目使用');
    console.log('\n📁 项目结构:');
    console.log('   app.js              - 主文件（组装路由）');
    console.log('   routes/');
    console.log('   ├── users.js        - 用户路由（6个接口）');
    console.log('   ├── posts.js        - 文章路由（6个接口）');
    console.log('   └── admin.js        - 后台管理（8个接口）');
    console.log('\n💡 测试示例:');
    console.log(`   curl http://localhost:${PORT}/`);
    console.log(`   curl http://localhost:${PORT}/api/users/profile`);
    console.log(`   curl http://localhost:${PORT}/api/posts`);
    console.log(`   curl http://localhost:${PORT}/admin/stats`);
    console.log('='.repeat(70) + '\n');
});
