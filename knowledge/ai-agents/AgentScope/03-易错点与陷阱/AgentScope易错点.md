---
tags: [易错点, AgentScope]
创建时间: 2026-07-11
---

# AgentScope 易错点汇总

## 1. Agent 构造没有 permission_context 参数(报错)

```python
# ❌ 错:Agent 不接受 permission_context
agent = Agent(..., permission_context=PermissionContext(...))
# TypeError: Agent.__init__() got an unexpected keyword argument 'permission_context'

# ✅ 对:权限配在 AgentState,通过 state= 传
state = AgentState(permission_context=PermissionContext(mode=PermissionMode.BYPASS))
agent = Agent(..., state=state)
```

**根因**:`permission_context` 是 `AgentState` 的字段,不是 `Agent` 构造参数。Agent 构造只接受 10 个参数(name/system_prompt/model/toolkit/middlewares/state/offloader/model_config/context_config/react_config)。
**教训**:`SubAgentTemplate`(app 层)有 `permission_context`,但底层 `Agent` 没有 —— 别从一个类的用法推断另一个。碰到 `unexpected keyword argument`,第一步看类的真实 `__init__` 签名。

## 2. DEFAULT 模式卡 REQUIRE_USER_CONFIRM

- **现象**:agent 调了工具(`TOOL_CALL_*`)但没给最终答案,程序就结束。
- **原因**:默认 DEFAULT 模式,工具执行前要用户确认,你没回复 → Agent 等待 → 流停住。
- **排查**:事件流加 `else: print(evt.type)`,看到 `REQUIRE_USER_CONFIRM`。
- **修复**:`AgentState(permission_context=PermissionContext(mode=PermissionMode.BYPASS))`。

## 3. dashscope_multiagent.py 不是真多 agent

它是**单 model 扮多角色**(DashScopeMultiAgentFormatter 把 alice/bob/moderator 历史格式化给一个 model),不是多个 Agent 实例协作。真多 agent 团队在**服务层**(`create_app` + Redis)。

## 4. Windows 控制台中文乱码

Python print 中文在 PowerShell 显示乱码(GBK 编码)。
**修复**:脚本开头加 `import sys; sys.stdout.reconfigure(encoding="utf-8")`,或跑时 `$env:PYTHONUTF8=1; uv run python script.py`。

## 5. uv run script.py 找不到

`uv run agent_weather.py` 报 `program not found`。
**修复**:用 `uv run python agent_weather.py`(显式 python 跑脚本)。

## 6. 模型名要准确

`qwen3.5-plus` / `qwen3.6-plus` / `qwen-plus` 是不同版本。以你跑通的为准。报 `model not found` 去百炼控制台看模型名。

## 🔗 关联

- [[../01-知识点总结/AgentScope核心概念与API]]
- [[../01-知识点总结/多agent与权限系统]]
