from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


class SearchRequest(BaseModel):
    country: str = Field(min_length=2, max_length=80)
    cities: list[str] = Field(min_length=1, max_length=50)
    business_queries: list[str] = Field(min_length=1, max_length=10)
    max_results: int = Field(default=20, ge=1, le=100)
    headless: bool = True
    origin: str | None = Field(default=None, max_length=200)

    @field_validator("country")
    @classmethod
    def clean_country(cls, value: str) -> str:
        return " ".join(value.split())

    @field_validator("cities", "business_queries")
    @classmethod
    def clean_lists(cls, values: list[str]) -> list[str]:
        cleaned = list(dict.fromkeys(" ".join(item.split()) for item in values if item.strip()))
        if not cleaned:
            raise ValueError("At least one non-empty value is required")
        return cleaned


class TemplateRequest(BaseModel):
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=10_000)


class SendEmailRequest(TemplateRequest):
    lead_ids: list[str] = Field(min_length=1, max_length=25)
    smtp_host: str = Field(min_length=3, max_length=253)
    smtp_port: int = Field(default=587, ge=1, le=65535)
    smtp_username: str = Field(min_length=1, max_length=320)
    smtp_password: str = Field(min_length=1, max_length=500)
    from_email: EmailStr
    use_tls: bool = True
    confirm: Literal[True]

