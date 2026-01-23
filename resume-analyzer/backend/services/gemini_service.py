import google.generativeai as genai
import os
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        # Using gemini-flash-latest as an alias for the latest stable flash model (likely 1.5)
        self.model = genai.GenerativeModel('gemini-flash-latest')
        
    def _parse_json_response(self, response_text: str) -> Dict[str, Any]:
        """Extract and parse JSON from Gemini response"""
        try:
            # Try to find JSON in the response
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx != -1 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                return json.loads(json_str)
            else:
                # If no JSON found, try parsing the entire response
                return json.loads(response_text)
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response: {response_text}")
            raise ValueError(f"Failed to parse JSON from Gemini response: {str(e)}")
    
    async def analyze_resume(self, resume_text: str, job_description: str = "") -> Dict[str, Any]:
        """Analyze resume and return structured scores and insights"""
        
        prompt = f"""You are an expert ATS (Applicant Tracking System) and resume analyzer. 
Analyze the following resume and provide a comprehensive evaluation.

Resume Text:
{resume_text}

{f"Job Description: {job_description}" if job_description else ""}

Provide your analysis in STRICT JSON format with the following structure:
{{
    "resume_score": <number 0-100>,
    "ats_score": <number 0-100>,
    "skills": {{
        "matched": [<list of skills found in resume>],
        "missing": [<list of important skills not found>],
        "recommended": [<list of skills to add>]
    }},
    "section_scores": {{
        "education": <number 0-100>,
        "experience": <number 0-100>,
        "projects": <number 0-100>,
        "skills": <number 0-100>
    }},
    "resume_category": "<Fresher or Experienced>",
    "improvement_tips": [<list of 4-6 specific actionable tips>],
    "experience_match": "<Strong or Moderate or Weak>"
}}

IMPORTANT: Return ONLY the JSON object, no additional text or explanation."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def analyze_ats_heatmap(self, resume_text: str) -> Dict[str, Any]:
        """Analyze resume sections for ATS compatibility"""
        
        prompt = f"""You are an ATS (Applicant Tracking System) expert. Analyze the following resume 
and evaluate each section for ATS compatibility.

Resume Text:
{resume_text}

Provide your analysis in STRICT JSON format:
{{
    "sections": [
        {{
            "name": "Contact Information",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Professional Summary",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Work Experience",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Education",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Skills",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Projects",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Certifications",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }},
        {{
            "name": "Keywords Density",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }}
    ]
}}

Status guidelines:
- excellent: 90-100
- good: 80-89
- moderate: 70-79
- needs-work: 50-69
- critical: 0-49

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def match_job(self, resume_text: str, job_description: str) -> Dict[str, Any]:
        """Match resume with job description"""
        
        prompt = f"""You are an expert job matching AI. Compare the following resume with the job description 
and provide a detailed match analysis.

Resume:
{resume_text}

Job Description:
{job_description}

Provide analysis in STRICT JSON format:
{{
    "match_percentage": <number 0-100>,
    "matched_skills": [<list of skills that match>],
    "missing_skills": [<list of required skills not in resume>],
    "experience_match": "<low|medium|high>",
    "reasoning": "<detailed explanation of why this is a good/bad match>"
}}

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def simulate_improvement(
        self, 
        resume_text: str, 
        added_item: str, 
        item_type: str,
        job_description: str = ""
    ) -> Dict[str, Any]:
        """Simulate the impact of adding a skill/project to resume"""
        
        prompt = f"""You are a resume optimization expert. Analyze the impact of adding a new {item_type} 
to the resume.

Original Resume:
{resume_text}

Added {item_type}:
{added_item}

{f"Target Job: {job_description}" if job_description else ""}

Provide analysis in STRICT JSON format:
{{
    "old_score": <number 0-100>,
    "new_score": <number 0-100>,
    "impact_percentage": <number representing improvement>,
    "old_job_match": <number 0-100>,
    "new_job_match": <number 0-100>,
    "impact_explanation": "<detailed explanation of the impact>"
}}

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def generate_career_path(
        self, 
        current_role: str, 
        target_role: str,
        current_skills: list = None
    ) -> Dict[str, Any]:
        """Generate personalized career roadmap"""
        
        skills_text = f"Current Skills: {', '.join(current_skills)}" if current_skills else ""
        
        prompt = f"""You are a career development expert. Create a detailed learning roadmap for transitioning 
from {current_role} to {target_role}.

{skills_text}

Provide a structured roadmap in STRICT JSON format:
{{
    "total_duration": "<e.g., 7-11 months>",
    "roadmap": [
        {{
            "phase": "Phase 1: <Name>",
            "duration": "<e.g., 2-3 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        }},
        {{
            "phase": "Phase 2: <Name>",
            "duration": "<e.g., 2-3 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        }},
        {{
            "phase": "Phase 3: <Name>",
            "duration": "<e.g., 1-2 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        }},
        {{
            "phase": "Phase 4: <Name>",
            "duration": "<e.g., 2-3 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        }}
    ]
}}

Provide 4 phases with specific, actionable skills and resources.
Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def optimize_resume(
        self,
        resume_text: str,
        job_description: str,
        company_name: str = ""
    ) -> Dict[str, Any]:
        """Optimize resume content for specific job and company"""
        
        company_context = f" at {company_name}" if company_name else ""
        
        prompt = f"""You are an expert resume writer and ATS optimization specialist. 
Rewrite the following resume to perfectly match the job description{company_context}.

CRITICAL RULES:
1. Preserve ALL factual information (dates, companies, education)
2. Enhance language to match job requirements
3. Add relevant ATS keywords from the job description
4. Improve action verbs and quantifiable achievements
5. Maintain professional tone

Original Resume:
{resume_text}

Job Description:
{job_description}

Provide optimization in STRICT JSON format:
{{
    "optimized_summary": "<rewritten professional summary>",
    "optimized_skills": ["<skill 1>", "<skill 2>", ...],
    "optimized_experience": [
        {{
            "original": "<original bullet point>",
            "optimized": "<improved bullet point>",
            "reason": "<why this change improves ATS score>"
        }}
    ],
    "ats_improvement_score": <number 0-100 representing expected improvement>,
    "changes_explanation": "<summary of key optimizations made>"
}}

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def generate_interview_questions(
        self,
        resume_text: str,
        job_description: str,
        missing_skills: list = None
    ) -> Dict[str, Any]:
        """Generate role-specific interview questions"""
        
        missing_context = ""
        if missing_skills:
            missing_context = f"\nMissing Skills to Focus On: {', '.join(missing_skills)}"
        
        prompt = f"""You are an expert technical interviewer. Generate comprehensive interview questions 
based on the candidate's resume and the job requirements.

Resume:
{resume_text}

Job Description:
{job_description}
{missing_context}

Generate questions in STRICT JSON format:
{{
    "technical": [
        {{
            "question": "<technical question>",
            "focus_area": "<skill/technology>",
            "difficulty": "easy|medium|hard"
        }}
    ],
    "behavioral": [
        {{
            "question": "<behavioral question>",
            "focus_area": "<competency>",
            "difficulty": "easy|medium|hard"
        }}
    ],
    "situational": [
        {{
            "question": "<situational question>",
            "focus_area": "<scenario type>",
            "difficulty": "easy|medium|hard"
        }}
    ],
    "overall_difficulty": "easy|medium|hard",
    "preparation_tips": ["<tip 1>", "<tip 2>", ...]
}}

Generate 5 questions per category. Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def explain_score(
        self,
        resume_text: str,
        job_description: str,
        ats_score: float,
        matched_skills: list,
        missing_skills: list
    ) -> Dict[str, Any]:
        """Provide explainable AI reasoning for scores"""
        
        prompt = f"""You are an AI explainability expert. Provide clear, actionable reasoning 
for why this resume received its ATS score.

Resume:
{resume_text}

Job Description:
{job_description}

Current ATS Score: {ats_score}%
Matched Skills: {', '.join(matched_skills)}
Missing Skills: {', '.join(missing_skills)}

Provide explanation in STRICT JSON format:
{{
    "reasoning": "<detailed explanation of the score>",
    "positive_factors": [
        {{
            "factor": "<what helped the score>",
            "impact": "high|medium|low",
            "evidence": "<specific example from resume>"
        }}
    ],
    "negative_factors": [
        {{
            "factor": "<what hurt the score>",
            "impact": "high|medium|low",
            "evidence": "<specific gap or issue>"
        }}
    ],
    "improvement_actions": [
        {{
            "action": "<specific action to take>",
            "expected_impact": "+<number> points",
            "priority": "high|medium|low"
        }}
    ],
    "score_breakdown": {{
        "skills_match": <0-100>,
        "experience_relevance": <0-100>,
        "keyword_optimization": <0-100>,
        "formatting_quality": <0-100>
    }}
}}

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def check_resume_quality(
        self,
        resume_text: str
    ) -> Dict[str, Any]:
        """Analyze resume for confidence, authenticity, and quality issues"""
        
        prompt = f"""You are a resume quality auditor. Analyze this resume for:
1. Weak/passive language
2. Buzzword overuse
3. Vague claims without evidence
4. Unrealistic skill claims
5. Inconsistencies

Resume:
{resume_text}

Provide analysis in STRICT JSON format:
{{
    "confidence_score": <number 0-100>,
    "authenticity_score": <number 0-100>,
    "issues": [
        {{
            "type": "weak_language|buzzwords|vague_claim|unrealistic|inconsistency",
            "severity": "high|medium|low",
            "location": "<where in resume>",
            "issue": "<description of the problem>",
            "example": "<specific text from resume>"
        }}
    ],
    "suggestions": [
        {{
            "issue_type": "<type>",
            "current": "<current text>",
            "suggested": "<improved text>",
            "reason": "<why this is better>"
        }}
    ],
    "risk_level": "low|medium|high",
    "overall_assessment": "<summary of resume quality>"
}}

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise
    
    async def compare_resume_versions(
        self,
        version1_text: str,
        version2_text: str,
        version1_score: float,
        version2_score: float
    ) -> Dict[str, Any]:
        """Compare two resume versions and explain improvements"""
        
        prompt = f"""You are a resume improvement analyst. Compare these two resume versions 
and explain what changed and why it improved (or worsened) the score.

Version 1 (Score: {version1_score}%):
{version1_text}

Version 2 (Score: {version2_score}%):
{version2_text}

Provide comparison in STRICT JSON format:
{{
    "score_change": {{
        "previous": {version1_score},
        "current": {version2_score},
        "delta": <difference>,
        "trend": "improved|declined|unchanged"
    }},
    "key_changes": [
        {{
            "section": "<which section changed>",
            "change_type": "added|removed|modified",
            "description": "<what changed>",
            "impact": "positive|negative|neutral"
        }}
    ],
    "improvements": ["<improvement 1>", "<improvement 2>", ...],
    "regressions": ["<regression 1>", "<regression 2>", ...],
    "recommendation": "<overall advice for next iteration>"
}}

Return ONLY the JSON object."""

        try:
            response = self.model.generate_content(prompt)
            return self._parse_json_response(response.text)
        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            raise

# Create singleton instance
gemini_service = GeminiService()
