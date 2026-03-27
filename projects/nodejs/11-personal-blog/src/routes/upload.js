const express = require('express');
const router = express.Router();
const { uploadAvatar, uploadCover } = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');

/**
 * 上传用户头像
 * POST /api/upload/avatar
 * Content-Type: multipart/form-data
 * Body: file (binary)
 */
router.post('/avatar', uploadAvatar.single('file'), uploadController.uploadAvatar);

/**
 * 上传文章封面图
 * POST /api/upload/cover
 * Content-Type: multipart/form-data
 * Body: file (binary)
 */
router.post('/cover', uploadCover.single('file'), uploadController.uploadCover);

/**
 * 删除文件
 * DELETE /api/upload/file/:filename
 */
router.delete('/file/:filename', uploadController.deleteFile);

module.exports = router;
