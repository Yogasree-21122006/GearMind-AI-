from datetime import datetime
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, DateTime

Base = declarative_base()

class TimestampMixin:
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
