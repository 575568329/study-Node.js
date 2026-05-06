import { config } from "dotenv";
config();

import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MessagesAnnotation, StateGraph, START, END, MemorySaver, Command, interrupt } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";

type CalculatorInput = {
  expression: string;
};

type DeleteFileInput = {
  filePath: string;
};
// ==================== 1. LLM ====================

const model = new ChatOpenAI({
  modelName: "glm-4-flash",
  temperature: 0.1,
  apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
  configuration: {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
  },
});

type ToolRiskLevel = "low" | "medium" | "high";

const toolPolicies: Record<string, {
  approvalRequired: boolean;
  riskLevel: ToolRiskLevel;
  reason: string;
}> = {
  calculator: {
    approvalRequired: false,
    riskLevel: "low",
    reason: "只做数学计算",
  },
  getTime: {
    approvalRequired: false,
    riskLevel: "low",
    reason: "只读取当前时间",
  },
  deleteFile: {
    approvalRequired: true,
    riskLevel: "high",
    reason: "删除文件是危险操作",
  },
};

function shouldRequireApproval(toolName: string): boolean {
  const policy = toolPolicies[toolName];

  if (!policy) {
    return true;
  }

  return policy.approvalRequired;
}

function withApproval<TInput>(
  toolName: string,
  handler: (input: TInput) => string
) {
  return (input: TInput) => {
    const policy = toolPolicies[toolName];

    if (!shouldRequireApproval(toolName)) {
      return handler(input);
    }

    const approval = interrupt({
      question: `是否允许执行工具 ${toolName}？`,
      toolName,
      riskLevel: policy?.riskLevel ?? "high",
      reason: policy?.reason ?? "未知工具，默认需要审批",
      input,
    }) as { approved: boolean };

    if (!approval.approved) {
      return `人工审批未通过，已取消执行工具:${toolName}`;
    }

    return handler(input);
  };
}

const tools = [
  tool(withApproval<CalculatorInput>("calculator", ({ expression }) => {
    const result = Function(`return ${expression}`)();
    return `计算结果: ${result}`;
  }), {
    name: "calculator",
    description: "一个计算器工具，输入数学表达式，输出计算结果",
    schema: z.object({ expression: z.string() }),
  }),

  tool( withApproval("getTime",() => {
    return `当前时间是 ${new Date().toLocaleString("zh-CN")}`;
  }), {
    name: "getTime",
    description: "获取当前时间",
    schema: z.object({}),
  }),

  // 危险工具
  tool(
    withApproval<DeleteFileInput>("deleteFile", ({ filePath }) => {
      return `已模拟删除文件: ${filePath}`;
    }),
    {
      name: "deleteFile",
      description: "删除指定路径的文件",
      schema: z.object({
        filePath: z.string(),
      }),
    }
  )
  
];

// memory
const checkpointer = new MemorySaver()


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
  .compile({checkpointer});

// ==================== 4. 测试 ====================

// async function main() {
//   const questions = [
//     "3 + 5 * 2 等于多少？",
//     "现在几点了？",
//     "你好，介绍一下你自己",
//   ];

//   for (const q of questions) {
//     console.log(`\n📌 问题: "${q}"`);
//     const result = await graph.invoke({
//       messages: [new HumanMessage(q)],
//     });

//     const lastMsg = result.messages[result.messages.length - 1];
//     console.log(`  ✅ 回答: ${lastMsg.content}`);
//   }
// }
// ID
const configurable = {
  configurable: {
    thread_id: "demo-chat-1"
  }
}
const configurable2 = {
  configurable: {
    thread_id: "demo-chat-2"
  }
}
async function main() {
  // const result1 = await graph.invoke(
  //   { messages: [new HumanMessage("我叫张三")] },
  //   configurable
  // );

  // console.log("第一轮：", result1.messages.at(-1)?.content);

  // const result2 = await graph.invoke(
  //   { messages: [new HumanMessage("我叫什么？")] },
  //   configurable
  // );

  // console.log("第二轮：", result2.messages.at(-1)?.content);
  // const result3 = await graph.invoke(
  //   { messages: [new HumanMessage("我叫什么？")] },
  //   configurable2
  // );

  // console.log("第三轮：", result3.messages.at(-1)?.content);

  //工具审批白名单
  const calculatorResult = await graph.invoke(
    {
      messages: [new HumanMessage("请计算 3 + 5")],
    },
    configurable
  )
  console.log('计算执行:',JSON.stringify(calculatorResult,null,2))
  // 执行删除工具的两段式执行
  const firstResult = await graph.invoke(
    {
      messages: [new HumanMessage("请删除 important.txt")],
    },
    configurable
  )
  console.log('第一次执行:',JSON.stringify(firstResult,null,2))

  const secondResult = await graph.invoke(
    new Command({
      resume: { approved:false },
    }),
    configurable
  )

  console.log('审批后执行:',JSON.stringify(secondResult,null,2))
}

main().catch((error) => {
  console.error("运行失败:", error);
});

