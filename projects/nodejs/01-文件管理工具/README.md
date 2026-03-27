# 文件管理工具

## 📁 项目结构

```
01-文件管理工具/
├── file-manager.js     # 主程序（待实现）
├── test-files/         # 测试文件目录
└── README.md          # 项目说明
```

## 🎯 项目目标

实现一个命令行文件管理工具，支持以下操作：

### 基础功能
- **创建文件**: `node file-manager.js create <文件名> [内容]`
- **读取文件**: `node file-manager.js read <文件名>`
- **删除文件**: `node file-manager.js delete <文件名>`
- **重命名文件**: `node file-manager.js rename <旧名> <新名>`
- **查看目录**: `node file-manager.js list [目录名]`
- **查看文件信息**: `node file-manager.js stat <文件名>`

## 📚 涉及的知识点

- **C.1 fs文件写入** - fs.writeFile()
- **C.2 fs文件读取** - fs.readFile()
- **C.4 fs文件信息** - fs.stat()
- **C.5 path路径处理** - path.join(), path.resolve()
- **process.argv** - 命令行参数解析
- **错误处理** - try-catch, fs.promises

## 🚀 开始实现

### Step 1: 理解 process.argv
```bash
node file-manager.js create test.txt "Hello"
# argv[0] = node路径
# argv[1] = file-manager.js路径
# argv[2] = "create"
# argv[3] = "test.txt"
# argv[4] = "Hello"
```

### Step 2: 实现命令路由
根据 `argv[2]` 的值决定执行什么操作

### Step 3: 实现各个命令
使用 fs.promises API + async/await

## ✅ 完成标准

- [ ] 所有6个命令正常工作
- [ ] 错误处理完善（文件不存在等）
- [ ] 代码结构清晰（每个命令一个函数）
- [ ] 使用 fs.promises API

---

**开始时间**: 2026-03-26
**预计完成时间**: 30-45分钟
