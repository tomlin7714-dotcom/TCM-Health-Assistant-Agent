/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HerbItem, RecipeItem, WorkoutItem, ConsultationRecord, ReminderItem } from './types';
import { HERB_IMAGES } from './herb-images';

// 草药库数据（至少6种常用中草药）
export const MOCK_HERBS: HerbItem[] = [
  {
    id: 'h1',
    name: '人参',
    pinyin: 'Rénshēn',
    property: '微温',
    flavor: '甘、微苦，归脾、肺、心、肾经',
    origin: '《神农本草经》',
    description: '大补元气，复脉固脱，补脾益肺，生津养血，安神益智。被誉为“百草之王”，是调理虚劳之圣药。',
    isFeatured: true,
    effect: '大补元气，强心固脱，健脾生津',
    treatment: [
      '体虚欲脱、肢冷脉微，大病、久病后元气大伤。',
      '脾气不足、中气下陷之神疲乏力、食少便溏。',
      '肺气亏虚、短气喘促，或是热病伤津、气阴两伤之口渴。',
      '心神不安、失眠多梦、惊悸健忘。'
    ],
    research: '人参主要含有多种人参皂苷、人参多糖及挥发油。现代药理学研究表明，人参具有显著的抗疲劳、增强免疫力、改善心肌缺血、延缓衰老及双向调节血压和血糖的作用。',
    taboos: [
      '实证、热证及正气不虚者忌服。',
      '不宜与藜芦、五灵脂同用，服用期间忌喝茶与食萝卜。'
    ],
    image: HERB_IMAGES.h1
  },
  {
    id: 'h2',
    name: '枸杞子',
    pinyin: 'Gǒuqǐzǐ',
    property: '平',
    flavor: '甘，归肝、肾、肺经',
    origin: '《神农本草经》',
    description: '滋补肝肾，益精明目。用于虚劳精亏，腰膝酸痛，眩晕耳鸣，内热消渴，血虚萎黄，目昏不明。',
    isFeatured: true,
    effect: '滋补肝肾，养血明目，润肺止咳',
    treatment: [
      '肝肾阴虚、精血不足所致的腰膝酸软、头晕目眩。',
      '目暗不明、两目干涩、视力减退等症（常配伍菊花）。',
      '肺肾阴虚、劳嗽干咳、消渴引饮者。'
    ],
    research: '枸杞子富含枸杞多糖、β-胡萝卜素、叶黄素、多种维生素和氨基酸。研究表明能够显著提高机体非特异性免疫功能、抗氧化、保护视网膜感光细胞，并有一定的保肝补肾和抗疲劳作用。',
    taboos: [
      '因本品滋腻，外感实热、脾虚便溏、湿热内蕴者不宜服用。'
    ],
    image: HERB_IMAGES.h2
  },
  {
    id: 'h3',
    name: '黄芪',
    pinyin: 'Huángqǐ',
    property: '微温',
    flavor: '甘，归脾、肺经',
    origin: '《神农本草经》',
    description: '补气升阳，固表止汗，利水消肿，生津养血，行滞通痹，托毒排脓，敛疮生肌。',
    isFeatured: true,
    effect: '补气升阳，固表止汗，敛疮生肌',
    treatment: [
      '脾胃气虚之乏力便溏、中气下陷之脏器脱垂。',
      '肺气虚、表虚不固之自汗易感，或气虚水停之小便不利、面目浮肿。',
      '气血不足之痈疽难溃，或溃久不敛。',
      '气虚血滞之肢体麻木、半身不遂之气虚血瘀。'
    ],
    research: '黄芪主要含有黄芪多糖、黄芪皂苷、黄酮类化合物等。具有免疫调节、心血管系统保护、抗衰老、抗应激以及对肾脏的保护作用，能促进血清蛋白和肝脏蛋白的生物合成。',
    taboos: [
      '表实邪盛、内有实热、阳亢阴虚、气滞湿阻或痈疽初起红肿热痛者不宜服用。'
    ],
    image: HERB_IMAGES.h3
  },
  {
    id: 'h4',
    name: '菊花',
    pinyin: 'Júhuā',
    property: '微寒',
    flavor: '甘、苦，归肺、肝经',
    origin: '《神农本草经》',
    description: '散风清热，平肝明目，清热解毒。常用治风热感冒，头痛眩晕，目赤肿痛，眼目昏花，疮痈肿毒。',
    isFeatured: false,
    effect: '散风清热，平肝明目，清热解毒',
    treatment: [
      '外感风热、温病初起之发热恶风、头痛咳嗽。',
      '肝阳上亢之头痛眩晕、耳鸣目胀。',
      '肝经风热、实火之目赤肿痛、迎风流泪或眼目干涩。',
      '热毒疮肿、咽喉肿痛等实热证。'
    ],
    research: '菊花含有丰富的挥发油、黄酮类及绿原酸等成分。具有良好的抗菌消炎、抗感冒病毒、扩张冠状动脉、增加冠脉血流量、降低血压以及抗斑块形成的作用。',
    taboos: [
      '阳虚体质、脾胃虚寒、食少泄泻及孕妇应慎用。'
    ],
    image: HERB_IMAGES.h4
  },
  {
    id: 'h5',
    name: '干姜',
    pinyin: 'Gānjiāng',
    property: '热',
    flavor: '辛，归脾、胃、肾、心、肺经',
    origin: '《神农本草经》',
    description: '温中散寒，回阳通脉，温肺化饮。主治脾胃虚寒之脘腹冷痛、呕吐泄泻；亡阳之四肢厥冷；肺寒之喘咳痰多。',
    isFeatured: false,
    effect: '温脾胃之寒，回阳通脉，温肺化饮',
    treatment: [
      '脾胃虚寒、中焦冷痛、自利不渴、呕吐不止（如理中汤证）。',
      '心肾阳衰、阴寒内盛、四肢逆冷、脉微欲绝（常与附子配伍，如四逆汤）。',
      '肺寒津阻、寒饮咳喘、痰多清稀（如小青龙汤）。'
    ],
    research: '干姜含有挥发油及姜辣素（包括姜酚、姜酮）。研究表明，干姜等能显著促进胃液分泌和肠胃运动，具有优异的镇吐、抗溃疡、强心、促肾上腺皮质激素释放及消炎止痛功效。',
    taboos: [
      '阴虚火旺、血热妄行之出血证及孕妇忌服。'
    ],
    image: HERB_IMAGES.h5
  },
  {
    id: 'h6',
    name: '甘草',
    pinyin: 'Gāncǎo',
    property: '平',
    flavor: '甘，归心、肺、脾、胃经',
    origin: '《神农本草经》',
    description: '补脾益气，清热解毒，祛痰止咳，缓急止痛，调和诸药。素有“国老”之称，常作使药调和寒热。',
    isFeatured: false,
    effect: '补脾益气，清热解毒，祛痰止咳，调和诸药',
    treatment: [
      '脾胃虚弱、中气不足、心悸气短（如炙甘草汤）。',
      '痈疽疮毒、咽喉肿痛以及食物/药物中毒之解毒。',
      '咳嗽痰多、气喘，或脘腹、四肢挛急疼痛。',
      '调和处方中各种药物的烈性，降低毒副作用。'
    ],
    research: '甘草提取物主要有甘草甜素、甘草酸、黄酮类及多糖。具有糖皮质激素样作用（抗炎、抗过敏）、抗溃疡、解痉止痛、抗解毒，并具有保肝和明显的心肌细胞保护作用。',
    taboos: [
      '本品有保钠排钾及水钠潴留作用，故湿盛胀满、水肿、高血压患者忌过量或长期服用。',
      '不宜与大戟、芫花、甘遂、海藻同用（俗称“十八反”）。'
    ],
    image: HERB_IMAGES.h6
  },
  {
    id: 'h7',
    name: '当归',
    pinyin: 'Dāngguī',
    property: '温',
    flavor: '甘、辛，归肝、心、脾经',
    origin: '《神农本草经》',
    description: '补血活血，调经止痛，润肠通便。为补血之圣药，妇科调经之要药。',
    isFeatured: true,
    effect: '补血活血，调经止痛，润肠通便',
    treatment: [
      '血虚萎黄、头晕心悸、面色无华。',
      '血虚血瘀之月经不调、经闭痛经。',
      '虚寒腹痛、风湿痹痛、跌打损伤。',
      '血虚肠燥便秘。'
    ],
    research: '当归含藁本内酯、阿魏酸、当归多糖等成分。具有促进造血、抗血栓、扩张血管、调节子宫平滑肌及免疫调节作用。',
    taboos: ['湿盛中满、大便溏泻者慎用。'],
    image: HERB_IMAGES.h7
  },
  {
    id: 'h8',
    name: '党参',
    pinyin: 'Dǎngshēn',
    property: '平',
    flavor: '甘，归脾、肺经',
    origin: '《本草从新》',
    description: '补中益气，健脾益肺。功似人参而力弱，为平补气血之常用药。',
    isFeatured: false,
    effect: '补中益气，健脾益肺，养血生津',
    treatment: [
      '脾肺气虚之食少倦怠、咳嗽气短。',
      '气血两虚之面色萎黄、头晕心悸。',
      '气津两伤之口渴、内热消渴。'
    ],
    research: '党参含党参多糖、党参苷、生物碱等。具有增强免疫、抗疲劳、改善消化道功能及提高机体适应性等作用。',
    taboos: ['不宜与藜芦同用。实证、热证慎用。'],
    image: HERB_IMAGES.h8
  },
  {
    id: 'h9',
    name: '白术',
    pinyin: 'Báizhú',
    property: '温',
    flavor: '甘、苦，归脾、胃经',
    origin: '《神农本草经》',
    description: '健脾益气，燥湿利水，止汗安胎。为脾脏补气第一要药。',
    isFeatured: false,
    effect: '健脾益气，燥湿利水，固表止汗',
    treatment: [
      '脾胃气虚之食少便溏、脘腹胀满。',
      '脾虚水停之水肿、痰饮眩晕。',
      '表虚自汗、脾虚胎动不安。'
    ],
    research: '白术含苍术酮、白术内酯、多糖等。具有调节胃肠功能、利尿、降血糖、抗炎及增强免疫作用。',
    taboos: ['阴虚内热、津亏燥渴者慎用。'],
    image: HERB_IMAGES.h9
  },
  {
    id: 'h10',
    name: '茯苓',
    pinyin: 'Fúlíng',
    property: '平',
    flavor: '甘、淡，归心、肺、脾、肾经',
    origin: '《神农本草经》',
    description: '利水渗湿，健脾宁心。为利水渗湿之要药，药性平和。',
    isFeatured: false,
    effect: '利水渗湿，健脾和胃，宁心安神',
    treatment: [
      '水湿内停之水肿尿少、小便不利。',
      '脾虚湿盛之食少便溏、痰饮眩悸。',
      '心脾两虚之心神不安、失眠健忘。'
    ],
    research: '茯苓含茯苓多糖、三萜类化合物。具有显著利尿、免疫增强、抗肿瘤、保肝及镇静安神作用。',
    taboos: ['阴虚津亏、滑精遗精者慎用。'],
    image: HERB_IMAGES.h10
  },
  {
    id: 'h11',
    name: '陈皮',
    pinyin: 'Chénpí',
    property: '温',
    flavor: '辛、苦，归脾、肺经',
    origin: '《神农本草经》',
    description: '理气健脾，燥湿化痰。以陈久者为佳，故名陈皮。',
    isFeatured: false,
    effect: '理气调中，燥湿化痰，行气止痛',
    treatment: [
      '脾胃气滞之脘腹胀满、食少呕恶。',
      '湿痰壅肺之咳嗽痰多、胸闷气短。',
      '痰湿中阻之恶心呕吐、眩晕。'
    ],
    research: '陈皮含挥发油（柠檬烯）、橙皮苷、川陈皮素等。具有促进消化液分泌、祛痰平喘、抗炎及降血脂作用。',
    taboos: ['阴虚燥咳、内有实热者慎用。'],
    image: HERB_IMAGES.h11
  },
  {
    id: 'h12',
    name: '半夏',
    pinyin: 'Bànxià',
    property: '温',
    flavor: '辛，归脾、胃、肺经',
    origin: '《神农本草经》',
    description: '燥湿化痰，降逆止呕，消痞散结。为化痰止呕之要药。',
    isFeatured: false,
    effect: '燥湿化痰，降逆止呕，消痞散结',
    treatment: [
      '湿痰寒痰之咳嗽痰多、痰饮眩悸。',
      '胃气上逆之恶心呕吐、呃逆嗳气。',
      '痰热互结之胸脘痞闷、梅核气。'
    ],
    research: '半夏含半夏蛋白、半夏多糖、生物碱等。具有镇吐、镇咳祛痰、抗炎及抗肿瘤活性。',
    taboos: ['阴虚燥咳、血证、孕妇慎用。不宜与川乌、草乌、附子同用（十八反）。'],
    image: HERB_IMAGES.h12
  },
  {
    id: 'h13',
    name: '麦冬',
    pinyin: 'Màidōng',
    property: '微寒',
    flavor: '甘、微苦，归心、肺、胃经',
    origin: '《神农本草经》',
    description: '养阴润肺，益胃生津，清心除烦。为养阴润燥之上品。',
    isFeatured: false,
    effect: '养阴生津，润肺清心，益胃除烦',
    treatment: [
      '肺阴不足之干咳痰少、咽干鼻燥。',
      '胃阴亏损之口渴咽干、食少便秘。',
      '心阴不足之心烦失眠、心悸怔忡。'
    ],
    research: '麦冬含麦冬多糖、甾体皂苷、高异黄酮等。具有增强免疫、抗心肌缺血、降血糖及抗氧化作用。',
    taboos: ['脾胃虚寒、大便溏泻者慎用。'],
    image: HERB_IMAGES.h13
  },
  {
    id: 'h14',
    name: '丹参',
    pinyin: 'Dānshēn',
    property: '微寒',
    flavor: '苦，归心、肝经',
    origin: '《神农本草经》',
    description: '活血祛瘀，通经止痛，清心除烦。一味丹参，功同四物。',
    isFeatured: false,
    effect: '活血祛瘀，调经止痛，凉血消痈',
    treatment: [
      '血瘀之胸痹心痛、脘腹刺痛。',
      '血瘀经闭、月经不调、产后瘀滞腹痛。',
      '疮痈肿痛、热痹疼痛。',
      '心烦不眠、心悸怔忡。'
    ],
    research: '丹参含丹参酮、丹酚酸、原儿茶醛等。具有扩张冠脉、抗血小板聚集、改善微循环及抗炎保肝作用。',
    taboos: ['孕妇及月经过多者慎用。不宜与藜芦同用。'],
    image: HERB_IMAGES.h14
  },
  {
    id: 'h15',
    name: '金银花',
    pinyin: 'Jīnyínhuā',
    property: '寒',
    flavor: '甘，归肺、心、胃经',
    origin: '《本草纲目》',
    description: '清热解毒，疏散风热。为治疮痈肿毒之要药，亦有广谱抗菌作用。',
    isFeatured: true,
    effect: '清热解毒，疏散风热，凉血止痢',
    treatment: [
      '风热感冒之发热、咽喉肿痛。',
      '热毒疮痈、丹毒红肿、肠痈腹痛。',
      '热毒血痢、暑热烦渴。'
    ],
    research: '金银花含绿原酸、木犀草苷、挥发油等。具有广谱抗菌、抗病毒、解热抗炎及增强免疫作用。',
    taboos: ['脾胃虚寒、疮疡气虚脓清者慎用。'],
    image: HERB_IMAGES.h15
  },
  {
    id: 'h16',
    name: '决明子',
    pinyin: 'Juémíngzǐ',
    property: '微寒',
    flavor: '甘、苦、咸，归肝、大肠经',
    origin: '《神农本草经》',
    description: '清热明目，润肠通便。常用于目赤肿痛及肠燥便秘。',
    isFeatured: false,
    effect: '清肝明目，润肠通便，降脂降压',
    treatment: [
      '肝火上炎之目赤肿痛、羞明多泪。',
      '肝阳上亢之头痛眩晕。',
      '肠燥便秘、热结便秘。'
    ],
    research: '决明子含蒽醌类（大黄酚、大黄素）、决明子苷等。具有降血脂、降血压、保肝及缓泻作用。',
    taboos: ['脾胃虚寒、大便溏泻者慎用。'],
    image: HERB_IMAGES.h16
  },
  {
    id: 'h17',
    name: '山药',
    pinyin: 'Shānyào',
    property: '平',
    flavor: '甘，归脾、肺、肾经',
    origin: '《神农本草经》',
    description: '补脾养胃，生津益肺，补肾涩精。为药食同源之佳品。',
    isFeatured: false,
    effect: '健脾补肺，固肾益精，益气养阴',
    treatment: [
      '脾虚食少、大便溏泻、倦怠乏力。',
      '肺虚喘咳、虚劳咳嗽。',
      '肾虚遗精、尿频带下、消渴。'
    ],
    research: '山药含山药多糖、薯蓣皂苷、黏液蛋白等。具有降血糖、调节免疫、抗氧化及改善消化功能作用。',
    taboos: ['湿盛中满、积滞便秘者慎用。'],
    image: HERB_IMAGES.h17
  },
  {
    id: 'h18',
    name: '熟地黄',
    pinyin: 'Shúdìhuáng',
    property: '微温',
    flavor: '甘，归肝、肾经',
    origin: '《本草纲目》',
    description: '补血滋阴，益精填髓。为滋补肾阴、填补精血之要药。',
    isFeatured: false,
    effect: '补血滋阴，益精填髓，养肝补肾',
    treatment: [
      '血虚萎黄、心悸怔忡、月经不调。',
      '肝肾阴虚之腰膝酸软、骨蒸潮热。',
      '精血亏虚之须发早白、眩晕耳鸣。'
    ],
    research: '熟地黄含梓醇、地黄多糖、地黄苷等。具有促进造血、增强免疫、抗衰老及降血糖作用。',
    taboos: ['脾胃虚弱、气滞痰多、腹满便溏者慎用。'],
    image: HERB_IMAGES.h18
  },
  {
    id: 'h19',
    name: '肉桂',
    pinyin: 'Ròuguì',
    property: '大热',
    flavor: '辛、甘，归肾、脾、心、肝经',
    origin: '《神农本草经》',
    description: '补火助阳，散寒止痛，温通经脉。为治命门火衰之要药。',
    isFeatured: false,
    effect: '补火助阳，引火归元，散寒温经',
    treatment: [
      '肾阳不足之畏寒肢冷、腰膝冷痛。',
      '脾胃虚寒之脘腹冷痛、食少泄泻。',
      '寒凝血瘀之痛经、经闭。'
    ],
    research: '肉桂含桂皮醛、桂皮酸、挥发油等。具有扩张血管、促进血液循环、解热镇痛及抗菌作用。',
    taboos: ['阴虚火旺、血热妄行、孕妇慎用。'],
    image: HERB_IMAGES.h19
  },
  {
    id: 'h20',
    name: '酸枣仁',
    pinyin: 'Suānzǎorén',
    property: '平',
    flavor: '甘、酸，归肝、胆、心经',
    origin: '《神农本草经》',
    description: '养心补肝，宁心安神，敛汗生津。为治虚烦不眠之要药。',
    isFeatured: false,
    effect: '养心安神，益肝敛汗，生津止渴',
    treatment: [
      '心肝血虚之虚烦不眠、惊悸多梦。',
      '体虚自汗盗汗。',
      '津伤口渴。'
    ],
    research: '酸枣仁含酸枣仁皂苷、黄酮、三萜类等。具有显著镇静催眠、抗焦虑、抗惊厥及保护心肌作用。',
    taboos: ['实邪郁火、滑精者慎用。'],
    image: HERB_IMAGES.h20
  }
];

// 食谱数据（至少3-4个养膳食谱）
export const MOCK_RECIPES: RecipeItem[] = [
  {
    id: 'r1',
    name: '冬日红枣姜糖茶',
    benefits: ['温中散寒', '健脾暖胃', '养血安神'],
    time: '20分钟',
    difficulty: '入门',
    intro: '专为胃寒、手脚冰凉的人群设计。干姜能温中散寒，红枣补脾胃之气，红糖暖肝温经，三者相得益彰，驱散周身寒气。',
    ingredients: [
      { name: '干姜丝', quantity: '5克', icon: 'Sprout' },
      { name: '红枣（去核）', quantity: '6-8枚', icon: 'Leaf' },
      { name: '老红糖', quantity: '15克', icon: 'Flame' },
      { name: '纯净水', quantity: '500毫升', icon: 'Compass' }
    ],
    steps: [
      '准备食材，将干姜洗净并切成细丝，红枣对半剖开并去核。',
      '将干姜丝与去核红枣放入养生壶，注入500毫升纯净水。',
      '武火煮沸，随后转文火慢熬15分钟，使红枣和姜丝的药性成分充分溶出。',
      '最后5分钟放入老红糖，缓缓搅拌至红糖完全融化。',
      '趁热盛出代茶饮，微微出汗为最佳，能够迅速驱寒，暖手暖脚。'
    ],
    image: HERB_IMAGES.r1
  },
  {
    id: 'r2',
    name: '杞菊清肝明目茶',
    benefits: ['明目益肝', '散风清热', '滋补肝肾'],
    time: '15分钟',
    difficulty: '入门',
    intro: '适用于长期使用电脑和手机，导致眼睛干涩、头晕目昏的人群。菊花清热散风，杞子滋润肝肾，调理两目酸疲。',
    ingredients: [
      { name: '杭白菊（或胎菊）', quantity: '6朵', icon: 'Heart' },
      { name: '宁夏优质枸杞子', quantity: '10克', icon: 'Eye' },
      { name: '麦冬', quantity: '3克', icon: 'Droplet' },
      { name: '沸水', quantity: '400毫升', icon: 'Zap' }
    ],
    steps: [
      '用清水将菊花和枸杞子、麦冬轻柔冲洗一遍，洗净表面微尘。',
      '将所有材料放入茶杯或玻璃茶壶中。',
      '倒入刚沸腾的开水约400毫升，盖上杯盖进行闷泡。',
      '静置闷泡10分钟，等菊花徐徐绽放，茶汤色泽渐趋淡黄。',
      '温服饮用。可反复冲泡2-3次，直至茶味变淡，最后可将枸杞子一同嚼服获取全部营养。'
    ],
    image: HERB_IMAGES.r2
  },
  {
    id: 'r3',
    name: '黑米红豆健脾粥',
    benefits: ['健脾暖胃', '去湿消肿', '补血乌发'],
    time: '50分钟',
    difficulty: '中级',
    intro: '针对湿气偏重、脾胃虚弱、精神疲倦、大便溏软的人群。红豆行水祛湿，黑米黑豆滋肾健脾，是四季皆宜的粗粮调养良方。',
    ingredients: [
      { name: '红小豆', quantity: '40克', icon: 'Award' },
      { name: '黑米', quantity: '50克', icon: 'Sun' },
      { name: '糙米', quantity: '30克', icon: 'Wind' },
      { name: '去核红枣', quantity: '4枚', icon: 'Shield' }
    ],
    steps: [
      '为了方便煮烂，将红小豆、黑米和糙米提前在冷水中浸泡4小时以上。',
      '将泡好的食材连同浸泡水洗净后滤干，倒入砂锅内。',
      '一次性加入冷水约1200毫升，放入去核红枣增加自然甜香。',
      '砂锅置于火上，用大火烧沸后，用勺子撇去浮沫。',
      '转成极小火，盖上砂锅盖，慢熬约40分钟，中途搅拌数次防粘底。',
      '待粥体粘稠，红豆煮至酥软爆花，关火闷5分钟，温热食用，大健脾阳。'
    ],
    image: HERB_IMAGES.r3
  },
  {
    id: 'r4',
    name: '四神汤',
    benefits: ['健脾祛湿', '养胃安神', '补中益气'],
    time: '60分钟',
    difficulty: '入门',
    intro: '中医经典健脾名方，由茯苓、山药、莲子、芡实四味组成，均属性平之品，适合脾胃虚弱、湿气偏重、食欲不振、大便溏软的人群四季调理。',
    ingredients: [
      { name: '茯苓', quantity: '15克', icon: 'Compass' },
      { name: '山药', quantity: '15克', icon: 'Leaf' },
      { name: '莲子（去心）', quantity: '15克', icon: 'Heart' },
      { name: '芡实', quantity: '15克', icon: 'Shield' },
      { name: '猪肚或排骨', quantity: '200克', icon: 'Award' }
    ],
    steps: [
      '将茯苓、山药、莲子、芡实提前用清水浸泡30分钟。',
      '猪肚洗净切块焯水去腥（或排骨焯水），捞出备用。',
      '将所有材料放入砂锅，加入清水约1500毫升。',
      '大火煮沸后撇去浮沫，转小火慢炖50分钟。',
      '出锅前加少许盐调味即可，汤料同食，健脾效果更佳。'
    ],
    image: HERB_IMAGES.r4
  },
  {
    id: 'r5',
    name: '当归生姜羊肉汤',
    benefits: ['温经散寒', '补血活血', '暖身驱寒'],
    time: '90分钟',
    difficulty: '中级',
    intro: '源自张仲景《金匮要略》的经典药膳方。当归补血活血，生姜温中散寒，羊肉温阳暖肾，三味合用为冬季温补佳品，特别适合手脚冰凉、畏寒怕冷的阳虚体质。',
    ingredients: [
      { name: '当归', quantity: '15克', icon: 'Flame' },
      { name: '生姜', quantity: '30克', icon: 'Sun' },
      { name: '羊肉（带骨）', quantity: '500克', icon: 'Award' },
      { name: '料酒', quantity: '15毫升', icon: 'Droplet' },
      { name: '枸杞子', quantity: '5克', icon: 'Eye' }
    ],
    steps: [
      '羊肉切块，冷水下锅加料酒焯水去膻，捞出洗净。',
      '当归用清水浸泡15分钟，生姜洗净切片。',
      '将羊肉、当归、姜片放入砂锅，加清水约2000毫升。',
      '大火煮沸后撇去浮沫，转小火慢炖80分钟。',
      '出锅前10分钟加入枸杞子，加少许盐调味。'
    ],
    image: HERB_IMAGES.r5
  },
  {
    id: 'r6',
    name: '银耳莲子羹',
    benefits: ['滋阴润肺', '养心安神', '美容养颜'],
    time: '45分钟',
    difficulty: '入门',
    intro: '银耳滋阴润肺被誉为"平民燕窝"，搭配莲子清心安神、百合润肺止咳、冰糖润燥，四味甘润之品共奏滋阴润燥之功，适合阴虚体质、干咳咽干、皮肤干燥者。',
    ingredients: [
      { name: '银耳（干）', quantity: '15克', icon: 'Droplet' },
      { name: '莲子（去心）', quantity: '20克', icon: 'Heart' },
      { name: '百合（干）', quantity: '10克', icon: 'Leaf' },
      { name: '枸杞子', quantity: '5克', icon: 'Eye' },
      { name: '冰糖', quantity: '适量', icon: 'Flame' }
    ],
    steps: [
      '银耳提前用温水泡发2小时，撕成小朵，去除黄色根部。',
      '莲子、百合提前用清水浸泡30分钟。',
      '将银耳、莲子、百合放入炖盅，加清水约800毫升。',
      '隔水炖或小火煮40分钟，至银耳出胶、汤汁粘稠。',
      '出锅前5分钟加入枸杞子和冰糖，冰糖溶化即可。'
    ],
    image: HERB_IMAGES.r6
  },
  {
    id: 'r7',
    name: '山楂陈皮消食茶',
    benefits: ['消食化积', '理气健脾', '降脂解腻'],
    time: '15分钟',
    difficulty: '入门',
    intro: '山楂消食化积善消肉食油腻，陈皮理气健脾燥湿化痰，麦芽消米面食积，三味合用为餐后消食佳饮，适合饮食过量、脘腹胀满、消化不良者。',
    ingredients: [
      { name: '山楂（干）', quantity: '10克', icon: 'Award' },
      { name: '陈皮', quantity: '5克', icon: 'Leaf' },
      { name: '炒麦芽', quantity: '10克', icon: 'Sun' },
      { name: '冰糖', quantity: '适量', icon: 'Flame' }
    ],
    steps: [
      '山楂、陈皮、炒麦芽用清水快速冲洗一遍。',
      '将所有材料放入养生壶或砂锅，加清水约600毫升。',
      '大火煮沸后转小火煮10分钟。',
      '加入冰糖搅拌至溶化，滤出药渣即可饮用。',
      '饭后半小时温服，消食效果最佳。'
    ],
    image: HERB_IMAGES.r7
  },
  {
    id: 'r8',
    name: '桂圆红枣安神茶',
    benefits: ['养血安神', '补心益脾', '改善睡眠'],
    time: '20分钟',
    difficulty: '入门',
    intro: '桂圆补心脾、益气血，红枣养血安神，枸杞滋补肝肾，三味甘温之品共奏养血安神之功，适合心血不足、失眠多梦、精神疲倦者，晚间饮用有助入眠。',
    ingredients: [
      { name: '桂圆肉', quantity: '10克', icon: 'Heart' },
      { name: '红枣（去核）', quantity: '6枚', icon: 'Shield' },
      { name: '枸杞子', quantity: '5克', icon: 'Eye' },
      { name: '红糖', quantity: '适量', icon: 'Flame' }
    ],
    steps: [
      '红枣洗净去核切片，桂圆肉用清水稍泡。',
      '将桂圆肉、红枣片放入杯中或小壶。',
      '加入沸水约400毫升，盖上盖子闷泡15分钟。',
      '加入枸杞子和红糖，再闷泡3分钟至红糖溶化。',
      '睡前1小时温服，安神助眠效果最佳。'
    ],
    image: HERB_IMAGES.r8
  }
];

// 锻炼数据
export const MOCK_WORKOUTS: WorkoutItem[] = [
  {
    id: 'w1',
    name: '健身气功 · 八段锦',
    subtitle: '国家体育总局推荐气功功法',
    teacher: '国医堂 张景明 教授指导',
    level: '入门',
    students: 12480,
    calories: 180,
    actionsCount: 8,
    intro: '“八段锦”起源于宋代，是一套独立完整的健身气功功法。古人把这套动作比喻为“锦”，意为动作优美，如锦缎般柔顺，全套共八个动作，能够全面疏通十二经脉，调和五脏六腑之气。',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1gT4y1m7ec&page=1&high_quality=1',
    actions: [
      { order: 1, title: '双手托天理三焦', keys: '吸气时双手托天，呼气时徐徐落下', role: '调理上焦、中焦、下焦，宣通肺气。' },
      { order: 2, title: '左右开弓似射雕', keys: '展肩扩胸，马步拉弓，眼注视指尖', role: '疏理肝气，矫正脊柱，健脾益胃。' },
      { order: 3, title: '调理脾胃须单举', keys: '双手交替上下单托，一升一降牵拉中焦', role: '活动脾胃之气，通达胃经、脾经。' },
      { order: 4, title: '五劳七伤往后瞧', keys: '转头向后凝望，身体重心微微下沉', role: '缓解精神压力，保养中枢神经。' },
      { order: 5, title: '摇头摆尾去心火', keys: '宽步俯身，头尾相应旋转，顺接呼引', role: '宣泄心火，活血滋肾开胃。' },
      { order: 6, title: '两手攀足固肾腰', keys: '柔顺俯身两手顺脚背攀足，膝关节绷直', role: '锻炼腰肾部肌肉群，强固肾水。' },
      { order: 7, title: '攒拳怒目增气力', keys: '马步直冲重拳，大睁双目注视前方', role: '疏泄肝胆积热，激发精气神。' },
      { order: 8, title: '背后七颠百病消', keys: '两脚跟提起提肛，颠足下落震动周身', role: '整合诸经气血，消除体内浊气顽疾。' }
    ]
  },
  {
    id: 'w2',
    name: '晨起太极导引法',
    subtitle: '古法太极五行导引秘传',
    teacher: '武当派 虚静道长 主讲',
    level: '中级',
    students: 5820,
    calories: 220,
    actionsCount: 4,
    intro: '太极导引法是一套注重呼吸吐纳与柔和展体完美结合的功法，适合清晨起床后，在清晨的第一缕微光中，顺应大自然生发之气，调理奇经八脉，振奋阳气。',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1Sx411R7yZ&page=1&high_quality=1',
    actions: [
      { order: 1, title: '紫气东来迎太虚', keys: '面向东方，两腿开立，双臂沿两侧提至胸前，做气降丹田', role: '吐故纳新，将大自然清阳之气导入体内。' },
      { order: 2, title: '拨云见日抱合一', keys: '两手从内向外分云，下沉，呈太极抱球动作', role: '平衡体内阴阳之气，使清气升浊气降。' },
      { order: 3, title: '神龙戏水探乾坤', keys: '身躯呈S型蛇形柔动，左右扭腰展肩', role: '疏理脊髓督脉，促进全身气血通达。' },
      { order: 4, title: '混元交泰归丹田', keys: '左手放肚脐，右手交叠附于其上，静心深呼吸', role: '收功固本，将锻炼产生之元气深藏于腹部下丹田。' }
    ]
  },
  {
    id: 'w3',
    name: '日常经络穴位按摩',
    subtitle: '居家绿色无药止痛御湿指南',
    teacher: '针灸科 林海峰 教授示范',
    level: '入门',
    students: 9320,
    calories: 60,
    actionsCount: 3,
    intro: '通过双手手指，对身体的关键敏感腧穴进行适度的按、摩、推、揉，可以达到通经络、调脏腑、减缓疲劳的作用。本指南主要针对上班、看手机的现代亚健康体质进行选穴。',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV1kW41127Xh&page=1&high_quality=1',
    actions: [
      { order: 1, title: '按揉足三里 · 健脾保胃', keys: '在外膝眼下三寸，骨旁开一横指。大拇指重按旋转揉动', role: '强健脾胃，提升中焦原能，对胃胀有神效。' },
      { order: 2, title: '按压合谷穴 · 清热止痛', keys: '手背虎口，第二掌骨中点。朝食指方向使力酸胀按压', role: '散风清热，缓解由于上火引发的头痛牙胀不适。' },
      { order: 3, title: '艾热内关穴 · 快意安神', keys: '腕横纹上两寸，两筋之间。以指尖垂直点戳按摩', role: '宽胸解郁，调理心胸气逆、心慌、神经紧张性失眠。' }
    ]
  },
  {
    id: 'w4',
    name: '古法祛湿操',
    subtitle: '9分钟跟练版 · 湿寒退散全身轻松',
    teacher: '国医堂 李明辉 教授编排',
    level: '入门',
    students: 15680,
    calories: 120,
    actionsCount: 5,
    intro: '专为湿寒体质编排的古法养生操，融合八段锦与五禽戏精华，通过拉伸、扭转、拍打等动作激活脾经和膀胱经，加速湿气排出。每天9分钟，坚持一周即可感受到身体变轻、精神变好。',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://player.bilibili.com/player.html?bvid=BV194YyzEE54&page=1&high_quality=1',
    actions: [
      { order: 1, title: '开天辟地 · 唤醒阳气', keys: '双脚与肩同宽，双臂从体侧缓缓上举过头，掌心朝天，踮脚尖拉伸脊柱，保持3个呼吸。', role: '拉伸督脉，振奋全身阳气，打通任督二脉之气机。' },
      { order: 2, title: '扭转乾坤 · 梳理带脉', keys: '双手叉腰，以腰为轴缓缓左右扭转上身，头部随之转动，左右各8次。', role: '疏通带脉和胆经，促进腰腹部气血循环，驱散中焦寒湿。' },
      { order: 3, title: '拍打脾经 · 运化湿气', keys: '双手空心掌，沿大腿内侧脾经循行路线由下往上轻拍，每条腿拍打30秒。', role: '激活脾经气血，增强脾胃运化水湿功能，改善浮肿和困重。' },
      { order: 4, title: '金鸡独立 · 引火归元', keys: '单腿站立，另一脚贴于内侧膝部，双手合十于胸前，保持平衡30秒后换腿。', role: '引气血下行，补肾固本，改善上热下寒体质，增强核心稳定。' },
      { order: 5, title: '收功归田 · 气沉丹田', keys: '双脚分开，双手从体侧缓缓下压至丹田位置，闭目静立，深呼吸3次。', role: '将运动产生的阳气收敛入丹田，固本培元，使全身气血归于平和。' }
    ]
  }
];

// 历史记录（包含多条健康咨询记录）
export const MOCK_HISTORY: ConsultationRecord[] = [
  {
    id: 'c1',
    title: '辨证施膳 · 消化调养咨询',
    date: '2026-06-12',
    type: 'pulse',
    symptoms: '最近几天经常胃胀难受，尤其是吃过晚饭之后，经常打嗝发酸，感觉大便也不太成形，舌苔有一点点白腻，浑身觉得沉沉的、打不起精神。',
    analysis: '患者神疲乏力、舌苔白腻。此乃典型的脾胃虚寒、运化受阻之症，由于体内寒湿蕴发，胃中清阳难升。属于中医学“痞满”范畴，急需温中散寒、健脾去湿。',
    suggestion: '近期避免生冷硬食。主推食谱为【黑米红豆健脾粥】，可温养脾阳，散风行湿。辅以【按揉足三里】，每日早晚各顺时针揉按50下，以激扬阳明胃气，帮助脾运。',
  },
  {
    id: 'c2',
    title: '时令调摄 · 暑湿多汗复治',
    date: '2026-06-08',
    type: 'seasonal',
    symptoms: '初夏时节天气转热，动不动就大汗淋漓，总感觉心慌口渴，喉咙经常有一点干，晚上很不容易睡着。',
    analysis: '初夏温热邪气入侵，易伤津耗气。患者大汗引饮、口干舌红，系心气受扰兼有心火上炎。此证为气阴两虚之象。',
    suggestion: '推荐冲泡【杞菊清肝明目茶】滋阴润肺，补充人体水分。避免在中午阳气最旺、气温最高时在户外剧烈活动，清早可配合【八段锦 · 双手托天理三焦】和【背后七颠百病消】顺调心中郁结之火。',
  },
  {
    id: 'c3',
    title: '智能断病 · 畏寒厥冷初诊',
    date: '2026-05-30',
    type: 'tongue',
    symptoms: '常年手脚冰凉，冬天钻进被子半天也捂不暖，平时非常容易感冒，稍微一吹空调就开始流清鼻涕，稍微多走两步路就出汗得厉害。',
    analysis: '表里虚损、肺气不固。手足厥冷是大脑中枢及梢部气血达不到表皮，由卫气虚弱、元阳不振引发。舌淡白无苔，辨证结果为【阳虚质 / 气虚质】。',
    suggestion: '强烈建议每日上午冲服一杯【冬日红枣姜糖茶】，干姜和红糖能调和气血，暖经散寒。日常注意在关元、气海两个肚脐周围的穴位进行保暖。早晨练习【太极导引 · 紫气东来迎太虚】振奋原阳。',
  }
];

// 预设健康提醒
export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: 'rem1',
    name: '晨间导引 · 八段锦功法',
    time: '07:00',
    frequency: '每天',
    type: 'qigong',
    active: true
  },
  {
    id: 'rem2',
    name: '冬日姜枣茶 · 暖胃驱寒',
    time: '11:00',
    frequency: '周一/三/五',
    type: 'tea',
    active: true
  },
  {
    id: 'rem3',
    name: '按揉足三里 · 促进脾胃运化',
    time: '18:30',
    frequency: '每天',
    type: 'acupoint',
    active: false
  },
  {
    id: 'rem4',
    name: '息香冥想 · 安神沉静睡眠',
    time: '22:30',
    frequency: '每天',
    type: 'sleep',
    active: true
  }
];
