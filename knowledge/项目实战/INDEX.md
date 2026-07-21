# 项目实战 — Obsidian 笔记索引

> 技能: AI 知识库问答系统（rag-docs-assistant）
> 进度: Day 6 完成（前端 UI 优化 + 图谱集成 + JSON 持久化 + 实体提取）
> 下次学习: LangGraph.js（Agent 工作流编排）

---

## 01-知识点总结

- [[RAG对话API设计]] — RAG 流程、相似度过滤、引用标注策略
- [[AI SDK v6 useChat与流式输出]] — useChat Hook、DefaultChatTransport、parts 格式
- [[文档切片策略]] — 标题分段切片、chunkSize/overlap 调优
- [[文件向量存储实现]] — FileStore JSON 存储、余弦相似度、策略模式
- [[上传进度条实现]] — XHR vs fetch、upload.onprogress、Record 独立追踪
- [[Toast通知组件设计]] — 自定义 Toast、onClose 回调、条件渲染、自动消失
- [[来源追溯全链路设计]] — SourceBadge 从 chunker 到 UI 的完整元数据管道
- [[混合检索与RRF融合]] — 向量+关键词混合搜索，RRF 融合算法
- [[多轮对话检索优化]] — buildSearchQuery 上下文拼接策略
- [[侧边栏差异化渲染]] — 按页面上下文显示不同操作项（对话页/数据页/图谱页）
- [[GraphCanvas 白色主题适配]] — 深色文字+白底的图谱配色方案
- [[GraphSearch 混合搜索模式]] — 固定搜索栏 + Ctrl+K 快捷键 + 模态结果面板
- [[图谱实体提取集成]] — 上传文档时 AI 实体提取（glm-4-flash + structured output）
- [[ForceGraph2D API 2D vs 3D]] — 2D 用 centerAt/zoom，3D 用 cameraPosition，不能混用

## 03-易错点与陷阱

- [[项目实战踩坑记录]] — Day 3~6 全部踩坑（20 个问题 + 原因 + 修复）

## 05-速查表

- [[RAG项目速查表]] — 项目结构、常用命令、关键参数
