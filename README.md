# Mini Learning Platform

A small learning platform that lets users:
- Register & login (JWT auth)
- Choose a **category** and **sub-category**
- Submit a **prompt** 
- Get a lesson 
- See personal **learning history**
- **Admin:** first registered user can list all users and all prompts

---

## Tech Used

- **Backend:** FastAPI (Python), SQLAlchemy, Pydantic
- **DB:** PostgreSQL (via Docker Compose)
- **Auth:** JWT Bearer tokens
- **AI Integration:** OpenAI Chat Completions (falls back to mock if no key)
- **Frontend:** React + Vite + TypeScript
- **Docs:** Swagger/OpenAPI at `/docs`

---

## Assumptions

- The first registered user is automatically given the admin role.
- If OPENAI_API_KEY is not provided in .env, the backend will return a mock lesson response.
- Database runs in a Dockerized Postgres instance.
- Credentials (like DB password and API keys) are not committed to GitHub — use .env files.

## Setup Instructions

1. Clone the repository
git clone https://github.com/<your-username>/mini-learning-platform.git
cd mini-learning-platform

2.Start PostgreSQL with Docker
docker compose up -d db

3. Backend setup
cd backend
python -m venv .venv
.\.venv\Scripts\activate   # (Windows PowerShell)
pip install -r requirements.txt
Run the server:  python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

4.Frontend setup
cd ../frontend
npm install
npm run dev


## How To Run Locally
1. start the database: docker compose up -d db
2. run backend: 
.\.venv\Scripts\activate
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
3. run frontend: npm run dev

## Environment variables

### backend/.env.example 
  DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5432/learnlab
  JWT_SECRET=please_change_me
  OPENAI_API_KEY=   # leave empty to use mock
  OPENAI_MODEL=gpt-4o-mini
  CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
  ENV=dev

### frontend/.env.example
  VITE_API_URL=http://127.0.0.1:8000



