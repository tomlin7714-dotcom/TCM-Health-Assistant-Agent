# Balance · 智慧中医健康助手

基于 **Python / FastAPI / LangChain / LangGraph / ChromaDB / React** 构建的 PC Web 端智慧中医健康助手，支持症状辨证、舌苔图片分析、体质测评、药膳食谱推荐、导引功法匹配等功能。

---

## 项目结构

```
balance智慧中医/
├── backend/                # Python FastAPI 后端
│   ├── app/
│   │   ├── agent/          # LangGraph Agent 工作流（阶段三实现）
│   │   │   └── tools/      # LangChain Tool 封装
│   │   ├── api/routes/     # FastAPI 路由
│   │   ├── core/           # 配置、安全（JWT）
│   │   ├── db/             # SQLAlchemy 数据库引擎
│   │   ├── models/         # ORM 数据模型
│   │   ├── schemas/        # Pydantic 请求/响应模型
│   │   ├── services/       # 业务逻辑层
│   │   └── main.py         # FastAPI 应用入口
│   ├── alembic/            # 数据库迁移
│   ├── tests/              # pytest 测试
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/               # React + Vite + TailwindCSS 前端
│   ├── src/
│   │   ├── api/            # Axios 请求封装
│   │   │   ├── client.ts   # Axios 实例 + 拦截器
│   │   │   └── services.ts # 各业务 API 函数
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vite.config.ts      # 含开发代理配置
├── docker-compose.yml
└── .gitignore
```

---

## 快速开始（本地开发）

### 1. 后端

```bash
cd backend

# 复制环境变量文件并填写 API Key
cp .env.example .env

# 创建虚拟环境并安装依赖
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# 启动开发服务器（数据库表会自动创建）
uvicorn app.main:app --reload --port 8001
```

API 文档访问：http://localhost:8001/docs

### 2. 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器（自动代理 /api 到 localhost:8001）
npm run dev
```

前端访问：http://localhost:5173

### 3. 运行测试

```bash
cd backend
pytest -v
```

---

## Docker 一键部署

```bash
# 先在 backend/.env 填好 API Key，然后：
docker-compose up --build
```

- 前端：http://localhost:5173
- 后端 API：http://localhost:8001/docs

---

## 当前完成阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| 阶段一 | 项目基础架构、数据库、FastAPI 骨架、前端原型迁移 | ✅ 完成 |
| 阶段二 | 中医知识库构建（ChromaDB RAG） | 🔲 待开发 |
| 阶段三 | LangGraph Agent 核心（辨证推理、图片分析） | 🔲 待开发 |
| 阶段四 | 所有 API 接口完善 | 🔲 待开发 |
| 阶段五 | 前端与后端完整对接 | 🔲 待开发 |
| 阶段六 | 测试与质量保障 | 🔲 待开发 |
| 阶段七 | 生产部署与监控 | 🔲 待开发 |

---

## 技术栈

- **后端**：Python 3.12 · FastAPI · SQLAlchemy 2 · Alembic · JWT
- **AI Agent**：LangChain · LangGraph · ChromaDB（向量库）
- **LLM**：OpenAI GPT-4o / Google Gemini（可配置切换）
- **前端**：React 19 · TypeScript · Vite · TailwindCSS v4 · Framer Motion
- **部署**：Docker Compose · Nginx

---

## 免责声明

本项目仅供学习研究使用，AI 辨证结果基于中医传统哲学概念，不可作为临床诊疗依据。
