# AgentScope 学习笔记

> 阿里达摩院 Python 多 agent 框架(P0-2)。金海指定(替换 langchain/langgraph),匹配通义千问/阿里云生态。

> 🧠 **记忆锚点**:AgentScope = 建「Agent」(给它大脑+工具,它自己 ReAct 循环,事件流可观测、权限内置)。对比:LangChain 拼「链」、LangGraph 画「图」、AgentScope 建「Agent」。权限配在 `AgentState(permission_context=BYPASS)`,不是 Agent 构造参数。多 agent 两层:脚本手动编排 / 服务层原生团队(Leader·Worker,要 Redis)。

## 进度概览

- **状态**: ✅ P0-2 完成(三步全通:起手 model 直调 / ReActAgent+工具 / 多 agent 流水线)
- **实战项目**: `projects/agentscope-hello/`
  - `agent_weather.py`:ReActAgent + get_weather 工具(BYPASS 权限)
  - `multi_agent.py`:翻译→校对 流水线
- **关联**: [[../MCP/INDEX|MCP]]、[[../Skill/INDEX|Skill]]、[[../LLM-API/INDEX|LLM-API]](AgentScope 内置 mcp/skill/rag 模块)

---

## 笔记目录

### [01-知识点总结](01-知识点总结/)

| 文件 | 内容 |
|---|---|
| [AgentScope核心概念与API.md](01-知识点总结/AgentScope核心概念与API.md) | 心智模型、五大抽象、Agent构造10参数、AgentState、事件流、ReAct循环、对比LangChain/LangGraph |
| [多agent与权限系统.md](01-知识点总结/多agent与权限系统.md) | 多agent两层(脚本/服务层)、流水线demo、PermissionMode五模式、REQUIRE_USER_CONFIRM |

### [03-易错点与陷阱](03-易错点与陷阱/)

| 文件 | 内容 |
|---|---|
| [AgentScope易错点.md](03-易错点与陷阱/AgentScope易错点.md) | Agent无permission_context参数、权限配AgentState、DEFAULT卡确认、Windows乱码、multiagent非真多agent |

### [05-速查表](05-速查表/)

| 文件 | 内容 |
|---|---|
| [AgentScope速查表.md](05-速查表/AgentScope速查表.md) | 最小可运行模板 / Agent构造 / 事件类型 / 权限模式 / 模型对照 |

---

## 待深挖(P0-2 收尾后)

- AgentScope 配置文档(zread.ai/agentscope-ai/agentscope/):
  - `6-agent-class-and-react-loop`(Agent 类)
  - `8-agent-state-management`(状态)
  - `21-permission-engine-and-rules`(权限)
  - `11-model-provider-architecture`(模型)
- 服务层多 agent(`create_app` + Redis):真 Leader/Worker 团队
- middlewares 中间件(RAG / 记忆 / 预算控制)
- 内置 mcp / skill 模块实战(关联已学 MCP/Skill)
