from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from services.parser import parse_resume
from services.nlp_engine import nlp_engine
from services.ai_generator import ai_generator
from db.firebase import get_database
from models.schemas import AIAnalysisResult, AnalysisRequest
import uuid
from datetime import datetime

router = APIRouter()


def _normalize_points(items, limit=4):
    normalized = []
    seen = set()

    for raw in items or []:
        text = str(raw or "").strip()
        if not text:
            continue

        # Keep suggestions concise for dashboard readability.
        if len(text) > 140:
            text = f"{text[:137].rstrip()}..."

        key = text.lower()
        if key in seen:
            continue

        seen.add(key)
        normalized.append(text)
        if len(normalized) >= limit:
            break

    return normalized


def _build_fallback_strengths(result, resume_skills, job_description):
    strengths = []

    if resume_skills:
        top_skills = ", ".join(resume_skills[:3])
        strengths.append(f"Resume highlights relevant skills: {top_skills}.")

    if result.matched_skills:
        strengths.append(f"Matched {len(result.matched_skills)} role-aligned skills from the JD.")

    if result.score_breakdown:
        section_score = result.score_breakdown.get("section_coverage", {}).get("score", 0)
        if section_score >= 10:
            strengths.append("Resume structure includes multiple ATS-friendly sections.")

    if not job_description.strip():
        strengths.append("Resume is indexed and ready for JD comparison once a job description is added.")

    if result.ats_score >= 80:
        strengths.append("Strong overall ATS readiness based on strict rubric scoring.")
    elif result.ats_score >= 65:
        strengths.append("Moderate ATS readiness with clear room for targeted improvement.")
    else:
        strengths.append("Resume needs tighter alignment before it will pass stricter ATS filtering.")

    return _normalize_points(strengths, limit=4)

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

    resume_skills = nlp_engine.extract_skills(resume["content_text"])
    
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
        ai_tips = _normalize_points(ai_analysis.get("improvement_tips", []), limit=4)
        ai_strengths = _normalize_points(ai_analysis.get("strengths", []), limit=4)

        # Prefer Groq feedback text when available; keep deterministic fallback otherwise.
        if ai_tips:
            result.ai_suggestions = ai_tips
        else:
            result.ai_suggestions = _normalize_points(result.ai_suggestions, limit=4)

        if ai_strengths:
            result.strengths = ai_strengths
        elif not result.strengths:
            result.strengths = _build_fallback_strengths(result, resume_skills, request.job_description or "")
    except Exception as e:
        print(f"AI Analysis Error (supplemental only): {e}")
        result.ai_suggestions = _normalize_points(result.ai_suggestions, limit=4)
        if not result.strengths:
            result.strengths = _build_fallback_strengths(result, resume_skills, request.job_description or "")

    await db["resumes"].update_one(
        {"id": request.resume_id},
        {"$set": {
            "ats_score": result.ats_score,
            "resume_skills": resume_skills,
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

    def _enrich_analysis_result(record):
        analysis = dict(record.get("analysis_result") or {})
        if not analysis:
            return None

        fallback_skills = record.get("resume_skills") or record.get("skills") or []
        if not fallback_skills:
            fallback_skills = nlp_engine.extract_skills(record.get("content_text") or "")
        if (not isinstance(analysis.get("resume_skills"), list)) or len(analysis.get("resume_skills") or []) == 0:
            analysis["resume_skills"] = fallback_skills

        # Keep response shape stable for older records.
        analysis["matched_skills"] = analysis.get("matched_skills") or []
        analysis["missing_skills"] = analysis.get("missing_skills") or []
        analysis["strengths"] = analysis.get("strengths") or []
        analysis["ai_suggestions"] = analysis.get("ai_suggestions") or []
        return analysis

    # Map to simpler format for list view
    return [{
        "id": r["id"],
        "filename": r["filename"],
        "uploaded_at": r["uploaded_at"],
        "ats_score": r.get("ats_score"),
        # Return full result if present so we can load it instantly
        "analysis_result": _enrich_analysis_result(r)
    } for r in resumes]

@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str, db = Depends(get_database)):
    result = await db["resumes"].delete_one({"id": resume_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"message": "Deleted successfully"}
