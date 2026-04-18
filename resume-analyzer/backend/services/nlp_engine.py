import re
from difflib import SequenceMatcher

from utils.skills_db import COMMON_SKILLS
from models.schemas import AIAnalysisResult

class NLPService:
    def __init__(self):
        # Precompute lowercase skills once for faster matching.
        self._skills = [skill.strip().lower() for skill in COMMON_SKILLS if skill.strip()]

    def _tokenize(self, text: str) -> set[str]:
        return set(re.findall(r"[a-zA-Z0-9+#.-]+", text.lower()))

    def extract_skills(self, text: str) -> list[str]:
        text_lower = text.lower()
        tokens = self._tokenize(text)
        skills = set()

        for skill in self._skills:
            if " " in skill:
                if skill in text_lower:
                    skills.add(skill)
            elif skill in tokens:
                skills.add(skill)

        return sorted(skills)

    def calculate_similarity_score(self, resume_text: str, job_desc: str) -> float:
        resume_text = (resume_text or "").strip().lower()
        job_desc = (job_desc or "").strip().lower()

        if not resume_text or not job_desc:
            return 0.0

        # Lightweight fuzzy text similarity as a semantic approximation.
        ratio = SequenceMatcher(None, resume_text, job_desc).ratio()
        return ratio * 100

    def analyze_resume_vs_job(self, resume_text: str, job_desc: str) -> AIAnalysisResult:
        resume_skills = set(self.extract_skills(resume_text))
        job_skills = set(self.extract_skills(job_desc))
        matched_skills = list(resume_skills.intersection(job_skills))
        missing_skills = list(job_skills - resume_skills)
        semantic_score = self.calculate_similarity_score(resume_text, job_desc)
        
        skill_score = 0
        if job_skills:
            skill_score = (len(matched_skills) / len(job_skills)) * 100
        else:
            skill_score = semantic_score
            
        final_score = (0.5 * skill_score) + (0.5 * semantic_score)
        final_score = min(100, max(0, final_score))
        
        exp_match = "Strong" if semantic_score > 70 else "Moderate" if semantic_score > 40 else "Weak"
        
        suggestions = []
        if len(missing_skills) > 0:
            suggestions.append(f"Consider acquiring: {', '.join(missing_skills[:3])}")
        if final_score < 70:
            suggestions.append("Optimize keywords for better ATS match.")

        return AIAnalysisResult(
            ats_score=round(final_score, 1),
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            experience_match=exp_match,
            ai_suggestions=suggestions
        )

nlp_engine = NLPService()
