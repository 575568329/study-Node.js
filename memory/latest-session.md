# 最近会话

**最后更新**：2026-05-11

## 当前上下文

- 项目：`Node.js-Study`
- 当前阶段：学习内容已基本完成，转入项目证明、简历和面试准备。
- 当前定位：全栈工程师｜Node.js / React / Next.js｜AI 应用方向。
- 当前主项目：外部仓库 `D:\Study\rag-docs-assistant`。
- 当前仓库用途：学习记录、简历素材、项目证明方案、面试资产、辅助 demo。

## 后续工作读取顺序

1. `docs/00-工作入口.md`
2. `docs/01-全栈转型项目证明方案.md`
3. `docs/02-RAG项目体检清单.md`
4. `docs/03-面试资产目录.md`
5. `projects/INDEX.md`
6. `memory/latest-session.md`
7. `memory/todo.md`

简历任务再读：

1. `简历相关/个人背景与简历定位.md`
2. `简历相关/基于study-Node.js的学习路径判断.md`
3. `简历相关/三版本简历方向调研结论.md`
4. `简历相关/resume-web/README.md`

## 最近完成内容

- LangGraph.js 核心学习已完成 12/12。
- 已提交并推送：`feat: 完成 LangGraph 流式输出和动态路由学习`。
- 已提交并推送：`docs: 更新学习记忆上下文`。
- 用户明确：目前学习内容已经完成，后续要用项目证明能力，并保证面试追问能应对。
- 用户明确：放弃纯前端主线，全面转型全栈。
- 已新增项目读取入口与执行计划：
  - `docs/README.md`
  - `docs/00-工作入口.md`
  - `docs/01-全栈转型项目证明方案.md`
  - `docs/02-RAG项目体检清单.md`
  - `docs/03-面试资产目录.md`
  - `projects/INDEX.md`
  - `docs/04-全栈求职执行计划.md`
  - `docs/组件库设计方案.md`
- 已新增组件库范围说明：
  - `docs/组件库组件范围说明.md`
  - 明确组件库主卖点为 AI / RAG / Agent / 前端复杂状态抽象，不做通用大而全 UI 库。
- 已开始构建 `projects/fullstack-ui-kit`：
  - 创建了 Vite + React + TypeScript 子项目骨架。
  - 首批实现 `ChatMessage`、`SourceCard`、`StepTimeline`、`UploadPanel`。
  - 已验证 `npm run build` 通过。
- 已将组件库独立迁移到 `D:\Study\fullstack-ui-kit`，并切换为可发布 npm 包结构：
  - 增加 `src/index.ts` 作为库入口。
  - 增加 `tsconfig.build.json` 产出类型声明。
  - Vite 改为 library mode，输出 `dist/index.js`、`dist/index.cjs`、`dist/style.css`。
  - 已验证独立仓库 `npm run build` 通过。
- 已把 `codex_with_cc` 的子代理工作流思想集成到当前仓库：
  - 更新 `AGENTS.md` 增加子代理调度规范。
  - 新增 `docs/codex_with_cc子代理工作流.md` 作为可执行说明。
- 已新增组件库说明文档：
  - `docs/fullstack-ui-kit组件说明.md`
  - 用于解释 `ChatMessage`、`SourceCard`、`StepTimeline`、`UploadPanel` 的作用和分层。
- 已把 `D:\Study\fullstack-ui-kit` 改造成本地可浏览的 ElementUI 风格演示站：
  - 左侧目录 + 右侧组件展示区。
  - `npm run dev` 可直接浏览组件页面。
  - 组件库本体和演示站共存，兼顾 npm 发布和本地展示。
- 已把独立仓库开发端口固定为 `3000`，预览端口固定为 `3001`，避免和其他项目默认端口冲突。
- 已把页面主标题改成中性表述 `组件演示站`，不再使用类比式宣传文案。
- 已在独立仓库 `D:\\Study\\fullstack-ui-kit` 新增 repo-local `memory.md`，同步项目定位、当前组件、演示方式和下一步。
- 2026-05-09 完成 Node.js 事件循环复习的第二轮追问：
  - `setTimeout` 不传 delay 时，Node 默认按 `1ms` 处理，且小于 1 的值也会被归一到 `1`。
  - 在 I/O 回调里同时注册 `process.nextTick`、Promise、`setImmediate`、`setTimeout` 时，通常顺序仍是 `nextTick -> Promise -> immediate -> timeout`。
  - 进一步确认 `await` 后续执行属于 Promise 微任务，不是同步代码也不是宏任务。
- 2026-05-11 完成 Node.js Stream 与背压复习：
  - 明确 `readFileSync` 会阻塞事件循环，大文件一次性读入内存可能导致 OOM。
  - 明确 `fs.createReadStream()` 默认产出的 `chunk` 是 `Buffer`，传 `encoding` 后才是字符串。
  - 讲清 `write()` 返回值、`pause()`、`drain`、`resume()` 如何配合处理背压。
  - 讲清 `pipe()` 自动处理背压，`pipeline()` 进一步统一错误处理和资源清理。
  - 讲清 `Readable`、`Writable`、`Duplex`、`Transform` 四种流的区别。
  - 已新增笔记：`docs/fullstack/Node Stream与背压.md`。

## 当前项目状态

- `Node.js-Study` 不再以课程推进为核心。
- `rag-docs-assistant` 是主项目，需要先做体检；同时组件库作为第二条证明线，按 `docs/组件库设计方案.md` 推进。
- 组件库当前定位已收敛为 AI 相关组件、项目沉淀组件、前端疑难杂症组件，普通组件只做最小能力，不作为主卖点。
- `projects/fullstack-ui-kit` 当前是可运行的最小版本，后续可以继续补 `StreamingText`、`ErrorStatePanel`、`RetryNotice`、`ConversationHistoryPanel`。
- 真正要发布 npm 的版本现在在 `D:\Study\fullstack-ui-kit`，不是 `Node.js-Study` 子目录里的 demo 版本。
- `projects/langgraph-demo`、`projects/langchain-demo`、`projects/ai-chat` 是学习证明，不作为主项目。
- 子代理工作流现在已成为仓库级规范，后续大任务可以按“主线程规划 + 子代理分工 + 主线程验收”执行。
- `简历相关/resume-web` 是简历生成工具，后续简历内容从 `docs/` 面试资产中提炼。

## 下一步建议

直接进入：

```text
rag-docs-assistant 项目体检
```

按 `docs/02-RAG项目体检清单.md` 输出：

- 已完成能力。
- 简历可写点。
- 面试风险点。
- 必须补齐项。
- 建议执行顺序。

## 注意事项

- 不提交 `.env` 或密钥。
- 不大规模移动历史学习目录。
- 不把没有项目支撑的技术词写进简历主技能。
- 后续回答默认围绕“项目证明 + 面试可讲”展开。
## 2026-05-07 RAG 项目体检

- 已确认 RAG 主项目真实路径为 `D:\Study\rag-docs-assistant`。
- 已输出 `docs/RAG项目体检报告.md`。
- 体检结论：项目主体能力完整，但优先要修复构建失败、路径记录过期、对话历史不完整、图谱清理不完整等风险。
## 2026-05-07 RAG 构建修复

- 已在 `D:\Study\rag-docs-assistant\next.config.ts` 配置 `turbopack.root = process.cwd()`。
- 已执行 `npm install` 补齐本地依赖。
- 已验证 `npm run build` 通过。
- 下一步建议补删除知识库时图谱清理逻辑。
## 2026-05-07 RAG 数据一致性修复

- 已在 `D:\Study\rag-docs-assistant\src\app\api\kb\[id]\route.ts` 中删除知识库时同步调用 `getGraphStore().deleteCollection(id)`。
- 已验证 `npm run build` 通过。
- 剩余建议：补完整对话历史持久化，或补删除单个文档时图谱节点清理。
## 2026-05-07 RAG 对话历史闭环

- 已在 `D:\Study\rag-docs-assistant\src\lib\db.ts` 增加 `conversationMessages` 存储结构。
- 已扩展 `/api/chat/history?convId=xxx` 返回单个对话及完整消息。
- 已让 `/api/chat` 在带 `conversationId` 时保存 user / assistant 消息和 sources metadata。
- 已让前端通过 `convId` 路由新建、打开并恢复历史对话。
- 已验证 `npm run build` 通过。


## 2026-05-07 文档按项目归档

- 已将 RAG 面试资产统一收口到 `docs/projects/rag-docs-assistant/`。
- 已把求职定位、项目盘点、职业策略和历史调研整理到 `docs/career/`。
- 已把讯飞澳门项目素材和项目表达总结整理到 `docs/work-projects/`。
- 已将 `简历相关/` 收缩为简历工程、原始简历归档和少量直接相关材料。
- 已删除 `docs/` 根目录下与 RAG 项目重复的副本，保留项目分类目录作为真源。

## 2026-05-07 复习模式约定

- 后续 Node / React / Vue / Next / AI / 后端 复习按统一模式推进：
  先判断是否会，不会就按学习时的方式重新讲解，再配小实例或代码，最后出对应面试题。
- 该模式会作为后续知识点复习的默认节奏，避免下次又切回纯讲解或跳步复习。

## 2026-05-07 fullstack 复习入口补齐

- 已新增 `docs/fullstack/统一复习矩阵.md`，把 Node / React / Vue / Next / AI / 后端按 `必问 / 需精进 / 项目关联` 三层拆开。
- 已新增 `docs/fullstack/复习计划.md`，明确顺序为：先矩阵，再 Node，再 React/Vue/Next，再 AI/后端，最后面试模拟和简历回填。
- 已补 `docs/fullstack/` 下的后端与面试补强材料：
  - `Node后端追问清单.md`
  - `数据库与持久化取舍.md`
  - `SSE与WebSocket对比.md`
  - `MQ思想与Node落地.md`
  - `Java概念到Node类比.md`
- 已新增 `docs/projects/rag-docs-assistant/RAG项目简历描述.md`。

## 2026-05-08 Node 事件循环复习

- 已按问答方式完成 Node.js 事件循环第一轮复习。
- 已明确模型：入口脚本可理解为初始宏任务；每个宏任务内部先执行同步代码，再清空 `process.nextTick` 和 Promise 微任务，然后进入下一个宏任务。
- 已补充 Node.js 与 Java 后端选型区别，以及 Claude Code / Codex 等 CLI 工具为什么常用 Node.js。
- 已新增笔记：`docs/fullstack/Node事件循环.md`。
- 后续进入下一个 Node 高频知识点，继续按“先判断是否会 -> 讲解 -> 小例子 -> 面试回答 -> 记录笔记”的方式推进。

## 2026-05-09 Node 计时器追问

- 已继续追问 `setTimeout` / `setImmediate` / `process.nextTick` / Promise 的相对顺序。
- 已明确：`setTimeout(fn)` 在 Node.js 中默认 delay 为 `1ms`，不是 `0ms`。
- 已确认：在 `readFile` 这类 I/O 回调内部注册定时器时，`setImmediate` 仍通常先于 `setTimeout` 执行。
- 后续继续复习 Node 高频题：`Promise` / `async-await` 细节、`Stream`、错误处理和背压。

## 2026-05-11 Node Stream 与背压复习

- 已按问答方式复习 Stream、大文件读取、背压、`pipe()`、`pipeline()` 和四种流类型。
- 已纠正：`readFileSync` 会阻塞 Node.js 事件循环，不适合在服务端请求链路中处理大文件。
- 已明确：背压的核心是读取端快于写入端，导致写入缓冲区堆积。
- 已新增笔记：`docs/fullstack/Node Stream与背压.md`。
- 后续建议继续 Node 高频复习：错误处理、异步任务状态设计、文件上传链路与 RAG 项目结合。

## 2026-05-11 Node 异步与错误处理复习

- 已按问答方式复习 `Promise`、`async/await`、异步错误捕获和并发控制。
- 已纠正：`await` 普通值时，后续代码仍会进入 Promise 微任务。
- 已明确：`return promise` 不会被当前函数内部 `try...catch` 捕获，`return await promise` 可以。
- 已明确：API Route 中影响接口成功与否的异步逻辑必须 `await`，后台增强任务可以不 `await`，但必须 `.catch()`。
- 已明确：`Promise.all` 适合缺一不可的并行任务，`Promise.allSettled` 适合允许部分失败的降级任务。
- 已明确：`map(async fn)` 返回 `Promise[]`，大批量任务需要分批或 `p-limit` 做并发控制。
- 已新增笔记：`docs/fullstack/Node异步与错误处理.md`。
- 后续建议继续 Node 高频复习：HTTP 服务与请求生命周期、请求/响应结构、状态码、headers、body、流式响应，以及和 Next.js Route Handler 的关系。
