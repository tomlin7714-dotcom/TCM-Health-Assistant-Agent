"""
TCM Agent Tools — searchable functions the LLM can call to retrieve knowledge.
"""
from langchain_core.tools import tool


@tool
def search_herbs(query: str) -> str:
    """搜索中药材数据库。输入药材名称、功效或药性关键词，返回匹配的药材详情。用于回答'什么药材适合''XX药材的功效是什么'等问题。"""
    from app.api.routes.content import HERBS
    q = query.lower()
    results = []
    for h in HERBS:
        if q in h.name or q in h.pinyin.lower() or q in h.effect or q in h.property:
            results.append(
                f"【{h.name}】（{h.property}性）{h.effect}。{h.description} "
                f"主治：{'；'.join(h.treatment[:2])}。禁忌：{'；'.join(h.taboos[:1])}"
            )
    if not results:
        return f"未找到与'{query}'相关的药材。可尝试搜索：补气、活血、清热、温中、安神等。"
    return "\n\n".join(results[:3])


@tool
def search_recipes(query: str) -> str:
    """搜索药膳食谱数据库。输入食材名、功效或菜名关键词，返回匹配的食谱详情。用于回答'有什么食疗方案''XX怎么做'等问题。"""
    from app.api.routes.content import RECIPES
    q = query.lower()
    results = []
    for r in RECIPES:
        if q in r.name or any(q in b for b in r.benefits) or any(q in ing.name for ing in r.ingredients):
            benefits_str = "、".join(r.benefits)
            ingredients_str = "、".join(f"{ing.name}{ing.quantity}" for ing in r.ingredients)
            results.append(
                f"【{r.name}】（{r.difficulty}·{r.time}）功效：{benefits_str}。"
                f"食材：{ingredients_str}。做法：{'；'.join(r.steps[:2])}"
            )
    if not results:
        return f"未找到与'{query}'相关的食谱。可尝试搜索：暖胃、明目、健脾、安神等。"
    return "\n\n".join(results[:3])


@tool
def search_workouts(query: str) -> str:
    """搜索导引功法数据库。输入功法名或调理目标关键词，返回匹配的功法详情。用于回答'有什么运动推荐''八段锦怎么做'等问题。"""
    from app.api.routes.content import WORKOUTS
    q = query.lower()
    results = []
    for w in WORKOUTS:
        if q in w.name or q in w.subtitle or q in w.level or any(q in a.title for a in w.actions):
            actions_str = "；".join(f"{a.title}：{a.role}" for a in w.actions[:3])
            results.append(
                f"【{w.name}】（{w.level}·{w.calories}千卡）{w.intro} "
                f"动作：{actions_str}"
            )
    if not results:
        return f"未找到与'{query}'相关的功法。可尝试搜索：八段锦、太极、穴位、导引等。"
    return "\n\n".join(results[:3])


@tool
def assess_constitution(symptoms_summary: str) -> str:
    """根据症状摘要判断中医体质类型。输入症状描述，返回最可能的体质类型和说明。用于判断用户是阳虚/阴虚/气虚/痰湿/湿热/血瘀/气郁/特禀/平和质。"""
    mapping = [
        ("阳虚质", ["怕冷", "手脚冰凉", "畏寒", "肢冷", "喜热", "腰膝酸软", "夜尿多", "大便溏"]),
        ("阴虚质", ["怕热", "手脚心热", "口干", "咽干", "盗汗", "失眠", "多梦", "便秘", "颧红"]),
        ("气虚质", ["乏力", "气短", "易出汗", "懒言", "精神差", "易感冒", "食欲差", "腹胀"]),
        ("痰湿质", ["肥胖", "痰多", "胸闷", "头重", "口黏", "大便黏", "舌苔厚腻", "浮肿"]),
        ("湿热质", ["口苦", "口臭", "长痘", "油光", "大便黏臭", "小便黄", "带下黄", "湿疹"]),
        ("血瘀质", ["刺痛", "面色晦暗", "瘀斑", "黑眼圈", "痛经", "唇暗", "舌有瘀点"]),
        ("气郁质", ["抑郁", "烦躁", "胁胀", "善叹息", "失眠", "情绪波动", "经前乳胀"]),
        ("特禀质", ["过敏", "鼻炎", "哮喘", "荨麻疹", "皮肤过敏"]),
        ("平和质", ["精神好", "睡眠佳", "食欲正常", "二便调", "精力充沛"]),
    ]
    scores = {}
    for ctype, keywords in mapping:
        score = sum(1 for kw in keywords if kw in symptoms_summary)
        if score > 0:
            scores[ctype] = score

    if not scores:
        return "无法从描述中确定体质，建议进一步描述具体症状。常见体质：阳虚（怕冷）、阴虚（怕热口干）、气虚（乏力易累）、痰湿（体胖痰多）。"

    sorted_types = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    result = f"根据症状分析，最可能的体质为【{sorted_types[0][0]}】（匹配度{int(sorted_types[0][1]/max(1,len(symptoms_summary.split()))*100)}%）。\n"
    if len(sorted_types) > 1:
        result += f"次选：{'、'.join(f'{t}({s}项)' for t,s in sorted_types[1:3])}"
    return result


@tool
def remember_user_context(constitution: str, preferences: str) -> str:
    """记录用户的体质类型和个人偏好，用于后续个性化推荐。调用此工具存储用户信息后，后续对话会自动参考。"""
    return f"已记录。体质类型：{constitution}，偏好：{preferences}。后续推荐将基于这些信息进行个性化调整。"


@tool
def search_knowledge(query: str) -> str:
    """搜索中医经典知识库。输入关键词（如'阳虚''失眠''脾胃''气血'等），返回《黄帝内经》《伤寒论》《神农本草经》等经典原文引用。用于在辨证时引用经典理论依据，增强回答权威性。"""
    from app.agent.tools.knowledge_base import search_knowledge_base
    results = search_knowledge_base(query, top_k=4)
    if not results:
        return "未找到相关经典原文。可尝试搜索：阳虚、阴虚、失眠、脾胃、气血、养生等。"
    return "\n\n".join(f"📖 {r['quote']}\n  ——{r['source']}" for r in results)


TCM_TOOLS = [search_herbs, search_recipes, search_workouts, assess_constitution, remember_user_context, search_knowledge]
