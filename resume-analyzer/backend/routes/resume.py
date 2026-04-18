from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from services.parser import parse_resume
from services.nlp_engine import nlp_engine
from services.ai_generator import ai_generator
from db.firebase import get_database
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
    from services.ai_service import ai_service
    
    resume = await db["resumes"].find_one({"id": request.resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Primary score uses deterministic ATS rubric for stable, strict scoring.
    result = nlp_engine.analyze_resume_vs_job(
        resume["content_text"],
        request.job_description or "",
    )

    ai_analysis = None
    try:
        ai_analysis = await ai_service.analyze_resume(
            resume["content_text"],
            request.job_description or "",
        )
        ai_tips = ai_analysis.get("improvement_tips", [])
        if ai_tips:
            merged_tips = result.ai_suggestions + [tip for tip in ai_tips if tip not in result.ai_suggestions]
            result.ai_suggestions = merged_tips[:6]
    except Exception as e:
        print(f"AI Analysis Error (supplemental only): {e}")

    await db["resumes"].update_one(
        {"id": request.resume_id},
        {"$set": {
            "ats_score": result.ats_score,
            "analysis_result": result.dict(),
            "ai_analysis": ai_analysis,
            "last_analyzed_at": datetime.utcnow(),
        }}
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
