# Day 31 · Linux 部署 + Docker 入门

> **主题**：裸部署流程 / nohup 咒语 / 停机窗口 / Docker 三件套 / run 参数
> **日期**：2026-08-27 ｜ **阶段**：五 · 运维基础（开篇）
> **前置**：Day 21-30 微服务主线收官

---

## 一、裸部署五步（没有 Docker 之前）

```bash
# 1. 上传
scp app.jar user@192.168.1.100:/opt/app/

# 2. 登录服务器
ssh user@192.168.1.100

# 3. 确认 JRE
java -version

# 4. 启动
nohup java -jar /opt/app/app.jar > /opt/app/logs/app.log 2>&1 &

# 5. 看日志
tail -f /opt/app/logs/app.log
```

### 第 4 步咒语拆解

| 片段 | 意思 | 为什么 |
|------|------|--------|
| `nohup` | 挂断免疫 | ssh 断开不杀进程（否则关终端服务就死） |
| `> app.log` | stdout 重定向 | 后台进程日志必须落盘 |
| `2>&1` | stderr 并入 stdout | 错误+正常进同一文件 |
| 末尾 `&` | 后台运行 | 不占 shell |

> = Node 世界里 `pm2 start` 解决的问题的手搓版。

### 停机窗口问题

kill 旧进程 → 新进程起来之间，服务是断的（请求全失败）。
- pm2 `reload` 零停机；裸 Java 没有保障
- 生产方案：Nginx 负载均衡多实例滚动更新 / K8s

---

## 二、Docker：把环境打包进箱子

**一句话：把应用+整个环境（JRE/依赖/配置）打包成标准镜像，任何装了 Docker 的机器上跑起来都一样。**

### 三件套

| Docker | 类比 | 说明 |
|--------|------|------|
| 镜像 Image | npm tarball / class 模板 | 只读模板（应用+环境的静态打包产物） |
| 容器 Container | new 出来的对象 | 镜像运行起来的活体进程（动态实例） |
| 仓库 Registry | npm registry | 存镜像（Docker Hub / 私有 harbor） |

**Image : Container = Class : Instance = 模板 : 实例**

### 部署流（对标 npm）

```bash
docker build -t myapp:1.0 .   # 打镜像（对标 npm pack）
docker push myapp:1.0          # 推仓库（对标 npm publish）
docker pull myapp:1.0          # 拉镜像（对标 npm install）
docker run -d -p 8080:8080 --name app1 myapp:1.0   # 起容器（对标 npx）
```

### 一剑封四大痛点

| 裸部署痛点 | Docker 解法 |
|-----------|------------|
| 环境不一致（"在我机器上是好的"） | 环境封死在镜像里 ✅ |
| 配置散落 | Dockerfile 写一次处处复现 ✅ |
| 扩容慢 | 新机器 pull + run 两行 ✅ |
| 互相污染 | 容器隔离（各自文件系统/网络） ✅ |

---

## 三、run 参数详解

```bash
docker run -d -p 8080:8080 --name app1 --restart=always myapp:1.0
```

| 参数 | 意义 |
|------|------|
| `-d` | detached 后台模式（= 手搓版 `nohup ... &`） |
| `-p 8080:8080` | 宿主机端口:容器端口映射 |
| `--name` | 容器命名 |
| `--restart=always` | 挂了自动重启（比 nohup 强的地方） |

### 端口映射

```
-p 8080:8080
     │    └─ 容器内端口（Spring Boot 监听的）
     └────── 宿主机端口（外部访问的）

外部 → 宿主 8080 → 转发进容器 8080
```

为什么需要？**每个容器网络是隔离的**——容器里监听的端口外面看不见，必须 `-p` 开门。

**同机多实例不冲突**：各容器映射不同宿主端口（8081:8080、8082:8080），容器内都是 8080——这正是滚动更新的基础设施。

---

## 四、常用命令速查

```bash
docker ps                 # 看运行中的容器
docker ps -a              # 含已停止的
docker logs -f app1       # 盯容器日志（等价 tail -f）
docker exec -it app1 bash # 进容器内部
docker stop app1 / start app1 / rm app1
docker images             # 本地镜像列表
tail -f app.log           # follow 模式盯文件新增内容（vs cat 看历史）
grep ERROR app.log        # 历史错误筛查
```

---

## 五、面试标准答案

> 裸部署：scp 上传 jar，ssh 登录，nohup java -jar 后台启动（nohup 防 ssh 断连杀进程），tail -f 看日志。问题：环境不一致、配置散落、扩容慢、互相污染，且 kill 到重启有停机窗口。
>
> Docker 把应用和整个环境打包成只读镜像（Image:Container = Class:Instance），push 到仓库，目标机器 pull 后 run 起容器。环境封死在镜像里解决"在我机器上是好的"；-p 端口映射打通容器隔离网络（宿主:容器）；-d 后台 + --restart=always 自动重启。同机多实例用不同宿主机端口映射，为滚动更新打底。

---

## 🤖 AI 时代视角

**被 AI 贬值**：docker run 参数背写、Dockerfile 样板、Linux 命令查询

**AI 时代更值钱**：
- **容器化架构判断**（哪些服务值得容器化、镜像怎么分层设计减小体积）
- **排障直觉**（端口不通→先查 -p 映射和防火墙；容器挂了→先 docker logs 不是重启）
- **从"会用"到"会教"**——给团队定容器化规范（AI 给不了你团队的上下文）

---

## 关联

- [[Day25-SpringBoot自动配置]] — Spring Boot 内嵌 Tomcat 让 jar 可独立运行，是容器化的前提
- [[Day27-SpringCloud-vs-Dubbo]] — 微服务多实例扩容的需求来源

## 下次

- Day 32：Dockerfile 写法 + docker compose 编排
- FSRS：08-28 批量复查（Tailwind/Hooks/宏微/RHF/Zod）
