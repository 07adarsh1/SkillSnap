from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from services.gemini_service import gemini_service
from db.mongodb import get_database
from datetime import datetime
import uuid

router = APIRouter()

# ============================================
# REQUEST/RESPONSE MODELS
# ============================================

class OptimizeResumeRequest(BaseModel):
    resume_id: str
    job_description: str
    company_name: Optional[str] = ""

class InterviewQuestionsRequest(BaseModel):
    resume_id: str
    job_description: str

class ExplainScoreRequest(BaseModel):
    resume_id: str
    job_description: str

class QualityCheckRequest(BaseModel):
    resume_id: str

class CompareVersionsRequest(BaseModel):
    resume_id: str
    version1: int
    version2: int

# ============================================
# FEATURE 1: COMPANY-SPECIFIC RESUME OPTIMIZER
# ============================================

@router.post("/optimize-resume")
async def optimize_resume(request: OptimizeResumeRequest, db = Depends(get_database)):
    """
    Optimize resume content for specific job and company using Gemini AI
    """
    try:
        # Get resume from database
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Call Gemini service
        optimization_result = await gemini_service.optimize_resume(
            resume["content_text"],
            request.job_description,
            request.company_name
        )
        
        # Save optimized version as new version
        version_number = resume.get("version", 1) + 1
        optimized_resume_id = str(uuid.uuid4())
        
        optimized_resume_data = {
            "id": optimized_resume_id,
            "user_id": resume["user_id"],
            "filename": f"{resume['filename']}_optimized_v{version_number}",
            "content_text": resume["content_text"],  # Keep original
            "optimized_content": optimization_result,
            "uploaded_at": datetime.utcnow(),
            "version": version_number,
            "parent_resume_id": request.resume_id,
            "optimization_metadata": {
                "job_description": request.job_description,
                "company_name": request.company_name,
                "optimized_at": datetime.utcnow()
            }
        }
        
        await db["resumes"].insert_one(optimized_resume_data)
        
        return {
            **optimization_result,
            "optimized_resume_id": optimized_resume_id,
            "version": version_number
        }
        
    except Exception as e:
        print(f"Optimization Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to optimize resume: {str(e)}")

# ============================================
# FEATURE 2: INTERVIEW READINESS MODULE
# ============================================

@router.post("/interview-questions")
async def generate_interview_questions(request: InterviewQuestionsRequest, db = Depends(get_database)):
    """
    Generate role-specific interview questions based on resume and job description
    """
    try:
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Get analysis data if available for missing skills
        missing_skills = []
        if resume.get("analysis_result"):
            missing_skills = resume["analysis_result"].get("missing_skills", [])
        
        questions = await gemini_service.generate_interview_questions(
            resume["content_text"],
            request.job_description,
            missing_skills
        )
        
        # Save interview prep data
        await db["resumes"].update_one(
            {"id": request.resume_id},
            {"$set": {
                "interview_prep": questions,
                "interview_prep_generated_at": datetime.utcnow()
            }}
        )
        
        return questions
        
    except Exception as e:
        print(f"Interview Questions Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")

# ============================================
# FEATURE 3: EXPLAINABLE AI (XAI) PANEL
# ============================================

@router.post("/explain-score")
async def explain_score(request: ExplainScoreRequest, db = Depends(get_database)):
    """
    Provide detailed explanation for ATS score and match percentage
    """
    try:
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Get current analysis or perform new one
        analysis = resume.get("analysis_result")
        if not analysis:
            raise HTTPException(status_code=400, detail="Resume not analyzed yet. Please analyze first.")
        
        explanation = await gemini_service.explain_score(
            resume["content_text"],
            request.job_description,
            analysis.get("ats_score", 0),
            analysis.get("matched_skills", []),
            analysis.get("missing_skills", [])
        )
        
        # Save explanation
        await db["resumes"].update_one(
            {"id": request.resume_id},
            {"$set": {
                "score_explanation": explanation,
                "explanation_generated_at": datetime.utcnow()
            }}
        )
        
        return explanation
        
    except Exception as e:
        print(f"Explain Score Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to explain score: {str(e)}")

# ============================================
# FEATURE 4: RESUME VERSION CONTROL
# ============================================

@router.get("/resume-versions/{resume_id}")
async def get_resume_versions(resume_id: str, db = Depends(get_database)):
    """
    Get all versions of a resume with score history
    """
    try:
        # Find original resume and all its versions
        original = await db["resumes"].find_one({"id": resume_id})
        if not original:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Find all versions (children of this resume)
        versions_cursor = db["resumes"].find({
            "$or": [
                {"id": resume_id},
                {"parent_resume_id": resume_id}
            ]
        }).sort("version", 1)
        
        versions = await versions_cursor.to_list(length=100)
        
        # Format version history
        version_history = []
        for v in versions:
            version_history.append({
                "id": v["id"],
                "version": v.get("version", 1),
                "filename": v["filename"],
                "uploaded_at": v["uploaded_at"],
                "ats_score": v.get("ats_score"),
                "is_optimized": "optimized_content" in v,
                "optimization_metadata": v.get("optimization_metadata")
            })
        
        return {
            "resume_id": resume_id,
            "total_versions": len(version_history),
            "versions": version_history
        }
        
    except Exception as e:
        print(f"Version History Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get versions: {str(e)}")

@router.post("/compare-versions")
async def compare_versions(request: CompareVersionsRequest, db = Depends(get_database)):
    """
    Compare two resume versions side-by-side
    """
    try:
        # Get both versions
        versions_cursor = db["resumes"].find({
            "$or": [
                {"id": request.resume_id},
                {"parent_resume_id": request.resume_id}
            ]
        }).sort("version", 1)
        
        versions = await versions_cursor.to_list(length=100)
        
        if len(versions) < 2:
            raise HTTPException(status_code=400, detail="Not enough versions to compare")
        
        # Find requested versions
        v1 = next((v for v in versions if v.get("version", 1) == request.version1), None)
        v2 = next((v for v in versions if v.get("version", 1) == request.version2), None)
        
        if not v1 or not v2:
            raise HTTPException(status_code=404, detail="One or both versions not found")
        
        # Compare using Gemini
        comparison = await gemini_service.compare_resume_versions(
            v1["content_text"],
            v2["content_text"],
            v1.get("ats_score", 0),
            v2.get("ats_score", 0)
        )
        
        return {
            "version1": {
                "id": v1["id"],
                "version": v1.get("version", 1),
                "score": v1.get("ats_score", 0)
            },
            "version2": {
                "id": v2["id"],
                "version": v2.get("version", 1),
                "score": v2.get("ats_score", 0)
            },
            "comparison": comparison
        }
        
    except Exception as e:
        print(f"Version Comparison Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to compare versions: {str(e)}")

# ============================================
# FEATURE 5: CONFIDENCE & AUTHENTICITY CHECK
# ============================================

@router.post("/resume-quality-check")
async def check_resume_quality(request: QualityCheckRequest, db = Depends(get_database)):
    """
    Analyze resume for quality issues, weak language, and authenticity
    """
    try:
        resume = await db["resumes"].find_one({"id": request.resume_id})
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        quality_report = await gemini_service.check_resume_quality(
            resume["content_text"]
        )
        
        # Save quality check results
        await db["resumes"].update_one(
            {"id": request.resume_id},
            {"$set": {
                "quality_check": quality_report,
                "quality_checked_at": datetime.utcnow()
            }}
        )
        
        return quality_report
        
    except Exception as e:
        print(f"Quality Check Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to check quality: {str(e)}")
