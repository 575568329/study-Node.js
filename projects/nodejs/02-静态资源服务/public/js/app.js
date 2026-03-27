// JavaScript文件测试

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ JavaScript文件已加载');

    // 显示当前时间
    updateTime();

    // 每秒更新时间
    setInterval(updateTime, 1000);

    // 添加交互效果
    const container = document.querySelector('.container');

    container.addEventListener('click', function(e) {
        if (e.target === container) {
            container.style.transform = 'scale(1.02)';
            setTimeout(() => {
                container.style.transform = 'scale(1)';
            }, 200);
        }
    });
});

// 更新时间函数
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long',
        hour12: false
    });

    const timeElement = document.getElementById('time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

console.log('📝 app.js 已加载完成');
