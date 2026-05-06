import { config } from "dotenv";
config();

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MessagesAnnotation, StateGraph, START, END } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

// ==================== 1. LLM ====================

const model = new ChatOpenAI({
  modelName: "glm-4-flash",
  temperature: 0.1,
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  configuration: {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
  },
});

const tools = [
  tool(({ expression }) => {
    const result = Function(`return ${expression}`)();
    return `计算结果: ${result}`;
  }, {
    name: "calculator",
    description: "一个计算器工具，输入数学表达式，输出计算结果",
    schema: z.object({ expression: z.string() }),
  }),

  tool(() => {
    return `当前时间是 ${new Date().toLocaleString("zh-CN")}`;
  }, {
    name: "getTime",
    description: "获取当前时间",
    schema: z.object({}),
  }),
];

// ==================== 2. Agent 节点 ====================

const modelWithTools = model.bindTools(tools);

async function llmNode(state: { messages: any[] }) {
  const response = await modelWithTools.invoke(state.messages);
  return { messages: [response] };
}

// ==================== 3. 构建图 ====================

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", llmNode)
  .addNode("tools", new ToolNode(tools))
  .addEdge(START, "agent")
  .addConditionalEdges("agent", toolsCondition, ["tools", END])
  .addEdge("tools", "agent")
  .compile();

// ==================== 4. 测试 ====================

async function main() {
  const questions = [
    "3 + 5 * 2 等于多少？",
    "现在几点了？",
    "你好，介绍一下你自己",
  ];

  for (const q of questions) {
    console.log(`\n📌 问题: "${q}"`);
    const result = await graph.invoke({
      messages: [new HumanMessage(q)],
    });

    const lastMsg = result.messages[result.messages.length - 1];
    console.log(`  ✅ 回答: ${lastMsg.content}`);
  }
}

main();
