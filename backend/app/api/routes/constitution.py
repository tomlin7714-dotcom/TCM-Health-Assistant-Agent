"""
Placeholder constitution route for Phase 1.
Full scoring logic with RAG integration comes in Phase 3.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any

from app.db.database import get_db
from app.schemas.schemas import ConstitutionEvaluateRequest, ConstitutionResult
from app.api.routes.auth import get_current_user
from app.services.user_service import update_user
from app.schemas.schemas import UserUpdate

router = APIRouter(prefix="/constitution", tags=["constitution"])

# Standard 3-question simplified questionnaire (will expand to full 60-item in Phase 3)
QUESTIONS: List[Dict[str, Any]] = [
    {
        "id": 1,
        "category": "量表一：阳气与畏寒度",
        "title": "您平时感觉自己的身体温度和耐受度如何？",
        "options": [
            {"score": 1, "label": "特别怕冷，手脚常常冰冰凉，一吹空调或寒风就起鸡皮疙瘩。", "type": "阳虚质"},
            {"score": 2, "label": "耐受温和，四季体温比较均衡舒适，没有明显的畏寒或怕热。", "type": "平和质"},
            {"score": 3, "label": "特别容易燥热发热，平时特别多汗、总是口渴想喝冷水。", "type": "湿热质"},
        ],
    },
    {
        "id": 2,
        "category": "量表二：气运与精神原能",
        "title": "您平时白天的精力和气色状态如何？",
        "options": [
            {"score": 1, "label": "极其容易疲惫，经常感觉气短无力、懒得跟人多说话。", "type": "气虚质"},
            {"score": 2, "label": "精神饱满，气息平稳，极少有神色焦悴。", "type": "平和质"},
            {"score": 3, "label": "容易身体发懒、头重脚轻，大便黏腻或经常胃胀。", "type": "痰湿质"},
        ],
    },
    {
        "id": 3,
        "category": "量表三：面色、发质与体虚",
        "title": "您的面部气色与皮肤、头发的出油状态如何？",
        "options": [
            {"score": 1, "label": "面色苍白没有血色，发质枯槁、容易落发干燥。", "type": "气血虚"},
            {"score": 2, "label": "面色红润有光泽，发丝黑亮顺滑，皮肤弹性较好。", "type": "平和质"},
            {"score": 3, "label": "面部和头发出油严重，极易长粉刺痤疮、口发苦发臭。", "type": "湿热质"},
        ],
    },
]

CONSTITUTION_DESCRIPTIONS = {
    "阳虚质": "阳虚质是由于脏腑阳气不足，以怕冷、手足厥冷为特征的体质状态。多由天生元阳虚衰，或后天饱食生冷、熬夜伤阴引起。",
    "气虚质": "气虚质是因为一身之气亏虚，以神疲乏力、少气懒言为特征的体质状态。脾肺两虚，抵抗力偏低，极易感冒。",
    "湿热质": "湿热质指湿热内蕴，以面部出油、口苦口臭、大便粘滞等症状为突出的体质，平素性情容易暴躁。",
    "痰湿质": "痰湿质以体形偏胖、腹部松软、头重如裹、痰多易咳为特征，多由饮食不节、脾失健运所致。",
    "平和质": "平和质是九大体质中最为理想的状态。心身平衡，阴阳匀协，面色红润，精神极好，适应四季能力强。",
}

CONSTITUTION_ADVICE = {
    "阳虚质": "宜多吃韭菜、羊肉、干姜、红枣温补食物，忌喝凉茶、冷饮。推荐进行【八段锦】晨练，并在关元、足三里艾灸，保护体内元阳。",
    "气虚质": "宜进补人参、黄芪、大枣等大补中脾气胃气之物。推荐练习【太极导引】调理呼吸，促进中气生发。",
    "湿热质": "饮食宜清淡，少吃麻辣油炸。多吃赤小豆、薏苡仁、莲子祛湿清热。推荐经常进行【经络穴位按摩】。",
    "痰湿质": "宜少食肥甘厚腻，多吃白萝卜、山药、薏米健脾化湿。坚持中等强度运动，出汗有助祛湿。",
    "平和质": "常保饮食规律，起居有常。春防风，夏避暑，秋御燥，冬温阳。每日静心调息运动，可葆常青之元气。",
}


def _calculate_constitution(answers: List[int]) -> str:
    if len(answers) < 3:
        return "平和质"
    a0, a1, a2 = answers[0], answers[1], answers[2]
    if a0 == 1 and a1 == 1:
        return "阳虚质"
    if a1 == 1:
        return "气虚质"
    if a0 == 3 or a2 == 3:
        return "湿热质"
    if a1 == 3:
        return "痰湿质"
    if a0 == 2 and a1 == 2 and a2 == 2:
        return "平和质"
    return "阴虚质"


@router.get("/questions")
async def get_questions():
    return {"questions": QUESTIONS}


@router.post("/evaluate", response_model=ConstitutionResult)
async def evaluate_constitution(
    data: ConstitutionEvaluateRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    scores = [a.score for a in sorted(data.answers, key=lambda x: x.question_id)]
    constitution = _calculate_constitution(scores)
    await update_user(db, current_user, UserUpdate(constitution=constitution))
    return ConstitutionResult(
        constitution=constitution,
        description=CONSTITUTION_DESCRIPTIONS.get(constitution, ""),
        advice=CONSTITUTION_ADVICE.get(constitution, ""),
    )
