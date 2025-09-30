Frontend - React + Vite + Zustand

Simple UI to authenticate (paste token) and manage organizations via the FastAPI backend.

Environment
- Copy .env.example to .env
- Set VITE_API_URL (default http://localhost:8000)
- Optionally set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY if wiring real Supabase auth

Install and Run
1) npm install
2) npm run dev

Notes
- Token is stored in localStorage as auth_token and sent as Bearer to backend.
- For local demo without Supabase, any non-empty token is accepted by backend when SUPABASE_JWT_SECRET is not set.
