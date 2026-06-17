"""
Multi-turn conversation — follow-up questions using the ReAct Agent with tools.
"""
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.schemas.schemas import ChatRequest, ChatResponse
from app.api.routes.auth import get_current_user
from app.db.database import get_db
from app.models.models import Consultation

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    data: ChatRequest,
    current_user=Depends(get_current_user),
):
    if not data.new_message.strip():
        raise HTTPException(status_code=400, detail="请输入问题")

    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
    from app.agent.graph import get_tcm_agent

    agent = get_tcm_agent()

    # Build conversation history for the agent
    messages = [
        SystemMessage(content=f"用户之前说的是：{data.symptoms}\n之前你给出的分析是：{data.diagnosis}\n现在用户接着追问了，请保持温暖贴心的风格，自然地引用小工具来帮忙回答~"),
    ]

    for msg in data.conversation_history[-12:]:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        else:
            messages.append(AIMessage(content=msg.content))

    messages.append(HumanMessage(content=data.new_message))

    try:
        user_ctx = None
        if current_user.constitution and current_user.constitution not in ("未测试", ""):
            user_ctx = f"用户体质：{current_user.constitution}"
        state = await agent.ainvoke({"messages": messages, "user_context": user_ctx})
        # Extract final response
        last = state["messages"][-1]
        reply = last.content if hasattr(last, "content") else str(last)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


class ChatSyncRequest(BaseModel):
    """Sync full chat log to an existing consultation record."""
    consultation_id: str
    chat_log: str  # JSON-stringified chat history


@router.put("/sync")
async def sync_chat_log(
    data: ChatSyncRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Consultation).where(
            Consultation.id == data.consultation_id,
            Consultation.user_id == current_user.id,
        )
    )
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="咨询记录不存在")
    record.suggestion = data.chat_log
    await db.commit()
    return {"status": "ok"}
