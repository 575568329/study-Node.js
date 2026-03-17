/**
 * 后台管理路由模块
 * 处理所有后台管理相关的API请求
 * 注意：这些路由通常需要管理员权限验证
 */

const express = require('express');
const router = express.Router();

// ============================================
// 中间件：模拟管理员权限验证
// ============================================
const checkAdmin = (req, res, next) => {
    console.log('→ 检查管理员权限...');

    // 实际项目中应该：
    // 1. 从token中获取用户信息
    // 2. 查询数据库判断是否是管理员
    // 3. 如果不是管理员，返回403错误

    // 这里为了演示，假设所有请求都有管理员权限
    next();
};

// 所有后台管理路由都先验证权限
router.use(checkAdmin);

// ============================================
// 获取系统统计数据
// ============================================
router.get('/stats', (req, res) => {
    console.log('→ GET /admin/stats');

    // 实际项目中应该从数据库聚合查询
    res.json({
        success: true,
        data: {
            users: {
                total: 1523,
                newToday: 15,
                growth: '+12%'
            },
            posts: {
                total: 3842,
                published: 3652,
                draft: 190
            },
            comments: {
                total: 12453,
                pending: 23,
                spam: 156
            },
            views: {
                total: 245678,
                today: 3421
            }
        }
    });
});

// ============================================
// 获取用户管理列表
// ============================================
router.get('/users', (req, res) => {
    console.log('→ GET /admin/users');

    const { page = 1, pageSize = 10, status } = req.query;

    // 实际项目中应该：
    // 1. 从数据库分页查询
    // 2. 支持状态过滤（正常/禁用）
    // 3. 支持搜索

    res.json({
        success: true,
        data: {
            users: [
                {
                    id: 1,
                    username: '张三',
                    email: 'zhangsan@example.com',
                    status: 'active',
                    postsCount: 25,
                    createdAt: '2026-01-15T10:30:00.000Z'
                },
                {
                    id: 2,
                    username: '李四',
                    email: 'lisi@example.com',
                    status: 'active',
                    postsCount: 18,
                    createdAt: '2026-02-20T14:20:00.000Z'
                }
            ],
            pagination: {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                total: 1523,
                totalPages: Math.ceil(1523 / pageSize)
            }
        }
    });
});

// ============================================
// 封禁/解封用户
// ============================================
router.put('/users/:id/status', (req, res) => {
    console.log(`→ PUT /admin/users/${req.params.id}/status`);

    const { status } = req.body; // 'active' | 'banned'

    // 实际项目中应该：
    // 1. 更新用户状态
    // 2. 记录操作日志
    // 3. 发送通知

    res.json({
        success: true,
        message: `用户状态已更新为: ${status}`
    });
});

// ============================================
// 获取文章管理列表
// ============================================
router.get('/posts', (req, res) => {
    console.log('→ GET /admin/posts');

    const { page = 1, pageSize = 10, status } = req.query;

    res.json({
        success: true,
        data: {
            posts: [
                {
                    id: 1,
                    title: 'Node.js学习笔记',
                    author: '张三',
                    status: 'published',
                    views: 1234,
                    createdAt: '2026-03-15T10:00:00.000Z'
                }
            ],
            pagination: {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                total: 3842,
                totalPages: Math.ceil(3842 / pageSize)
            }
        }
    });
});

// ============================================
// 审核待发布文章
// ============================================
router.put('/posts/:id/review', (req, res) => {
    console.log(`→ PUT /admin/posts/${req.params.id}/review`);

    const { action, reason } = req.body; // 'approve' | 'reject'

    // 实际项目中应该：
    // 1. 更新文章状态
    // 2. 发送通知给作者
    // 3. 记录审核日志

    res.json({
        success: true,
        message: `文章已${action === 'approve' ? '通过审核' : '拒绝'}`
    });
});

// ============================================
// 获取系统日志
// ============================================
router.get('/logs', (req, res) => {
    console.log('→ GET /admin/logs');

    const { type = 'all', page = 1 } = req.query;

    // 实际项目中应该：
    // 1. 从日志系统查询
    // 2. 支持类型过滤（登录/操作/错误）
    // 3. 支持时间范围查询

    res.json({
        success: true,
        data: {
            logs: [
                {
                    id: 1,
                    type: 'login',
                    user: '张三',
                    action: '用户登录',
                    ip: '192.168.1.100',
                    createdAt: '2026-03-16T10:30:00.000Z'
                },
                {
                    id: 2,
                    type: 'operation',
                    user: '李四',
                    action: '发布文章',
                    details: '发布了《JavaScript学习笔记》',
                    createdAt: '2026-03-16T10:25:00.000Z'
                }
            ],
            pagination: {
                page: parseInt(page),
                pageSize: 50,
                total: 2456
            }
        }
    });
});

// ============================================
// 系统设置
// ============================================
router.get('/settings', (req, res) => {
    console.log('→ GET /admin/settings');

    // 实际项目中应该从配置文件或数据库读取
    res.json({
        success: true,
        data: {
            siteName: '我的博客',
            siteDescription: '分享技术，记录成长',
            allowRegister: true,
            requireEmailVerify: false,
            maxPostPerDay: 10
        }
    });
});

router.put('/settings', (req, res) => {
    console.log('→ PUT /admin/settings');

    const settings = req.body;

    // 实际项目中应该：
    // 1. 验证配置
    // 2. 更新配置文件或数据库
    // 3. 重启相关服务

    res.json({
        success: true,
        message: '系统设置已更新',
        data: settings
    });
});

// 导出路由模块
module.exports = router;
