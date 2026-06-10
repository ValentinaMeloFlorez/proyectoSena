"""Repositorio genérico CRUD — base para todos los repositorios."""

from typing import Generic, List, Optional, Type, TypeVar
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.base import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)


class BaseRepository(Generic[ModelType]):
    """
    Implementación genérica de operaciones CRUD.
    Cumple DIP: los servicios dependen de esta abstracción.
    """

    def __init__(self, model: Type[ModelType], db: Session) -> None:
        self.model = model
        self.db = db

    def get_by_id(self, entity_id: UUID) -> Optional[ModelType]:
        return (
            self.db.query(self.model)
            .filter(self.model.id == entity_id, self.model.is_active.is_(True))
            .first()
        )

    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return (
            self.db.query(self.model)
            .filter(self.model.is_active.is_(True))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count(self) -> int:
        return self.db.query(self.model).filter(self.model.is_active.is_(True)).count()

    def create(self, entity: ModelType) -> ModelType:
        self.db.add(entity)
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def update(self, entity: ModelType) -> ModelType:
        self.db.commit()
        self.db.refresh(entity)
        return entity

    def soft_delete(self, entity: ModelType) -> ModelType:
        entity.is_active = False
        return self.update(entity)
