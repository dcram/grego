from pydantic import BaseModel


# --- Tags ---


class TagRead(BaseModel):
    id: int
    tag: str

    model_config = {"from_attributes": True}


# --- Sources ---


class SourceRead(BaseModel):
    id: int
    year: int | None = None
    period: str | None = None
    editor: str | None = None
    title: str | None = None

    model_config = {"from_attributes": True}


# --- Chants ---


class ChantRead(BaseModel):
    id: int
    cantus_id: str | None = None
    version: str | None = None
    incipit: str | None = None
    office_part: str | None = None
    mode: str | None = None
    mode_var: str | None = None
    commentary: str | None = None
    gabc: str | None = None

    model_config = {"from_attributes": True}


class ChantDetail(ChantRead):
    transcriber: str | None = None
    gabc_verses: str | None = None
    tex_verses: str | None = None
    remarks: str | None = None
    tags: list[TagRead] = []

    model_config = {"from_attributes": True}


class ChantListRead(BaseModel):
    id: int
    incipit: str | None = None
    office_part: str | None = None
    mode: str | None = None

    model_config = {"from_attributes": True}
