from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.chant import Chant, Feast, FeastChant
from app.schemas.chant import (
    ChantCreate,
    ChantRead,
    FeastChantCreate,
    FeastChantRead,
    FeastCreate,
    FeastRead,
)

router = APIRouter(prefix="/api")


# --- Chants ---


@router.get("/chants", response_model=list[ChantRead])
def list_chants(db: Session = Depends(get_db)):
    return db.query(Chant).all()


@router.post("/chants", response_model=ChantRead, status_code=201)
def create_chant(chant: ChantCreate, db: Session = Depends(get_db)):
    db_chant = Chant(**chant.model_dump())
    db.add(db_chant)
    db.commit()
    db.refresh(db_chant)
    return db_chant


@router.get("/chants/{chant_id}", response_model=ChantRead)
def get_chant(chant_id: int, db: Session = Depends(get_db)):
    chant = db.get(Chant, chant_id)
    if not chant:
        raise HTTPException(status_code=404, detail="Chant not found")
    return chant


# --- Feasts ---


@router.get("/feasts", response_model=list[FeastRead])
def list_feasts(db: Session = Depends(get_db)):
    return db.query(Feast).all()


@router.post("/feasts", response_model=FeastRead, status_code=201)
def create_feast(feast: FeastCreate, db: Session = Depends(get_db)):
    db_feast = Feast(**feast.model_dump())
    db.add(db_feast)
    db.commit()
    db.refresh(db_feast)
    return db_feast


@router.get("/feasts/{feast_id}", response_model=FeastRead)
def get_feast(feast_id: int, db: Session = Depends(get_db)):
    feast = db.get(Feast, feast_id)
    if not feast:
        raise HTTPException(status_code=404, detail="Feast not found")
    return feast


# --- Feast-Chant assignments ---


@router.post("/feast-chants", response_model=FeastChantRead, status_code=201)
def assign_chant_to_feast(
    assignment: FeastChantCreate, db: Session = Depends(get_db)
):
    db_assignment = FeastChant(**assignment.model_dump())
    db.add(db_assignment)
    db.commit()
    db.refresh(db_assignment)
    return db_assignment


@router.get("/feasts/{feast_id}/chants", response_model=list[ChantRead])
def get_feast_chants(feast_id: int, db: Session = Depends(get_db)):
    feast = db.get(Feast, feast_id)
    if not feast:
        raise HTTPException(status_code=404, detail="Feast not found")
    return [fc.chant for fc in feast.chants]
