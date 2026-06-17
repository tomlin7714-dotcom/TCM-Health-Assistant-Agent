# Balance · 智慧中医健康助手

> 一个具备 **7 个 Tool 的 ReAct Agent**，用户描述症状或上传舌苔图片，Agent 自主调用药材库、食谱库、功法库、经典文献库等工具完成辨证推理，输出个性化养生方案。

我独立从零开发的全栈项目，基于 **FastAPI + LangGraph ReAct Agent + DeepSeek / 智谱 GLM-4V + React 19 + TypeScript** 构建，历经 30+ 个迭代版本。从最初前后端联调失败，到固定流水线 LLM 调用，最终升级为**自主决策、动态调用 7 个工具、引用中医经典原文**的完整 Agent 架构。

---

## 为什么做这个项目

市面上大多数"AI 中医"产品本质是套壳 ChatGPT —— 用户问一句、它回一句，没有工具调用、没有记忆、没有安全校验。我想探索的是：**真正的 Agent 应该如何像中医师一样工作**——先判断信息是否充分、主动查经典文献找依据、查药材库和食谱库获取方案、检查配伍禁忌后再输出建议。

把项目从固定流水线一步步迭代到 ReAct Agent 架构，完整记录了我是怎么发现问题、分析根因、解决问题、再发现新问题的工程闭环。

---

## 技术架构

```
浏览器 (React 19 + TypeScript + TailwindCSS v4 + Framer Motion)
  │  /api/*  Vite Proxy → localhost:8001
  ▼
FastAPI 后端
  │
  ├── Auth 层 (JWT + bcrypt，注册/登录/自动登录/游客，多用户隔离)
  │
  ├── ReAct Agent 层 (7 Tools，Think → Act → Observe 循环)
  │   ├── 判断体质()        → 九种中医体质匹配
  │   ├── search_knowledge() →《黄帝内经》《伤寒论》《神农本草经》50+原文
  │   ├── search_herbs()     → 20 味药材数据库
  │   ├── search_recipes()   → 20 道药膳食谱
  │   ├── search_workouts()  → 7 套导引功法（含B站教学视频）
  │   ├── check_herb_conflicts() → 十八反十九畏配伍禁忌检查
  │   └── remember_user_context()→ 跨会话用户体质记忆
  │
  ├── 视觉层 (智谱 GLM-4V-Flash 舌苔图片望诊)
  │
  ├── Fallback 层 (DeepSeek 主模型 + 智谱 GLM-4-Flash 备用自动切换)
  │
  ├── REST API (11 组接口)
  │
  └── 存储层 (SQLite 用户数据 + 本地文件系统 头像/药材图/食谱图)
```

### 技术选型与理由

| 层级 | 技术 | 为什么选它 |
|------|------|-----------|
| 前端 | React 19 + TypeScript + Vite + TailwindCSS v4 | 组件化 + 原子化CSS + HMR 极快 |
| 动画 | Framer Motion | 聊天气泡和页面切换需要流畅动效 |
| 后端 | FastAPI (Python 3.11) | 异步高性能，自动 Swagger 文档，调试方便 |
| Agent 框架 | LangGraph StateGraph | 图结构编排 Agent 的 Think→Act→Observe 循环 |
| 文本 LLM | DeepSeek V3 (OpenAI 兼容) | 中文中医知识丰富，API 成本低 |
| 视觉 LLM | 智谱 GLM-4V-Flash | 免费，兼容 OpenAI 格式，无需境外信用卡 |
| 数据库 | SQLite + SQLAlchemy 2 (async) | 零配置，适合个人项目和演示 |
| 认证 | JWT + bcrypt | 无状态 Token，支持自动登录和游客模式 |
| 部署 | Docker Compose + Nginx | 一键启动前后端 |

---

## 快速开始

### 1. 准备 API Key

- DeepSeek：[platform.deepseek.com](https://platform.deepseek.com) 注册获取
- 智谱：[open.bigmodel.cn](https://open.bigmodel.cn) 注册获取（免费）

### 2. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入 OPENAI_API_KEY 和 ZHIPU_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

API 文档：http://localhost:8001/docs

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

---

## 开发历程：从零到 Agent 的四个阶段

### 阶段一：打通核心链路（v1.0 - v1.4）

**项目启动就遇到前后端联调失败。** 前端端口 3000，Vite 代理写的是 8001，但后端跑在 8000——所有 API 404。纠正端口后又是 500 报错，排查发现 LangGraph 0.2.x 把 checkpoint 模块拆成了独立包，但 requirements.txt 遗漏了 `langgraph-checkpoint`。装上后 DeepSeek 终于能正常返回辨证结果了。

最初的交互模式是"用户输入→固定流水线跑四步→输出→结束"，不像真实问诊。我加了 `/api/chat` 接口把辨证上下文传给 LLM 实现多轮追问。

**舌苔图片分析做了两次技术选型。** 第一次用 Google Gemini，发现国内 IP 的免费配额直接为 0，API 调用无限挂起。查了配额文档、尝试了多个模型后，切换为智谱 GLM-4V-Flash——免费、兼容 OpenAI 格式、注册即用，改三行代码完成迁移。

### 阶段二：用户体系 + 数据持久化（v1.5 - v1.8）

从"所有人共用 Mock 数据"改为每人只看到自己的记录。加了注册登录、bcrypt 密码哈希、JWT Token。踩了 bcrypt 版本兼容的坑——新版 5.x 和 passlib 不兼容导致注册 500，降级到 4.0.1 并改为直接调 bcrypt API。

追问持久化连踩三个坑：聊天 JSON 写到了后端但没同步前端 state → 点"继续追问"只显示第一句话；前端自增 ID 和后端 UUID 不匹配 → 同步接口 404；修复后又发现 setState 和 API 的时序问题 → 加了双写策略解决。

### 阶段三：体验完善与数据建设（v1.9 - v3.11）

从头像上传（遇到 Vite 代理没转发 `/uploads` 路径的坑）到药材库从 6 味扩到 20 味（AI 生成实物摄影图），食谱从 3 道扩到 20 道，功法从 3 套扩到 7 套（嵌入 B 站教学视频）。首页布局重构为 h-screen 全高布局——聊天区居中、侧栏同高独立滚动、追问在同一个聊天框内不再跳区域。

### 阶段四：升级为真正的 Agent 架构（v3.0 - v3.16）

**这是最关键的重构。** 此前虽然用了 LangGraph 编排节点，但本质还是固定流水线——代码写死了"先症状解析→再图片分析→再辨证→再推荐"。面试官问"这跟 Agent 有什么关系"的时候确实回答不上来。

真正的 Agent 应该自己决定什么时候做什么。我做了以下升级：

1. **给 LLM 绑定 7 个 Tool** —— 药材查询、食谱推荐、功法匹配、体质判断、经典检索、配伍检查、用户记忆
2. **用 LangGraph StateGraph 构建 ReAct 循环** —— LLM 自己决定调用哪个工具、调几次、信息够了就输出最终方案
3. **跨会话记忆** —— 用户做过体质测评后，下次问诊 Agent 自动加载体质信息，无需重复描述
4. **经典文献检索** —— 50+ 条《黄帝内经》《伤寒论》《神农本草经》原文按类别索引，Agent 辨证时可引用增强权威性
5. **配伍禁忌检查** —— 推荐药材方案后自动验证十八反十九畏冲突
6. **多模型 Fallback** —— DeepSeek 挂了自动切智谱备用模型，用户无感知
7. **首页布局重构** —— h-screen 全高布局，聊天框居中，侧栏独立滚动
8. **回复提取修复** —— Agent 调用工具过程中产生多轮消息，只取最终 AI 回复
9. **Prompt 人格化** —— "本草精灵"温暖贴心风格，去掉 Markdown 格式符号，活泼自然
10. **流式输出 (SSE)** —— Agent 回复像 ChatGPT 逐字显示，工具调用过程实时提示"正在翻阅古籍..."
11. **功法视频悬停预览** —— 鼠标移到功法卡片自动播放 B 站教学视频，移开恢复封面

---

## 核心技术问题与解决方案

| 问题 | 现象 | 排查过程 | 解决方案 |
|------|------|---------|---------|
| 前后端联调失败 | API 全部 404 | 对端口→不对；对代理配置→找到根因 | 统一端口 5173→8001，Vite proxy 加 `/api` + `/uploads` 两条规则 |
| LangGraph 模块缺失 | 诊断 500，`No module named 'langgraph.checkpoint.base'` | 查 langgraph 源码，发现 checkpoint 被拆成独立包 | `pip install langgraph-checkpoint` 并写入 requirements.txt |
| Gemini API 不可用 | 上传图片后无限等待 | 查 API Quota → 免费额度为 0；试了 7 个模型全部被拒 | 切换智谱 GLM-4V-Flash，OpenAI 兼容格式，3 行代码迁移 |
| bcrypt 不兼容 | 注册 500，passlib 读不到 bcrypt 版本 | 查 passlib 源码 → `bcrypt.__about__` 在 5.x 被移除 | 降级 bcrypt==4.0.1，弃用 passlib，直接调 bcrypt API |
| 追问记录丢失 | 恢复历史只有第一句话 | 打断点 → 后端有数据 → 前端 state 没更新 → 单写问题 | 双写策略：后端 sync + 前端 updateConsultationSuggestion |
| 同步 ID 不匹配 | `/chat/sync` 返回 404 | 打日志 → 前端 ID 是 `c_xxx`，后端是 UUID → 对不上 | diagnose 接口返回 consultation_id，前后端统一用后端 UUID |
| 头像上传后不显示 | 上传成功，img 加载 404 | 浏览器 F12 → `/uploads` 请求走前端端口没被代理 | Vite proxy 加 `/uploads` → `localhost:8001` |
| Agent 回复含工具中间结果 | 诊断结果出现 `---` 分隔符 | 遍历 messages → ToolMessage 被当成最终回复 | 只取最后一条 AIMessage（不带 tool_calls），过滤中间消息 |
| 结果重复显示 | 辨证内容出现两遍 | diagnosis 和 advice 设了同一个值 | Agent 输出已是完整方案，前端不再拼接 diagnosis+advice |
| 药材推荐始终为默认 | 不管什么症状都推人参 | 查代码 → v3.0 漏掉了 herb/recipe 匹配逻辑 | 后端加关键字智能匹配函数，覆盖 9 种辨证类型 |

---

## ReAct Agent 工作流示意

```
用户："我手脚冰凉怕冷，容易感冒"
        │
        ▼
┌─────────────────────────────────────────┐
│  Agent (DeepSeek V3 + 7 Tools bound)   │
│                                          │
│  Think: 需要先判断体质                  │
│  Act:   调用 判断体质("手脚冰凉怕冷")    │
│  Observe: 返回 → 阳虚质(匹配4项)        │
│                                          │
│  Think: 阳虚需要温阳，查经典找依据       │
│  Act:   调用 search_knowledge("阳虚")    │
│  Observe: 返回 → 《内经》"阳气者若天与日"│
│                                          │
│  Think: 需要查温阳药材和食谱            │
│  Act:   调用 search_herbs("温阳")        │
│         调用 search_recipes("驱寒")       │
│  Observe: 返回 → 干姜/肉桂 + 当归羊肉汤  │
│                                          │
│  Think: 验证方案安全性                  │
│  Act:   调用 check_herb_conflicts(...)   │
│  Observe: 返回 → 未发现配伍禁忌          │
│                                          │
│  Think: 信息充分，可以给出最终方案       │
│  Respond: 完整辨证分析 + 经典引用 +      │
│           药食方案 + 功法推荐 + 安全提示 │
│  Act:   调用 remember_user_context       │
└─────────────────────────────────────────┘
```

> LLM 自己决定调用什么工具、调用几次、何时结束，而不是按代码写死的顺序执行。整个过程是一个 Think → Act → Observe 的自主循环。

---

## 项目文件结构

```
balance智慧中医/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── graph.py                 # ReAct Agent (StateGraph + Tool Calling)
│   │   │   ├── llm.py                   # LLM 工厂 (DeepSeek + 智谱 + Fallback)
│   │   │   ├── prompts.py               # System Prompts
│   │   │   └── tools/
│   │   │       ├── tcm_tools.py          # 7 个 Agent Tool
│   │   │       └── knowledge_base.py     # 50+ 中医经典原文语料库
│   │   ├── api/routes/
│   │   │   ├── auth.py                  # 注册/登录/头像上传
│   │   │   ├── chat.py                  # 多轮对话 (含追问同步)
│   │   │   ├── diagnose.py              # 诊断入口 (智能匹配+用户记忆)
│   │   │   ├── content.py               # 药材库+食谱库+功法库 API
│   │   │   ├── history.py               # 咨询历史
│   │   │   ├── constitution.py          # 体质测评
│   │   │   └── ...
│   │   ├── core/
│   │   │   ├── config.py                # Pydantic Settings
│   │   │   └── security.py              # JWT + bcrypt
│   │   ├── db/database.py               # SQLAlchemy async engine
│   │   ├── models/models.py             # ORM 模型
│   │   ├── schemas/schemas.py           # Pydantic 模型
│   │   └── services/user_service.py     # 业务逻辑
│   ├── uploads/avatars/                 # 用户头像
│   ├── uploads/herbs/                   # 20 味药材 AI 生成图
│   ├── uploads/recipes/                 # 食谱图片
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                         # Axios 封装 + 全部 API 函数
│   │   ├── context/AppContext.tsx        # 全局状态管理
│   │   ├── pages/
│   │   │   ├── Home.tsx                  # 主页 (症状输入+多轮对话)
│   │   │   ├── Login.tsx                 # 注册/登录/游客
│   │   │   ├── History.tsx               # 历史记录+继续追问
│   │   │   ├── Profile.tsx               # 个人中心 (头像/昵称)
│   │   │   ├── TongueScan.tsx            # 舌苔扫描
│   │   │   ├── ConstitutionTest.tsx      # 体质测评
│   │   │   ├── Herbs.tsx                 # 药材库 (20味)
│   │   │   ├── Recipes.tsx               # 食谱库 (20道)
│   │   │   ├── Workouts.tsx              # 功法库 (7套+视频)
│   │   │   └── ...
│   │   ├── data.ts                       # 静态数据
│   │   ├── herb-images.ts                # 图片映射
│   │   └── types.ts                      # TypeScript 类型
│   └── vite.config.ts                    # 端口+代理配置
├── docker-compose.yml
├── 药材AI生图提示词.md                   # 药材+食谱 AI 绘图提示词
└── README.md
```

---

## 当前完成度

| 模块 | 状态 | 说明 |
|------|:----:|------|
| ReAct Agent (7 Tools) | ✅ | think→act→observe 自主循环 |
| 多轮对话 + 追问 | ✅ | 上下文携带，历史恢复 |
| 舌苔图片分析 | ✅ | 智谱 GLM-4V-Flash |
| 用户注册/登录 | ✅ | JWT + bcrypt + 游客 + 自动登录 |
| 多用户隔离 | ✅ | 每人只看自己的记录 |
| 跨会话记忆 | ✅ | 体质偏好自动注入 |
| RAG 知识库 | ✅ | 50+ 条经典原文检索 |
| 配伍禁忌检查 | ✅ | 十八反十九畏自动验证 |
| 多模型 Fallback | ✅ | DeepSeek→智谱自动切换 |
| 体质测评 | ✅ | 前后端联通 |
| 首页布局 | ✅ | h-screen 全高，独立滚动 |
| 个人中心 | ✅ | 头像/昵称编辑 |
| 药材库 | ✅ | 20 味 + AI 生成图 + 药性筛选 |
| 食谱库 | ✅ | 20 道 + 功效筛选 |
| 功法库 | ✅ | 7 套 + B站视频嵌入 |
| 流式输出 (SSE) | ✅ | Agent 回复逐字显示，工具调用过程实时提示 |
| 人格化 Prompt | ✅ | "本草精灵"温暖贴心风格，无 Markdown 格式符号 |
| 功法视频悬停预览 | ✅ | 鼠标移到功法卡片自动播放 B 站教学视频 |
| 端到端测试 | 🔲 | 已有 pytest 骨架 |
| CI/CD | 🔲 | 计划中 |

---

## 免责声明

本项目是我个人学习研究和技术演示的作品。AI 辨证结果基于大语言模型推理与中医传统哲学概念，**不可作为临床诊疗依据**。如有身体不适，请及时就医。
