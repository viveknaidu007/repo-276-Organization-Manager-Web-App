from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.organizations import router as organizations_router
from app.models.base import Base
from app.db.session import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG, version="1.0.0")

# CORS
raw_origins = settings.CORS_ORIGINS  # may be list or string depending on env parsing
if isinstance(raw_origins, str):
    origins = [o.strip() for o in raw_origins.split(',') if o.strip()]
else:
    origins = raw_origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(organizations_router)

@app.get("/")
def read_root():
    return {"status": "ok", "app": settings.APP_NAME, "version": "1.0.0"}
