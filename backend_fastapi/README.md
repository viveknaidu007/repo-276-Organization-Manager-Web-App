Backend - FastAPI

This FastAPI service exposes CRUD APIs for organizations, with per-user access control using Supabase JWTs (or a simple dev fallback). It uses PostgreSQL via SQLAlchemy.

Key endpoints
- GET /organizations
- POST /organizations
- GET /organizations/{id}
- PUT/PATCH /organizations/{id}
- DELETE /organizations/{id}

Setup
1) Create .env from .env.example and set values.
2) Ensure a local Postgres is running and DATABASE_URL points to it.
3) Install dependencies.
4) Start the server.

Database
Create a database named org_manager. Tables are created automatically on startup.

Auth
If SUPABASE_JWT_SECRET is set, JWTs will be validated. Otherwise, any non-empty Bearer token is accepted and used as the user id (dev only).

CORS
Allowed origins are configured via CORS_ORIGINS env.
