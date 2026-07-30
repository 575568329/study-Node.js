# Claude Memory 跨设备备份

> 本目录是 Claude Code memory 的**版本化权威副本**，随 git 跨设备同步，防止换设备丢失。

## 为什么存在

Claude Code 的 memory 从**固定本地路径**自动加载：

```
C:\Users\fjyu9\.claude\projects\D--Study-Node-js-Study\memory\
```

这个路径**不在仓库内**，也改不了 → 换设备 / 重装就丢。
本目录 `docs/claude-memory/` 是它的 git 副本，解决跨设备持久化。

## 两个位置的分工

| 位置 | 角色 | 谁读写 |
|------|------|--------|
| `~/.claude/projects/.../memory/`（本地固定路径） | **运行时源**：Claude 自动加载 + 读写 | Claude 运行时 |
| `docs/claude-memory/`（本仓库） | **权威副本**：随 git 跨设备 | 手动/约定镜像 |

## 同步规则（重要）

**写 memory 时**（Claude 约定）：
- 每次新增 / 修改本地 memory 文件后，**同步镜像一份到 `docs/claude-memory/`**
- 提交进度时一并 `git add docs/claude-memory/`

**换新设备时**（手动一次性）：
```bash
# 把仓库副本拷回 Claude 的本地加载路径
cp docs/claude-memory/*.md "$HOME/.claude/projects/D--Study-Node-js-Study/memory/"
```

## 文件说明

- `MEMORY.md` — 索引（Claude 每次会话自动加载前 200 行）
- `feedback-*.md` — 教学反馈规范（如何工作）
- `user-learning-profile.md` — 用户学习画像
- `methodology-validated.md` — 教学方法论验证结论
- `session-*.md` — 关键会话记录
- 其余 — 项目进度 / 参考类记忆

## 注意

- **不含敏感信息**：memory 里禁止存密钥 / 密码 / 未脱敏数据（本副本进 git 更要守此规）
- **冲突以谁为准**：教学规范类（AI 时代视角等）已迁入根 `CLAUDE.md`，那里是最高权威；本目录是 memory 全量备份
