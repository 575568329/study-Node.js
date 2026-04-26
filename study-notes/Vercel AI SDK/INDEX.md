# Vercel AI SDK 学习笔记

> 技能索引 | Claude Code 读取入口

---

## 学习状态

- **进度**: 10/10 topics = **100%** ✅
- **开始日期**: 2026-04-22
- **完成日期**: 2026-04-26
- **进度文件**: `progress/vercel-ai-sdk-progress.md`

---

## 01-知识点总结

| 笔记 | 核心内容 | 置信度 |
|------|---------|--------|
| [[useChat核心API]] | useChat 返回值、status、sendMessage、stop、regenerate | ⭐⭐⭐ |
| [[Tool-Calling]] | tool() 定义、inputSchema、execute、stepCountIs、协议原理 | ⭐⭐⭐ |
| [[v6迁移指南]] | v6 vs 旧版的关键变化汇总 | ⭐⭐⭐ |
| [[RAG整合]] | LangChain 检索 + AI SDK 流式展示对接模式 | ⭐⭐⭐ |

## 03-易错点与陷阱

| 笔记 | 说明 |
|------|------|
| （待补充） | 踩坑记录主要在进度文件中 |

## 05-速查表

| 笔记 | 说明 |
|------|------|
| [[Vercel-AI-SDK速查表]] | API 速查、常用模式 |

---

## 学习路径

```
流式聊天基础 → useChat 状态管理 → stop/regenerate → 新对话 → Tool Calling
                                                          ↓
                                              Structured Output → System Prompt → Client-side Tool → RAG 整合
```
