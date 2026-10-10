from pydantic import BaseModel, Field


class DealSaathiRequest(BaseModel):
    buyer_message: str = Field(min_length=1, max_length=2000)
    product_title: str = Field(default="", max_length=200)
    quantity: int | None = Field(default=None, ge=1)
    proposed_price: int | None = Field(default=None, ge=0)
    language: str = Field(default="hi", max_length=10)


class KeyTakeaway(BaseModel):
    label: str
    value: str
    tag: str | None = None


class DealSaathiData(BaseModel):
    summary: str
    explanation: str
    key_takeaways: list[KeyTakeaway] = Field(default_factory=list)
    suggested_reply: str
    counter_offer_advice: str | None = None
    questions_to_ask: list[str] = Field(default_factory=list)
