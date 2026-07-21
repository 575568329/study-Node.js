# AI 应用开发基础 - 学习会话 2026-04-13

## 会话概述
- **主题**: 结构化输出实战 + 前端流式聊天项目收尾 + LangChain.js 入门
- **时长**: 约1.5小时
- **状态**: 🟡 AI基础接近收尾，LangChain.js开始
- **学习方式**: 课前小测 + 实战 + 概念讲解

---

## 课前小测

| 题号 | 类型 | 结果 | 备注 |
|------|------|------|------|
| Q1 | 预测试（JSON mode） | ✅ | Few-shot + response_format 思路正确 |
| Q2 | 盲区（params await） | ✅ | **终于通过！** Promise类型 + await 全对 |
| Q3 | 随机（reader.read） | ✅ | done/value/Uint8Array 全对 |
| Q4 | 跨技能（API Key保护） | ✅ | 前端暴露密钥 |

---

## 学习内容

### 1. 结构化输出实战（情感分析 API）

- **项目**: `projects/ai-chat/app/api/sentiment/route.ts`
- **掌握**: `response_format: { type: 'json_object' }` 强制 JSON 输出
- **掌握**: 非流式 API Route 写法（`NextResponse.json()`）
- **踩坑**:
  - `...message` 展开字符串错误 → 应为 `{ role: 'user', content: message }`
  - PowerShell curl 语法不同 → 用 `Invoke-RestMethod`
  - glm-4-flash 情感分析不准 → 模型能力有限，需要更强模型或更精细 prompt
- **关键认知**: 不是所有任务都适合直接交给 AI，轻量模型有局限性

### 2. AI 基础阶段总结

- 完成进度：9/14 topics (64%)，核心内容已掌握
- 剩余：Transformer/Embedding 概念（LangChain 中会学到）

### 3. LangChain.js 入门概念

**核心定位**: AI API 的"Express框架"——封装重复工作

**四大组件**:
| 组件 | 作用 | 替代的原生写法 |
|------|------|---------------|
| Model | 封装 API 调用 | 手写 fetch |
| Prompt Template | 可复用 prompt 模板 | 手写字符串模板 |
| Chain | 串联 Model + Prompt | 手动组装 messages |
| Output Parser | 解析结构化输出 | 手写 JSON.parse |

**关键认知**: OpenAI API 格式已成行业标准，`ChatOpenAI` 通过改 `baseURL` 对接所有兼容模型（GLM、DeepSeek等）

---

## 掌握主题
- ✅ 结构化输出（response_format + JSON mode）
- ✅ 非流式 API Route 完整写法
- ✅ LangChain.js 定位与核心组件概念
- ✅ OpenAI 兼容接口原理（baseURL 切换）

## 盲区突破
- ✅ Next.js params await（第4次验证通过）

---

## 表现评估
- **理解能力**: ⭐⭐⭐⭐⭐ 课前小测全部通过，盲区全部突破
- **代码实践**: ⭐⭐⭐⭐ 情感分析 API 独立完成
- **迁移能力**: ⭐⭐⭐⭐ 能将 fetch 经验迁移到理解 LangChain.js 封装

---

## 下次学习内容

- LangChain.js 安装与环境配置
- Model / Prompt Template / Chain 实战
- 用 LangChain.js 改写之前的聊天工具
