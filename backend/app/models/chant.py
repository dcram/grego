from sqlalchemy import Boolean, ForeignKey, Integer, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Chant(Base):
    __tablename__ = "chants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    cantus_id: Mapped[str | None] = mapped_column(String(32))
    version: Mapped[str | None] = mapped_column(String(128))
    incipit: Mapped[str | None] = mapped_column(String(256))
    initial: Mapped[int] = mapped_column(Integer, default=1)
    office_part: Mapped[str | None] = mapped_column(String(16))
    mode: Mapped[str | None] = mapped_column(String(8))
    mode_var: Mapped[str | None] = mapped_column(String(16))
    transcriber: Mapped[str | None] = mapped_column(String(128))
    commentary: Mapped[str | None] = mapped_column(String(256))
    gabc: Mapped[str | None] = mapped_column(Text)
    gabc_verses: Mapped[str | None] = mapped_column(Text)
    tex_verses: Mapped[str | None] = mapped_column(Text)
    remarks: Mapped[str | None] = mapped_column(Text)
    copyrighted: Mapped[bool] = mapped_column(Boolean, default=False)

    sources: Mapped[list["ChantSource"]] = relationship(back_populates="chant")
    tags: Mapped[list["ChantTag"]] = relationship(back_populates="chant")


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    year: Mapped[int | None] = mapped_column(SmallInteger)
    period: Mapped[str | None] = mapped_column(String(128))
    editor: Mapped[str | None] = mapped_column(String(128))
    title: Mapped[str | None] = mapped_column(String(256))
    description: Mapped[str | None] = mapped_column(Text)
    caption: Mapped[str | None] = mapped_column(Text)

    chants: Mapped[list["ChantSource"]] = relationship(back_populates="source")


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    tag: Mapped[str] = mapped_column(String(255), unique=True)

    chants: Mapped[list["ChantTag"]] = relationship(back_populates="tag")


class ChantSource(Base):
    __tablename__ = "chant_sources"

    chant_id: Mapped[int] = mapped_column(ForeignKey("chants.id"), primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("sources.id"), primary_key=True)
    page: Mapped[str] = mapped_column(String(16), primary_key=True)
    sequence: Mapped[int] = mapped_column(Integer, default=1)
    extent: Mapped[int] = mapped_column(Integer, default=1)

    chant: Mapped["Chant"] = relationship(back_populates="sources")
    source: Mapped["Source"] = relationship(back_populates="chants")


class ChantTag(Base):
    __tablename__ = "chant_tags"

    chant_id: Mapped[int] = mapped_column(ForeignKey("chants.id"), primary_key=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tags.id"), primary_key=True)

    chant: Mapped["Chant"] = relationship(back_populates="tags")
    tag: Mapped["Tag"] = relationship(back_populates="chants")
