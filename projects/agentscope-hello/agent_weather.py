import asyncio
import os
from dotenv import load_dotenv
from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.model import DashScopeChatModel
from agentscope.credential import DashScopeCredential
from agentscope.tool import Toolkit, FunctionTool
from agentscope.state import AgentState
from agentscope.permission import PermissionContext, PermissionMode
from agentscope.event import EventType

load_dotenv()


def get_weather(city: str) -> str:
    """获取指定城市的天气。

    Args:
        city: 城市名,如"北京"。
    """
    return f"{city} 今天晴,25°C,微风。"


# 关键修复:权限配在 AgentState 里(Agent 构造没有 permission_context 参数)
# BYPASS = 跳过工具调用的用户确认,让 agent 自动执行
state = AgentState(
    permission_context=PermissionContext(mode=PermissionMode.BYPASS),
)

agent = Agent(
    name="Friday",
    system_prompt="你是天气助手。用户问天气时,调用 get_weather 工具获取,再用自然语言回答。",
    model=DashScopeChatModel(
        credential=DashScopeCredential(
            api_key=os.environ["DASHSCOPE_API_KEY"],
        ),
        model="qwen3.5-plus",
    ),
    toolkit=Toolkit(tools=[FunctionTool(get_weather)]),
    state=state,
)


async def main():
    async for evt in agent.reply_stream(UserMsg("Tony", "北京天气怎么样?")):
        if evt.type == EventType.REPLY_START:
            print("[开始回复]")
        elif evt.type == EventType.MODEL_CALL_START:
            print("[思考中...]")
        elif evt.type == EventType.TOOL_CALL_START:
            print(f"[调用工具: {evt.tool_call_name}]")
        elif evt.type == EventType.TOOL_CALL_END:
            print("[工具执行完]")
        elif evt.type == EventType.TEXT_BLOCK_DELTA:
            print(evt.delta, end="", flush=True)
    print()


if __name__ == "__main__":
    asyncio.run(main())
