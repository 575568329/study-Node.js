// Express 静态资源服务 - JavaScript

console.log('✅ app.js 加载成功！');
console.log('这个文件是通过静态资源服务加载的');

// 获取按钮和消息元素
const btn = document.getElementById('btn');
const message = document.getElementById('message');

// 点击次数计数器
let clickCount = 0;

// 按钮点击事件
btn.addEventListener('click', () => {
    clickCount++;

    // 根据点击次数显示不同的消息
    const messages = [
        '🎉 第一次点击！',
        '👍 第二次点击！',
        '🔥 第三次点击！',
        '💪 继续加油！',
        '🚀 你很有耐心！',
        '⭐ Express很强大！',
        '🎯 静态资源服务已掌握！'
    ];

    const messageIndex = Math.min(clickCount - 1, messages.length - 1);
    message.textContent = messages[messageIndex];
    message.style.opacity = '0';

    // 淡入动画
    setTimeout(() => {
        message.style.opacity = '1';
        message.style.transition = 'opacity 0.3s';
    }, 50);

    console.log(`按钮被点击了 ${clickCount} 次`);
});

// 页面加载完成提示
window.addEventListener('load', () => {
    console.log('✅ 页面加载完成！');
    console.log('静态资源（CSS、JS）都成功加载了');
});
