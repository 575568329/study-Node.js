import asyncio, os, sys
from dotenv import load_dotenv
from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.model import DashScopeChatModel
from agentscope.credential import DashScopeCredential
from agentscope.state import AgentState
from agentscope.permission import PermissionContext, PermissionMode
from agentscope.event import EventType

sys.stdout.reconfigure(encoding="utf-8")
load_dotenv()


def make_model():
    return DashScopeChatModel(
        credential=DashScopeCredential(api_key=os.environ["DASHSCOPE_API_KEY"]),
        model="qwen3.5-plus",
    )


def make_state():
    return AgentState(permission_context=PermissionContext(mode=PermissionMode.BYPASS))


translator = Agent(
    name="translator",
    system_prompt="你是专业翻译。把用户给的中文翻译成地道英文,只输出译文。",
    model=make_model(),
    state=make_state(),
)
proofreader = Agent(
    name="proofreader",
    system_prompt="你是英文校对。改进用户给的英文译文,更自然地道,只输出最终译文。",
    model=make_model(),
    state=make_state(),
)


async def run_agent(agent, prompt):
    result = ""
    async for evt in agent.reply_stream(UserMsg("user", prompt)):
        if evt.type == EventType.TEXT_BLOCK_DELTA:
            result += evt.delta
    return result


async def main():
    source = "今天天气真好,适合出去散步。"
    print(f"[原文] {source}\n")

    translated = await run_agent(translator, source)
    print(f"[translator 译文] {translated}\n")

    final = await run_agent(proofreader, f"请校对这段英文译文:{translated}")
    print(f"[proofreader 最终] {final}")


if __name__ == "__main__":
    asyncio.run(main())
