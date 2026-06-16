from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # DeepSeek / OpenAI-compatible LLM (text reasoning)
    openai_api_key: str = ""
    openai_base_url: str = "https://api.deepseek.com/v1"
    llm_provider: str = "deepseek"
    llm_model: str = "deepseek-chat"

    # Gemini (vision / image analysis)
    gemini_api_key: str = ""
    vision_model: str = "gemini-2.0-flash"

    # JWT
    secret_key: str = "change-this-to-a-random-secret-string"
    access_token_expire_minutes: int = 10080

    # Database
    database_url: str = "sqlite+aiosqlite:///./tcm_health.db"

    # ChromaDB
    chroma_persist_path: str = "./chroma_db"

    # Zhipu (vision / image analysis — free tier, no credit card needed)
    zhipu_api_key: str = ""
    zhipu_base_url: str = "https://open.bigmodel.cn/api/paas/v4/"
    zhipu_vision_model: str = "glm-4v-flash"

    # CORS
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # App
    app_env: str = "development"
    app_debug: bool = True

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
