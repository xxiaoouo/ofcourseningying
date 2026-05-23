from sqlalchemy import Column, Integer, String, Float
from database import Base

# =====================
# USER TABLE
# =====================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)

# =====================
# DEBT TABLE ⭐ FIXED
# =====================
class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    paid = Column(Float, default=0)
    total = Column(Float)