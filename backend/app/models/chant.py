import enum

from sqlalchemy import Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ChantType(str, enum.Enum):
    INTROIT = "introit"
    GRADUAL = "gradual"
    ALLELUIA = "alleluia"
    TRACT = "tract"
    OFFERTORY = "offertory"
    COMMUNION = "communion"
    KYRIE = "kyrie"
    GLORIA = "gloria"
    CREDO = "credo"
    SANCTUS = "sanctus"
    AGNUS_DEI = "agnus_dei"
    HYMN = "hymn"
    ANTIPHON = "antiphon"
    RESPONSORY = "responsory"


class LiturgicalSeason(str, enum.Enum):
    ADVENT = "advent"
    CHRISTMAS = "christmas"
    EPIPHANY = "epiphany"
    SEPTUAGESIMA = "septuagesima"
    LENT = "lent"
    PASSIONTIDE = "passiontide"
    EASTER = "easter"
    ASCENSION = "ascension"
    PENTECOST = "pentecost"
    AFTER_PENTECOST = "after_pentecost"


class Chant(Base):
    __tablename__ = "chants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255))
    incipit: Mapped[str | None] = mapped_column(String(255))
    chant_type: Mapped[ChantType] = mapped_column(Enum(ChantType))
    mode: Mapped[int | None] = mapped_column(Integer)
    latin_text: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str | None] = mapped_column(String(255))

    feasts: Mapped[list["FeastChant"]] = relationship(back_populates="chant")


class Feast(Base):
    __tablename__ = "feasts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    latin_name: Mapped[str | None] = mapped_column(String(255))
    season: Mapped[LiturgicalSeason] = mapped_column(Enum(LiturgicalSeason))
    rank: Mapped[str | None] = mapped_column(String(50))
    day_of_year: Mapped[int | None] = mapped_column(Integer)

    chants: Mapped[list["FeastChant"]] = relationship(back_populates="feast")


class FeastChant(Base):
    __tablename__ = "feast_chants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    feast_id: Mapped[int] = mapped_column(ForeignKey("feasts.id"))
    chant_id: Mapped[int] = mapped_column(ForeignKey("chants.id"))
    position: Mapped[int | None] = mapped_column(Integer)

    feast: Mapped["Feast"] = relationship(back_populates="chants")
    chant: Mapped["Chant"] = relationship(back_populates="feasts")
