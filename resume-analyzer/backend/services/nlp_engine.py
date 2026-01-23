import spacy
from sentence_transformers import SentenceTransformer, util
from utils.skills_db import COMMON_SKILLS
from core.config import get_settings
from models.schemas import AIAnalysisResult
import re

settings = get_settings()

class NLPService:
    def __init__(self):
        print("Loading NLP Models...")
        try:
            self.nlp = spacy.load(settings.SPACY_MODEL)
        except OSError:
            print(f"Downloading {settings.SPACY_MODEL}...")
            from spacy.cli import download
            download(settings.SPACY_MODEL)
            self.nlp = spacy.load(settings.SPACY_MODEL)
        self.model = SentenceTransformer(settings.TRANSFORMER_MODEL)
        print("NLP Models loaded.")

    def extract_skills(self, text: str) -> list[str]:
        doc = self.nlp(text.lower())
        skills = set()
        tokens = [token.text for token in doc]
        for skill in COMMON_SKILLS:
            if " " in skill:
                if skill in text.lower():
                    skills.add(skill)
            elif skill in tokens:
                skills.add(skill)
        return list(skills)

    def calculate_similarity_score(self, resume_text: str, job_desc: str) -> float:
        embeddings1 = self.model.encode(resume_text, convert_to_tensor=True)
        embeddings2 = self.model.encode(job_desc, convert_to_tensor=True)
        cosine_scores = util.cos_sim(embeddings1, embeddings2)
        return float(cosine_scores[0][0]) * 100

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
