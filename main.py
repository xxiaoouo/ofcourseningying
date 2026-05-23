import os
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv

from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import User, Debt   # ⭐ IMPORTANT

# =========================
# INIT DB (ONLY ONCE)
# =========================
Base.metadata.create_all(bind=engine)

# =========================
# ENV
# =========================
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

print("KEY LOADED =", "YES" if api_key else "NO")

# =========================
# APP
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# AI
# =========================
client = Groq(api_key=api_key)

# =========================
# SCHEMAS
# =========================
class ChatRequest(BaseModel):
    message: str

class UserCreate(BaseModel):
    name: str

class DebtCreate(BaseModel):
    name: str
    paid: float = 0
    total: float

# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

# =========================
# USERS
# =========================
@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# =========================
# 💰 DEBT (FIXED)
# =========================
@app.post("/add-debt")
def add_debt(debt: DebtCreate, db: Session = Depends(get_db)):

    print("🔥 ADD DEBT HIT:", debt)

    new_debt = Debt(
        name=debt.name,
        paid=debt.paid,
        total=debt.total
    )

    db.add(new_debt)
    db.commit()
    db.refresh(new_debt)

    print("💾 SAVED DEBT ID:", new_debt.id)

    return {"message": "Debt saved", "id": new_debt.id}


@app.get("/get-debts")
def get_debts(db: Session = Depends(get_db)):

    debts = db.query(Debt).all()

    return [
        {
            "id": d.id,
            "name": d.name,
            "paid": d.paid,
            "total": d.total
        }
        for d in debts
    ]

# =========================
# CHAT (UNCHANGED)
# =========================
@app.post("/chat")
def chat(req: ChatRequest):

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "user", "content": req.message}
            ]
        )

        return {"reply": response.choices[0].message.content}

    except Exception as e:
        return {"reply": str(e)}