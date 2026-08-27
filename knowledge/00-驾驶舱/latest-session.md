# 最近一次学习记录

**最后更新**:2026-08-27（Java 线 Day 31 Linux 部署 + Docker 入门）

## 2026-08-27 学习记录（Java 线）

### 课前小测（6 题）：基本盘恢复，剩"最后一公里"精度问题

08-27 密集复查的 7 条红标清账：

- ⚠️ Q1 受控/非受控：**方向翻回来了**（A 受控 B 非受控 ✅），但判断标准说成"值由用户修改"→ 正解"值存哪、谁说了算"（state=受控/DOM=非受控）→ H
- ⚠️ Q2 JWT 主动失效："黑名单 ✅ + 放弃签名 ❌"——后者应为**密钥轮换**（重签后旧 token 全失效），表述修正 → H
- ✅ Q3 Express async 错误：asyncHandler + next(err)，过关（补 Express 5 原生支持加分项）
- ✅ Q4 跨层通信：createContext+useContext=provide/inject，翻盘后固化确认
- ⚠️ Q5 自定义 Hook：不共享 ✅，但 state 存在哪打不出"Fiber"（第 3 次）→ 说准词过关
- ⚠️ Q6 OGNL：核心稳（status=0 不通过/删 != ''/Integer），但自己提出"or status==0 补丁"式坏答案——纠正：就两处修法，别记复杂版

**诊断**：没有全错了，全是精确度问题（判断标准措辞/术语名/标准修法）。规律：**结论先行恢复快，精确表述最后长出来**。

### 学习成果

**Linux 部署 + Docker 入门（Day 31，阶段五开篇）**

**裸部署五步**：
```bash
scp app.jar user@ip:/opt/app/   # 上传
ssh user@ip                      # 登录
java -version                    # 确认 JRE
nohup java -jar app.jar > app.log 2>&1 &   # 启动
tail -f app.log                  # 盯日志
```
- nohup=挂断免疫 / > 重定向 / 2>&1 错误并入 / & 后台——"手搓版 pm2"

**停机窗口问题**：kill 到重启之间服务是断的 → 生产靠 Nginx 多实例滚动更新或 K8s（pm2 reload 解决的同问题）

**Docker 三件套**：
| Docker | 类比 |
|--------|------|
| 镜像 Image | npm tarball/class（静态模板，应用+环境打包）|
| 容器 Container | new 出来的实例（镜像跑起来的活体进程）|
| 仓库 Registry | npm registry |

- **一剑封四大痛点**：环境封进镜像 → 不一致/散落/扩容慢/污染全解决
- 部署流：build → push → pull → run
- run 参数：`-d` 后台（+`--restart=always` 自动重启）、`-p 8080:8080` 宿主:容器端口映射（容器网络隔离，必须开门）、`--name`
- 同机多实例：不同宿主机端口映射同一容器端口（8081:8080/8082:8080）——滚动更新的基础
- `tail -f`：follow 跟随模式盯新日志（vs cat 看历史）

### 今日面试题沉淀（3 道）

1. "在我机器上是好的"Docker 怎么解决？→ 应用+环境全部打进镜像，环境不可变，到哪跑都一样
2. 一台机器起多个同类容器端口冲突吗？→ 不冲突，各容器 -p 映射不同宿主机端口（容器内端口可以都是 8080）
3. 裸部署 Java 服务为什么要 nohup？→ ssh 断开会杀子进程；nohup 免疫挂断 + 重定向落盘 + & 后台

### 遗留问题 / 下次计划

- **Day 32：Dockerfile 写法 + docker compose 编排**
- FSRS 到期：08-28 Tailwind/Hooks/宏微 setImmediate/RHF/Zod 批量查
- 复习线：⑰ Next.js（React 收官站）

---

## 上次会话（存档）

**2026-08-25（复习线 ⑯ 构建工具链；Java 线 Day 30 死信队列+延迟消息，MQ 主线收官）**
