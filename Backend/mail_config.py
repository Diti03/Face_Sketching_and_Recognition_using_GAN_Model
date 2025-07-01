from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import BaseSettings

class MailSettings(BaseSettings):
    MAIL_USERNAME: str = "your_email@gmail.com"
    MAIL_PASSWORD: str = "your_app_password"  # Use Gmail App Password (not your login password)
    MAIL_FROM: str = "your_email@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_TLS: bool = True
    MAIL_SSL: bool = False
    USE_CREDENTIALS: bool = True

    class Config:
        env_file = ".env"

mail_settings = MailSettings()

conf = ConnectionConfig(
    MAIL_USERNAME = mail_settings.MAIL_USERNAME,
    MAIL_PASSWORD = mail_settings.MAIL_PASSWORD,
    MAIL_FROM = mail_settings.MAIL_FROM,
    MAIL_PORT = mail_settings.MAIL_PORT,
    MAIL_SERVER = mail_settings.MAIL_SERVER,
    MAIL_TLS = mail_settings.MAIL_TLS,
    MAIL_SSL = mail_settings.MAIL_SSL,
    USE_CREDENTIALS = mail_settings.USE_CREDENTIALS
)
