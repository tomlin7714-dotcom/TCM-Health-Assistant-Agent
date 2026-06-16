"""
LLM client factory.
- Text: DeepSeek V3 via OpenAI-compatible API
- Vision: Zhipu GLM-4V-Flash (free, OpenAI-compatible)
"""
from functools import lru_cache


@lru_cache(maxsize=1)
def get_text_llm():
    from langchain_openai import ChatOpenAI
    from app.core.config import settings
    return ChatOpenAI(
        model=settings.llm_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
        temperature=0.7,
        max_tokens=2048,
    )


@lru_cache(maxsize=1)
def get_vision_llm():
    """Zhipu GLM-4V-Flash — free vision model, OpenAI-compatible API."""
    from langchain_openai import ChatOpenAI
    from app.core.config import settings
    return ChatOpenAI(
        model=settings.zhipu_vision_model,
        api_key=settings.zhipu_api_key,
        base_url=settings.zhipu_base_url,
        temperature=0.3,
        max_tokens=1024,
        timeout=45,
        max_retries=2,
    )
