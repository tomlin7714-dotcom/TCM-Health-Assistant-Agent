"""
LLM client factory with automatic fallback.
- Primary: DeepSeek V3 (text reasoning)
- Fallback: Zhipu GLM-4-Flash (free, kicks in if primary fails)
- Vision: Zhipu GLM-4V-Flash (image analysis)
"""
import logging
from functools import lru_cache

logger = logging.getLogger(__name__)


class _FallbackLLM:
    """
    透明 Fallback 包装器。
    - 正常情况走主模型（DeepSeek）
    - 主模型抛异常时自动切备用模型（智谱 GLM-4-Flash）
    - 对外接口和 ChatOpenAI 完全一样，其他代码无需改动
    """

    def __init__(self, primary, fallback):
        self._primary = primary
        self._fallback = fallback

    async def ainvoke(self, messages, **kwargs):
        try:
            return await self._primary.ainvoke(messages, **kwargs)
        except Exception as e:
            logger.warning(f"主模型 DeepSeek 调用失败，自动切换到智谱备用模型。原因：{e}")
            return await self._fallback.ainvoke(messages, **kwargs)

    def bind_tools(self, tools):
        """工具绑定委托给主模型（备用模型同样支持 OpenAI 格式 tool calling）"""
        primary_with_tools = self._primary.bind_tools(tools)
        fallback_with_tools = self._fallback.bind_tools(tools)
        return _FallbackLLM(primary_with_tools, fallback_with_tools)

    # 透传常用属性
    @property
    def model_name(self):
        return self._primary.model_name if hasattr(self._primary, 'model_name') else 'fallback-llm'


@lru_cache(maxsize=1)
def _get_primary_llm():
    """DeepSeek V3 — 主力文本推理模型"""
    from langchain_openai import ChatOpenAI
    from app.core.config import settings
    return ChatOpenAI(
        model=settings.llm_model,
        api_key=settings.openai_api_key,
        base_url=settings.openai_base_url,
        temperature=0.7,
        max_tokens=2048,
        timeout=60,
        max_retries=1,  # 只重试一次，快速触发 fallback
    )


@lru_cache(maxsize=1)
def _get_fallback_llm():
    """智谱 GLM-4-Flash — 免费备用文本模型，和 DeepSeek 一样兼容 OpenAI 格式"""
    from langchain_openai import ChatOpenAI
    from app.core.config import settings
    return ChatOpenAI(
        model="glm-4-flash",            # 智谱免费文本模型
        api_key=settings.zhipu_api_key,
        base_url=settings.zhipu_base_url,
        temperature=0.7,
        max_tokens=2048,
        timeout=60,
        max_retries=1,
    )


@lru_cache(maxsize=1)
def get_text_llm():
    """
    返回带自动 Fallback 的文本 LLM。
    外部调用方式和以前完全一样，不需要改任何代码。
    """
    return _FallbackLLM(_get_primary_llm(), _get_fallback_llm())


@lru_cache(maxsize=1)
def get_vision_llm():
    """智谱 GLM-4V-Flash — 免费视觉模型，用于舌苔图片分析"""
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
