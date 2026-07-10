import asyncio
import os
from dotenv import load_dotenv
from agentscope.message import Msg, TextBlock, ThinkingBlock
from agentscope.model import DashScopeChatModel
from agentscope.credential import DashScopeCredential

load_dotenv()  # 从 .env 加载 DASHSCOPE_API_KEY

async def stream_and_print(gen):
    """简化版流式收集:实时打印思考 + 回答,返回最终响应。"""
    final = None
    in_thinking = False
    async for chunk in gen:
        if chunk.is_last:           # 最后一个 chunk 是累积完整结果
            final = chunk
            continue
        for block in chunk.content:
            if isinstance(block, ThinkingBlock):   # 思考过程
                if not in_thinking:
                    print("[思考] ", end="", flush=True)
                    in_thinking = True
                print(block.thinking, end="", flush=True)
            elif isinstance(block, TextBlock):     # 正式回答
                if in_thinking:
                    print("\n--- 回答 ---")
                    in_thinking = False
                print(block.text, end="", flush=True)
    print()
    return final

async def main():
    model = DashScopeChatModel(
        credential=DashScopeCredential(
            api_key=os.environ["DASHSCOPE_API_KEY"],
        ),
        model="qwen3.5-plus",                              # 2026 版模型名
        stream=True,
        parameters=DashScopeChatModel.Parameters(thinking_enable=True),  # 开思考模式
    )
    msgs = [
        Msg(
            name="user",
            content=[TextBlock(text="用一句话解释什么是 Actor 模型")],
            role="user",
        ),
    ]
    await stream_and_print(await model(msgs))

if __name__ == "__main__":
    asyncio.run(main())
