from typing import TypeVar, Generic, Type, Optional, List
from uuid import UUID
from sqlalchemy.orm import Session
from backend.app.models.base import Base

ModelT = TypeVar("ModelT", bound=Base)

class BaseRepository(Generic[ModelT]):
    """Generic repository providing base CRUD operations over SQLAlchemy models."""

    def __init__(self, model: Type[ModelT], db: Optional[Session]):
        self.model = model
        self.db = db

    def get_by_id(self, id_: UUID) -> Optional[ModelT]:
        if not self.db:
            return None
        return self.db.query(self.model).filter(self.model.id == id_).first()

    def get_all(self, skip: int = 0, limit: int = 50) -> List[ModelT]:
        if not self.db:
            return []
        return self.db.query(self.model).offset(skip).limit(limit).all()

    def count(self) -> int:
        if not self.db:
            return 0
        return self.db.query(self.model).count()
