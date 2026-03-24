from pydantic import BaseModel

from app.models.chant import ChantType, LiturgicalSeason


class ChantBase(BaseModel):
    title: str
    incipit: str | None = None
    chant_type: ChantType
    mode: int | None = None
    latin_text: str | None = None
    source: str | None = None


class ChantCreate(ChantBase):
    pass


class ChantRead(ChantBase):
    id: int

    model_config = {"from_attributes": True}


class FeastBase(BaseModel):
    name: str
    latin_name: str | None = None
    season: LiturgicalSeason
    rank: str | None = None
    day_of_year: int | None = None


class FeastCreate(FeastBase):
    pass


class FeastRead(FeastBase):
    id: int

    model_config = {"from_attributes": True}


class FeastChantCreate(BaseModel):
    feast_id: int
    chant_id: int
    position: int | None = None


class FeastChantRead(FeastChantCreate):
    id: int

    model_config = {"from_attributes": True}
