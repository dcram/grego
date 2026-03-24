from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.chant import Chant, ChantTag, Source, Tag
from app.schemas.chant import ChantDetail, ChantListRead, SourceRead, TagRead

router = APIRouter(prefix="/api")


# --- Chants ---


@router.get("/chants", response_model=list[ChantListRead])
def list_chants(
    office_part: str | None = None,
    mode: str | None = None,
    search: str | None = None,
    tag_id: int | None = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: Session = Depends(get_db),
):
    q = db.query(Chant)
    if office_part:
        q = q.filter(Chant.office_part == office_part)
    if mode:
        q = q.filter(Chant.mode == mode)
    if search:
        q = q.filter(Chant.incipit.ilike(f"%{search}%"))
    if tag_id:
        q = q.join(ChantTag).filter(ChantTag.tag_id == tag_id)
    return q.order_by(Chant.incipit).offset(offset).limit(limit).all()


@router.get("/chants/{chant_id}", response_model=ChantDetail)
def get_chant(chant_id: int, db: Session = Depends(get_db)):
    chant = (
        db.query(Chant)
        .options(joinedload(Chant.tags).joinedload(ChantTag.tag))
        .filter(Chant.id == chant_id)
        .first()
    )
    if not chant:
        raise HTTPException(status_code=404, detail="Chant not found")
    chant.tags = [ct.tag for ct in chant.tags]
    return chant


# --- Tags ---


@router.get("/tags", response_model=list[TagRead])
def list_tags(
    search: str | None = None,
    db: Session = Depends(get_db),
):
    q = db.query(Tag)
    if search:
        q = q.filter(Tag.tag.ilike(f"%{search}%"))
    return q.order_by(Tag.tag).all()


@router.get("/tags/{tag_id}/chants", response_model=list[ChantListRead])
def get_tag_chants(tag_id: int, db: Session = Depends(get_db)):
    tag = db.get(Tag, tag_id)
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    return [ct.chant for ct in tag.chants]


# --- Sources ---


@router.get("/sources", response_model=list[SourceRead])
def list_sources(db: Session = Depends(get_db)):
    return db.query(Source).order_by(Source.title).all()
