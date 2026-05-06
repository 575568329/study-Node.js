import { z } from "zod";
import { StateGraph, START, END, StateSchema } from "@langchain/langgraph";

type ReviewDecision = "approved" | "revise" | "force_final";
// 子图
const TeamState = new StateSchema({
  task: z.string(),
  researchNotes: z.string().default(""),
  draft: z.string().default(""),
  review: z.string().default(""),
  finalAnswer: z.string().default(""),
  reviewDecision: z.enum(["approved", "revise", "force_final"]).default("approved"),
  revisionCount: z.number().default(0)
})

function researcherNode(state: typeof TeamState.State) {
  return {
    researchNotes: `研究员结论：围绕「${state.task}」，Subgraph 适合封装复杂流程，Multi-Agent 适合角色协作。`,
  };
}

function writerNode(state: typeof TeamState.State) {
  return {
    draft: `写作员草稿：${state.task}\n${state.researchNotes}\n建议：用主图编排多个角色子图。`,
  };
}

function reviewerNode(state: typeof TeamState.State) {
  const hasTask = state.draft.includes(state.task);
  const hasResearch = state.draft.includes("Subgraph");

  const passed = hasTask && hasResearch
  const nextRevisionCount = passed ? state.revisionCount : state.revisionCount + 1;
  const reviewDecision: ReviewDecision = passed
  ?"approved"
  :nextRevisionCount >= 2
  ?"force_final"
  :"revise"
  return {
    review: passed
      ? "审核通过：草稿围绕任务展开，并引用了研究结论。"
      : nextRevisionCount >= 2
        ? "审核未完全通过：已达到最大修改次数，进入最终输出。"
        : "审核不通过：草稿缺少任务或研究依据，需要重写。",
    reviewDecision,
    revisionCount: nextRevisionCount
  };
}

function routeAfterReview(state: typeof TeamState.State) {
  return state.reviewDecision === "revise" ? "writer" : "final";
}

function finalNode(state: typeof TeamState.State) {
  return {
    finalAnswer: `${state.draft}\n\n${state.review}`,
  };
}

const teamGraph = new StateGraph(TeamState)
.addNode("researcher", researcherNode)
.addNode("writer",writerNode)
.addNode("reviewer", reviewerNode)
.addNode("final",finalNode)
.addEdge(START, "researcher")
.addEdge("researcher", "writer")
.addEdge("writer", "reviewer")
.addConditionalEdges("reviewer", routeAfterReview)
.addEdge("final", END)
.compile();

async function main() {
  const result = await teamGraph.invoke({
    task: '解释 LangGraph Multi-Agent的价值',
    researchNotes: "",
    draft: "",
    review: "",
    finalAnswer: "",
    reviewDecision: "approved",
    revisionCount: 0,
  })
  console.log(result)
}

main().catch((error) => {
  console.error("运行失败:",error)
})