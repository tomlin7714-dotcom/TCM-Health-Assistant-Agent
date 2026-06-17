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
    video_url: Optional[str] = None
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
    HerbOut(
        id="h7", name="当归", pinyin="Danggui", property="温",
        flavor="甘、辛，归肝、心、脾经", origin="神农本草经",
        description="补血活血，调经止痛，润肠通便。为补血之圣药。",
        isFeatured=True, effect="补血活血，调经止痛，润肠通便",
        treatment=["血虚萎黄、头晕心悸、面色无华。",
                   "血虚血瘀之月经不调、经闭痛经。",
                   "虚寒腹痛、风湿痹痛、跌打损伤。",
                   "血虚肠燥便秘。"],
        research="当归含藁本内酯、阿魏酸、当归多糖等成分。具有促进造血、抗血栓、扩张血管、调节子宫平滑肌及免疫调节作用。",
        taboos=["湿盛中满、大便溏泻者慎用。"],
        image="/uploads/herbs/当归.png",
    ),
    HerbOut(
        id="h8", name="党参", pinyin="Dangshen", property="平",
        flavor="甘，归脾、肺经", origin="本草从新",
        description="补中益气，健脾益肺。功似人参而力弱，为平补气血之常用药。",
        isFeatured=False, effect="补中益气，健脾益肺，养血生津",
        treatment=["脾肺气虚之食少倦怠、咳嗽气短。",
                   "气血两虚之面色萎黄、头晕心悸。",
                   "气津两伤之口渴、内热消渴。"],
        research="党参含党参多糖、党参苷、生物碱等。具有增强免疫、抗疲劳、改善消化道功能及提高机体适应性等作用。",
        taboos=["不宜与藜芦同用。实证、热证慎用。"],
        image="/uploads/herbs/党参.png",
    ),
    HerbOut(
        id="h9", name="白术", pinyin="Baizhu", property="温",
        flavor="甘、苦，归脾、胃经", origin="神农本草经",
        description="健脾益气，燥湿利水，止汗安胎。为脾脏补气第一要药。",
        isFeatured=False, effect="健脾益气，燥湿利水，固表止汗",
        treatment=["脾胃气虚之食少便溏、脘腹胀满。",
                   "脾虚水停之水肿、痰饮眩晕。",
                   "表虚自汗、脾虚胎动不安。"],
        research="白术含苍术酮、白术内酯、多糖等。具有调节胃肠功能、利尿、降血糖、抗炎及增强免疫作用。",
        taboos=["阴虚内热、津亏燥渴者慎用。"],
        image="/uploads/herbs/白术.png",
    ),
    HerbOut(
        id="h10", name="茯苓", pinyin="Fuling", property="平",
        flavor="甘、淡，归心、肺、脾、肾经", origin="神农本草经",
        description="利水渗湿，健脾宁心。为利水渗湿之要药，药性平和。",
        isFeatured=False, effect="利水渗湿，健脾和胃，宁心安神",
        treatment=["水湿内停之水肿尿少、小便不利。",
                   "脾虚湿盛之食少便溏、痰饮眩悸。",
                   "心脾两虚之心神不安、失眠健忘。"],
        research="茯苓含茯苓多糖、三萜类化合物。具有显著利尿、免疫增强、抗肿瘤、保肝及镇静安神作用。",
        taboos=["阴虚津亏、滑精遗精者慎用。"],
        image="/uploads/herbs/茯苓.png",
    ),
    HerbOut(
        id="h11", name="陈皮", pinyin="Chenpi", property="温",
        flavor="辛、苦，归脾、肺经", origin="神农本草经",
        description="理气健脾，燥湿化痰。以陈久者为佳，故名陈皮。",
        isFeatured=False, effect="理气调中，燥湿化痰，行气止痛",
        treatment=["脾胃气滞之脘腹胀满、食少呕恶。",
                   "湿痰壅肺之咳嗽痰多、胸闷气短。",
                   "痰湿中阻之恶心呕吐、眩晕。"],
        research="陈皮含挥发油（柠檬烯）、橙皮苷、川陈皮素等。具有促进消化液分泌、祛痰平喘、抗炎及降血脂作用。",
        taboos=["阴虚燥咳、内有实热者慎用。"],
        image="/uploads/herbs/陈皮.png",
    ),
    HerbOut(
        id="h12", name="半夏", pinyin="Banxia", property="温",
        flavor="辛，归脾、胃、肺经", origin="神农本草经",
        description="燥湿化痰，降逆止呕，消痞散结。为化痰止呕之要药。",
        isFeatured=False, effect="燥湿化痰，降逆止呕，消痞散结",
        treatment=["湿痰寒痰之咳嗽痰多、痰饮眩悸。",
                   "胃气上逆之恶心呕吐、呃逆嗳气。",
                   "痰热互结之胸脘痞闷、梅核气。"],
        research="半夏含半夏蛋白、半夏多糖、生物碱等。具有镇吐、镇咳祛痰、抗炎及抗肿瘤活性。",
        taboos=["阴虚燥咳、血证、孕妇慎用。不宜与川乌、草乌、附子同用（十八反）。"],
        image="/uploads/herbs/半夏.png",
    ),
    HerbOut(
        id="h13", name="麦冬", pinyin="Maidong", property="微寒",
        flavor="甘、微苦，归心、肺、胃经", origin="神农本草经",
        description="养阴润肺，益胃生津，清心除烦。为养阴润燥之上品。",
        isFeatured=False, effect="养阴生津，润肺清心，益胃除烦",
        treatment=["肺阴不足之干咳痰少、咽干鼻燥。",
                   "胃阴亏损之口渴咽干、食少便秘。",
                   "心阴不足之心烦失眠、心悸怔忡。"],
        research="麦冬含麦冬多糖、甾体皂苷、高异黄酮等。具有增强免疫、抗心肌缺血、降血糖及抗氧化作用。",
        taboos=["脾胃虚寒、大便溏泻者慎用。"],
        image="/uploads/herbs/麦冬.png",
    ),
    HerbOut(
        id="h14", name="丹参", pinyin="Danshen", property="微寒",
        flavor="苦，归心、肝经", origin="神农本草经",
        description="活血祛瘀，通经止痛，清心除烦。一味丹参，功同四物。",
        isFeatured=False, effect="活血祛瘀，调经止痛，凉血消痈",
        treatment=["血瘀之胸痹心痛、脘腹刺痛。",
                   "血瘀经闭、月经不调、产后瘀滞腹痛。",
                   "疮痈肿痛、热痹疼痛。",
                   "心烦不眠、心悸怔忡。"],
        research="丹参含丹参酮、丹酚酸、原儿茶醛等。具有扩张冠脉、抗血小板聚集、改善微循环及抗炎保肝作用。",
        taboos=["孕妇及月经过多者慎用。不宜与藜芦同用。"],
        image="/uploads/herbs/丹参.png",
    ),
    HerbOut(
        id="h15", name="金银花", pinyin="Jinyinhua", property="寒",
        flavor="甘，归肺、心、胃经", origin="本草纲目",
        description="清热解毒，疏散风热。为治疮痈肿毒之要药，亦有广谱抗菌作用。",
        isFeatured=True, effect="清热解毒，疏散风热，凉血止痢",
        treatment=["风热感冒之发热、咽喉肿痛。",
                   "热毒疮痈、丹毒红肿、肠痈腹痛。",
                   "热毒血痢、暑热烦渴。"],
        research="金银花含绿原酸、木犀草苷、挥发油等。具有广谱抗菌、抗病毒、解热抗炎及增强免疫作用。",
        taboos=["脾胃虚寒、疮疡气虚脓清者慎用。"],
        image="/uploads/herbs/金银花.png",
    ),
    HerbOut(
        id="h16", name="决明子", pinyin="Juemingzi", property="微寒",
        flavor="甘、苦、咸，归肝、大肠经", origin="神农本草经",
        description="清热明目，润肠通便。常用于目赤肿痛及肠燥便秘。",
        isFeatured=False, effect="清肝明目，润肠通便，降脂降压",
        treatment=["肝火上炎之目赤肿痛、羞明多泪。",
                   "肝阳上亢之头痛眩晕。",
                   "肠燥便秘、热结便秘。"],
        research="决明子含蒽醌类（大黄酚、大黄素）、决明子苷等。具有降血脂、降血压、保肝及缓泻作用。",
        taboos=["脾胃虚寒、大便溏泻者慎用。"],
        image="/uploads/herbs/决明子.png",
    ),
    HerbOut(
        id="h17", name="山药", pinyin="Shanyao", property="平",
        flavor="甘，归脾、肺、肾经", origin="神农本草经",
        description="补脾养胃，生津益肺，补肾涩精。为药食同源之佳品。",
        isFeatured=False, effect="健脾补肺，固肾益精，益气养阴",
        treatment=["脾虚食少、大便溏泻、倦怠乏力。",
                   "肺虚喘咳、虚劳咳嗽。",
                   "肾虚遗精、尿频带下、消渴。"],
        research="山药含山药多糖、薯蓣皂苷、黏液蛋白等。具有降血糖、调节免疫、抗氧化及改善消化功能作用。",
        taboos=["湿盛中满、积滞便秘者慎用。"],
        image="/uploads/herbs/山药.png",
    ),
    HerbOut(
        id="h18", name="熟地黄", pinyin="Shudihuang", property="微温",
        flavor="甘，归肝、肾经", origin="本草纲目",
        description="补血滋阴，益精填髓。为滋补肾阴、填补精血之要药。",
        isFeatured=False, effect="补血滋阴，益精填髓，养肝补肾",
        treatment=["血虚萎黄、心悸怔忡、月经不调。",
                   "肝肾阴虚之腰膝酸软、骨蒸潮热。",
                   "精血亏虚之须发早白、眩晕耳鸣。"],
        research="熟地黄含梓醇、地黄多糖、地黄苷等。具有促进造血、增强免疫、抗衰老及降血糖作用。",
        taboos=["脾胃虚弱、气滞痰多、腹满便溏者慎用。"],
        image="/uploads/herbs/熟地黄.png",
    ),
    HerbOut(
        id="h19", name="肉桂", pinyin="Rougui", property="大热",
        flavor="辛、甘，归肾、脾、心、肝经", origin="神农本草经",
        description="补火助阳，散寒止痛，温通经脉。为治命门火衰之要药。",
        isFeatured=False, effect="补火助阳，引火归元，散寒温经",
        treatment=["肾阳不足之畏寒肢冷、腰膝冷痛。",
                   "脾胃虚寒之脘腹冷痛、食少泄泻。",
                   "寒凝血瘀之痛经、经闭。"],
        research="肉桂含桂皮醛、桂皮酸、挥发油等。具有扩张血管、促进血液循环、解热镇痛及抗菌作用。",
        taboos=["阴虚火旺、血热妄行、孕妇慎用。"],
        image="/uploads/herbs/肉桂.png",
    ),
    HerbOut(
        id="h20", name="酸枣仁", pinyin="Suanzaoren", property="平",
        flavor="甘、酸，归肝、胆、心经", origin="神农本草经",
        description="养心补肝，宁心安神，敛汗生津。为治虚烦不眠之要药。",
        isFeatured=False, effect="养心安神，益肝敛汗，生津止渴",
        treatment=["心肝血虚之虚烦不眠、惊悸多梦。",
                   "体虚自汗盗汗。",
                   "津伤口渴。"],
        research="酸枣仁含酸枣仁皂苷、黄酮、三萜类等。具有显著镇静催眠、抗焦虑、抗惊厥及保护心肌作用。",
        taboos=["实邪郁火、滑精者慎用。"],
        image="/uploads/herbs/酸枣仁.png",
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
        image="/uploads/recipes/冬日红枣姜糖茶.png",
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
        image="/uploads/recipes/杞菊清肝明目茶.png",
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
        image="/uploads/recipes/黑米红豆健脾粥.png",
    ),
    RecipeOut(
        id="r4", name="四神汤",
        benefits=["健脾祛湿", "养胃安神", "补中益气"],
        time="60分钟", difficulty="入门",
        intro="中医经典健脾名方，茯苓、山药、莲子、芡实四味均属性平之品，适合脾胃虚弱、湿气偏重、食欲不振、大便溏软的人群四季调理。",
        ingredients=[
            IngredientOut(name="茯苓", quantity="15克", icon="Compass"),
            IngredientOut(name="山药", quantity="15克", icon="Leaf"),
            IngredientOut(name="莲子（去心）", quantity="15克", icon="Heart"),
            IngredientOut(name="芡实", quantity="15克", icon="Shield"),
            IngredientOut(name="猪肚或排骨", quantity="200克", icon="Award"),
        ],
        steps=["将茯苓、山药、莲子、芡实提前用清水浸泡30分钟。",
               "猪肚洗净切块焯水去腥（或排骨焯水），捞出备用。",
               "将所有材料放入砂锅，加入清水约1500毫升。",
               "大火煮沸后撇去浮沫，转小火慢炖50分钟。",
               "出锅前加少许盐调味即可，汤料同食。"],
        image="/uploads/recipes/四神汤.png",
    ),
    RecipeOut(
        id="r5", name="当归生姜羊肉汤",
        benefits=["温经散寒", "补血活血", "暖身驱寒"],
        time="90分钟", difficulty="中级",
        intro="源自张仲景《金匮要略》的经典药膳方。当归补血活血，生姜温中散寒，羊肉温阳暖肾，特别适合手脚冰凉、畏寒怕冷的阳虚体质。",
        ingredients=[
            IngredientOut(name="当归", quantity="15克", icon="Flame"),
            IngredientOut(name="生姜", quantity="30克", icon="Sun"),
            IngredientOut(name="羊肉（带骨）", quantity="500克", icon="Award"),
            IngredientOut(name="料酒", quantity="15毫升", icon="Droplet"),
            IngredientOut(name="枸杞子", quantity="5克", icon="Eye"),
        ],
        steps=["羊肉切块，冷水下锅加料酒焯水去膻，捞出洗净。",
               "当归用清水浸泡15分钟，生姜洗净切片。",
               "将羊肉、当归、姜片放入砂锅，加清水约2000毫升。",
               "大火煮沸后撇去浮沫，转小火慢炖80分钟。",
               "出锅前10分钟加入枸杞子，加少许盐调味。"],
        image="/uploads/recipes/当归生姜羊肉汤.png",
    ),
    RecipeOut(
        id="r6", name="银耳莲子羹",
        benefits=["滋阴润肺", "养心安神", "美容养颜"],
        time="45分钟", difficulty="入门",
        intro="银耳滋阴润肺被誉为'平民燕窝'，搭配莲子清心安神、百合润肺止咳，适合阴虚体质、干咳咽干、皮肤干燥者。",
        ingredients=[
            IngredientOut(name="银耳（干）", quantity="15克", icon="Droplet"),
            IngredientOut(name="莲子（去心）", quantity="20克", icon="Heart"),
            IngredientOut(name="百合（干）", quantity="10克", icon="Leaf"),
            IngredientOut(name="枸杞子", quantity="5克", icon="Eye"),
            IngredientOut(name="冰糖", quantity="适量", icon="Flame"),
        ],
        steps=["银耳提前用温水泡发2小时，撕成小朵，去除黄色根部。",
               "莲子、百合提前用清水浸泡30分钟。",
               "将银耳、莲子、百合放入炖盅，加清水约800毫升。",
               "隔水炖或小火煮40分钟，至银耳出胶、汤汁粘稠。",
               "出锅前5分钟加入枸杞子和冰糖，冰糖溶化即可。"],
        image="/uploads/recipes/银耳莲子羹.png",
    ),
    RecipeOut(
        id="r7", name="山楂陈皮消食茶",
        benefits=["消食化积", "理气健脾", "降脂解腻"],
        time="15分钟", difficulty="入门",
        intro="山楂消食化积善消肉食油腻，陈皮理气健脾燥湿化痰，麦芽消米面食积，三味合用为餐后消食佳饮。",
        ingredients=[
            IngredientOut(name="山楂（干）", quantity="10克", icon="Award"),
            IngredientOut(name="陈皮", quantity="5克", icon="Leaf"),
            IngredientOut(name="炒麦芽", quantity="10克", icon="Sun"),
            IngredientOut(name="冰糖", quantity="适量", icon="Flame"),
        ],
        steps=["山楂、陈皮、炒麦芽用清水快速冲洗一遍。",
               "将所有材料放入养生壶或砂锅，加清水约600毫升。",
               "大火煮沸后转小火煮10分钟。",
               "加入冰糖搅拌至溶化，滤出药渣即可饮用。",
               "饭后半小时温服，消食效果最佳。"],
        image="/uploads/recipes/山楂陈皮消食茶.png",
    ),
    RecipeOut(
        id="r8", name="桂圆红枣安神茶",
        benefits=["养血安神", "补心益脾", "改善睡眠"],
        time="20分钟", difficulty="入门",
        intro="桂圆补心脾益气血，红枣养血安神，枸杞滋补肝肾，三味共奏养血安神之功，适合心血不足、失眠多梦、精神疲倦者。",
        ingredients=[
            IngredientOut(name="桂圆肉", quantity="10克", icon="Heart"),
            IngredientOut(name="红枣（去核）", quantity="6枚", icon="Shield"),
            IngredientOut(name="枸杞子", quantity="5克", icon="Eye"),
            IngredientOut(name="红糖", quantity="适量", icon="Flame"),
        ],
        steps=["红枣洗净去核切片，桂圆肉用清水稍泡。",
               "将桂圆肉、红枣片放入杯中或小壶。",
               "加入沸水约400毫升，盖上盖子闷泡15分钟。",
               "加入枸杞子和红糖，再闷泡3分钟至红糖溶化。",
               "睡前1小时温服，安神助眠效果最佳。"],
        image="/uploads/recipes/桂圆红枣安神茶.png",
    ),
]

WORKOUTS: List[WorkoutOut] = [
    WorkoutOut(
        id="w1", name="健身气功·八段锦",
        subtitle="国家体育总局推荐气功功法", teacher="国医堂 张景明 教授指导",
        level="入门", students=12480, calories=180, actionsCount=8,
        intro="八段锦起源于宋代，是一套独立完整的健身气功功法，全套共八个动作，能全面疏通十二经脉，调和五脏六腑之气。",
        image="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
        video_url="https://player.bilibili.com/player.html?bvid=BV1gT4y1m7ec&page=1&high_quality=1",
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
        video_url="https://player.bilibili.com/player.html?bvid=BV1Sx411R7yZ&page=1&high_quality=1",
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
        video_url="https://player.bilibili.com/player.html?bvid=BV1kW41127Xh&page=1&high_quality=1",
        actions=[
            WorkoutActionOut(order=1, title="按揉足三里·健脾保胃", keys="在外膝眼下三寸，骨旁开一横指。大拇指重按旋转揉动", role="强健脾胃，提升中焦原能，对胃胀有神效。"),
            WorkoutActionOut(order=2, title="按压合谷穴·清热止痛", keys="手背虎口，第二掌骨中点。朝食指方向使力酸胀按压", role="散风清热，缓解由于上火引发的头痛牙胀不适。"),
            WorkoutActionOut(order=3, title="按揉内关穴·安神宽胸", keys="腕横纹上两寸，两筋之间。以指尖垂直点戳按摩", role="宽胸解郁，调理心慌、神经紧张性失眠。"),
        ],
    ),
    WorkoutOut(
        id="w4", name="古法祛湿操",
        subtitle="9分钟跟练版·湿寒退散全身轻松", teacher="国医堂 李明辉 教授编排",
        level="入门", students=15680, calories=120, actionsCount=8,
        intro="专为湿寒体质编排的古法养生操，融合八段锦与五禽戏精华，通过拉伸、击掌、跳跃等动作激活全身经络，加速湿气排出。每天9分钟，坚持一周即可感受到身体变轻、精神变好。",
        image="https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=600&q=80",
        video_url="https://player.bilibili.com/player.html?bvid=BV194YyzEE54&page=1&high_quality=1",
        actions=[
            WorkoutActionOut(order=1, title="上下齊發", keys="收紧核心，吸气踮起脚跟，呼气脚跟踩地，左右手臂交替向上下伸展。", role="生发阳气、排出湿寒、缓解疲劳、促进新陈代谢。"),
            WorkoutActionOut(order=2, title="前後撃掌", keys="吸气双臂合掌向前，呼气展肩合掌向后，稳定根基。", role="疏通经络、震荡脉气、加强血液循环、提高人体免疫功能。"),
            WorkoutActionOut(order=3, title="大鵬展翅", keys="自然呼吸，收紧核心，腋窝充分打开。", role="刺激极泉穴、疏导心经郁火、扫除湿气。"),
            WorkoutActionOut(order=4, title="左右搖擺", keys="平衡好呼吸，稳定身体重心，手脚充分舒展。", role="疏肝解郁、调节气血、强化脾胃功能、减少湿痰。"),
            WorkoutActionOut(order=5, title="升陽跳", keys="双臂合掌向上，身体充分延展，左右脚交替单跳。", role="通补三焦、增强阳气、引火归元、赶走湿寒。"),
            WorkoutActionOut(order=6, title="鷹擊長空", keys="马步半蹲，核心发力，吸气抬双臂向上合掌、踮脚跟，呼气反之。", role="通经活络、平衡阴阳、驱散湿寒、调和气血。"),
            WorkoutActionOut(order=7, title="左右側拉", keys="稳定身体重心，确保每处拉伸身体得到充分的延展。", role="疏通经络、促进血液循环、带走身体毒素。"),
            WorkoutActionOut(order=8, title="金龜吸水", keys="核心发力，腿部充分拉伸，低血糖者建议放慢速度或者不做。", role="升阳祛湿、锻炼身体平衡、扫除身体疲惫。"),
        ],
    ),
    WorkoutOut(
        id="w5", name="古法健身脾胃操",
        subtitle="增强食欲·促进消化·8式调理", teacher="国医堂 王守义 教授编排",
        level="入门", students=18920, calories=150, actionsCount=8,
        intro="本操融合传统养生功法，通过八个动作系统调理脾胃功能。结合双手上撑下按、深蹲刺激脾经、躯干扭转按摩脏腑、拍打腹股沟通下焦等技法，节奏舒缓，适合日常调理脾胃虚弱、食欲不振、腹胀消化不良等问题。建议每日练习15-20分钟。",
        image="https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&w=600&q=80",
        video_url="https://player.bilibili.com/player.html?bvid=BV1A9VwzwEdY&page=1&high_quality=1",
        actions=[
            WorkoutActionOut(order=1, title="八段锦单举·疏肝健脾", keys="双手上撑下按做对称拉伸，左右交替，配合深呼吸，拉伸时吸气、还原时呼气。", role="刺激脾胃经络，促进气血运行，调和肝脾之气。"),
            WorkoutActionOut(order=2, title="托掌深蹲·疏通脾经", keys="双手向上托掌，缓慢下蹲至大腿与地面平行，膝盖不超过脚尖，保持背部挺直。", role="强化下肢气血循环，刺激足太阴脾经，改善腹胀乏力。"),
            WorkoutActionOut(order=3, title="左右拧转·按摩脾胃", keys="以腰腹为轴心带动躯干缓慢扭转，手臂随身体自然摆动，左右交替各8次。", role="增强脾胃运化功能，缓解消化不良，促进胃肠蠕动。"),
            WorkoutActionOut(order=4, title="合掌开合·疏肝理气", keys="双手合掌于胸前，缓慢向两侧打开扩胸，再缓缓收回，配合深呼吸。", role="调节肝胆气机，缓解情绪郁结，宽胸理气。"),
            WorkoutActionOut(order=5, title="提膝扭转·改善胃胀", keys="单腿提膝至胸前，同时上身向提膝侧扭转，双手自然摆动，左右交替。", role="促进胃肠蠕动，缓解积食胀气，增强核心力量。"),
            WorkoutActionOut(order=6, title="双手揉腹·促进消化", keys="双手叠放于腹部，顺时针揉腹36圈再逆时针揉腹36圈，力度轻柔均匀。", role="直接按摩脏腑，改善便秘及代谢，促进肠道蠕动。"),
            WorkoutActionOut(order=7, title="拍打腹股沟·疏通下焦", keys="双手空心掌，交替轻拍两侧腹股沟区域，力度适中，每侧拍打30秒。", role="刺激脾经与淋巴系统，加速湿邪排出，改善下焦循环。"),
            WorkoutActionOut(order=8, title="臀后弹踢·引火归元", keys="双手叉腰，左右脚交替向后弹踢，脚跟尽量触碰臀部，保持身体稳定。", role="刺激脾胃经，调和气血，改善上热下寒体质。"),
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
