"""
Multi-turn conversation — follow-up questions after initial diagnosis.
"""
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.schemas import ChatRequest, ChatResponse
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])

CHAT_SYSTEM_PROMPT = """你是一位精通中医辨证论治的资深中医师，熟读《黄帝内经》《伤寒杂病论》等经典。

你刚刚已经为患者完成了初步辨证分析，现在患者针对辨证结果和养生建议提出了进一步的追问。

请根据以下信息，简洁专业地回答患者的问题：
- 你已经给出了辨证结果和养生建议
- 患者正在追问具体细节
- 如果是问"吃什么"，给出具体食材和简单做法
- 如果是问"怎么调理"，给出可操作的日常建议
- 如果是问"为什么会这样"，用通俗语言解释中医原理
- 回答控制在150字以内，实用为主

注意：对话仅为养生参考，如症状严重请建议就医。"""


@router.post("", response_model=ChatResponse)
async def chat(
    data: ChatRequest,
    current_user=Depends(get_current_user),
):
    if not data.new_message.strip():
        raise HTTPException(status_code=400, detail="请输入问题")

    from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
    from app.agent.llm import get_text_llm

    llm = get_text_llm()

    # Build conversation with full context
    messages = [SystemMessage(content=CHAT_SYSTEM_PROMPT)]

    # Inject diagnosis context as a system-level note
    context_block = f"""【患者原始症状】
{data.symptoms}

【辨证结果】
{data.diagnosis}

【已给出的养生建议】
{data.advice}

以上是你之前给出的辨证分析。现在患者针对你的分析提出了新的追问，请基于之前的辨证结果进行回答。"""
    messages.append(SystemMessage(content=context_block))

    # Add conversation history (last 6 rounds to keep context manageable)
    for msg in data.conversation_history[-12:]:
        if msg.role == "user":
            messages.append(HumanMessage(content=msg.content))
        else:
            messages.append(AIMessage(content=msg.content))

    # Add the new question
    messages.append(HumanMessage(content=data.new_message))

    try:
        result = await llm.ainvoke(messages)
        return ChatResponse(reply=result.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
