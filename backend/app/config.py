from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    OPENAI_API_KEY: str | None = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    CORS_ORIGINS: str = "http://localhost:5173"
    ENV: str = "dev"
    class Config:
        env_file = ".env"

settings = Settings()
