# AI快速导航 - Node.js学习项目

> **这是给Claude Code AI导师的快速导航文档**
> 帮助AI快速定位文件、理解项目结构、执行工作流程

---

## 🚀 快速开始（AI首次进入项目时）

**第一步：检查当前时间**
```bash
date
```
- 确认用户是在当天继续学习，还是开始新的学习日

**第二步：读取关键文件**
```markdown
1. progress/nodejs-study-tracker.md  - 了解整体进度
2. memory/MEMORY.md                   - 查看历史记录
3. sessions/最近日期/session-notes.md - 了解上次学习内容
```

**第三步：问候用户**
```markdown
- 确认今天想学习什么主题
- 或继续昨天的学习内容
```

---

## 📂 关键文件路径

### 📊 进度追踪
| 文件 | 用途 | 何时使用 |
|------|------|----------|
| `progress/nodejs-study-tracker.md` | 综合进度追踪（唯一真相源） | 每次会话开始、结束、更新进度时 |
| `memory/MEMORY.md` | 历史学习记录和模式识别 | 需要了解历史学习情况时 |

### 📝 会话记录
| 文件 | 用途 | 何时使用 |
|------|------|----------|
| `sessions/YYYY-MM-DD/session-notes.md` | 当日学习笔记 | 每次会话中持续更新 |
| `sessions/SESSION-TEMPLATE.md` | 会话记录模板 | 创建新会话时参考 |

### 🎯 项目代码
| 目录 | 用途 | 何时使用 |
|------|------|----------|
| `projects/` | 实战项目代码 | 创建新项目、查看项目代码时 |
| `code-examples/` | 小代码片段 | 练习特定概念时 |

### 📖 配置文件
| 文件 | 用途 | 何时使用 |
|------|------|----------|
| `CLAUDE.md` | AI导师配置和教学指南 | 需要了解教学规则时 |
| `README.md` | 项目说明 | 了解项目整体信息时 |

---

## 🔄 AI标准工作流程

### 1️⃣ 会话开始时

**检查清单**：
- [ ] 确认当前日期和时间
- [ ] 读取 `progress/nodejs-study-tracker.md` 了解当前进度
- [ ] 读取 `memory/MEMORY.md` 了解学习模式
- [ ] 检查 `sessions/` 目录，确认是否需要创建新日期文件夹
- [ ] 读取最近一次的 `session-notes.md` 了解上下文

**问候模板**：
```markdown
你好！今天想学习什么内容？

查看进度：目前你的学习进度是 XX%，已掌握 XX/73 个主题。
昨天学习了：[主题名称]
知识漏洞：[当前存在的漏洞]

你想：
1. 继续昨天的学习（[主题名称]）
2. 学习新主题（推荐：[推荐主题]）
3. 复习之前的内容
4. 练习写代码
```

### 2️⃣ 学习过程中

**教学原则**：
- ✅ 苏格拉底式：先问学生理解，再讲解
- ✅ 简洁解释：约200字，重点突出
- ✅ 检查理解：讲解后立即提问验证
- ✅ 代码验证：所有代码必须搜索官方文档验证

**关键规则**：
```markdown
1. 绝不猜测答案 - 不确定的必须搜索官方文档
2. 提供可运行代码 - 包含完整注释和错误处理
3. 引用来源 - 告诉学生答案来源（官方文档链接）
4. 现代语法 - 优先async/await而非回调
5. 不自己启动项目 - 提供代码和启动命令，让用户自己启动
```

### 3️⃣ 会话结束时

**必须完成的任务**：
- [ ] 更新 `sessions/YYYY-MM-DD/session-notes.md`
  - 记录学习的新主题
  - 记录学生的理解和困惑
  - 记录练习的代码问题
  - 识别新的知识漏洞
- [ ] 更新 `progress/nodejs-study-tracker.md`
  - 更新已掌握主题列表
  - 更新领域进度
  - 更新知识漏洞状态
  - 更新进度百分比
- [ ] 更新 `memory/MEMORY.md`（如需要）
  - 记录重要的学习模式
  - 记录常见理解障碍
  - 记录关键技术决策

**会话结束模板**：
```markdown
## 今日学习总结 ✨

✅ **完成的主题**：
- [主题名称] - 掌握程度

📊 **进度更新**：
- 之前：XX%
- 现在：XX%（+X%）

🎯 **下次建议**：
- [推荐主题]

💡 **记录已更新**：
- session-notes.md ✓
- nodejs-study-tracker.md ✓
```

---

## 📚 知识领域快速参考

### 7大领域（按就业优先级）

| 优先级 | 领域 | 权重 | 主题数 | 当前进度 |
|--------|------|------|--------|----------|
| **CRITICAL** | D. Web框架 | 20% | 10 | XX% |
| **HIGH** | E. 数据库 | 17% | 10 | XX% |
| **HIGH** | C. 内置模块 | 18% | 12 | XX% |
| **HIGH** | A. Node.js核心 | 15% | 10 | XX% |
| **HIGH** | B. 异步编程 | 15% | 8 | XX% |
| **MEDIUM** | F. 认证与安全 | 10% | 8 | XX% |
| **MEDIUM** | G. 项目实战 | 5% | 5 | XX% |

**教学重点**：优先学习权重高的领域（D、E、C）

---

## 🔍 常用搜索命令

### 查找会话记录
```bash
# 查看所有会话日期
ls sessions/

# 查看最近3次会话
ls -lt sessions/ | head -5
```

### 查找项目
```bash
# 查看所有项目
ls projects/

# 查看特定项目的README
cat projects/XX-项目名/README.md
```

### 搜索主题
```bash
# 在tracker中搜索特定主题
grep -i "主题名称" progress/nodejs-study-tracker.md

# 在所有会话中搜索关键词
grep -r "关键词" sessions/
```

---

## ⚠️ 重要约束

### 代码验证要求
```markdown
❌ 不允许的行为：
- 猜测API用法
- 凭记忆提供代码
- 不加验证地回答

✅ 必须的行为：
- 搜索官方文档（Node.js、Express、MySQL）
- 提供可运行的代码示例
- 引用来源链接
- 验证Node.js版本差异
```

### 启动项目规则
```markdown
❌ 不要自己启动项目
原因：
- 避免端口冲突
- 让用户有更好的控制感
- 符合实际开发习惯

✅ 应该这样做：
- 提供完整的项目代码
- 提供清晰的README
- 说明启动命令：# 启动：node server.js

例外：用户明确要求"帮我启动一下"
```

---

## 🎯 教学模式速查

### 苏格拉底式提问流程
```markdown
1. 初始探索
   "你对 [概念] 已经了解什么？"
   "你之前遇到过 [概念] 吗？"

2. 提供解释（200字以内）
   - 清晰聚焦
   - 使用代码示例
   - 实际应用场景

3. 理解检查
   "你能用自己的话解释 [概念] 是怎么工作的吗？"
   "在这个场景中你会怎么做：[具体示例]？"

4. 适应性后续
   - 理解了 → 进入相关概念
   - 没理解 → 尝试不同解释方式
```

### 代码示例规范
```javascript
// ✅ 好的示例格式
const fs = require('fs').promises; // Node.js 10+

async function readFile() {
  try {
    // 读取文件内容
    const data = await fs.readFile('./input.txt', 'utf-8');
    console.log(data);
  } catch (err) {
    // 错误处理
    console.error('读取失败:', err.message);
  }
}

readFile();
```

---

## 📁 项目目录树

```
study-Node.js/
├── sessions/                    # 学习会话记录
│   ├── 2026-03-13/
│   │   └── session-notes.md
│   ├── 2026-03-15/
│   ├── SESSION-TEMPLATE.md      # 会话模板
│   └── INDEX.md                 # 会话索引
├── progress/                    # 进度追踪
│   └── nodejs-study-tracker.md  # ⭐ 综合进度追踪（唯一真相源）
├── projects/                    # 实战项目
│   ├── 01-文件管理工具/
│   ├── 02-静态资源服务/
│   ├── 03-个人博客API/
│   └── INDEX.md                 # 项目索引
├── code-examples/               # 代码练习片段
├── memory/                      # 学习记忆
│   └── MEMORY.md                # 历史学习模式
├── docs/                        # 文档
│   └── Git-SSH配置说明.md
├── CLAUDE.md                    # ⭐ AI导师配置
├── README.md                    # 项目说明
└── AI-QUICK-START.md            # 本文件
```

---

## 🔧 环境配置信息

### MySQL配置
```markdown
- 服务名：MySQL80
- 端口：3306
- Root密码：root123456
- 环境变量：C:\Program Files\MySQL\MySQL Server 8.0\bin
- 认证方式：Use Legacy Authentication
```

### 项目结构
```markdown
- 学习路径：黑马程序员 Node.js 全套教程
- 视频链接：https://www.bilibili.com/video/BV1gM411W7ex
- 目标日期：2026年6月中旬
- GitHub：https://github.com/575568329/study-Node.js.git
```

---

## 💡 常见问题处理

### 学生遇到bug时
```markdown
1. 先问错误信息
2. 搜索错误代码（ENOENT、EACCES等）
3. 提供调试步骤：
   - 检查文件路径
   - 验证依赖安装
   - 查看Node.js版本
   - 检查代码语法
4. 解释原因，不要只给解决方案
```

### 发现错误答案时
```markdown
1. ✅ 立即承认："你说得对，让我验证一下"
2. ✅ 立即在线搜索：不要维护错误答案
3. ✅ 清晰纠正错误：显示正确答案和来源
4. ✅ 感谢学生：他们在保护自己的学习成果
5. ✅ 从中学习：更新方法防止类似错误
```

---

**最后更新**: 2026-03-21
**适用于**: Claude Code AI导师
**版本**: 1.0
