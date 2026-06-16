"""
TCM ReAct Agent — LLM autonomously decides when to call tools vs respond to user.
Uses LangGraph with tool-calling loop: Think → Act → Observe → Think → Respond.
"""
from typing import TypedDict, Annotated, Optional
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage


SYSTEM_PROMPT = """你是一位精通中医辨证论治的资深中医师，熟读《黄帝内经》《伤寒杂病论》等经典。你拥有以下工具来辅助诊断：

可用工具：
- search_herbs: 搜索药材数据库，查找药材功效和用法
- search_recipes: 搜索药膳食谱，推荐食疗方案
- search_workouts: 搜索导引功法，推荐运动调理
- assess_constitution: 根据症状判断体质类型
- remember_user_context: 记录用户体质和偏好

你的工作方式：
1. 用户描述症状后，先用 assess_constitution 判断体质
2. 根据需要调用 search_herbs、search_recipes、search_workouts 查找对应的调理方案
3. 如果信息不够充分，主动追问用户
4. 综合所有信息后，给出完整的辨证分析和调养建议
5. 用 remember_user_context 记录用户体质，方便下次参考

最终回答格式要求：
第一行必须写：辨证名称：XXX（简洁有力，不超过15字）
然后分两段：【病机分析】和【调养方案】
调养方案中整合你刚才查询到的具体药材、食谱和功法推荐
结尾：如症状持续或加重请就医。

你的回答将直接展示给患者，不要输出"好的"、"明白了"等过渡语，直接给出辨证结果。"""


class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    user_context: Optional[str]


def _load_tools():
    from app.agent.tools.tcm_tools import TCM_TOOLS
    return TCM_TOOLS


async def agent_node(state: AgentState) -> AgentState:
    """LLM call with tool binding — decides whether to respond or call tools."""
    from app.agent.llm import get_text_llm
    tools = _load_tools()
    llm = get_text_llm().bind_tools(tools)

    messages = [SystemMessage(content=SYSTEM_PROMPT)] + state["messages"]

    # Inject user context if available
    if state.get("user_context"):
        messages.insert(1, SystemMessage(content=f"用户已记录的体质/偏好信息：{state['user_context']}"))

    response = await llm.ainvoke(messages)
    return {"messages": [response]}


def should_continue(state: AgentState) -> str:
    """Check if the last message has tool calls — if so, route to tools node."""
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "tools"
    return "end"


async def tools_node(state: AgentState) -> AgentState:
    """Execute tool calls from the LLM."""
    from langchain_core.messages import ToolMessage
    tools = {t.name: t for t in _load_tools()}

    last_msg = state["messages"][-1]
    tool_messages = []

    for tc in last_msg.tool_calls:
        tool = tools.get(tc["name"])
        if tool:
            try:
                result = await tool.ainvoke(tc["args"])
                tool_messages.append(ToolMessage(content=str(result), tool_call_id=tc["id"]))
            except Exception as e:
                tool_messages.append(ToolMessage(content=f"工具调用出错：{e}", tool_call_id=tc["id"]))

    return {"messages": tool_messages}


def build_tcm_agent():
    graph = StateGraph(AgentState)

    graph.add_node("agent", agent_node)
    graph.add_node("tools", tools_node)

    graph.set_entry_point("agent")

    graph.add_conditional_edges(
        "agent",
        should_continue,
        {"tools": "tools", "end": END},
    )
    graph.add_edge("tools", "agent")

    return graph.compile()


_tcm_agent = None


def get_tcm_agent():
    global _tcm_agent
    if _tcm_agent is None:
        _tcm_agent = build_tcm_agent()
    return _tcm_agent
