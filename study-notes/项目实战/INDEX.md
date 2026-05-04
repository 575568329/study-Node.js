# 项目实战 — Obsidian 笔记索引

> 技能: AI 知识库问答系统（rag-docs-assistant）
> 进度: Day 5 完成（项目优化 — 来源追溯 + 混合检索 + 多轮对话上下文）
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

## 03-易错点与陷阱

- [[项目实战踩坑记录]] — Day 3~5 全部踩坑（16 个问题 + 原因 + 修复）

## 05-速查表

- [[RAG项目速查表]] — 项目结构、常用命令、关键参数
