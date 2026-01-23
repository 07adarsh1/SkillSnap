from openai import OpenAI
from core.config import get_settings
from typing import List
import json

settings = get_settings()

class AIGenerator:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = None
        if self.api_key:
            try:
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                print(f"OpenAI Init Error: {e}")

    def generate_feedback(self, resume_text: str, job_desc: str, missing_skills: List[str]) -> List[str]:
        suggestions = []
        text_lower = resume_text.lower()

        # 1. Real AI Generation (if key exists)
        if self.client:
            prompt = f"Analyze resume vs job. Missing: {missing_skills}. Give 3 short improvements."
            try:
                response = self.client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=150
                )
                content = response.choices[0].message.content
                return [line.strip("- ") for line in content.split("\n") if line.strip()]
            except:
                pass # Fallback to rule-based

        # 2. Smart Rule-Based Feedback (No API Key)
        
        # Check for Quantification (Metrics)
        if not any(char.isdigit() for char in resume_text):
            suggestions.append("Quantify your achievements! Use numbers (e.g., 'Improved efficiency by 20%') to prove impact.")
        
        # Check for 'Experience' or 'Work' sections
        if "experience" not in text_lower and "work" not in text_lower:
            suggestions.append("Ensure you have a clearly labeled 'Professional Experience' section.")

        # Check for 'Education'
        if "education" not in text_lower and "university" not in text_lower:
            suggestions.append("Don't forget to include an 'Education' section with your degree and year.")

        # Check for Soft Skills context
        if "team" not in text_lower and "collaborat" not in text_lower:
            suggestions.append("Highlight teamwork and collaboration. Use words like 'partnered', 'collaborated', or 'co-ordinated'.")

        # Fallback / General Tips if resume looks good
        if len(suggestions) < 3:
            pool = [
                "Use strong action verbs (e.g., 'Architected', 'Spearheaded') instead of passive language.",
                "Tailor your project descriptions to highlight the technologies most relevant to the role.",
                "Ensure your LinkedIn profile URL is included and clickable.",
                "Move your most relevant technical skills to the top of the resume.",
                "Check for consistency in date formatting (e.g., 'Jan 2023' vs '01/2023')."
            ]
            import random
            # Add unique suggestions from pool until we have 3
            while len(suggestions) < 3:
                pick = random.choice(pool)
                if pick not in suggestions:
                    suggestions.append(pick)

        return suggestions[:3]

ai_generator = AIGenerator()
