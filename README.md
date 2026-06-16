# Balance · 智慧中医健康助手

> 一个具备 **Tool-Use 能力的 AI 中医辨证 Agent** — 用户描述症状或上传舌苔图片，Agent 自主调用药材库、食谱库、体质判断等工具，完成辨证推理并给出个性化养生方案。

我独立从零开发的个人项目，基于 **FastAPI + LangGraph ReAct Agent + DeepSeek / 智谱 GLM-4V + React 19** 构建，历经 20+ 个迭代版本。从最初前后端无法联调，到固定流水线 LLM 调用，最终升级为**自主决策、动态调用工具的真正 Agent 架构**。

## 为什么做这个项目

市面上大多数"AI 中医"产品只是套壳 ChatGPT 的问答机器人——用户问一句、它回一句，没有工具、没有记忆、没有决策能力。我想探索的是：**一个真正的 Agent 应该如何像中医师一样工作**——先判断信息够不够、主动查资料、综合多源信息后再给出判断，而不是背一段 prompt 就完了。

这个项目从最初的固定流水线，一步步迭代到 ReAct Agent 架构，完整记录了我是怎么发现问题、解决问题的过程。

---

## 技术架构

```
浏览器 (React 19 + TypeScript + TailwindCSS v4)
  │  /api/*  Vite Proxy → localhost:8001
  ▼
FastAPI 后端
  │
  ├── Auth 层 (JWT + bcrypt，注册/登录/自动登录/游客)
  │
  ├── ReAct Agent 层 (核心)
  │   ┌─────────────────────────────────────────┐
  │   │         Think → Act → Observe 循环       │
  │   │                                          │
  │   │  Agent (DeepSeek V3 + Tool Calling)      │
  │   │    ├── search_herbs()       药材库       │
  │   │    ├── search_recipes()     食谱库       │
  │   │    ├── search_workouts()    功法库       │
  │   │    ├── assess_constitution() 体质判断    │
  │   │    └── remember_user_context() 用户记忆  │
  │   └─────────────────────────────────────────┘
  │
  ├── 视觉层 (智谱 GLM-4V-Flash 舌苔望诊)
  │
  ├── REST API (CRUD + 多轮聊天 + 文件上传)
  │
  └── 存储层 (SQLite + 本地文件系统)
```

### 技术选型

| 层级 | 技术 | 选型原因 |
|------|------|---------|
| 前端 | React 19 + TypeScript + Vite + TailwindCSS v4 + Framer Motion | 组件化 + 原子化CSS + 流畅动效 |
| 后端 | FastAPI (Python) | 异步高性能、自动 Swagger 文档 |
| Agent | LangGraph StateGraph | 图结构编排 Agent 的 Think→Act→Observe 循环 |
| 文本 LLM | DeepSeek V3 (OpenAI 兼容) | 中文中医知识丰富、成本低 |
| 视觉 LLM | 智谱 GLM-4V-Flash | 免费、兼容 OpenAI 格式、无需境外支付 |
| 数据库 | SQLite + SQLAlchemy 2 (async) | 轻量零配置 |
| 认证 | JWT + bcrypt | 无状态 Token，支持自动登录 |
| 部署 | Docker Compose + Nginx | 一键启动 |

---

## 快速开始

### 1. 获取 API Key

- DeepSeek：[platform.deepseek.com](https://platform.deepseek.com) → 创建 API Key
- 智谱：[open.bigmodel.cn](https://open.bigmodel.cn) → 创建 API Key（免费）

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

### 4. Docker 一键部署

```bash
docker-compose up --build
```

---

## 我从零到一的开发历程

### 阶段一：打通核心链路（v1.0 - v1.4）

**遇到的问题：前后端完全不通。** 前端跑在 3000 端口，Vite 代理写的是 8001，但后端实际跑在 8000——端口对不上，所有 API 请求 404。改完端口后又是 500 报错，查日志发现 `langgraph.checkpoint.base` 模块找不到，原来 LangGraph 0.2.x 把 checkpoint 拆成了独立包，但 requirements.txt 没写。补装依赖后，DeepSeek 终于能返回辨证结果了。

**然后发现交互模式不对。** 最初的交互是"用户输入→固定流水线跑四步→输出结果→结束"，不像真实问诊。真实的中医问诊是对话式的——患者说一句，医生追问，再根据回答深入。我加了 `/api/chat` 接口，把辨证上下文传给 LLM 实现多轮追问。前端把结果卡片改成聊天气泡样式。

**舌苔分析做了两次技术选型。** 第一次用 Google Gemini 做图片分析，发现国内 IP 的免费配额直接就是 0，API 调用无限挂起。切换到智谱 GLM-4V-Flash——免费、兼容 OpenAI 格式、注册即用，改三行代码就完成了迁移。

### 阶段二：建立用户体系 + 数据持久化（v1.5 - v1.8）

**从"所有人共用假数据"到"每人只看自己的"。** 项目最初硬编码了 3 条 Mock 历史记录，所有用户看到的一样。我加了完整的注册登录体系：User 模型加 username 字段、bcrypt 哈希密码、JWT 签发 Token。这里踩了一个坑——新版 `bcrypt 5.x` 和 `passlib` 不兼容，注册直接 500。降级到 `bcrypt 4.0.1` 并改为直接调用 `bcrypt.hashpw()` 解决。

**追问记录持久化连踩三个坑：**
1. 聊天 JSON 写到了后端但没同步前端本地 state → 点"继续追问"只显示第一句话
2. 前端用自增 ID（`c_xxx`）但后端用 UUID → 同步接口 404
3. 修复后又发现 `setState` 和 API 调用的时序不对 → 双写策略（后端 + 前端本地同时更新）

### 阶段三：体验完善（v1.9 - v2.5）

个人中心从头像 URL 粘贴升级到本地上传，遇到 Vite 代理只转发 `/api` 导致 `/uploads` 下图片不显示的问题。药材库从 6 味 Unsplash 通用图（很多对不上实物）扩充到 20 味，写了一套专业 AI 生图提示词用通义万相生成实物级摄影图。

### 阶段四：升级为真正的 Agent 架构（v3.0）

**这是最关键的一次重构。** 此前虽然用 LangGraph 编排了节点，但本质还是固定流水线——代码写死了"先症状解析→再图片分析→再辨证→再推荐"四个步骤。面试官问"这跟 Agent 有什么关系"的时候，我确实回答不上来。

真正的 Agent 应该自己决定什么时候做什么。我重写了整个 `agent/graph.py`：

- 给 LLM 绑定 5 个 Tool（search_herbs / search_recipes / search_workouts / assess_constitution / remember_user_context）
- 用 LangGraph StateGraph 构建 Think→Act→Observe 循环
- LLM 自主决定调用哪些工具、调用几次、信息够了就给出最终回复

改完之后，用户输入"手脚冰凉"，Agent 会先调用 `assess_constitution` 判断体质→得到"阳虚质"→调用 `search_herbs("温阳")` 查药材→调用 `search_recipes("驱寒")` 查食谱→最后综合输出方案。整个过程不是代码硬编码的，是 LLM 自己推理的。

---

## 踩过的坑总结

| 问题 | 现象 | 排查过程 | 解决方案 |
|------|------|---------|---------|
| 前后端联调失败 | API 全部 404 | 对端口 → 不对；对代理配置 → 找到 | 统一端口 5173→8001，Vite proxy 加 `/api` + `/uploads` 两条规则 |
| LangGraph 模块缺失 | 诊断 500，`No module named 'langgraph.checkpoint.base'` | 查 langgraph 源码，发现 checkpoint 被拆成独立包 | `pip install langgraph-checkpoint` 并写入 requirements.txt |
| Gemini API 不可用 | 上传图片后无限等待 | 查 API Quota → 发现免费额度为 0 | 切换智谱 GLM-4V-Flash，OpenAI 兼容格式，3 行代码迁移 |
| bcrypt 不兼容 | 注册 500，passlib 读不到 bcrypt 版本 | 查 passlib 源码 → 发现 `bcrypt.__about__` 在新版被移除 | 降级 bcrypt==4.0.1，弃用 passlib，直接调 bcrypt API |
| 追问记录丢失 | 恢复历史只有第一句话 | 打断点 → 后端有数据 → 前端 state 没更新 → 单写问题 | 双写策略：后端 sync + 前端 updateConsultationSuggestion |
| 同步 ID 不匹配 | `/chat/sync` 返回 404 | 打日志 → 前端 ID 是 `c_xxx`，后端是 UUID → 对不上 | diagnose 接口返回 consultation_id，前后端统一用后端 UUID |
| 头像上传后不显示 | 上传成功，img 加载 404 | 浏览器 F12 → `/uploads` 请求走前端端口没被代理 | Vite proxy 加 `/uploads` → `localhost:8001` |
| Agent 回复包含工具中间结果 | 诊断结果里出现 `---` 分隔符 | 遍历 messages → ToolMessage 被当成最终回复 | 只取最后一条 AIMessage（不带 tool_calls），过滤中间消息 |
| 结果重复显示 | 辨证内容出现两遍 | diagnosis 和 advice 设了同一个值 | Agent 输出已是完整方案，前端不再拼接 diagnosis+advice |

---

## 项目文件结构

```
balance智慧中医/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── graph.py              # ReAct Agent (StateGraph + Tool Calling)
│   │   │   ├── llm.py                # LLM 工厂 (DeepSeek + 智谱)
│   │   │   ├── prompts.py            # System Prompts
│   │   │   └── tools/tcm_tools.py    # 5 个 Agent Tool (药材/食谱/功法/体质/记忆)
│   │   ├── api/routes/
│   │   │   ├── auth.py               # 注册/登录/头像上传
│   │   │   ├── chat.py               # 多轮对话 (含追问同步)
│   │   │   ├── diagnose.py           # 诊断入口 (combined/symptom/image)
│   │   │   ├── content.py            # 药材库 API (20味) + 食谱 + 功法
│   │   │   ├── history.py            # 咨询历史 CRUD
│   │   │   ├── favorites.py          # 收藏
│   │   │   ├── reminders.py          # 健康提醒
│   │   │   ├── feedback.py           # 用户反馈
│   │   │   └── constitution.py       # 体质测评
│   │   ├── core/config.py            # Pydantic Settings
│   │   ├── core/security.py          # JWT + bcrypt
│   │   ├── db/database.py            # SQLAlchemy async engine
│   │   ├── models/models.py          # ORM (User/Consultation/Favorite/Reminder/Feedback)
│   │   ├── schemas/schemas.py        # Pydantic 模型
│   │   ├── services/user_service.py  # 业务逻辑
│   │   └── main.py
│   ├── uploads/avatars/              # 用户头像
│   ├── uploads/herbs/                # 20味药材 AI 生成图
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts             # Axios + JWT 拦截
│   │   │   └── services.ts           # 全部 API 函数
│   │   ├── context/AppContext.tsx     # 全局状态 (认证/导航/历史/聊天)
│   │   ├── pages/
│   │   │   ├── Home.tsx               # 主页 (症状输入 + 多轮对话)
│   │   │   ├── Login.tsx              # 注册/登录/游客
│   │   │   ├── History.tsx            # 诊断历史 + 继续追问
│   │   │   ├── Profile.tsx            # 个人中心 (头像/昵称编辑)
│   │   │   ├── TongueScan.tsx         # 智能舌部扫描
│   │   │   ├── Herbs.tsx              # 药材库
│   │   │   ├── HerbDetail.tsx         # 药材详情
│   │   │   ├── Recipes.tsx            # 药膳食谱
│   │   │   ├── Workouts.tsx           # 导引功法
│   │   │   └── ...
│   │   ├── data.ts                    # 静态数据
│   │   ├── herb-images.ts             # 药材图片映射
│   │   └── types.ts                   # TypeScript 类型
│   ├── vite.config.ts                 # 端口 + 代理
│   ├── nginx.conf
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
├── 药材AI生图提示词.md               # 20味药材 AI 绘图提示词
└── README.md
```

---

## 当前完成度

| 模块 | 状态 | 说明 |
|------|:----:|------|
| 前端页面 | ✅ | 9 个页面，完整交互流程 |
| 后端 API | ✅ | 10 组 REST 接口，全部通过 Swagger 可测试 |
| ReAct Agent | ✅ | 5 个 Tool，LLM 自主决策调用，Think→Act→Observe 循环 |
| 多轮对话 | ✅ | 上下文携带，支持追问饮食/运动/病理 |
| 舌苔图片分析 | ✅ | 智谱 GLM-4V-Flash，输出舌色/苔色/舌形 |
| 用户体系 | ✅ | 注册/登录/自动登录/游客，多用户数据隔离 |
| 个人中心 | ✅ | 头像本地上传，昵称在线编辑 |
| 药材库 | ✅ | 20 味药材，AI 生成实物摄影图 |
| 追问持久化 | ✅ | 完整对话 JSON 存后端，前后端双写 |
| 中医 RAG 知识库 | 🔲 | 计划用 ChromaDB 构建经典文献向量库 |
| 自动化测试 | 🔲 | 已有 pytest 骨架，待扩展场景覆盖 |
| 生产部署 | 🔲 | 已有 Docker Compose，待加 HTTPS/监控/CI |

---

## 免责声明

本项目是我个人学习研究和技术演示的作品。AI 辨证结果基于大语言模型推理与中医传统哲学概念，**不可作为临床诊疗依据**。如有身体不适，请及时就医。
