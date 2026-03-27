// Express + mysql2 示例
const cors = require('cors');
const express = require('express');
const mysql = require('mysql2/promise'); // 使用Promise版本
const dbConfig = require('./db.config');

const app = express();
app.use(cors());
const PORT = 3003;

// 中间件
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析表单数据

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
app.get('/test-connection', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功！');
    connection.release(); // 释放连接回池子
    res.json({
      success: true,
      message: '数据库连接成功'
    });
  } catch (err) {
    console.error('❌ 数据库连接失败：', err.message);
    res.status(500).json({
      success: false,
      message: '数据库连接失败',
      error: err.message
    });
  }
});

// 查询所有用户
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: err.message
    });
  }
});

// 根据ID查询用户
app.get('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '查询失败',
      error: err.message
    });
  }
});

// 创建用户（POST）
app.post('/api/users', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 参数验证
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名、邮箱和密码不能为空'
      });
    }
    
    // 参数化查询（防止SQL注入）
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    
    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: {
        id: result.insertId,
        username,
        email
      }
    });
  } catch (err) {
    // 处理重复键错误
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      });
    }
    
    res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: err.message
    });
  }
});

// 更新用户（PUT）
app.put('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    
    const [result] = await pool.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [username, email, password, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      message: '用户更新成功'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '更新失败',
      error: err.message
    });
  }
});

// 删除用户（DELETE）
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '删除失败',
      error: err.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 测试连接: http://localhost:${PORT}/test-connection`);
});
