const express = require('express');
const path = require('path');

const app = express();

// 静态资源中间件
app.use(express.static('public'));

// 根路径重定向到 index.html
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// 或者直接发送文件（更推荐）
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// 404 处理（放在最后）
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Express 静态资源服务器运行在 http://localhost:${PORT}`);
});
