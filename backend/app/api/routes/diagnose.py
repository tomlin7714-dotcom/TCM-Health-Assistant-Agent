"""
Diagnose routes - powered by the LangGraph TCM Agent.
"""
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import base64
import traceback

from app.db.database import get_db
from app.schemas.schemas import DiagnoseRequest, DiagnoseResult, ConsultationCreate
from app.services.user_service import create_consultation
from app.api.routes.auth import get_current_user
from app.agent.graph import get_tcm_agent

router = APIRouter(prefix="/diagnose", tags=["diagnose"])


@router.get("/test")
async def diagnose_test():
    """Smoke test - no auth needed."""
    from app.core.config import settings
    try:
        from app.agent.llm import get_text_llm
        get_text_llm()
        return {
            "status": "ok",
            "llm_model": settings.llm_model,
            "base_url": settings.openai_base_url,
            "deepseek_key_set": bool(settings.openai_api_key and "sk-your" not in settings.openai_api_key),
            "zhipu_key_set": bool(settings.zhipu_api_key and "your" not in settings.zhipu_api_key),
            "vision_model": settings.zhipu_vision_model,
        }
    except Exception as e:
        return {"status": "error", "detail": str(e), "trace": traceback.format_exc()}


async def _run_agent(symptoms: str, image_base64: str | None) -> DiagnoseResult:
    try:
        agent = get_tcm_agent()
        state = await agent.ainvoke({
            "symptoms": symptoms,
            "image_base64": image_base64,
            "parsed_symptoms": None,
            "image_analysis": None,
            "diagnosis": None,
            "advice": None,
            "title": None,
            "herb_id": None,
            "recipe_id": None,
            "constitution": None,
            "error": None,
        })
        return DiagnoseResult(
            title=state.get("title") or "AI 中医辨证分析",
            diagnosis=state.get("diagnosis") or "",
            advice=state.get("advice") or "",
            herb_id=state.get("herb_id"),
            recipe_id=state.get("recipe_id"),
            constitution=state.get("constitution"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}\n{traceback.format_exc()}")


@router.post("/combined", response_model=DiagnoseResult)
async def diagnose_combined(
    data: DiagnoseRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not data.symptoms.strip():
        raise HTTPException(status_code=400, detail="请输入症状描述")

    result = await _run_agent(data.symptoms, data.image_base64)

    await create_consultation(db, current_user.id, ConsultationCreate(
        title=result.title,
        type="tongue",
        symptoms=data.symptoms,
        analysis=result.diagnosis,
        suggestion=result.advice or "",
    ))
    return result


@router.post("/symptom", response_model=DiagnoseResult)
async def diagnose_symptom(
    data: DiagnoseRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if not data.symptoms.strip():
        raise HTTPException(status_code=400, detail="请输入症状描述")
    result = await _run_agent(data.symptoms, None)
    await create_consultation(db, current_user.id, ConsultationCreate(
        title=result.title,
        type="tongue",
        symptoms=data.symptoms,
        analysis=result.diagnosis,
        suggestion=result.advice or "",
    ))
    return result


@router.post("/image", response_model=DiagnoseResult)
async def diagnose_image(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="仅支持 JPEG / PNG / WebP 格式图片")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="图片大小不能超过 5MB")
    image_b64 = base64.b64encode(content).decode("utf-8")
    result = await _run_agent("请根据图片进行中医望诊分析", image_b64)
    await create_consultation(db, current_user.id, ConsultationCreate(
        title=result.title,
        type="tongue",
        symptoms="上传舌苔/检验报告图片",
        analysis=result.diagnosis,
        suggestion=result.advice or "",
    ))
    return result
