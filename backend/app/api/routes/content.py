"""
Static content endpoints for herbs, recipes, and workouts.
Phase 1: data served from in-memory seed list.
Phase 2 will migrate retrieval to ChromaDB RAG.
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel


class HerbOut(BaseModel):
    id: str
    name: str
    pinyin: str
    property: str
    flavor: str
    origin: str
    description: str
    effect: str
    treatment: List[str]
    research: str
    taboos: List[str]
    image: str
    isFeatured: bool = False


class IngredientOut(BaseModel):
    name: str
    quantity: str
    icon: str


class RecipeOut(BaseModel):
    id: str
    name: str
    benefits: List[str]
    time: str
    difficulty: str
    intro: str
    ingredients: List[IngredientOut]
    steps: List[str]
    image: str


class WorkoutActionOut(BaseModel):
    order: int
    title: str
    keys: str
    role: str


class WorkoutOut(BaseModel):
    id: str
    name: str
    subtitle: str
    teacher: str
    level: str
    students: int
    calories: int
    actionsCount: int
    intro: str
    image: str
    actions: List[WorkoutActionOut]


HERBS: List[HerbOut] = [
    HerbOut(
        id="h1", name="人参", pinyin="Renshen", property="微温",
        flavor="甘、微苦，归脾、肺、心、肾经", origin="神农本草经",
        description="大补元气，复脉固脱，补脾益肺，生津养血，安神益智。",
        isFeatured=True, effect="大补元气，强心固脱，健脾生津",
        treatment=["体虚欲脱、肢冷脉微，大病、久病后元气大伤。",
                   "脾气不足、中气下陷之神疲乏力、食少便溏。",
                   "肺气亏虚、短气喘促，或热病伤津、气阴两伤之口渴。",
                   "心神不安、失眠多梦、惊悸健忘。"],
        research="人参主要含有多种人参皂苷、人参多糖及挥发油。具有抗疲劳、增强免疫力、改善心肌缺血、延缓衰老及双向调节血压和血糖的作用。",
        taboos=["实证、热证及正气不虚者忌服。", "不宜与藜芦同用，服用期间忌喝茶与食萝卜。"],
        image="/uploads/herbs/人参.png",
    ),
    HerbOut(
        id="h2", name="枸杞子", pinyin="Gouqizi", property="平",
        flavor="甘，归肝、肾、肺经", origin="神农本草经",
        description="滋补肝肾，益精明目。用于虚劳精亏，腰膝酸痛，眩晕耳鸣，内热消渴，目昏不明。",
        isFeatured=True, effect="滋补肝肾，养血明目，润肺止咳",
        treatment=["肝肾阴虚、精血不足所致的腰膝酸软、头晕目眩。",
                   "目暗不明、两目干涩、视力减退等症（常配伍菊花）。",
                   "肺肾阴虚、劳嗽干咳、消渴引饮者。"],
        research="枸杞子富含枸杞多糖、β-胡萝卜素、叶黄素、多种维生素和氨基酸。能显著提高免疫功能、抗氧化、保护视网膜感光细胞。",
        taboos=["因本品滋腻，外感实热、脾虚便溏、湿热内蕴者不宜服用。"],
        image="/uploads/herbs/枸杞子.png",
    ),
    HerbOut(
        id="h3", name="黄芪", pinyin="Huangqi", property="微温",
        flavor="甘，归脾、肺经", origin="神农本草经",
        description="补气升阳，固表止汗，利水消肿，生津养血，行滞通痹，托毒排脓，敛疮生肌。",
        isFeatured=True, effect="补气升阳，固表止汗，敛疮生肌",
        treatment=["脾胃气虚之乏力便溏、中气下陷之脏器脱垂。",
                   "肺气虚、表虚不固之自汗易感，或气虚水停之小便不利、浮肿。",
                   "气血不足之痈疽难溃，或溃久不敛。",
                   "气虚血滞之肢体麻木、半身不遂之气虚血瘀。"],
        research="黄芪含有黄芪多糖、黄芪皂苷、黄酮类化合物等。具有免疫调节、心血管系统保护、抗衰老、抗应激以及对肾脏的保护作用。",
        taboos=["表实邪盛、内有实热、阳亢阴虚或痈疽初起红肿热痛者不宜服用。"],
        image="/uploads/herbs/黄芪.png",
    ),
    HerbOut(
        id="h4", name="菊花", pinyin="Juhua", property="微寒",
        flavor="甘、苦，归肺、肝经", origin="神农本草经",
        description="散风清热，平肝明目，清热解毒。常用治风热感冒，头痛眩晕，目赤肿痛，疮痈肿毒。",
        isFeatured=False, effect="散风清热，平肝明目，清热解毒",
        treatment=["外感风热、温病初起之发热恶风、头痛咳嗽。",
                   "肝阳上亢之头痛眩晕、耳鸣目胀。",
                   "肝经风热、实火之目赤肿痛、迎风流泪或眼目干涩。",
                   "热毒疮肿、咽喉肿痛等实热证。"],
        research="菊花含有丰富的挥发油、黄酮类及绿原酸等成分。具有抗菌消炎、抗感冒病毒、扩张冠状动脉、增加冠脉血流量、降低血压的作用。",
        taboos=["阳虚体质、脾胃虚寒、食少泄泻及孕妇应慎用。"],
        image="/uploads/herbs/菊花.png",
    ),
    HerbOut(
        id="h5", name="干姜", pinyin="Ganjiang", property="热",
        flavor="辛，归脾、胃、肾、心、肺经", origin="神农本草经",
        description="温中散寒，回阳通脉，温肺化饮。主治脾胃虚寒之脘腹冷痛、呕吐泄泻；亡阳之四肢厥冷。",
        isFeatured=False, effect="温脾胃之寒，回阳通脉，温肺化饮",
        treatment=["脾胃虚寒、中焦冷痛、自利不渴、呕吐不止（理中汤证）。",
                   "心肾阳衰、阴寒内盛、四肢逆冷、脉微欲绝（常与附子配伍，四逆汤）。",
                   "肺寒津阻、寒饮咳喘、痰多清稀（小青龙汤）。"],
        research="干姜含有挥发油及姜辣素（包括姜酚、姜酮）。能促进胃液分泌和肠胃运动，具有镇吐、抗溃疡、强心、消炎止痛功效。",
        taboos=["阴虚火旺、血热妄行之出血证及孕妇忌服。"],
        image="/uploads/herbs/干姜.png",
    ),
    HerbOut(
        id="h6", name="甘草", pinyin="Gancao", property="平",
        flavor="甘，归心、肺、脾、胃经", origin="神农本草经",
        description="补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。素有国老之称。",
        isFeatured=False, effect="补脾益气，清热解毒，祛痰止咳，调和诸药",
        treatment=["脾胃虚弱、中气不足、心悸气短（炙甘草汤）。",
                   "痈疽疮毒、咽喉肿痛以及食物药物中毒之解毒。",
                   "咳嗽痰多、气喘，或脘腹、四肢挛急疼痛。",
                   "调和处方中各种药物的烈性，降低毒副作用。"],
        research="甘草提取物主要有甘草甜素、甘草酸、黄酮类及多糖。具有糖皮质激素样作用、抗溃疡、解痉止痛，并具有保肝和心肌细胞保护作用。",
        taboos=["湿盛胀满、水肿、高血压患者忌过量或长期服用。",
                "不宜与大戟、芫花、甘遂、海藻同用（十八反）。"],
        image="/uploads/herbs/甘草.png",
    ),
]

RECIPES: List[RecipeOut] = [
    RecipeOut(
        id="r1", name="冬日红枣姜糖茶",
        benefits=["温中散寒", "健脾暖胃", "养血安神"],
        time="20分钟", difficulty="入门",
        intro="专为胃寒、手脚冰凉的人群设计。干姜能温中散寒，红枣补脾胃之气，红糖暖肝温经，三者相得益彰。",
        ingredients=[
            IngredientOut(name="干姜丝", quantity="5克", icon="Sprout"),
            IngredientOut(name="红枣（去核）", quantity="6-8枚", icon="Leaf"),
            IngredientOut(name="老红糖", quantity="15克", icon="Flame"),
            IngredientOut(name="纯净水", quantity="500毫升", icon="Compass"),
        ],
        steps=["准备食材，将干姜洗净并切成细丝，红枣对半剖开并去核。",
               "将干姜丝与去核红枣放入养生壶，注入500毫升纯净水。",
               "武火煮沸，随后转文火慢熬15分钟，使药性成分充分溶出。",
               "最后5分钟放入老红糖，缓缓搅拌至完全融化。",
               "趁热代茶饮，微微出汗为最佳，能迅速驱寒暖手暖脚。"],
        image="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    ),
    RecipeOut(
        id="r2", name="杞菊清肝明目茶",
        benefits=["明目益肝", "散风清热", "滋补肝肾"],
        time="15分钟", difficulty="入门",
        intro="适用于长期使用电脑和手机，导致眼睛干涩、头晕目昏的人群。菊花清热散风，枸杞滋润肝肾。",
        ingredients=[
            IngredientOut(name="杭白菊", quantity="6朵", icon="Heart"),
            IngredientOut(name="宁夏枸杞子", quantity="10克", icon="Eye"),
            IngredientOut(name="麦冬", quantity="3克", icon="Droplet"),
            IngredientOut(name="沸水", quantity="400毫升", icon="Zap"),
        ],
        steps=["用清水将菊花和枸杞子、麦冬轻柔冲洗一遍。",
               "将所有材料放入茶杯或玻璃茶壶中。",
               "倒入刚沸腾的开水约400毫升，盖上杯盖进行闷泡。",
               "静置闷泡10分钟，等菊花徐徐绽放，茶汤色泽渐趋淡黄。",
               "温服饮用。可反复冲泡2-3次，最后将枸杞子一同嚼服。"],
        image="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    ),
    RecipeOut(
        id="r3", name="黑米红豆健脾粥",
        benefits=["健脾暖胃", "去湿消肿", "补血乌发"],
        time="50分钟", difficulty="中级",
        intro="针对湿气偏重、脾胃虚弱、精神疲倦、大便溏软的人群。红豆行水祛湿，黑米黑豆滋肾健脾。",
        ingredients=[
            IngredientOut(name="红小豆", quantity="40克", icon="Award"),
            IngredientOut(name="黑米", quantity="50克", icon="Sun"),
            IngredientOut(name="糙米", quantity="30克", icon="Wind"),
            IngredientOut(name="去核红枣", quantity="4枚", icon="Shield"),
        ],
        steps=["将红小豆、黑米和糙米提前在冷水中浸泡4小时以上。",
               "将泡好的食材洗净后滤干，倒入砂锅内。",
               "一次性加入冷水约1200毫升，放入去核红枣。",
               "砂锅置于火上，大火烧沸后撇去浮沫。",
               "转成极小火，慢熬约40分钟，中途搅拌数次防粘底。",
               "待粥体粘稠，红豆煮至酥软爆花，关火闷5分钟，温热食用。"],
        image="https://images.unsplash.com/photo-1536304997881-a372c179924b?auto=format&fit=crop&w=600&q=80",
    ),
]

WORKOUTS: List[WorkoutOut] = [
    WorkoutOut(
        id="w1", name="健身气功·八段锦",
        subtitle="国家体育总局推荐气功功法", teacher="国医堂 张景明 教授指导",
        level="入门", students=12480, calories=180, actionsCount=8,
        intro="八段锦起源于宋代，是一套独立完整的健身气功功法，全套共八个动作，能全面疏通十二经脉，调和五脏六腑之气。",
        image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
        actions=[
            WorkoutActionOut(order=1, title="双手托天理三焦", keys="吸气时双手托天，呼气时徐徐落下", role="调理上焦、中焦、下焦，宣通肺气。"),
            WorkoutActionOut(order=2, title="左右开弓似射雕", keys="展肩扩胸，马步拉弓，眼注视指尖", role="疏理肝气，矫正脊柱，健脾益胃。"),
            WorkoutActionOut(order=3, title="调理脾胃须单举", keys="双手交替上下单托，一升一降牵拉中焦", role="活动脾胃之气，通达胃经、脾经。"),
            WorkoutActionOut(order=4, title="五劳七伤往后瞧", keys="转头向后凝望，身体重心微微下沉", role="缓解精神压力，保养中枢神经。"),
            WorkoutActionOut(order=5, title="摇头摆尾去心火", keys="宽步俯身，头尾相应旋转，顺接呼引", role="宣泄心火，活血滋肾开胃。"),
            WorkoutActionOut(order=6, title="两手攀足固肾腰", keys="柔顺俯身两手顺脚背攀足，膝关节绷直", role="锻炼腰肾部肌肉群，强固肾水。"),
            WorkoutActionOut(order=7, title="攒拳怒目增气力", keys="马步直冲重拳，大睁双目注视前方", role="疏泄肝胆积热，激发精气神。"),
            WorkoutActionOut(order=8, title="背后七颠百病消", keys="两脚跟提起提肛，颠足下落震动周身", role="整合诸经气血，消除体内浊气顽疾。"),
        ],
    ),
    WorkoutOut(
        id="w2", name="晨起太极导引法",
        subtitle="古法太极五行导引秘传", teacher="武当派 虚静道长 主讲",
        level="中级", students=5820, calories=220, actionsCount=4,
        intro="太极导引法注重呼吸吐纳与柔和展体完美结合，适合清晨顺应大自然生发之气，调理奇经八脉，振奋阳气。",
        image="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        actions=[
            WorkoutActionOut(order=1, title="紫气东来迎太虚", keys="面向东方，两腿开立，双臂沿两侧提至胸前，做气降丹田", role="吐故纳新，将大自然清阳之气导入体内。"),
            WorkoutActionOut(order=2, title="拨云见日抱合一", keys="两手从内向外分云，下沉，呈太极抱球动作", role="平衡体内阴阳之气，使清气升浊气降。"),
            WorkoutActionOut(order=3, title="神龙戏水探乾坤", keys="身躯呈S型蛇形柔动，左右扭腰展肩", role="疏理脊髓督脉，促进全身气血通达。"),
            WorkoutActionOut(order=4, title="混元交泰归丹田", keys="左手放肚脐，右手交叠附于其上，静心深呼吸", role="收功固本，将锻炼产生之元气深藏于腹部下丹田。"),
        ],
    ),
    WorkoutOut(
        id="w3", name="日常经络穴位按摩",
        subtitle="居家绿色无药止痛御湿指南", teacher="针灸科 林海峰 教授示范",
        level="入门", students=9320, calories=60, actionsCount=3,
        intro="通过双手手指对身体关键腧穴进行按、摩、推、揉，达到通经络、调脏腑、减缓疲劳的作用。",
        image="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
        actions=[
            WorkoutActionOut(order=1, title="按揉足三里·健脾保胃", keys="在外膝眼下三寸，骨旁开一横指。大拇指重按旋转揉动", role="强健脾胃，提升中焦原能，对胃胀有神效。"),
            WorkoutActionOut(order=2, title="按压合谷穴·清热止痛", keys="手背虎口，第二掌骨中点。朝食指方向使力酸胀按压", role="散风清热，缓解由于上火引发的头痛牙胀不适。"),
            WorkoutActionOut(order=3, title="按揉内关穴·安神宽胸", keys="腕横纹上两寸，两筋之间。以指尖垂直点戳按摩", role="宽胸解郁，调理心慌、神经紧张性失眠。"),
        ],
    ),
]

# ── Routers ───────────────────────────────────────────────────────────────────

herbs_router = APIRouter(prefix="/herbs", tags=["herbs"])
recipes_router = APIRouter(prefix="/recipes", tags=["recipes"])
workouts_router = APIRouter(prefix="/workouts", tags=["workouts"])


@herbs_router.get("", response_model=List[HerbOut])
async def list_herbs(
    featured: Optional[bool] = Query(None),
    search: Optional[str] = Query(None),
):
    result = HERBS
    if featured is not None:
        result = [h for h in result if h.isFeatured == featured]
    if search:
        q = search.lower()
        result = [h for h in result if q in h.name or q in h.pinyin.lower() or q in h.effect]
    return result


@herbs_router.get("/{herb_id}", response_model=HerbOut)
async def get_herb(herb_id: str):
    herb = next((h for h in HERBS if h.id == herb_id), None)
    if not herb:
        raise HTTPException(status_code=404, detail="草药不存在")
    return herb


@recipes_router.get("", response_model=List[RecipeOut])
async def list_recipes(search: Optional[str] = Query(None)):
    result = RECIPES
    if search:
        q = search.lower()
        result = [r for r in result if q in r.name or any(q in b for b in r.benefits)]
    return result


@recipes_router.get("/{recipe_id}", response_model=RecipeOut)
async def get_recipe(recipe_id: str):
    recipe = next((r for r in RECIPES if r.id == recipe_id), None)
    if not recipe:
        raise HTTPException(status_code=404, detail="食谱不存在")
    return recipe


@workouts_router.get("", response_model=List[WorkoutOut])
async def list_workouts(level: Optional[str] = Query(None)):
    result = WORKOUTS
    if level:
        result = [w for w in result if w.level == level]
    return result


@workouts_router.get("/{workout_id}", response_model=WorkoutOut)
async def get_workout(workout_id: str):
    workout = next((w for w in WORKOUTS if w.id == workout_id), None)
    if not workout:
        raise HTTPException(status_code=404, detail="功法不存在")
    return workout
