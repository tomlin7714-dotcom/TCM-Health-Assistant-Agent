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
    """Run the ReAct agent. If image provided, pre-analyze it and add to context."""
    from langchain_core.messages import HumanMessage

    try:
        user_message = symptoms

        # If image provided, analyze it first via Zhipu
        if image_base64:
            try:
                from app.agent.llm import get_vision_llm
                from langchain_core.messages import HumanMessage as HMsg
                vision_llm = get_vision_llm()
                img_data = image_base64
                if "," in img_data:
                    img_data = img_data.split(",", 1)[1]
                vision_result = await vision_llm.ainvoke([
                    HMsg(content=[
                        {"type": "text", "text": "你是中医望诊专家。请详细分析舌苔图片：舌色、苔色、舌形、齿痕裂纹，给出寒热虚实判断。200字以内中文回答。"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{img_data}"}},
                    ])
                ])
                user_message = f"【舌苔望诊结果】{vision_result.content}\n\n【用户症状描述】{symptoms}\n\n请综合望诊和症状进行辨证分析。"
            except Exception:
                pass  # If vision fails, continue with text only

        agent = get_tcm_agent()
        state = await agent.ainvoke({
            "messages": [HumanMessage(content=user_message)],
            "user_context": None,
        })

        # Extract final AI response
        final_content = ""
        tool_calls_made = []
        for msg in state["messages"]:
            if hasattr(msg, "tool_calls") and msg.tool_calls:
                tool_calls_made.extend(tc["name"] for tc in msg.tool_calls)
            if isinstance(msg, type(state["messages"][-1])) and hasattr(msg, "content") and msg.content and not hasattr(msg, "tool_calls"):
                final_content = msg.content

        if not final_content:
            final_content = str(state["messages"][-1].content) if hasattr(state["messages"][-1], "content") else "辨证分析完成，请查看结果。"

        # Parse title from content (first line or extract)
        lines = [l.strip() for l in final_content.split("\n") if l.strip()]
        title = lines[0].lstrip("#").strip()[:30] if lines else "AI 中医辨证分析"

        return DiagnoseResult(
            title=title,
            diagnosis=final_content,
            advice=final_content,  # Unified response
            constitution="待测",
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

    consult = await create_consultation(db, current_user.id, ConsultationCreate(
        title=result.title,
        type="tongue",
        symptoms=data.symptoms,
        analysis=result.diagnosis,
        suggestion=result.advice or "",
    ))
    result.consultation_id = consult.id
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
    consult = await create_consultation(db, current_user.id, ConsultationCreate(
        title=result.title,
        type="tongue",
        symptoms=data.symptoms,
        analysis=result.diagnosis,
        suggestion=result.advice or "",
    ))
    result.consultation_id = consult.id
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
    consult = await create_consultation(db, current_user.id, ConsultationCreate(
        title=result.title,
        type="tongue",
        symptoms="上传舌苔/检验报告图片",
        analysis=result.diagnosis,
        suggestion=result.advice or "",
    ))
    result.consultation_id = consult.id
    return result
