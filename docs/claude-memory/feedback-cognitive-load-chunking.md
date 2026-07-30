---
name: feedback-cognitive-load-chunking
description: 单次教学控量——一次1-2个核心概念，先代码后术语，分段确认，深水区拆到后续Day
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 0f18e9c6-1dac-42e1-bc52-dcb4883d9bb7
  modified: 2026-07-28T08:18:01.767Z
---

教新知识时严格控制单次信息量：**一次只讲透 1-2 个核心概念**，讲完停下来问"继续还是先消化"，再推下一个。切入用代码/场景（worked example），术语最后贴标签，别一上来抛术语表格。复杂主题的深水区拆到后续 Day，不硬赶。

**Why:** 用户反馈 Day 13 学 AOP"概念太多一次塞太满"——当天塞了 AOP五术语 + 5种Advice + Bean生命周期10步 + JDK/CGLIB代理 + 自调用陷阱，五大块远超工作记忆容量，导致每块都学得浅、盲区多（BeanPostProcessor 只记一半、依赖调解重犯）。查证认知科学（2026-07-28）：
- 工作记忆一次只处理 **3-4 个 chunk**（非旧说的7），过载则处理速度下降 🟢
- Chunking 分块教学是标准解法：拆成离散小节，先建 schema 再加复杂度 🟢
- Worked examples 示例先行对新手比"先抽象定义后做题"更高效 🟢
- 对照 Day 14（@Transactional）用转账代码切入、一次一个传播行为、分段确认 → 用户明显学得更顺

**How to apply:**
1. 单次新概念控制在 1-2 个，讲透一个再走下一个
2. 每讲完一块，显式问"要继续还是先消化"
3. 先给代码/真实场景，术语放最后贴标签（关联 [[feedback-teaching-style]] 的"先语法后例子"，但对实践导向用户改为"先具体代码后抽象"）
4. 大主题深水区（如 JDK/CGLIB、自调用陷阱）拆成独立 Day，不当天硬塞
5. 关联 [[user-learning-profile]]（实践导向、深度思考型）
