from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from services.parser import parse_resume
from services.nlp_engine import nlp_engine
from services.ai_generator import ai_generator
from db.mongodb import get_database
from models.schemas import AIAnalysisResult, AnalysisRequest
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/upload-resume")
async def upload_resume(
    file: UploadFile = File(...), 
    user_id: str = Form(None),
    db = Depends(get_database)
):
    try:
        text = await parse_resume(file)
        resume_id = str(uuid.uuid4())
        resume_data = {
            "id": resume_id,
            "user_id": user_id,
            "filename": file.filename,
            "content_text": text,
            "uploaded_at": datetime.utcnow(),
            "skills": nlp_engine.extract_skills(text),
            # Initialize analysis fields
            "ats_score": None,
            "analysis_result": None
        }
        await db["resumes"].insert_one(resume_data)
        return {"resume_id": resume_id, "message": "Uploaded", "extracted_skills": resume_data["skills"]}
    except Exception as e:
        print(f"Upload Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-resume", response_model=AIAnalysisResult)
async def analyze_resume(request: AnalysisRequest, db = Depends(get_database)):
    from services.gemini_service import gemini_service
    
    resume = await db["resumes"].find_one({"id": request.resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    try:
        # Use Gemini AI for analysis
        analysis = await gemini_service.analyze_resume(
            resume["content_text"], 
            request.job_description or ""
        )
        
        # Map Gemini response to our schema
        result = AIAnalysisResult(
            ats_score=float(analysis.get("ats_score", 75)),
            matched_skills=analysis.get("skills", {}).get("matched", []),
            missing_skills=analysis.get("skills", {}).get("missing", []),
            experience_match=analysis.get("experience_match", "Moderate"),
            ai_suggestions=analysis.get("improvement_tips", [])
        )
        
        # SAVE RESULT TO DB with additional Gemini data
        await db["resumes"].update_one(
            {"id": request.resume_id},
            {"$set": {
                "ats_score": result.ats_score,
                "analysis_result": result.dict(),
                "gemini_analysis": analysis,  # Store full Gemini response
                "last_analyzed_at": datetime.utcnow()
            }}
        )
        
        return result
        
    except Exception as e:
        print(f"Gemini Analysis Error: {e}")
        # Fallback to basic analysis if Gemini fails
        resume_skills = nlp_engine.extract_skills(resume["content_text"])
        result = AIAnalysisResult(
            ats_score=75.0,
            matched_skills=resume_skills,
            missing_skills=[],
            experience_match="Moderate",
            ai_suggestions=["Analysis service temporarily unavailable. Please try again."]
        )
        return result

@router.get("/resumes/{user_id}")
async def get_user_resumes(user_id: str, db = Depends(get_database)):
    cursor = db["resumes"].find({"user_id": user_id}).sort("uploaded_at", -1)
    resumes = await cursor.to_list(length=100)
    
    # Map to simpler format for list view
    return [{
        "id": r["id"],
        "filename": r["filename"],
        "uploaded_at": r["uploaded_at"],
        "ats_score": r.get("ats_score"),
        # Return full result if present so we can load it instantly
        "analysis_result": r.get("analysis_result")
    } for r in resumes]

@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, db = Depends(get_database)):
    result = await db["resumes"].delete_one({"id": resume_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Deleted successfully"}
