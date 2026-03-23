-- =============================================
-- 个人博客数据库设计
-- 数据库名: blog_db
-- =============================================

CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE blog_db;

-- =============================================
-- 1. 用户表 (users)
-- =============================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码(bcrypt加密)',
  email VARCHAR(100) NOT NULL UNIQUE COMMENT '邮箱',
  nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  avatar VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  bio TEXT DEFAULT NULL COMMENT '个人简介',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- =============================================
-- 2. 文章表 (posts)
-- =============================================
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL COMMENT '文章标题',
  content TEXT NOT NULL COMMENT '文章内容(Markdown)',
  cover_image VARCHAR(255) DEFAULT NULL COMMENT '封面图URL',
  author_id INT NOT NULL COMMENT '作者ID',
  view_count INT DEFAULT 0 COMMENT '浏览次数',
  status ENUM('draft', 'published') DEFAULT 'draft' COMMENT '状态: 草稿/已发布',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';

-- =============================================
-- 3. 评论表 (comments)
-- =============================================
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL COMMENT '文章ID',
  user_id INT NOT NULL COMMENT '评论者ID',
  content TEXT NOT NULL COMMENT '评论内容',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- =============================================
-- 4. 文件上传表 (uploads) - 可选
-- =============================================
CREATE TABLE uploads (
  id INT PRIMARY KEY AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL COMMENT '原始文件名',
  stored_name VARCHAR(255) NOT NULL COMMENT '存储文件名(带时间戳)',
  file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
  file_size INT NOT NULL COMMENT '文件大小(字节)',
  mime_type VARCHAR(100) NOT NULL COMMENT 'MIME类型',
  uploader_id INT NOT NULL COMMENT '上传者ID',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  FOREIGN KEY (uploader_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件上传表';

-- =============================================
-- 测试数据
-- =============================================
INSERT INTO users (username, password, email, nickname) VALUES
('test_user', '$2b$10$dummy_hash_for_testing', 'test@example.com', '测试用户');

-- =============================================
-- 索引优化
-- =============================================
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_uploads_uploader ON uploads(uploader_id);
