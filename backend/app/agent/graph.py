"""
TCM Diagnostic Agent - compatible with langgraph 1.x and langchain-core 1.x
"""
from typing import TypedDict, Optional


class DiagnoseState(TypedDict):
    symptoms: str
    image_base64: Optional[str]
    parsed_symptoms: Optional[str]
    image_analysis: Optional[str]
    diagnosis: Optional[str]
    advice: Optional[str]
    title: Optional[str]
    herb_id: Optional[str]
    recipe_id: Optional[str]
    constitution: Optional[str]
    error: Optional[str]


async def symptom_parser_node(state: DiagnoseState) -> DiagnoseState:
    from langchain_core.messages import HumanMessage, SystemMessage
    from app.agent.llm import get_text_llm
    from app.agent.prompts import SYMPTOM_PARSER_PROMPT
    llm = get_text_llm()
    result = await llm.ainvoke([
        SystemMessage(content=SYMPTOM_PARSER_PROMPT),
        HumanMessage(content=f"用户描述的症状：{state['symptoms']}"),
    ])
    return {**state, "parsed_symptoms": result.content}


async def image_analyzer_node(state: DiagnoseState) -> DiagnoseState:
    if not state.get("image_base64"):
        return {**state, "image_analysis": None}
    try:
        from langchain_core.messages import HumanMessage
        from app.agent.llm import get_vision_llm
        llm = get_vision_llm()
        image_data = state["image_base64"]
        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        result = await llm.ainvoke([
            HumanMessage(content=[
                {"type": "text", "text": "你是中医望诊专家。分析舌苔图片：舌色、苔色、苔厚薄、齿痕裂纹，给出寒热虚实判断。200字以内中文回答。"},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}},
            ])
        ])
        return {**state, "image_analysis": result.content}
    except Exception as e:
        return {**state, "image_analysis": f"图片分析暂时不可用：{str(e)}"}


async def tcm_diagnoser_node(state: DiagnoseState) -> DiagnoseState:
    from langchain_core.messages import HumanMessage, SystemMessage
    from app.agent.llm import get_text_llm
    from app.agent.prompts import TCM_DIAGNOSE_PROMPT
    llm = get_text_llm()
    combined = f"症状分析：{state.get('parsed_symptoms', state['symptoms'])}"
    if state.get("image_analysis"):
        combined += f"\n\n望诊分析：{state['image_analysis']}"
    result = await llm.ainvoke([
        SystemMessage(content=TCM_DIAGNOSE_PROMPT),
        HumanMessage(content=combined),
    ])
    content = result.content
    lines = [l.strip() for l in content.split("\n") if l.strip()]
    title = lines[0].lstrip("#").strip() if lines else "中医辨证分析"
    return {**state, "diagnosis": content, "title": title}


async def recommendation_generator_node(state: DiagnoseState) -> DiagnoseState:
    from langchain_core.messages import HumanMessage, SystemMessage
    from app.agent.llm import get_text_llm
    from app.agent.prompts import RECOMMENDATION_PROMPT
    llm = get_text_llm()
    result = await llm.ainvoke([
        SystemMessage(content=RECOMMENDATION_PROMPT),
        HumanMessage(content=f"辨证结果：{state.get('diagnosis', '')}\n\n原始症状：{state['symptoms']}"),
    ])
    herb_id, recipe_id, constitution = _map_to_content(state.get("diagnosis", ""))
    return {**state, "advice": result.content, "herb_id": herb_id, "recipe_id": recipe_id, "constitution": constitution}


def _map_to_content(diagnosis: str) -> tuple:
    d = diagnosis
    if any(k in d for k in ["阳虚", "寒", "怕冷", "手脚冰"]):
        return "h5", "r1", "阳虚质"
    if any(k in d for k in ["气虚", "乏力", "疲倦", "懒言"]):
        return "h3", "r3", "气虚质"
    if any(k in d for k in ["阴虚", "失眠", "多梦", "眼干", "目涩"]):
        return "h2", "r2", "阴虚质"
    if any(k in d for k in ["湿热", "痰湿", "湿", "胀"]):
        return "h6", "r3", "痰湿质"
    return "h1", "r2", "平和质"


def should_analyze_image(state: DiagnoseState) -> str:
    return "image_analyzer" if state.get("image_base64") else "tcm_diagnoser"


def build_tcm_agent():
    from langgraph.graph import StateGraph, END
    graph = StateGraph(DiagnoseState)
    graph.add_node("symptom_parser", symptom_parser_node)
    graph.add_node("image_analyzer", image_analyzer_node)
    graph.add_node("tcm_diagnoser", tcm_diagnoser_node)
    graph.add_node("recommendation_generator", recommendation_generator_node)
    graph.set_entry_point("symptom_parser")
    graph.add_conditional_edges(
        "symptom_parser",
        should_analyze_image,
        {"image_analyzer": "image_analyzer", "tcm_diagnoser": "tcm_diagnoser"},
    )
    graph.add_edge("image_analyzer", "tcm_diagnoser")
    graph.add_edge("tcm_diagnoser", "recommendation_generator")
    graph.add_edge("recommendation_generator", END)
    return graph.compile()


_tcm_agent = None


def get_tcm_agent():
    global _tcm_agent
    if _tcm_agent is None:
        _tcm_agent = build_tcm_agent()
    return _tcm_agent
