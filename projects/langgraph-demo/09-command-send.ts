import { z } from "zod";
import { StateGraph, START, END, StateSchema, Send, ReducedValue, Command  } from "@langchain/langgraph";
import { registry } from "@langchain/langgraph/zod"

type workerInput = {
  task: string;
}

const PlannerState = new StateSchema({
  topic:z.string(),
  tasks:z.array(z.string()).default(()=>[]),
  results:new ReducedValue(
     z.array(z.string()).default(() => []),
    {
      inputSchema: z.array(z.string()),
      reducer: (existing, update) => existing.concat(update),
    }
  ),
  finalAnswer:z.string().default("")
})

function judgeNode(state: typeof PlannerState.State) {
  if (state.topic.includes("简单")) {
    return new Command({
      update: {
        finalAnswer: `简单问题直接回答: ${state.topic}`,
      },
      goto:END,
    })
  }

  return new Command({
    goto: "planner"
  })
}

function plannerNode(state: typeof PlannerState.State){
  return {
    tasks:[
      `查资料: ${state.topic}`,
      `分析代码: ${state.topic}`,
      `整理结论: ${state.topic}`,
    ]
  }
}

function routeTasks(state: typeof PlannerState.State){
  return state.tasks.map((task)=> new Send("worker",{ task }))
}

function workerNode(state:workerInput){
  
  console.log('接收数据',state.task);
  
  return {
    results: [`完成任务: ${state.task}`]
  }
}

function aggregatorNode(state: typeof PlannerState.State){
  return{
    finalAnswer:JSON.stringify(state.results)
  }
}

const graph = new StateGraph(PlannerState)
  .addNode("judge",judgeNode,{
    ends: ["planner",END]
  })
  .addNode("planner", plannerNode)
  .addNode("worker", workerNode)
  .addNode("aggregator", aggregatorNode)
  .addEdge(START, "judge")
  .addConditionalEdges("planner",routeTasks)
  .addEdge("worker","aggregator")
  .addEdge("aggregator", END)
  .compile()

async function main(){
  const stream = await graph.stream(
    {
      topic: '简单介绍 LangGraph',
      tasks: [],
      results: [],
      finalAnswer: "",
    },
    {
      streamMode:"updates",
    }
  );

  for await (const chunk of stream) {
    console.log("updates:", chunk);
    
  }
}

main().catch((error) => {
  console.error("运行失败:", error);
});