from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import resume, gemini_routes
from core.config import get_settings
from db.mongodb import db

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api", tags=["Resume"])
app.include_router(gemini_routes.router, prefix="/api", tags=["Gemini AI"])

class DBHandler:
    async def startup(self):
        await db.connect_to_database()
        
    async def shutdown(self):
        await db.close_database_connection()

db_handler = DBHandler()

app.add_event_handler("startup", db_handler.startup)
app.add_event_handler("shutdown", db_handler.shutdown)

@app.get("/")
def read_root():
    return {"message": "AI Resume Analyzer API is running"}
