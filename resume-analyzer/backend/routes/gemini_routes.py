from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from services.gemini_service import gemini_service
from db.mongodb import get_database

router = APIRouter()

class ATSHeatmapRequest(BaseModel):
    resume_id: str

class JobMatchRequest(BaseModel):
    resume_id: str
    job_description: str

class SimulateImprovementRequest(BaseModel):
    resume_id: str
    added_item: str
    item_type: str  # "skill", "project", "certification", "experience"
    job_description: Optional[str] = ""

class CareerPathRequest(BaseModel):
    current_role: str
    target_role: str
    current_skills: Optional[List[str]] = []

@router.post("/ats-heatmap")
async def get_ats_heatmap(request: ATSHeatmapRequest, db = Depends(get_database)):
    """Get ATS compatibility heatmap for resume sections"""
    try:
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        heatmap_data = await gemini_service.analyze_ats_heatmap(resume["content_text"])
        
        # Save to database
        await db["resumes"].update_one(
            {"id": request.resume_id},
            {"$set": {"ats_heatmap": heatmap_data}}
        )
        
        return heatmap_data
        
    except Exception as e:
        print(f"ATS Heatmap Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate ATS heatmap: {str(e)}")

@router.post("/job-match")
async def match_job(request: JobMatchRequest, db = Depends(get_database)):
    """Match resume with job description"""
    try:
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        match_data = await gemini_service.match_job(
            resume["content_text"],
            request.job_description
        )
        
        return match_data
        
    except Exception as e:
        print(f"Job Match Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to match job: {str(e)}")

@router.post("/simulate-improvement")
async def simulate_improvement(request: SimulateImprovementRequest, db = Depends(get_database)):
    """Simulate impact of adding skill/project to resume"""
    try:
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        simulation_data = await gemini_service.simulate_improvement(
            resume["content_text"],
            request.added_item,
            request.item_type,
            request.job_description
        )
        
        return simulation_data
        
    except Exception as e:
        print(f"Simulation Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to simulate improvement: {str(e)}")

@router.post("/career-path")
async def generate_career_path(request: CareerPathRequest):
    """Generate personalized career roadmap"""
    try:
        roadmap_data = await gemini_service.generate_career_path(
            request.current_role,
            request.target_role,
            request.current_skills
        )
        
        return roadmap_data
        
    except Exception as e:
        print(f"Career Path Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate career path: {str(e)}")
