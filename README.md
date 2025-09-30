Organization Manager Web App

Stack
- Frontend: React + Vite + Zustand
- Backend: FastAPI (Python) + SQLAlchemy
- DB: PostgreSQL (local), compatible with Supabase approach

Features
- Auth: Supabase JWT validation if configured; dev fallback token mode
- CRUD: Organizations (name, description, created date, owner_id)
- Per-user data isolation
- CORS enabled for local dev

Project Structure
- backend_fastapi/ — FastAPI app (modular: api, core, db, models, schemas, services)
- frontned_react+vite/ — React app with Zustand stores

Backend Setup
1) cd backend_fastapi
2) Copy .env.example to .env and adjust values (DATABASE_URL, CORS_ORIGINS, SUPABASE_* if used)
3) Ensure local PostgreSQL is running and create a database org_manager
4) pip install -r requirements.txt
5) uvicorn app.main:app --reload --port 8000

Windows Postgres quick notes (example):
- Create DB: createdb org_manager
- Or via psql: CREATE DATABASE org_manager;

Frontend Setup
1) cd frontned_react+vite
2) Copy .env.example to .env and set VITE_API_URL (default http://localhost:8000)
3) npm install
4) npm run dev

Demo Auth
- Without Supabase: enter any non-empty token in the UI's Auth box; backend treats token as user id.
- With Supabase: paste a real session access_token; set SUPABASE_JWT_SECRET in backend .env so tokens are verified.

Environment files
- .env.example at project root shows both frontend and backend variables.
- backend_fastapi/.env.example and frontned_react+vite/.env.example are also provided.

API Endpoints
- GET /organizations
- POST /organizations
- GET /organizations/{id}
- PUT/PATCH /organizations/{id}
- DELETE /organizations/{id}

Database
- SQLAlchemy will create table organizations on startup.
- Columns: id (uuid), name, description, created_at, owner_id (string user id)

Assumptions
- Minimal auth acceptable; Supabase recommended but optional per assignment.
- Focused on working product and clean code.

Stretch ideas (optional)
- Client-side search/filter by name
- active/inactive flag on organizations


