/**
 * Express 静态资源服务示例
 * 演示如何托管静态文件（HTML、CSS、JS、图片等）
 */

const express = require('express');
const path = require('path');
const app = express();

// ============================================
// 1. 基本静态资源服务
// ============================================

// 托管public文件夹作为静态资源目录
app.use(express.static('public'));

console.log('✅ 静态资源目录: public/');
console.log('   访问 http://localhost:3000/index.html');
console.log('   访问 http://localhost:3000/css/style.css');
console.log('   访问 http://localhost:3000/js/app.js');

// ============================================
// 2. 多个静态资源目录的顺序
// ============================================

// 创建一个assets目录（如果需要的话）
// app.use(express.static('assets'));

// 注意：Express会按照注册顺序查找文件
// 第一个目录中找到就返回，找不到才去下一个目录

// ============================================
// 3. 指定虚拟路径前缀（mount path）
// ============================================

// 如果想给静态资源加个URL前缀
// 访问方式变为: /static/css/style.css 而不是 /css/style.css
// app.use('/static', express.static('public'));

// ============================================
// 4. 设置静态资源的缓存策略
// ============================================

// 设置最大缓存时间为1天（单位：毫秒）
// maxAge: 1000 * 60 * 60 * 24 = 1天
// app.use(express.static('public', {
//     maxAge: '1d',  // 或者使用字符串: '1d', '2h', '30m'
//     // 或者使用毫秒数: 1000 * 60 * 60 * 24
// }));

// ============================================
// 5. 自定义静态文件的MIME类型
// ============================================

// Express会自动根据文件扩展名设置正确的Content-Type
// HTML → text/html
// CSS → text/css
// JavaScript → application/javascript
// 图片 → image/png, image/jpeg 等

// ============================================
// 6. 根路由重定向到首页
// ============================================

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// ============================================
// 7. 启动服务器
// ============================================

const PORT = 3000;
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Express 静态资源服务器运行在 http://localhost:${PORT}`);
    console.log('='.repeat(60));
    console.log('\n📖 功能说明：');
    console.log('   1. 托管 public 文件夹中的所有静态文件');
    console.log('   2. 自动识别文件类型（HTML/CSS/JS/图片等）');
    console.log('   3. 支持目录浏览（如果需要）');
    console.log('\n📁 文件结构：');
    console.log('   public/');
    console.log('   ├── index.html      ← 首页');
    console.log('   ├── css/');
    console.log('   │   └── style.css   ← 样式表');
    console.log('   └── js/');
    console.log('       └── app.js      ← JavaScript');
    console.log('\n💡 提示：在浏览器中访问 http://localhost:3000');
    console.log('='.repeat(60) + '\n');
});

// ============================================
// 8. 静态资源的工作原理
// ============================================

/*
当你访问 http://localhost:3000/css/style.css 时：

1. Express 收到请求: GET /css/style.css
2. 检查中间件: express.static('public')
3. 在文件系统中查找: public/css/style.css
4. 找到文件后：
   - 读取文件内容
   - 设置正确的 Content-Type: text/css
   - 返回文件内容给浏览器
5. 浏览器收到CSS文件，应用到页面上

整个过程是自动的，你不需要写任何路由代码！
*/
