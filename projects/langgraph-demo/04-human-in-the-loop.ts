import {
  Command,
  END,
  interrupt,
  MemorySaver,
  START,
  StateGraph,
  StateSchema,
} from "@langchain/langgraph";
import { z } from "zod";

const State = new StateSchema({
  action: z.string(),
  approved: z.boolean().default(false),
  result: z.string(),
})

function prepareActionNode(){
  return {
    action: '删除 important.txt',
  }
}

function humanReviewNode(state: typeof State.State){
  const review = interrupt({
    question: "是否批准执行?",
    action: state.action,
  }) as { approved: boolean }

  return {
    approved: review.approved
  }
}

function executeActionNode(state: typeof State.State) {
  if (!state.approved) {
    return {
      result: `已取消: ${state.action}`
    }
  }

  return {
    result: `已执行: ${state.action}`
  }
}

const checkpointer = new MemorySaver();

const graph = new StateGraph(State)
.addNode('prepareActionNode',prepareActionNode)
.addNode('humanReviewNode',humanReviewNode)
.addNode('executeActionNode',executeActionNode)
.addEdge(START,'prepareActionNode')
.addEdge('prepareActionNode','humanReviewNode')
.addEdge('humanReviewNode','executeActionNode')
.addEdge("executeActionNode", END)
.compile({ checkpointer });

async function main() {
  const runConfig = {
    configurable: {
      thread_id: "approval-demo-1"
    }
  }

  const firstResult = await graph.invoke(
    {action:"",approved: false, result: ""},
    runConfig
  )

  console.log("第一次执行结果:",JSON.stringify(firstResult, null, 2))

  const secondResult = await graph.invoke(
    new Command({
      resume: { approved: false },
    }),
    runConfig
  )

  console.log("恢复后结果:", JSON.stringify(secondResult, null, 2))
}

main().catch((error)=>{
  console.error('运行失败', error)
})