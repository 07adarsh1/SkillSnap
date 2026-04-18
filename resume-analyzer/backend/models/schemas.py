from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class AnalysisRequest(BaseModel):
    resume_id: str
    job_description: str

class AIAnalysisResult(BaseModel):
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    experience_match: str
    strengths: Optional[List[str]] = None
    ai_suggestions: List[str]
    score_breakdown: Optional[Dict[str, Dict[str, float]]] = None
