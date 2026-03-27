// =============================================
// 文章控制器 - 文章管理
// =============================================
const { where } = require('sequelize');
const { Post, User } = require('../models/index');

/**
 * 获取文章列表（分页）
 * GET /api/posts
 * Query: ?page=1&pageSize=10
 */
const getPosts = async (req, res, next) => {
  try {
    // TODO 1: 获取分页参数
    // 提示: req.query.page, req.query.pageSize
    // 提示: 设置默认值 page=1, pageSize=10
    const { page = 1, pageSize = 10 } = req.query;

    // TODO 2: 计算偏移量
    // 提示: offset = (page - 1) * pageSize
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    // TODO 3: 查询文章列表（联表查询作者信息）
    // 提示: SELECT p.*, u.username, u.nickname, u.avatar
    //       FROM posts p
    //       LEFT JOIN users u ON p.author_id = u.id
    //       WHERE p.status = 'published'
    //       ORDER BY p.created_at DESC
    //       LIMIT ? OFFSET ?
    //
    // 注意：只返回已发布的文章
    const {rows, count} = await Post.findAndCountAll({
      where:{status:'published'},
      order: [['created_at', 'DESC']],
      limit: parseInt(pageSize),
      offset: offset,
      include:[
        {
          model: User,
          as: 'author',
          attributes: ['username', 'nickname', 'avatar']
        }
      ],
      
    })

    
    // TODO 4: 查询总文章数
    // 提示: SELECT COUNT(*) as total FROM posts WHERE status = 'published'
    const totalPages = Math.ceil(count / parseInt(pageSize));
    // TODO 5: 返回文章列表和分页信息
    res.json({
      success: true,
      data: {
        list: rows, // ✅ 填充文章列表
        pagination: {
          page: parseInt(page), // TODO: 当前页
          pageSize: parseInt(pageSize), // TODO: 每页数量
          total: count, // TODO: 总文章数
          totalPages: totalPages // TODO: 总页数 = Math.ceil(total / pageSize)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取文章详情
 * GET /api/posts/:id
 */
const getPostById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // TODO 1: 查询文章详情（联表查询作者信息）
    // 提示: SELECT p.*, u.username, u.nickname, u.avatar
    //       FROM posts p
    //       LEFT JOIN users u ON p.author_id = u.id
    //       WHERE p.id = ?
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'nickname', 'avatar']
        }
      ]
    })
    // TODO 2: 检查文章是否存在
    // 提示: if (posts.length === 0) return 404
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      })
    }

    // TODO 3: 增加浏览次数
    // 提示: UPDATE posts SET view_count = view_count + 1 WHERE id = ?
    await post.increment('viewCount')

    // TODO 4: 返回文章详情
    res.json({
      success: true,
      data: post.toJSON()
       // TODO: 填充文章数据
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 发表文章
 * POST /api/posts
 * Body: { title, content, coverImage?, status? }
 * 需要JWT认证
 */
const createPost = async (req, res, next) => {
  try {
    const { title, content, coverImage, status = 'draft' } = req.body;
    const authorId = req.user.user_id; // 从JWT中间件获取

    // TODO 1: 参数验证
    // 提示: 检查title和content是否为空
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '标题和内容不能为空'
      });
    }

    // TODO 2: 插入文章
    // 提示: INSERT INTO posts (title, content, cover_image, author_id, status)
    //       VALUES (?, ?, ?, ?, ?)
    const newPost  = await Post.create({
      title,
      content,
      coverImage,
      authorId,
      status,
    }
  )

    // TODO 3: 返回创建的文章
    res.status(201).json({
      success: true,
      message: '文章发表成功',
      data: {
        id: newPost.id, // ✅ 返回新插入的文章ID
        title,
        content
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 编辑文章
 * PUT /api/posts/:id
 * Body: { title?, content?, coverImage?, status? }
 * 需要JWT认证
 */
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, coverImage, status } = req.body;
    const authorId = req.user.user_id; // 从JWT中间件获取

    // TODO 1: 检查文章是否存在
    // 提示: SELECT * FROM posts WHERE id = ?
    const post = await Post.findOne({
      where: { id }
    })

    if (!post) {
      return res.status(404).json({
        success: false,
        message: '文章不存在'
      });
    }

    // TODO 2: 验证是否是作者
    // 提示: if (post.author_id !== authorId) return 403
    if (post.authorId !== authorId) {
      return res.status(403).json({
        success: false,
        message: '无权限'
      });
    }

    // TODO 3: 构建更新SQL（只更新提供的字段）
    // 提示: 动态构建SET子句
    // 示例: UPDATE posts SET title = ?, content = ?, updated_at = NOW() WHERE id = ?

    // TODO 4: 执行更新
    await post.update(
      {
      title,
      content,
      coverImage,
      status,
      updatedAt: new Date()
    },
  )

    // TODO 5: 返回更新后的文章
    res.json({
      success: true,
      message: '文章更新成功',
      data: {
        id: id,
        title,
        content,
      } // TODO: 返回更新后的文章
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 删除文章
 * DELETE /api/posts/:id
 * 需要JWT认证
 */
const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorId = req.user.user_id; // 从JWT中间件获取

    // TODO 1: 检查文章是否存在
    // 提示: SELECT * FROM posts WHERE id = ?
    const post = await Post.findOne({
      where: { id }
    })

    // TODO 2: 验证是否是作者
    // 提示: if (post.author_id !== authorId) return 403
    if (post.authorId !== authorId) {
      return res.status(403).json({
        success: false,
        message: '无权限'
      });
    }

    // TODO 3: 删除文章
    // 提示: DELETE FROM posts WHERE id = ?
    await post.destroy()

    // TODO 4: 返回成功
    res.json({
      success: true,
      message: '文章删除成功'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
