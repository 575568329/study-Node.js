/**
 * 文章路由模块
 * 处理所有文章相关的API请求
 */

const express = require('express');
const router = express.Router();

// 模拟文章数据
const posts = [
    {
        id: 1,
        title: 'Node.js学习笔记 - Express框架',
        content: 'Express是一个简洁灵活的Node.js Web应用框架...',
        author: '张三',
        createdAt: '2026-03-15T10:00:00.000Z',
        views: 1234,
        tags: ['Node.js', 'Express', '后端']
    },
    {
        id: 2,
        title: 'JavaScript异步编程详解',
        content: 'Promise和async/await是处理异步操作的现代方式...',
        author: '李四',
        createdAt: '2026-03-14T15:30:00.000Z',
        views: 856,
        tags: ['JavaScript', '异步编程', 'Promise']
    },
    {
        id: 3,
        title: 'RESTful API设计最佳实践',
        content: 'RESTful API是一种软件架构风格...',
        author: '王五',
        createdAt: '2026-03-13T09:20:00.000Z',
        views: 2341,
        tags: ['API', 'RESTful', '设计']
    }
];

// ============================================
// 获取文章列表（支持分页和搜索）
// ============================================
router.get('/', (req, res) => {
    console.log('→ GET /posts');

    // 获取查询参数
    const { page = 1, pageSize = 10, keyword } = req.query;

    // 实际项目中应该：
    // 1. 从数据库查询
    // 2. 支持关键词搜索
    // 3. 支持标签过滤
    // 4. 分页处理

    res.json({
        success: true,
        data: {
            posts: posts,
            pagination: {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                total: posts.length,
                totalPages: Math.ceil(posts.length / pageSize)
            }
        }
    });
});

// ============================================
// 获取单个文章详情
// ============================================
router.get('/:id', (req, res) => {
    console.log(`→ GET /posts/${req.params.id}`);

    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({
            success: false,
            message: '文章不存在'
        });
    }

    // 实际项目中应该：
    // 1. 增加阅读量
    // 2. 查询文章详情
    // 3. 返回关联的评论

    res.json({
        success: true,
        data: {
            ...post,
            views: post.views + 1 // 阅读量+1
        }
    });
});

// ============================================
// 创建文章
// ============================================
router.post('/', (req, res) => {
    console.log('→ POST /posts');

    const { title, content, tags } = req.body;

    // 验证必填字段
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: '标题和内容不能为空'
        });
    }

    // 实际项目中应该：
    // 1. 验证用户身份
    // 2. 验证数据格式
    // 3. 保存到数据库
    // 4. 返回创建的文章

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        author: '当前用户',
        createdAt: new Date().toISOString(),
        views: 0,
        tags: tags || []
    };

    posts.push(newPost);

    res.status(201).json({
        success: true,
        message: '文章发布成功',
        data: newPost
    });
});

// ============================================
// 更新文章
// ============================================
router.put('/:id', (req, res) => {
    console.log(`→ PUT /posts/${req.params.id}`);

    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '文章不存在'
        });
    }

    const { title, content, tags } = req.body;

    // 实际项目中应该：
    // 1. 验证是否是作者
    // 2. 更新数据库
    // 3. 记录修改历史

    posts[postIndex] = {
        ...posts[postIndex],
        title: title || posts[postIndex].title,
        content: content || posts[postIndex].content,
        tags: tags || posts[postIndex].tags,
        updatedAt: new Date().toISOString()
    };

    res.json({
        success: true,
        message: '文章更新成功',
        data: posts[postIndex]
    });
});

// ============================================
// 删除文章
// ============================================
router.delete('/:id', (req, res) => {
    console.log(`→ DELETE /posts/${req.params.id}`);

    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: '文章不存在'
        });
    }

    // 实际项目中应该：
    // 1. 验证是否是作者或管理员
    // 2. 软删除（标记为已删除）
    // 3. 同时删除相关评论

    posts.splice(postIndex, 1);

    res.json({
        success: true,
        message: '文章删除成功'
    });
});

// ============================================
// 获取文章的评论
// ============================================
router.get('/:id/comments', (req, res) => {
    console.log(`→ GET /posts/${req.params.id}/comments`);

    // 实际项目中应该：
    // 1. 查询这个文章的所有评论
    // 2. 支持分页

    res.json({
        success: true,
        data: {
            comments: [
                { id: 1, content: '很好的文章！', author: '小明', createdAt: '2026-03-15T12:00:00.000Z' },
                { id: 2, content: '学到了很多', author: '小红', createdAt: '2026-03-15T13:30:00.000Z' }
            ],
            total: 2
        }
    });
});

// 导出路由模块
module.exports = router;
