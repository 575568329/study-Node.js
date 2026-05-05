/**
 * LangGraph.js 入门示例：智能路由
 *
 * 演示核心概念：State（状态）→ Nodes（节点）→ Edges（边 + 条件分支）
 * 不依赖 LLM，纯逻辑图，方便理解图的流转机制
 *
 * 运行：npx tsx 01-hello-graph.ts
 */

import { StateGraph, StateSchema, START, END } from "@langchain/langgraph"
import { z } from "zod"

// ==================== 1. 定义状态 ====================
// 状态是整个图中流转的数据对象，所有节点共享

const State = new StateSchema({
  question: z.string(),       // 用户问题
  answer: z.string(),         // 最终回答
  questionType: z.string(),   // 问题类型（math/greeting/unknown）
  steps: z.array(z.string()), // 记录走过的节点（调试用）
})

// ==================== 2. 定义节点 ====================
// 每个节点是一个函数：接收当前状态 → 返回状态更新

/** 路由节点：判断问题类型 */
function classifyNode(state: typeof State.State) {
  const q = state.question.toLowerCase()

  let questionType = "unknown"
  if (q.includes("计算") || q.includes("加") || q.includes("乘") || q.includes("+")) {
    questionType = "math"
  } else if (q.includes("你好") || q.includes("hello") || q.includes("hi")) {
    questionType = "greeting"
  }

  console.log(`  [classify] 问题类型: ${questionType}`)
  return { questionType, steps: ["classify"] }
}

/** 数学节点：处理计算类问题 */
function mathNode(state: typeof State.State) {
  console.log(`  [math] 处理数学问题...`)
  const answer = `数学回答："${state.question}" — 我是 Agent，可以调用计算器工具来帮你算！`
  return { answer, steps: ["math"] }
}

/** 问候节点：处理打招呼 */
function greetingNode(state: typeof State.State) {
  console.log(`  [greeting] 回应问候...`)
  const answer = `你好！我是 LangGraph Agent，有什么可以帮你的？`
  return { answer, steps: ["greeting"] }
}

/** 兜底节点：处理未知问题 */
function fallbackNode(state: typeof State.State) {
  console.log(`  [fallback] 兜底处理...`)
  const answer = `抱歉，我还不太懂"${state.question}"，需要调用搜索工具查一下。`
  return { answer, steps: ["fallback"] }
}

// ==================== 3. 定义条件边 ====================
// 根据状态中的 questionType 决定走哪个节点

function routeByType(state: typeof State.State): string {
  const map: Record<string, string> = {
    math: "mathNode",
    greeting: "greetingNode",
    unknown: "fallbackNode",
  }
  return map[state.questionType] || "fallbackNode"
}

// ==================== 4. 构建图 ====================

const graph = new StateGraph(State)
  // 添加节点
  .addNode("classify", classifyNode)
  .addNode("mathNode", mathNode)
  .addNode("greetingNode", greetingNode)
  .addNode("fallbackNode", fallbackNode)
  // 添加边
  .addEdge(START, "classify")                          // 入口 → classify
  .addConditionalEdges("classify", routeByType)         // classify → 根据类型分支
  .addEdge("mathNode", END)                             // mathNode → 结束
  .addEdge("greetingNode", END)                         // greetingNode → 结束
  .addEdge("fallbackNode", END)                         // fallbackNode → 结束
  .compile()

// ==================== 5. 运行 ====================

async function main() {
  const questions = [
    "计算 3 + 5",
    "你好呀",
    "今天天气怎么样",
  ]

  for (const q of questions) {
    console.log(`\n📌 问题: "${q}"`)
    const result = await graph.invoke({ question: q, answer: "", questionType: "", steps: [] })
    console.log(`  ✅ 回答: ${result.answer}`)
    console.log(`  📊 走过的节点: ${result.steps.join(" → ")}`)
  }
}

main()
