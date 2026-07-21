---
tags: [速查表, AgentScope]
创建时间: 2026-07-11
---

# AgentScope 速查表

## 🚀 最小可运行模板(ReActAgent + 工具)

```python
import asyncio, os, sys
from dotenv import load_dotenv
from agentscope.agent import Agent
from agentscope.message import UserMsg
from agentscope.model import DashScopeChatModel
from agentscope.credential import DashScopeCredential
from agentscope.tool import Toolkit, FunctionTool
from agentscope.state import AgentState
from agentscope.permission import PermissionContext, PermissionMode
from agentscope.event import EventType

sys.stdout.reconfigure(encoding="utf-8")   # Windows 防乱码
load_dotenv()


def my_tool(x: str) -> str:
    """工具说明(docstring 会给模型看)。"""
    return f"result: {x}"


agent = Agent(
    name="Friday",
    system_prompt="...",
    model=DashScopeChatModel(
        credential=DashScopeCredential(api_key=os.environ["DASHSCOPE_API_KEY"]),
        model="qwen3.5-plus",
    ),
    toolkit=Toolkit(tools=[FunctionTool(my_tool)]),
    state=AgentState(permission_context=PermissionContext(mode=PermissionMode.BYPASS)),
)


async def main():
    async for evt in agent.reply_stream(UserMsg("user", "...")):
        if evt.type == EventType.TEXT_BLOCK_DELTA:
            print(evt.delta, end="", flush=True)


asyncio.run(main())
```

## 🧱 Agent 构造参数(10)

`name`* / `system_prompt`* / `model`* / `toolkit` / `middlewares` / `state` / `offloader` / `model_config` / `context_config` / `react_config`
（* 必填。**没有 permission_context**,权限在 state 里）

## 📡 常用事件

`REPLY_START`/`END` · `MODEL_CALL_START`/`END` · `TEXT_BLOCK_DELTA` · `THINKING_BLOCK_DELTA` · `TOOL_CALL_START`/`DELTA`/`END` · `TOOL_RESULT_*` · `REQUIRE_USER_CONFIRM` · `EXCEED_MAX_ITERS`

## 🔐 权限模式(5)

| 模式 | 用途 |
|---|---|
| `DEFAULT` | 问确认(默认,会卡) |
| `ACCEPT_EDITS` | 自动读写 |
| `EXPLORE` | 只读 |
| **`BYPASS`** | **全跳过(demo 用)** |
| `DONT_ASK` | ASK 转 DENY |

## 🌐 模型对照(credential / ChatModel / env)

| 提供商 | Credential | ChatModel | 环境变量 |
|---|---|---|---|
| **DashScope(通义)** | DashScopeCredential | DashScopeChatModel | DASHSCOPE_API_KEY |
| OpenAI | OpenAICredential | OpenAIChatModel/ResponseModel | OPENAI_API_KEY |
| Anthropic | AnthropicCredential | AnthropicChatModel | ANTHROPIC_API_KEY |
| DeepSeek | DeepSeekCredential | DeepSeekChatModel | DEEPSEEK_API_KEY |
| Gemini | GeminiCredential | GeminiChatModel | GEMINI_API_KEY |
| Ollama(本地) | OllamaCredential | OllamaChatModel | 无需 key |

## ▶️ 跑法

```bash
uv add agentscope python-dotenv
uv run python script.py            # 注意 python 不能漏
# Windows 避免乱码:
$env:PYTHONUTF8=1; uv run python script.py
```

## 🆚 对比一句话

**LangChain 拼「链」· LangGraph 画「图」· AgentScope 建「Agent」**
