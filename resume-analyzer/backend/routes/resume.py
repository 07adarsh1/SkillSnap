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
    resume = await db["resumes"].find_one({"id": request.resume_id})
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # If no job description provided, perform General Resume Audit
    if not request.job_description or len(request.job_description.strip()) < 10:
        resume_skills = nlp_engine.extract_skills(resume["content_text"])
        
        try:
            llm_suggestions = ai_generator.generate_feedback(resume["content_text"], "General Software Engineering Role", [])
        except Exception as e:
            print(f"AI Generation Error: {e}")
            llm_suggestions = ["Ensure your resume content is parsable.", "Check for consistent formatting."]
        
        result = AIAnalysisResult(
            ats_score=85.0, # Base score for a valid resume
            matched_skills=resume_skills, # Show what we found
            missing_skills=[],
            experience_match="Good",
            ai_suggestions=llm_suggestions
        )
    else:
        # Otherwise perform comparison
        result = nlp_engine.analyze_resume_vs_job(resume["content_text"], request.job_description)
        llm_suggestions = ai_generator.generate_feedback(resume["content_text"], request.job_description, result.missing_skills)
        if llm_suggestions:
             result.ai_suggestions = llm_suggestions

    # SAVE RESULT TO DB
    await db["resumes"].update_one(
        {"id": request.resume_id},
        {"$set": {
            "ats_score": result.ats_score,
            "analysis_result": result.dict(),
            "last_analyzed_at": datetime.utcnow()
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
