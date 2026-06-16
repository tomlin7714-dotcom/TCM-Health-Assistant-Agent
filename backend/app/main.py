from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.database import init_db
from app.api.routes import auth, history, favorites, reminders, feedback, diagnose, constitution
from app.api.routes.content import herbs_router, recipes_router, workouts_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="智慧中医健康助手 API",
    description="基于 LangGraph Agent + RAG 的 PC Web 端中医健康助手后端接口",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"

app.include_router(auth.router,         prefix=API_PREFIX)
app.include_router(history.router,      prefix=API_PREFIX)
app.include_router(favorites.router,    prefix=API_PREFIX)
app.include_router(reminders.router,    prefix=API_PREFIX)
app.include_router(feedback.router,     prefix=API_PREFIX)
app.include_router(diagnose.router,     prefix=API_PREFIX)
app.include_router(constitution.router, prefix=API_PREFIX)
app.include_router(herbs_router,        prefix=API_PREFIX)
app.include_router(recipes_router,      prefix=API_PREFIX)
app.include_router(workouts_router,     prefix=API_PREFIX)


@app.get("/")
async def root():
    return {"message": "智慧中医健康助手 API 运行正常", "docs": "/docs"}


@app.get("/health")
async def health():
    return {"status": "ok"}
