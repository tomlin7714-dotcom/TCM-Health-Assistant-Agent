# Balance · 智慧中医健康助手

> 一个 PC 端 AI 中医辨证平台——用户描述症状或上传舌苔图片，AI 进行辨证分析并给出养生方案。

这是我独立从零开发的个人项目，基于 **FastAPI + LangGraph + DeepSeek / 智谱 GLM-4V + React 19** 构建，历经 19 个迭代版本，从最初的前后端无法联调，逐步完善到支持多轮对话、图片分析、用户体系、药材库等完整功能。

---

## 我用了哪些技术

| 层级 | 技术 | 我为什么选它 |
|------|------|-------------|
| 前端 | React 19 + TypeScript + Vite | Vite 热更新极快，TailwindCSS v4 写样式效率高 |
| 动画 | Framer Motion | 页面切换和聊天气泡需要流畅的动效 |
| 后端 | FastAPI (Python 3.11) | 异步性能好，自动生成 Swagger 接口文档，调试方便 |
| AI 工作流 | LangGraph StateGraph | 辨证流程多步骤（症状解析→图片分析→辨证→推荐），用图来编排节点和条件分支 |
| 文本推理 | DeepSeek V3 | 国产模型对中医中文语境的理解决不输 GPT-4，且 API 兼容 OpenAI 格式 |
| 图片分析 | 智谱 GLM-4V-Flash | 免费视觉模型，无需境外信用卡，注册即用 |
| 数据库 | SQLite + SQLAlchemy 2 async | 个人项目不需要 MySQL，SQLite 零配置即可运行 |
| 认证 | JWT + bcrypt | 无状态 Token，用户刷新页面也能自动登录 |
| 部署 | Docker Compose + Nginx | 一键启动前后端 |

---

## 怎么跑起来

### 1. 准备 API Key

- DeepSeek Key：[platform.deepseek.com](https://platform.deepseek.com) 注册获取
- 智谱 Key：[open.bigmodel.cn](https://open.bigmodel.cn) 注册获取（免费）

### 2. 启动后端

```bash
cd backend
cp .env.example .env
# 编辑 .env，把两个 Key 填进去
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:5173 就能用了。API 文档在 http://localhost:8001/docs。

---

## 项目架构

```
浏览器 (React 19 + TypeScript)
  │  /api/*  →  Vite Proxy →  localhost:8001
  ▼
FastAPI 后端
  ├── Auth (JWT 注册/登录/自动登录)
  ├── ReAct Agent (Think→Act→Observe 循环 + 5 Tools)
  │    ├── search_herbs     → 药材数据库
  │    ├── search_recipes   → 食谱数据库
  │    ├── search_workouts  → 功法数据库
  │    ├── assess_constitution → 体质判断
  │    └── remember_user_context → 用户记忆
  ├── REST API (CRUD + 多轮聊天)
  ├── StaticFiles (头像/药材图)
  │
  ├── DeepSeek V3 API ← 文本推理 + Tool Calling
  ├── 智谱 GLM-4V API ← 舌苔图片望诊
  └── SQLite ← 用户/咨询记录
```

---

## 我是怎么一版一版开发的

### 第一阶段：把核心流程跑通

**v1.0 — 前后端联调 + LLM 辨证**

项目刚搭起来的时候前端根本调不通后端。我发现 Vite 代理端口写的是 8001 但后端实际跑在 8000，改了端口后还是 500 报错，排查发现是 `langgraph-checkpoint` 这个包没在 requirements.txt 里，LangGraph 0.2.x 把这个模块拆成了独立包。装上之后 DeepSeek 终于能正常返回辨证结果了。

**v1.1 — 多轮对话追问**

最初的交互是"提交一次症状 → 出一次结果 → 结束"，这不像真实问诊。我在后端加了 `/api/chat` 接口，把之前的辨证结果作为上下文传给 LLM，让用户能追问"适合吃什么""为什么会这样"。前端把诊断结果区改成了聊天气泡样式。

**v1.4 — 智能舌部扫描**

首页"智能舌部扫描"卡片原来只是跳转到历史页面的占位符。我独立做了一个舌诊模块页面，上传舌苔图片后调用智谱 GLM-4V-Flash 进行望诊分析，输出舌色、苔色、舌形、寒热虚实判断。分析完后可以基于结果跳转到主页继续完整辨证。

### 第二阶段：搞定用户体系和数据持久化

**v1.5 — 注册登录 + 自动登录 + 多用户隔离**

之前只有一个游客模式，所有数据混在一起。我加了用户名密码注册登录、bcrypt 密码哈希、JWT Token。用户首次登录后 Token 存 localStorage，下次打开自动检测登录。每个人的咨询记录从后端按 user_id 隔离拉取，不再共用一个 mock 数据。

**v1.6~v1.8 — 追问记录持久化**

追问内容之前只在内存里，一刷新就没了。我把完整对话 JSON 存到后端 consultation 表的 suggestion 字段。但这中间踩了好几个坑：前端用自增 ID 而后端用 UUID 导致同步 404；后端更新了但前端本地 state 没同步导致恢复时还是只显示第一句话。最终通过前后端 ID 统一 + 双写解决。

### 第三阶段：完善体验

**v1.9~v2.1 — 个人中心**

原本的个人中心只能看不能改。我加了点击头像上传、点击昵称编辑的功能。头像上传后又遇到一个新问题——上传成功但页面不显示，排查发现 Vite 代理只转发 `/api` 路径，`/uploads` 下的图片前端访问不到，加了代理规则就好了。

**v2.2~v2.5 — 药材库**

最早的 6 味药材用的是 Unsplash 通用图片，很多跟实物对不上。我写了一套专业的 AI 生图提示词，用通义万相给每味药材生成高清摄影风格的图片，然后把药材库从 6 味扩充到 20 味，前后端数据保持一致。

---

## 踩过的坑

| 问题 | 现象 | 我的排查和解决方法 |
|------|------|------------------|
| **前后端无法联调** | 前端所有 API 请求 404 | Vite proxy 端口 `8001` → `8000`，后来统一改为 `5173→8001` |
| **LangGraph 500 错误** | 诊断接口报 `No module named 'langgraph.checkpoint.base'` | requirements.txt 遗漏了 `langgraph-checkpoint`，补装并锁定版本 |
| **Gemini 配额耗尽** | 上传舌苔图片后一直卡住不返回 | 我的 Google Cloud 账号没有境外支付方式，Gemini 免费配额为 0。切换为智谱 GLM-4V-Flash，兼容 OpenAI 格式，代码改动很小 |
| **bcrypt 注册报错** | 注册接口 500，`passlib` 与 `bcrypt 5.x` 不兼容 | 降级 `bcrypt==4.0.1`，弃用 passlib 直接调用 `bcrypt.hashpw()` |
| **追问记录丢失** | 点"继续追问此辨证"只显示第一句话，后续追问全丢了 | 聊天 JSON 只写到了后端但没同步前端本地 state。加了 `updateConsultationSuggestion` 双写 |
| **同步 404** | 追问同步接口返回 404 | 前端自增 ID（`c_xxx`）和后端 UUID 不匹配。改为诊断接口返回 `consultation_id`，前后端统一使用 |
| **头像上传不显示** | 上传成功返回 URL，但 `<img>` 标签加载不出来 | Vite dev server 只代理了 `/api`，`/uploads` 路径不被转发。加代理规则解决 |
| **药材图片不匹配** | Unsplash 图片与药材实物不符 | 外部图源不可靠，改用 AI 生成的实物级药材摄影图 |

---

## 项目文件结构

```
balance智慧中医/
├── backend/
│   ├── app/
│   │   ├── agent/               # LangGraph Agent (工作流+LLM工厂+Prompts)
│   │   ├── api/routes/          # FastAPI 路由 (auth/chat/diagnose/content/...)
│   │   ├── core/                # 配置 + JWT + bcrypt
│   │   ├── db/                  # SQLAlchemy async engine
│   │   ├── models/              # ORM 模型
│   │   ├── schemas/             # Pydantic 请求/响应模型
│   │   ├── services/            # 业务逻辑
│   │   └── main.py
│   ├── uploads/avatars/         # 用户头像
│   ├── uploads/herbs/           # 药材图片 (20味 AI 生成)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios 封装 + 全部 API 函数
│   │   ├── context/AppContext   # 全局状态管理
│   │   ├── pages/               # 页面组件 (Home/Login/History/Profile/TongueScan/Herbs/...)
│   │   └── herb-images.ts       # 药材图片映射
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml
├── 药材AI生图提示词.md
└── README.md
```

---

## 当前完成度

| 模块 | 状态 | 说明 |
|------|:----:|------|
| 前端 9 个页面 | ✅ | Home / Login / History / Profile / TongueScan / Herbs / HerbDetail / Recipes / Workouts |
| 后端 10 组 API | ✅ | auth / diagnose / chat / history / favorites / reminders / feedback / herbs / recipes / workouts |
| LangGraph ReAct Agent | ✅ | Tool-Use 自主决策：5 个 Tool + Think→Act→Observe 循环 |
| 多轮对话追问 | ✅ | 携带辨证上下文，支持追问饮食/运动/病理 |
| 图片舌诊分析 | ✅ | 智谱 GLM-4V-Flash，输出舌色/苔色/舌形/寒热虚实 |
| 用户注册登录 | ✅ | 用户名+密码注册，JWT 自动登录，多用户数据隔离 |
| 个人中心 | ✅ | 头像本地上传，昵称在线编辑 |
| 药材库 | ✅ | 20 味常用中药材，AI 生成实物摄影图 |
| 追问记录持久化 | ✅ | 完整对话 JSON 存后端，恢复历史时看到所有追问 |
| ChromaDB RAG 知识库 | 🔲 | 计划用中医经典文献构建向量库，增强辨证引用能力 |
| 自动化测试 | 🔲 | 已有 pytest 基础测试，待扩展覆盖率 |
| 生产部署 | 🔲 | 已有 Docker Compose，待加监控和 CI/CD |

---

## 免责声明

本项目是我个人学习研究和技术演示的作品。AI 辨证结果基于大语言模型推理与中医传统哲学概念，**不可作为临床诊疗依据**。如有身体不适，请及时就医。
