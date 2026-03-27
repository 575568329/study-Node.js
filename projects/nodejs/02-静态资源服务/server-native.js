/*
 * @Author: fjyu9 fjyu9@iflytek.com
 * @Date: 2026-03-26 16:40:05
 * @LastEditors: fjyu9 fjyu9@iflytek.com
 * @LastEditTime: 2026-03-26 17:25:44
 * @FilePath: \Node.js-Study\projects\02-静态资源服务\server-native.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// const http = require('http');
// const fs = require('fs');
// const path = require('path');
// const mimeTypes = {
//   '.html': 'text/html',
//   '.css': 'text/css',
//   '.js': 'application/javascript',
//   '.json': 'application/json',
//   '.png': 'image/png',
//   '.jpg': 'image/jpeg',
//   '.gif': 'image/gif',
//   '.svg': 'image/svg+xml',
//   '.ico': 'image/x-icon'
// };
// const server = http.createServer((req,res)=>{
//     console.log('收到请求:',req.url);
//     //处理跟路径
//     if(req.url === '/'){
//       req.url = '/index.html';
//     }
//     const filePath = path.join(__dirname,'public',req.url);
//     console.log('文件路径',filePath);
    
//     const ext = path.extname(filePath);
//     const contentType = mimeTypes[ext] || 'text/plain';
//     fs.readFile(filePath, (err,data)=>{ 
//       if(err){
//         //文件不存在
//         res.statusCode = 404;
//         res.end('404 Not Found');
//         return;
//       }else{
//         res.setHeader('Content-Type',contentType)
//         res.end(data);
//       }
//     })
// })

// server.listen(3000,()=>{
//     console.log('服务器启动成功，请访问 http://localhost:3000');
//     console.log('静态目录:public');
// })

const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use(express.static('public'))
//404页面
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

const PORT = 3000;
app.listen(PORT, () => { 
  console.log(`🚀 Express 静态资源服务器运行在 http://localhost:${PORT}`);
})