/**
 * 用户路由模块
 * 处理所有用户相关的API请求
 */

const express = require('express');
const router = express.Router();

// ============================================
// 用户注册
// ============================================
router.post('/register', (req, res) => {
    console.log('→ POST /users/register');

    // 模拟用户注册逻辑
    const { username, password, email } = req.body;

    // 实际项目中应该：
    // 1. 验证数据格式
    // 2. 检查用户名是否已存在
    // 3. 加密密码
    // 4. 保存到数据库
    // 5. 返回成功信息

    res.json({
        success: true,
        message: '用户注册成功',
        data: {
            username,
            email,
            id: Date.now(),
            createdAt: new Date().toISOString()
        }
    });
});

// ============================================
// 用户登录
// ============================================
router.post('/login', (req, res) => {
    console.log('→ POST /users/login');

    const { username, password } = req.body;

    // 实际项目中应该：
    // 1. 查询数据库验证用户名
    // 2. 验证密码（bcrypt对比）
    // 3. 生成JWT token
    // 4. 返回token

    res.json({
        success: true,
        message: '登录成功',
        data: {
            username,
            token: 'fake-jwt-token-' + Date.now()
        }
    });
});

// ============================================
// 获取用户资料
// ============================================
router.get('/profile', (req, res) => {
    console.log('→ GET /users/profile');

    // 实际项目中应该从token或session中获取用户ID
    res.json({
        success: true,
        data: {
            id: 1,
            username: '张三',
            email: 'zhangsan@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
            bio: '全栈开发工程师，热爱学习',
            createdAt: '2026-01-15T10:30:00.000Z'
        }
    });
});

// ============================================
// 更新用户资料
// ============================================
router.put('/profile', (req, res) => {
    console.log('→ PUT /users/profile');

    const { username, email, bio } = req.body;

    // 实际项目中应该：
    // 1. 验证数据格式
    // 2. 更新数据库
    // 3. 返回更新后的数据

    res.json({
        success: true,
        message: '资料更新成功',
        data: {
            id: 1,
            username: username || '张三',
            email: email || 'zhangsan@example.com',
            bio: bio || '全栈开发工程师',
            updatedAt: new Date().toISOString()
        }
    });
});

// ============================================
// 获取用户列表（管理员功能）
// ============================================
router.get('/', (req, res) => {
    console.log('→ GET /users');

    // 实际项目中应该：
    // 1. 验证管理员权限
    // 2. 分页查询数据库
    // 3. 返回用户列表

    res.json({
        success: true,
        data: {
            users: [
                { id: 1, username: '张三', email: 'zhangsan@example.com' },
                { id: 2, username: '李四', email: 'lisi@example.com' },
                { id: 3, username: '王五', email: 'wangwu@example.com' }
            ],
            total: 3,
            page: 1,
            pageSize: 10
        }
    });
});

// ============================================
// 删除用户（管理员功能）
// ============================================
router.delete('/:id', (req, res) => {
    console.log(`→ DELETE /users/${req.params.id}`);

    const userId = req.params.id;

    // 实际项目中应该：
    // 1. 验证管理员权限
    // 2. 检查用户是否存在
    // 3. 软删除或硬删除
    // 4. 返回结果

    res.json({
        success: true,
        message: `用户ID ${userId} 已删除`
    });
});

// 导出路由模块
module.exports = router;
