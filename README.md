AI Money Buddy — AI Personal Finance Assistant


Money Buddy is an AI-powered personal finance assistant designed to help users track expenses, analyze spending behavior, and receive intelligent financial insights.


Built for hackathon use, the system combines a FastAPI backend, lightweight frontend, database storage, and AI integration to enhance financial decision-making.

---
Key Features


•	Expense & income tracking


•	AI financial advisor chatbot 


•	Risk prediction analysis 


•	SQLite database storage 


•	Responsive frontend (HTML/CSS/JS) 


•	FastAPI backend for real-time communication


Technology Used


Backend:


- Python

  
- FastAPI

  
- Uvicorn

  
- SQLAlchemy

  
Database:


- SQLite (`moneybuddy.db`)


Frontend:


- HTML

  
- CSS

  
- JavaScript

  
Environment & Config:


- python-dotenv

  

AI Tools Used
- Figma
- ChatGPT
- Claude 
- Gemini 
- Copilot
- Groq API

---
How the System is Built


Architecture Overview: 


Frontend (HTML / CSS / JS)


        ↓

        
FastAPI Backend (main.py)


        ↓

        
SQLite Database (moneybuddy.db)


        ↓

        
AI Layer (Groq API)



---
Terminal Setup Step-by-Step


1. Open project folder


cd "C:\Users\YOUR_NAME\Documents\HACKATHON\MONEY BUDDY"


2. Create virtual environment


python -m venv venv


3. Enable PowerShell script permission (Windows only)


Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass


4.  Activate virtual environment

   
.\venv\Scripts\Activate.ps1


If successful, you will see: (venv)


5. Install required dependencies

   
pip install fastapi uvicorn sqlalchemy python-dotenv groq


6. Create .env file

   
Add your API key: GROQ_API_KEY=your_api_key_here


7. Run backend server

   
uvicorn main:app --reload


8. Open frontend

   
Open: index.html

