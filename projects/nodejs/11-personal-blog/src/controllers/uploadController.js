const fs = require('fs');
const path = require('path');

/**
 * 上传用户头像
 * POST /api/upload/avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    // 检查是否有文件
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    // 返回文件信息
    res.status(200).json({
      success: true,
      message: '头像上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/avatars/${req.file.filename}`  // 返回可访问的URL
      }
    });

  } catch (error) {
    // 如果出错，删除已上传的文件
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: '头像上传失败',
      error: error.message
    });
  }
};

/**
 * 上传文章封面图
 * POST /api/upload/cover
 */
exports.uploadCover = async (req, res) => {
  try {
    // 检查是否有文件
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的文件'
      });
    }

    // 返回文件信息
    res.status(200).json({
      success: true,
      message: '封面图上传成功',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: `/uploads/covers/${req.file.filename}`  // 返回可访问的URL
      }
    });

  } catch (error) {
    // 如果出错，删除已上传的文件
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: '封面图上传失败',
      error: error.message
    });
  }
};

/**
 * 删除文件（辅助函数）
 * DELETE /api/upload/file/:filename
 */
exports.deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;

    // 安全检查：防止路径遍历攻击
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: '非法的文件名'
      });
    }

    // 尝试从avatars目录删除
    const avatarPath = path.join(__dirname, '../../uploads/avatars', filename);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
      return res.json({ success: true, message: '文件删除成功' });
    }

    // 尝试从covers目录删除
    const coverPath = path.join(__dirname, '../../uploads/covers', filename);
    if (fs.existsSync(coverPath)) {
      fs.unlinkSync(coverPath);
      return res.json({ success: true, message: '文件删除成功' });
    }

    res.status(404).json({
      success: false,
      message: '文件不存在'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: '文件删除失败',
      error: error.message
    });
  }
};
