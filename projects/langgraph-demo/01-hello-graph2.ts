import { StateGraph, StateSchema, START, END,ReducedValue } from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({
  question: z.string(),
  answer: z.string(),
  questionType: z.string(),
  steps: new ReducedValue(z.array(z.string()), {
    reducer: (prev, next) => prev.concat(next)
  })
})
//第一个节点一般是用来判断问题的类型

function classifyNode(state: typeof State.State) {
  const q = state.question.toLowerCase()

  let questionType = 'unknown'
  if (q.includes('计算') || q.includes('加') || q.includes('乘') || q.includes('+')) {
    questionType = 'math'
  } else if (q.includes('你好') || q.includes('hello') || q.includes('hi')) {
    questionType = 'greeting'
  }
  console.log(`  [classify] 问题类型: ${questionType}`)
  return { questionType, steps: ['classify'] }
}

function mathNode(state: typeof State.State) {
  console.log(`  [math] 处理数学问题...`)
  const answer = `数学回答："${state.question}" — 我是 Agent，可以调用计算器工具来帮你算！`
  return { answer, steps: ['math'] }
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

//使用策略模式来决定走哪个节点
function routeByType(state: typeof State.State): string {
  const map: Record<string, string> = {
    math: 'mathNode',
    greeting: 'greetingNode',
    unknown: 'fallbackNode',
  }
  return map[state.questionType] || 'fallbackNode'
}

//构建图
const graph = new StateGraph(State)
// 添加节点
.addNode('classifyNode', classifyNode) // 第一个节点就是判断问题类型的节点
.addNode('mathNode', mathNode)
.addNode('greetingNode', greetingNode)  
.addNode('fallbackNode', fallbackNode)
// 添加条件边
.addEdge(START, 'classifyNode') // 从 START 到 classifyNode
.addConditionalEdges('classifyNode', routeByType) // classifyNode 根据 questionType 分流到不同节点
.addEdge('mathNode', END) // mathNode 处理完就结束
.addEdge('greetingNode', END) // greetingNode 处理完就结束
.addEdge('fallbackNode', END) // fallbackNode 处理完就结束
.compile()

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