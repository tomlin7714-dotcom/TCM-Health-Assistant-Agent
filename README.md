# Balance · 智慧中医健康助手

> **PC 端 AI 中医辨证平台** — 文本描述症状 + 舌苔图片上传 → LangGraph Agent 多节点推理 → 体质判断 + 药膳推荐 + 导引功法匹配 + 多轮追问对话。

基于 **FastAPI + LangGraph + DeepSeek / 智谱 GLM-4V + React 19** 构建，从零到一完成 19 个迭代版本，覆盖前后端联调、多模态输入、用户认证、数据持久化等完整功能链路。

---

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端 (React 19)                     │
│  Vite + TailwindCSS v4 + Framer Motion + Axios          │
│  Pages: Home / History / Profile / Herbs / TongueScan   │
└──────────────────────┬──────────────────────────────────┘
                       │  /api/*  (Vite Proxy)
┌──────────────────────▼──────────────────────────────────┐
│                   后端 (FastAPI)                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Auth (JWT)   │  │ LangGraph    │  │ REST API      │  │
│  │ 注册/登录    │  │ Agent 工作流 │  │ CRUD + Chat   │  │
│  └─────────────┘  └──────┬───────┘  └───────────────┘  │
│                          │                               │
│         ┌────────────────┼────────────────┐              │
│         ▼                ▼                ▼              │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ DeepSeek V3  │ │ 智谱 GLM-4V  │ │  SQLite      │    │
│  │ (文本辨证)   │ │ (图片望诊)   │ │ (用户+记录)  │    │
│  └──────────────┘ └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────────────────────┘
```

| 层级 | 技术选型 | 选型理由 |
|------|---------|---------|
| **前端** | React 19 + TypeScript + Vite | 组件化开发，Vite HMR 极快 |
| **样式** | TailwindCSS v4 + Framer Motion | 原子化 CSS，交互动画 |
| **后端** | FastAPI (Python 3.11) | 异步高性能，自动生成 Swagger 文档 |
| **Agent** | LangGraph StateGraph | 多节点工作流：症状解析 → 图片分析 → 辨证 → 推荐 |
| **文本 LLM** | DeepSeek V3 (OpenAI 兼容) | 国产模型，中文中医知识丰富，成本低 |
| **视觉 LLM** | 智谱 GLM-4V-Flash | 免费视觉模型，兼容 OpenAI 格式，无需境外支付 |
| **数据库** | SQLite + SQLAlchemy 2 (async) | 轻量零配置，适合演示部署 |
| **认证** | JWT + bcrypt | 无状态认证，支持自动登录 |
| **部署** | Docker Compose + Nginx | 一键启动前后端 |

---

## 快速开始

### 前置条件
- Python 3.11+
- Node.js 20+
- DeepSeek API Key（[申请地址](https://platform.deepseek.com)）
- 智谱 API Key（[申请地址](https://open.bigmodel.cn)，免费）

### 1. 后端

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY 和 ZHIPU_API_KEY
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

API 文档：http://localhost:8001/docs

### 2. 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 3. Docker 部署

```bash
docker-compose up --build
```

---

## 迭代开发历程（19 个版本）

### 第一阶段：核心功能打通（v1.0 - v1.4）

| 版本 | 功能 | 关键决策 |
|------|------|---------|
| **v1.0** | 前后端联调 + LLM 辨证 | 修复 Vite 代理端口、axios 超时、LangGraph 依赖缺失 |
| **v1.1** | 多轮对话追问 | 新增 `/api/chat` 接口，LLM 携带辨证上下文回答追问 |
| **v1.2** | 侧边栏历史 | 诊断记录可点击跳转 History 详情页 |
| **v1.3** | 历史恢复追问 | AppContext 传递历史记录，恢复完整对话继续聊 |
| **v1.4** | 智能舌部扫描 | 独立舌诊模块，上传舌苔图片 → GLM-4V 分析舌色苔色舌形 |

### 第二阶段：用户体系与数据持久化（v1.5 - v1.8）

| 版本 | 功能 | 关键决策 |
|------|------|---------|
| **v1.5** | 注册/登录/自动登录 | bcrypt 密码哈希、JWT 令牌持久化、多用户数据隔离 |
| **v1.6** | 追问记录持久化 | 完整对话 JSON 存入后端 consultation 表 |
| **v1.7** | 修复同步 404 | 前端自增 ID 和后端 UUID 不匹配 → 统一使用后端 ID |
| **v1.8** | 修复双写不同步 | 后端更新后同步更新前端本地 state，避免数据源不一致 |

### 第三阶段：个人中心与药材库（v1.9 - v2.5）

| 版本 | 功能 | 关键决策 |
|------|------|---------|
| **v1.9** | 个人中心编辑 | 点击头像/昵称直接编辑，调 PUT `/api/auth/me` |
| **v2.0** | 本地上传头像 | 后端 `/api/auth/avatar` 接收文件，StaticFiles 挂载 |
| **v2.1** | 头像显示修复 | Vite proxy 未转发 `/uploads` → 加代理规则 |
| **v2.2** | 药材 SVG 图片 | 外部图片源不可达 → SVG 内嵌，每味药专属配色 |
| **v2.3** | AI 生成药材图 | 编写 20 味药材生图提示词，AI 生成后替换 SVG |
| **v2.4** | 药材库 6→20 | 补充 14 味常用药材，前后端数据一致 |
| **v2.5** | 全部图片到位 | 20 张 AI 生成药材图就位 |

---

## 核心技术挑战与解决方案

### 1. 前后端联调失败（v1.0）
| 问题 | 原因 | 解决 |
|------|------|------|
| 前端请求 404 | Vite proxy 端口 `8001`，后端运行在 `8000` | 统一改为 `8001` |
| LLM 调用超时 | axios 默认 30s 超时，不足 LLM 推理时间 | 改为 `120s` |
| LangGraph 500 错误 | `langgraph-checkpoint` 包未安装 | 补装依赖并锁定版本 |

### 2. 图片分析卡死（v1.1）
| 问题 | 原因 | 解决 |
|------|------|------|
| 上传舌苔图片后无响应 | Gemini API 配额耗尽（`limit: 0`） | 切换为智谱 GLM-4V-Flash（免费、兼容 OpenAI 格式） |
| 请求无限重试 | `langchain-google-genai` 默认无限重试 429 | 设 `max_retries=2, timeout=45` |

### 3. bcrypt 密码哈希失败（v1.5）
| 问题 | 原因 | 解决 |
|------|------|------|
| 注册 500 错误 | `passlib` 与新版 `bcrypt 5.x` 不兼容 | 降级 `bcrypt==4.0.1`，改用 `bcrypt.hashpw()` 直接调用 |

### 4. 追问记录不保存（v1.6 - v1.8）
| 问题 | 原因 | 解决 |
|------|------|------|
| 恢复历史只有第一句 | 聊天 JSON 写后端但未更新前端 state | 双写：同步 `syncChatLog` + `updateConsultationSuggestion` |
| 同步请求 404 | 前端自增 ID `c_xxx` 与后端 UUID 不匹配 | 诊断接口返回 `consultation_id`，前端统一使用 |

### 5. 头像上传不显示（v2.0 - v2.1）
| 问题 | 原因 | 解决 |
|------|------|------|
| 上传成功但页面不显示 | Vite 代理只转发 `/api`，`/uploads` 路径不可达 | Vite proxy 加 `/uploads` → `localhost:8001` |

### 6. 多用户数据隔离（v1.5）
| 问题 | 原因 | 解决 |
|------|------|------|
| 所有用户看到相同历史 | 前端硬编码 `MOCK_HISTORY` | 注册登录后从后端 `GET /api/history` 拉取，每人只看到自己的 |

### 7. 药材图片与实物不符（v2.2 - v2.5）
| 问题 | 原因 | 解决 |
|------|------|------|
| Unsplash 图片与药材不匹配 | 通用图库无精准药材标签 | 编写专业 AI 生图提示词 → 生成实物级药材摄影图 |

---

## LangGraph Agent 工作流

```
用户提交症状 + 图片
        │
        ▼
┌──────────────────┐
│ symptom_parser   │  DeepSeek 解析症状 → 提取关键信息
└────────┬─────────┘
         │ 有图片？
    ┌────┴────┐
    ▼ YES     ▼ NO
┌──────────┐  │
│ image_   │  │   智谱 GLM-4V-Flash 分析舌色/苔色/舌形
│ analyzer │  │
└────┬─────┘  │
     └───┬────┘
         ▼
┌──────────────────┐
│ tcm_diagnoser    │  DeepSeek 综合辨证 → 病机分析 + 体质判断
└────────┬─────────┘
         ▼
┌──────────────────┐
│ recommendation   │  DeepSeek 生成养生建议 + 草药/食谱推荐
│ _generator       │
└──────────────────┘
```

---

## 项目结构

```
balance智慧中医/
├── backend/
│   ├── app/
│   │   ├── agent/               # LangGraph Agent
│   │   │   ├── graph.py         #   工作流定义 (StateGraph)
│   │   │   ├── llm.py           #   LLM 工厂 (DeepSeek + 智谱)
│   │   │   ├── prompts.py       #   System prompts
│   │   │   └── tools/           #   LangChain Tools
│   │   ├── api/routes/
│   │   │   ├── auth.py          #   注册/登录/头像上传
│   │   │   ├── chat.py          #   多轮对话 + 同步
│   │   │   ├── diagnose.py      #   诊断接口 (combined/symptom/image)
│   │   │   ├── content.py       #   药材/食谱/功法 (20味药材)
│   │   │   ├── history.py       #   咨询历史
│   │   │   ├── constitution.py  #   体质测评
│   │   │   └── ...
│   │   ├── core/
│   │   │   ├── config.py        #   Pydantic Settings (环境变量)
│   │   │   └── security.py      #   JWT + bcrypt
│   │   ├── db/database.py       #   SQLAlchemy async engine
│   │   ├── models/models.py     #   ORM (User/Consultation/Favorite/Reminder)
│   │   ├── schemas/schemas.py   #   Pydantic 请求/响应模型
│   │   ├── services/            #   业务逻辑层
│   │   └── main.py              #   FastAPI 入口
│   ├── uploads/
│   │   ├── avatars/             #   用户头像
│   │   └── herbs/               #   药材图片 (20味 AI 生成)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts        #   Axios + JWT 拦截器
│   │   │   └── services.ts      #   全部 API 函数
│   │   ├── context/
│   │   │   └── AppContext.tsx    #   全局状态 (认证/导航/历史/收藏)
│   │   ├── pages/
│   │   │   ├── Home.tsx          #   主页 (症状输入 + 多轮对话)
│   │   │   ├── Login.tsx         #   注册/登录/游客
│   │   │   ├── History.tsx       #   诊断历史 + 继续追问
│   │   │   ├── Profile.tsx       #   个人中心 (头像/昵称编辑)
│   │   │   ├── TongueScan.tsx    #   智能舌部扫描
│   │   │   ├── Herbs.tsx         #   药材库 (20味)
│   │   │   ├── HerbDetail.tsx    #   药材详情
│   │   │   └── ...
│   │   ├── herb-images.ts        #   药材图片映射
│   │   ├── data.ts               #   静态数据 (药材/食谱/功法)
│   │   └── types.ts              #   TypeScript 类型
│   ├── vite.config.ts            #   Vite 配置 (端口 + 代理)
│   └── package.json
├── docker-compose.yml
├── 药材AI生图提示词.md           #   20味药材 AI 绘图提示词
├── .gitignore
└── README.md
```

---

## 免责声明

本项目仅供学习研究与技术演示使用。AI 辨证结果基于中医传统哲学概念与大语言模型推理，**不可作为临床诊疗依据**。如有身体不适，请及时就医。
