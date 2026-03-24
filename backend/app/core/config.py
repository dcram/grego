from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://grego:grego@localhost:5432/grego"
    app_name: str = "Grego"

    model_config = {"env_prefix": "GREGO_"}


settings = Settings()
