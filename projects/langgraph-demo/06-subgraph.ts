import { z } from "zod";
import { StateGraph, START, END, StateSchema } from "@langchain/langgraph";

const WriterState = new StateSchema({
  topic: z.string(),
  researchSummary: z.string(),
  draft: z.string().default(""),
})

function draftNode(state: typeof WriterState.State) {
  return {
    draft: `围绕[${state.topic}]写作:\n${state.researchSummary}\n结论: Subgraph 适合封装复杂子流程.`,
  }
}

const writerGraph = new StateGraph(WriterState)
.addNode("generateDraft", draftNode)
.addEdge(START, "generateDraft")
.addEdge("generateDraft",END)
.compile();

const ResearchState = new StateSchema({
  query: z.string(),
  documents: z.array(z.string()).default([]),
  summary: z.string().default(""),
})

function searchNode(state: typeof ResearchState.State) {
  return {
    documents: [
      `关于「${state.query}」的资料 A`,
      `关于「${state.query}」的资料 B`,
    ],
  };
}

function summarizeNode(state: typeof ResearchState.State) {
  return {
    summary: `基于 ${state.documents.length} 条资料，总结：${state.documents.join("；")}`,
  };
}

const researchGraph = new StateGraph(ResearchState)
.addNode("search",searchNode)
.addNode("summarize", summarizeNode)
.addEdge(START, "search")
.addEdge("search", "summarize")
.addEdge("summarize", END)
.compile();


const MainState = new StateSchema({
  question: z.string(),
  researchSummary: z.string().default(""),
  finalAnswer: z.string().default(""),
  draft: z.string().default(""),
})

async function callResearchSubgraph(state: typeof MainState.State) {
  const researchResult = await researchGraph.invoke({
    query: state.question,
    documents: [],
    summary: ""
  });

  return {
    researchSummary: researchResult.summary,
  }
}

async function callWriterSubgraph(state: typeof MainState.State){
  const writerResult = await writerGraph.invoke({
    topic: state.question,
    researchSummary: state.researchSummary,
    draft: ""
  })

  return {
    draft: writerResult.draft,
  }
}

function finalNode(state: typeof MainState.State){
  return {
    finalAnswer: `最终回答: \n${state.draft}`
  }
}

const mainGraph = new StateGraph(MainState)
.addNode("research",callResearchSubgraph)
.addNode("writer", callWriterSubgraph)
.addNode("final",finalNode)
.addEdge(START,"research")
.addEdge("research", "writer")
.addEdge("writer","final")
.addEdge("final",END)
.compile();

//main
async function main(){
  const result = await mainGraph.invoke({
    question: "LangGraph Subgraph 有什么用?",
    researchSummary: "",
    finalAnswer: "",
  })

  console.log(result);
  
}

main().catch((error)=>{
  console.error("运行失败", error);
})