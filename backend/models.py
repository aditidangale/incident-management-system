from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    component_id = Column(String, index=True)
    severity = Column(String)
    status = Column(String, default="OPEN")

    root_cause = Column(String, nullable=True)
    fix_applied = Column(String, nullable=True)
    prevention = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)