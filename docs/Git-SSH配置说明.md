# Git SSH 配置说明

> **项目**: Node.js学习
> **配置时间**: 2025-03-15
> **协议**: SSH (已从HTTPS切换)

---

## ✅ 当前配置

### 远程仓库
```bash
git@github.com:575568329/study-Node.js.git
```

### SSH优化配置
```bash
core.sshCommand=ssh -o IdentitiesOnly=yes -o IdentitiesConfirmation=no
```

---

## 🚀 使用SSH推送

### 正常推送
```bash
cd "C:\Users\about\OneDrive\桌面\study\study-Node.js"
git push
```

### 强制推送 (谨慎使用)
```bash
git push --force
```

### 推送特定分支
```bash
git push origin main
```

---

## 🔧 SSH密钥管理

### 当前SSH密钥
- **类型**: RSA
- **位置**: `C:\Users\about\.ssh\id_rsa.pub`
- **邮箱**: 575568329@qq.com
- **状态**: ✅ 已添加到GitHub

### 查看SSH公钥
```bash
cat ~/.ssh/id_rsa.pub
```

### 复制SSH公钥到剪贴板
```bash
powershell -Command "Get-Content ~/.ssh/id_rsa.pub | Set-Clipboard"
```

### 测试SSH连接
```bash
ssh -T git@github.com
```

**成功响应**:
```
Hi 575568329! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 🔍 SSH故障排查

### 问题1: Permission denied (publickey)
**原因**: SSH密钥未添加到GitHub
**解决**:
1. 复制公钥到剪贴板 (见上面命令)
2. 访问 https://github.com/settings/keys
3. 点击 "New SSH key"
4. 粘贴公钥并添加

### 问题2: Could not resolve host
**原因**: 网络DNS问题
**解决**:
```bash
# 刷新DNS
ipconfig /flushdns

# 或配置DNS为 8.8.8.8
```

### 问题3: Connection timeout
**原因**: 网络不稳定或防火墙
**解决**:
- 检查网络连接
- 尝试切换网络
- 配置代理（如果需要）

---

## 📝 相关命令

### 查看远程仓库配置
```bash
git remote -v
```

### 查看SSH配置
```bash
git config --local --list | grep ssh
```

### 查看所有Git配置
```bash
git config --local --list
```

---

## 🔄 从SSH切换回HTTPS (如果需要)

**不推荐，但记录一下**

```bash
# 切换回HTTPS
git remote set-url origin https://github.com/575568329/study-Node.js.git

# 切换回SSH
git remote set-url origin git@github.com:575568329/study-Node.js.git
```

---

## 💡 最佳实践

### ✅ DO (推荐)
- ✅ 使用SSH推送（更稳定）
- ✅ 定期测试SSH连接
- ✅ 保护好私钥 (~/.ssh/id_rsa)
- ✅ 定期更新SSH密钥

### ❌ DON'T (避免)
- ❌ 不要分享私钥
- ❌ 不要在不安全的网络推送
- ❌ 不要随意删除SSH密钥
- ❌ 不要在公共电脑上配置SSH

---

## 🔐 安全建议

1. **备份SSH密钥**
   - 备份 `~/.ssh/` 文件夹
   - 存储在安全的地方

2. **使用强密码短语**
   - 生成密钥时设置passphrase
   - 记住在安全的地方

3. **定期更新密钥**
   - 每6-12个月更新一次
   - 删除GitHub上的旧密钥

---

## 📚 参考资料

- [GitHub SSH keys](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Git SSH配置](https://git-scm.com/docs/ssh)

---

**最后更新**: 2025-03-15
**状态**: ✅ SSH已配置并测试成功
