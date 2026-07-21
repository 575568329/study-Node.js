---
name: commit
description: 高效 Git 提交技能。自动分析变更、生成规范的 commit message、暂存并提交。当用户说"提交代码"、"commit"、"提交"时触发。
---

# Git 提交技能

## 触发条件

用户说以下任一关键词时触发：
- "提交代码"、"提交"、"commit"
- "提交到github"、"推送"

## 核心流程

```
触发 → git status → git diff → 生成 commit message → git add → git commit → git push（可选）
```

## 执行步骤

### Step 1: 分析变更

并行执行：
1. `git status` — 查看所有变更文件
2. `git diff` — 查看未暂存的变更内容
3. `git diff --cached` — 查看已暂存的变更内容
4. `git log --oneline -5` — 查看最近提交历史，学习 commit 风格

### Step 2: 分类变更

将变更文件分为几类：
- **知识库/笔记**: `knowledge/` → `docs:`
- **求职资产**: `career/` → `docs:`
- **归档迁移**: `archive/` → `chore:`
- **项目代码**: `projects/` → `feat:` / `fix:` / `refactor:`
- **工具链**: `tools/` → `feat:` / `fix:`
- **配置文件**: `CLAUDE.md`, `AGENTS.md`, `.claude/`, `tsconfig.json` → `chore:`
- **代码示例**: `code-examples/` → `feat:`

### Step 3: 生成 commit message

**Conventional Commits 格式**：
```
<type>: <简短描述>

[可选的详细说明]
```

**type 选择规则**：
| type | 场景 |
|------|------|
| `feat:` | 新功能、新知识点、新项目 |
| `fix:` | 修复 bug、修正错误 |
| `docs:` | 笔记、进度、文档更新 |
| `refactor:` | 重构、结构调整 |
| `chore:` | 配置、依赖、工具更新 |

**message 要求**：
- 第一行不超过 50 字
- 描述"做了什么"而非"怎么做的"
- 多个类型变更时，按主要变更选 type

### Step 4: 暂存文件

- 排除敏感文件：`.env`、`credentials`、`node_modules/`
- 优先按文件类型分组暂存：`git add <具体文件>`
- 不要用 `git add -A`，避免意外提交

### Step 5: 提交

```bash
git commit -m "$(cat <<'EOF'
type: 描述

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

### Step 6: 推送（需确认）

**不主动推送**，除非用户明确说"推送"或"push"。推送前确认：
- 当前分支
- 是否有冲突风险
- 确认后执行 `git push`

## 学习项目的批量提交策略

当变更涉及多个方面时（学习进度 + 笔记 + 项目代码），采用**单次提交**：

```
docs: 完成TypeScript全部章节学习（TS.1-TS.8），重构笔记库支持多技能

- TypeScript 37/37 = 100%
- 新增 ts-api-demo 实践项目
- 重构 study-notes 笔记库适配多技能
- 更新 CLAUDE.md 和进度跟踪技能
```

## 特殊场景

### 大量新文件（如今天的学习）
如果变更文件超过 10 个，按目录分组暂存：

```bash
git add knowledge/
git add career/
git add projects/java/src/ projects/java/pom.xml
git add CLAUDE.md AGENTS.md .claude/skills/
```

### 敏感文件检测
提交前检查，如发现以下文件则跳过并警告：
- `.env`、`*.key`、`*.pem`、`credentials.*`
- `node_modules/`
- `dist/`、`build/`

## 注意事项

- **不要 amend**：始终创建新 commit
- **不要 force push**：除非用户明确要求
- **不要 skip hooks**：如果 hook 失败，分析原因再处理
- **确认后执行**：展示 commit message，用户无异议再提交
