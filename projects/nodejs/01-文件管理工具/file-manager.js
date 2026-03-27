const fs = require('fs').promises;
const path = require('path');

// 获取命令行参数
const command = process.argv[2];
const args = process.argv.slice(3); // 获取命令后面的参数

// 命令路由 - 使用 if 判断
if (command === 'create') {
  createFile(args[0], args[1]);
} else if (command === 'read') {
  readFile(args[0]);
} else if (command === 'delete') {
  deleteFile(args[0]);
} else if (command === 'rename') {
  renameFile(args[0], args[1]);
} else if (command === 'list') {
  listDir(args[0] || '.');
} else if (command === 'stat') {
  fileStat(args[0]);
} else {
  showHelp();
}

// TODO: 实现各个函数
async function createFile(filename, content = '') {
  try {
    if (!filename) {
      console.error('❌ 错误：请提供文件名');
      return;
    }
    await fs.writeFile(filename, content, 'utf8');
    console.log(`✅ 文件创建成功: ${filename}`);
  } catch (err) {
    console.error('❌ 创建文件失败:', err.message);
  }
}

async function readFile(filename) {
  // 你的代码
  try{
    if(!filename){
      console.error('❌ 错误：请提供文件名');
      return;
    }
    const content = await fs.readFile(filename, 'utf8');
    console.log(`✅ 文件内容: ${content}`);
  } catch (err) {
    console.error('❌ 读取文件失败:', err.message);
  }
}

async function deleteFile(filename) {
  // 你的代码
  try{
    if(!filename){
      console.error('❌ 错误：请提供文件名');
      return;
    }
    await fs.unlink(filename);
    console.log(`✅ 文件删除成功: ${filename}`);
  } catch (err) {
    console.error('❌ 删除文件失败:', err.message);
  }
}

async function renameFile(oldName, newName) {
  // 你的代码
  try{
    if(!oldName || !newName){
      console.error('❌ 错误：请提供文件名');
      return;
    }
    await fs.rename(oldName, newName);
    console.log(`✅ 文件重命名成功: ${oldName} -> ${newName}`);
  } catch (err) {
    console.error('❌ 重命名文件失败:', err.message);
  }
}

async function listDir(dirname) {
  try {
    if (!dirname) {
      dirname = '.';
    }
    const files = await fs.readdir(dirname);
    console.log(`📁 目录: ${dirname}`);
    console.log('─'.repeat(50));
    if (files.length === 0) {
      console.log('(空目录)');
    } else {
      files.forEach((file, index) => {
        console.log(`${index + 1}. ${file}`);
      });
    }
    console.log('─'.repeat(50));
    console.log(`共 ${files.length} 个项目`);
  } catch (err) {
    console.error('❌ 获取文件列表失败:', err.message);
  }
}

async function fileStat(filename) {
  // 你的代码
  try{
    if(!filename){
      console.error('❌ 错误：请提供文件名');
      return;
    }
    const stats = await fs.stat(filename);
    console.log(`文件名: ${filename}`);
    console.log(`文件大小: ${stats.size} 字节`);
    console.log(`创建时间: ${stats.birthtime}`);
    console.log(`修改时间: ${stats.mtime}`);
  } catch (err) {
    console.error('❌ 获取文件信息失败:', err.message);
  }
}

function showHelp() {
  console.log(`
文件管理工具使用方法：

创建文件: node file-manager.js create <文件名> [内容]
读取文件: node file-manager.js read <文件名>
删除文件: node file-manager.js delete <文件名>
重命名: node file-manager.js rename <旧名> <新名>
查看目录: node file-manager.js list [目录名]
文件信息: node file-manager.js stat <文件名>
  `);
}
