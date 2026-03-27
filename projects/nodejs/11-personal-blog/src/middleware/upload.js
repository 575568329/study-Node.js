const multer = require('multer');
const path = require('path');

// 文件过滤器：只允许图片
const fileFilter = (req, file, cb) => {
  // 允许的MIME类型
  const allowedMimes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // 检查文件类型
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);  // 接受文件
  } else {
    cb(new Error('只允许上传图片文件（JPG、PNG、GIF、WEBP）'), false);  // 拒绝文件
  }
};

// 通用配置
const commonConfig = {
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024  // 限制文件大小为2MB
  }
};

// 创建不同用途的upload实例

// 1. 头像上传实例
const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: 'uploads/avatars/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'avatar-' + uniqueSuffix + ext);
    }
  }),
  ...commonConfig
});

// 2. 文章封面上传实例
const uploadCover = multer({
  storage: multer.diskStorage({
    destination: 'uploads/covers/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'cover-' + uniqueSuffix + ext);
    }
  }),
  ...commonConfig
});

// 3. 通用上传实例
const uploadAny = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, 'file-' + uniqueSuffix + ext);
    }
  }),
  ...commonConfig
});

module.exports = {
  uploadAvatar,
  uploadCover,
  uploadAny
};
