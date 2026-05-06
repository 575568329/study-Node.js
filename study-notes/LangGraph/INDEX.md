# LangGraph.js 笔记索引

> 进度: 10/12 (83%)
> 最近更新: 2026-05-06
> 下次学习: Streaming / Command + Send 动态路由

---

## 01-知识点总结

- [[Memory 多轮对话上下文]] — MemorySaver、thread_id、MessagesAnnotation 的职责边界
- [[Human-in-the-loop 人工审批]] — interrupt、Command resume、__interrupt__、审批恢复
- [[Agent 工具审批策略]] — 危险工具内部 interrupt、toolPolicies、withApproval、fail closed
- [[Checkpoint 持久化设计]] — MemorySaver 局限、messages vs checkpoint、业务表设计
- [[Subgraph 子图]] — 主图调用子图、独立 State、输入输出映射
- [[Multi-Agent 编排]] — 角色分工、条件审核循环、revisionCount 防死循环

## 03-易错点与陷阱

- [[LangGraph 踩坑记录]] — dotenv、config 命名冲突、resume/state、withApproval 泛型、checkpoint 误区、Subgraph/Multi-Agent 踩坑

## 05-速查表

- [[LangGraph.js 速查表]] — StateGraph、Memory、Human-in-the-loop、工具审批、Checkpoint、Subgraph、Multi-Agent 关键 API
