from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra="forbid",
    )


class KnownProductDetails(APIModel):
    title: str = Field(default="", max_length=160)
    description: str = Field(default="", max_length=5000)
    category: str = Field(default="", max_length=120)
    craft_type: str = Field(default="", max_length=120)
    materials: list[str] = Field(default_factory=list, max_length=20)
    colours: list[str] = Field(default_factory=list, max_length=20)
    effort: str = Field(default="", max_length=500)
    size: str = Field(default="", max_length=120)
    answers: dict[str, str] = Field(default_factory=dict)


class ProductAnalysisRequest(APIModel):
    image_urls: list[HttpUrl] = Field(min_length=1, max_length=3)
    transcript: str = Field(default="", max_length=5000)
    description: str = Field(default="", max_length=5000)
    language: Literal["en", "hi"] = "en"
    known_details: KnownProductDetails = Field(default_factory=KnownProductDetails)


class ListingSuggestions(APIModel):
    title: str = Field(default="", max_length=160)
    description: str = Field(default="", max_length=5000)
    category: str = Field(default="", max_length=120)
    craft_type: str = Field(default="", max_length=120)
    materials: list[str] = Field(default_factory=list, max_length=20)
    colours: list[str] = Field(default_factory=list, max_length=20)
    tags: list[str] = Field(default_factory=list, max_length=12)


class MissingInformationQuestion(APIModel):
    id: str = Field(min_length=1, max_length=80)
    field: str = Field(min_length=1, max_length=80)
    question: str = Field(min_length=1, max_length=240)
    skippable: bool = True


class GeminiProductAnalysis(APIModel):
    suggestions: ListingSuggestions
    missing_information_questions: list[MissingInformationQuestion] = Field(
        default_factory=list,
        max_length=4,
    )


class ProductAnalysisData(APIModel):
    suggestions: ListingSuggestions
    confirmed_details: KnownProductDetails
    missing_information_questions: list[MissingInformationQuestion]
    model: str


class MakingProcessStepInput(APIModel):
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(default="", max_length=120)
    description: str = Field(default="", max_length=2000)
    image_url: HttpUrl | None = None


class MakingProcessAnalysisRequest(APIModel):
    language: Literal["en", "hi"] = "en"
    steps: list[MakingProcessStepInput] = Field(min_length=1, max_length=5)


class MakingProcessStepSuggestion(APIModel):
    id: str = Field(min_length=1, max_length=100)
    title: str = Field(default="", max_length=120)
    description: str = Field(default="", max_length=2000)


class GeminiMakingProcessAnalysis(APIModel):
    steps: list[MakingProcessStepSuggestion] = Field(min_length=1, max_length=5)


class MakingProcessAnalysisData(APIModel):
    steps: list[MakingProcessStepSuggestion]
    model: str
