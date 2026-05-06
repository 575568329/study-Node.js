# LangGraph 踩坑记录

> 最近更新: 2026-05-06

## API 与类型

| 问题 | 原因 | 正确做法 |
|------|------|----------|
| MessagesState 不存在 | v1.3.0 使用 MessagesAnnotation | `import { MessagesAnnotation } from "@langchain/langgraph"` |
| addEdge 传函数 | addEdge 需要节点名字符串 | `.addEdge(START, "agent")` |
| withApproval 泛型变 unknown | 泛型未被 tool() 调用推断 | `withApproval<CalculatorInput>()` |
| `as` 被误认为运行时校验 | `as` 只是类型断言 | 生产用 Zod parse |

## 环境变量

| 问题 | 原因 | 正确做法 |
|------|------|----------|
| dotenv injected 0 | 当前目录没有 `.env` | 在运行目录创建 `.env` 或指定 path |
| dotenv injected 1 仍 Missing credentials | 变量名不一致 | `.env` 和代码都用 `ZHIPU_API_KEY` |
| config 不可调用 | dotenv `config()` 与对象 `config` 同名 | 运行配置命名为 `runConfig` |

## Agent 安全

| 问题 | 原因 | 正确做法 |
|------|------|----------|
| LLM 脑补文件路径 | 模型会生成看似合理的参数 | 展示真实参数、权限校验、路径白名单 |
| 工具拒绝文案不清楚 | 模型会误总结为权限不足 | 返回“人工审批未通过” |
| messages 代替 checkpoint | messages 不含执行现场 | checkpoint 保存恢复点 |

| State 字段名与节点名重复 | channel 与 node 共享命名空间 | 字段用名词，节点用动词 |
| z.enum 返回值变 string | 字面量类型被拓宽 | 显式声明联合类型 |
| Multi-Agent 无限重写 | 缺少最大循环次数 | 使用 revisionCount + force_final |
