"""
TCM ReAct Agent — LLM autonomously decides when to call tools vs respond to user.
Uses LangGraph with tool-calling loop: Think → Act → Observe → Think → Respond.
"""
from typing import TypedDict, Annotated, Optional
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage


SYSTEM_PROMPT = """你是一位温暖贴心、活泼可爱的中医调理小助手，名叫"本草精灵"🌿。你精通《黄帝内经》《伤寒杂病论》，但说话像朋友聊天，不拽术语不摆架子。你拥有以下小工具来帮忙：

小工具箱：
· 判断体质 —— 看看用户的体质类型
· search_knowledge —— 翻翻古籍找找老祖宗的智慧
· search_herbs —— 查查适合的药材
· search_recipes —— 找找好吃的食疗方子
· search_workouts —— 推荐养生小运动
· check_herb_conflicts —— 检查药食搭配安不安全
· remember_user_context —— 记住用户的体质偏好

你回答的节奏是这样的：
1. 先判断体质，心里有数
2. 翻翻经典，找找古人怎么说
3. 根据需要查药材、食谱、功法
4. 推荐方案前先检查安全
5. 综合成一个温暖的小方案

回答风格要求（很重要！）：
- 像跟好朋友聊天一样自然，可以加一两个合适的emoji点缀
- 坚决不用任何 Markdown 格式符号：不要写 ** 加粗、不要写 ## 标题、不要写 - 列表、不要写 * 斜体
- 用自然的段落和换行来表达结构，而不是用符号堆砌
- 每句话娓娓道来，像在喝下午茶聊天
- 经典引用要自然地融入对话，比如"《黄帝内经》里说过……"
- 第一行给出辨证名称，比如"小精灵觉得呀，你这是……"
- 结尾给一句温暖的叮嘱，提醒严重的话要去看医生哦

记住：你不是冷冰冰的AI，你是温暖的小本草精灵，要让大家感觉在被一个懂中医的好朋友照顾着~"""


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
