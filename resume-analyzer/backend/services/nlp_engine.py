import re
from difflib import SequenceMatcher

from utils.skills_db import COMMON_SKILLS
from models.schemas import AIAnalysisResult

class NLPService:
    def __init__(self):
        # Precompute lowercase skills once for faster matching.
        self._skills = [skill.strip().lower() for skill in COMMON_SKILLS if skill.strip()]
        self._required_sections = [
            "summary",
            "experience",
            "education",
            "skills",
            "projects",
        ]
        self._critical_sections = ["experience", "skills", "education"]
        self._action_verbs = {
            "built", "led", "managed", "designed", "developed", "implemented", "optimized",
            "improved", "launched", "scaled", "automated", "delivered", "created", "reduced",
            "increased", "spearheaded", "architected", "achieved",
        }
        self._section_headings = {
            "experience", "education", "projects", "summary", "certifications",
            "achievements", "work experience", "profile", "objective",
        }
        self._fallback_stopwords = {
            "and", "or", "with", "using", "in", "of", "the", "to", "for", "a", "an",
            "skills", "technologies", "tools", "frameworks", "languages", "proficient", "knowledge",
        }

    def _tokenize(self, text: str) -> set[str]:
        return set(re.findall(r"[a-zA-Z0-9+#.-]+", text.lower()))

    def _extract_fallback_skills(self, text: str) -> list[str]:
        text = text or ""
        lines = [line.strip() for line in text.splitlines() if line.strip()]

        # Prefer explicit skills sections when present.
        collected = []
        capture = False
        for line in lines:
            lower = line.lower().strip(" :|-\t")

            if "skill" in lower:
                capture = True
                continue

            if capture and lower in self._section_headings:
                break

            if capture:
                collected.append(line)

        # If no skills section found, take first lines as weak fallback.
        source_text = "\n".join(collected[:20]) if collected else "\n".join(lines[:30])

        candidates = []
        raw_parts = re.split(r"[,|/•;\n]+", source_text)
        for part in raw_parts:
            chunk = re.sub(r"\s+", " ", part).strip(" -:\t")
            if not chunk:
                continue

            # Keep short skill-like phrases.
            words = [w for w in re.findall(r"[A-Za-z0-9+#.-]+", chunk)]
            if not words or len(words) > 4:
                continue

            normalized = " ".join(words).lower()
            if normalized in self._fallback_stopwords:
                continue
            if any(sw in normalized.split() for sw in self._fallback_stopwords):
                # Keep tokens like 'data structures' but drop noisy phrases.
                if len(words) == 1:
                    continue

            # Must contain at least one alphabetic character.
            if not re.search(r"[a-zA-Z]", normalized):
                continue

            candidates.append(normalized)

        # Deduplicate while preserving order.
        seen = set()
        ordered = []
        for skill in candidates:
            if skill in seen:
                continue
            seen.add(skill)
            ordered.append(skill)
            if len(ordered) >= 18:
                break

        return ordered

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

        # If dictionary match is sparse, recover skills from explicit skills text patterns.
        if len(skills) < 3:
            for fallback_skill in self._extract_fallback_skills(text):
                skills.add(fallback_skill)

        return sorted(skills)

    def calculate_similarity_score(self, resume_text: str, job_desc: str) -> float:
        resume_text = (resume_text or "").strip().lower()
        job_desc = (job_desc or "").strip().lower()

        if not resume_text or not job_desc:
            return 0.0

        # Lightweight fuzzy text similarity as a semantic approximation.
        ratio = SequenceMatcher(None, resume_text, job_desc).ratio()
        return ratio * 100

    def _score_sections(self, resume_text: str) -> tuple[float, list[str]]:
        text = (resume_text or "").lower()
        found = []
        missing = []

        for section in self._required_sections:
            pattern = rf"\b{re.escape(section)}\b"
            if re.search(pattern, text):
                found.append(section)
            else:
                missing.append(section)

        section_score = (len(found) / len(self._required_sections)) * 20
        return section_score, missing

    def _score_impact_signals(self, resume_text: str) -> tuple[float, int, int]:
        text = (resume_text or "").lower()
        tokens = self._tokenize(text)

        metric_matches = re.findall(
            r"\b(\d+%|\$\d+[kKmM]?|\d+\+?\s?(years|yrs|months|users|clients|projects|features))\b",
            text,
        )
        metric_count = len(metric_matches)

        verb_count = len(self._action_verbs.intersection(tokens))

        metrics_component = min(metric_count, 5) / 5 * 6
        verbs_component = min(verb_count, 6) / 6 * 4
        return metrics_component + verbs_component, metric_count, verb_count

    def _score_formatting(self, resume_text: str) -> tuple[float, list[str]]:
        text = resume_text or ""
        suggestions = []
        score = 0.0

        email_present = bool(re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text))
        phone_present = bool(re.search(r"(\+?\d[\d\-\s]{8,}\d)", text))
        bullet_count = len(re.findall(r"(^\s*[-*•]|\n\s*[-*•])", text, flags=re.MULTILINE))
        length = len(text)

        if email_present:
            score += 3
        else:
            suggestions.append("Add a professional email in contact details.")

        if phone_present:
            score += 2
        else:
            suggestions.append("Include a phone number for ATS completeness.")

        if 450 <= length <= 9000:
            score += 3
        elif length < 450:
            suggestions.append("Resume content is too short; add role impact and project details.")
        else:
            suggestions.append("Resume content is too long; keep it concise and ATS-friendly.")

        if bullet_count >= 4:
            score += 2
        else:
            suggestions.append("Use bullet points to improve ATS parsing and readability.")

        return score, suggestions

    def _keyword_stuffing_penalty(self, resume_text: str, job_skills: set[str]) -> tuple[float, int]:
        text = (resume_text or "").lower()
        if not text:
            return 0.0, 0

        repeated_count = 0
        for skill in job_skills:
            occurrences = len(re.findall(rf"\b{re.escape(skill)}\b", text))
            if occurrences >= 6:
                repeated_count += 1

        # Penalize excessive repetition of JD keywords (possible keyword stuffing).
        penalty = min(repeated_count * 2.0, 8.0)
        return penalty, repeated_count

    def _strict_caps(
        self,
        base_score: float,
        job_skill_count: int,
        skill_coverage: float,
        missing_sections: list[str],
        metric_count: int,
        bullet_count: int,
    ) -> tuple[float, list[str]]:
        capped_score = base_score
        cap_reasons = []

        missing_critical = [section for section in self._critical_sections if section in missing_sections]

        # Gate 1: with JD provided, low skill coverage should hard-cap ATS score.
        if job_skill_count > 0:
            if skill_coverage < 0.25:
                capped_score = min(capped_score, 45.0)
                cap_reasons.append("Very low role-skill coverage (<25%).")
            elif skill_coverage < 0.40:
                capped_score = min(capped_score, 60.0)
                cap_reasons.append("Low role-skill coverage (<40%).")

        # Gate 2: missing critical resume structure should cap readiness.
        if len(missing_critical) >= 2:
            capped_score = min(capped_score, 55.0)
            cap_reasons.append("Missing multiple critical sections (Experience/Skills/Education).")

        # Gate 3: no quantifiable impact should cap strong ATS outcomes.
        if metric_count == 0:
            capped_score = min(capped_score, 65.0)
            cap_reasons.append("No quantifiable impact metrics detected.")

        # Gate 4: very weak formatting (few bullets) should cap score.
        if bullet_count < 3:
            capped_score = min(capped_score, 70.0)
            cap_reasons.append("Insufficient bullet structure for ATS parsing.")

        return capped_score, cap_reasons

    def analyze_resume_vs_job(self, resume_text: str, job_desc: str) -> AIAnalysisResult:
        resume_text = resume_text or ""
        job_desc = job_desc or ""

        resume_skills = set(self.extract_skills(resume_text))
        job_skills = set(self.extract_skills(job_desc))
        matched_skills = list(resume_skills.intersection(job_skills))
        missing_skills = list(job_skills - resume_skills)
        semantic_score = self.calculate_similarity_score(resume_text, job_desc)

        # Strict ATS rubric (0-100): skills 45, semantic 15, sections 20, impact 10, format 10.
        if job_skills:
            skill_coverage = len(matched_skills) / len(job_skills)
            skills_component = skill_coverage * 45
        else:
            # No JD provided: apply strict baseline by detected skill breadth.
            skill_coverage = 0.0
            skills_component = min(len(resume_skills), 18) / 18 * 45

        semantic_component = (semantic_score / 100) * 15
        sections_component, missing_sections = self._score_sections(resume_text)
        impact_component, metric_count, verb_count = self._score_impact_signals(resume_text)
        format_component, formatting_suggestions = self._score_formatting(resume_text)
        bullet_count = len(re.findall(r"(^\s*[-*•]|\n\s*[-*•])", resume_text, flags=re.MULTILINE))

        stuffing_penalty, stuffed_keywords = self._keyword_stuffing_penalty(resume_text, job_skills)
        weak_impact_penalty = 4.0 if metric_count < 2 else 0.0
        weak_action_penalty = 2.0 if verb_count < 3 else 0.0
        deductions = stuffing_penalty + weak_impact_penalty + weak_action_penalty

        final_score = skills_component + semantic_component + sections_component + impact_component + format_component - deductions
        final_score, cap_reasons = self._strict_caps(
            base_score=final_score,
            job_skill_count=len(job_skills),
            skill_coverage=skill_coverage,
            missing_sections=missing_sections,
            metric_count=metric_count,
            bullet_count=bullet_count,
        )

        final_score = min(100, max(0, final_score))
        final_score = round(final_score, 1)

        score_breakdown = {
            "skills_alignment": {"score": round(skills_component, 1), "max": 45.0},
            "semantic_relevance": {"score": round(semantic_component, 1), "max": 15.0},
            "section_coverage": {"score": round(sections_component, 1), "max": 20.0},
            "impact_evidence": {"score": round(impact_component, 1), "max": 10.0},
            "formatting_quality": {"score": round(format_component, 1), "max": 10.0},
            "strictness_deductions": {"score": round(deductions, 1), "max": 14.0},
            "total": {"score": final_score, "max": 100.0},
        }

        exp_match = "Strong" if final_score >= 85 else "Moderate" if final_score >= 65 else "Weak"

        suggestions = []
        if missing_skills:
            suggestions.append(f"Consider acquiring: {', '.join(missing_skills[:3])}")

        if missing_sections:
            suggestions.append(f"Add missing sections: {', '.join(missing_sections[:2])}.")

        if metric_count < 3:
            suggestions.append("Add quantified achievements (numbers, %, impact metrics).")

        if verb_count < 4:
            suggestions.append("Use stronger action verbs to improve ATS relevance.")

        suggestions.extend(formatting_suggestions[:2])

        if stuffed_keywords > 0:
            suggestions.append("Reduce repetitive keyword stuffing and use natural, role-relevant phrasing.")

        if cap_reasons:
            suggestions.extend([f"Score cap applied: {reason}" for reason in cap_reasons[:2]])

        if final_score < 70:
            suggestions.append("Align resume keywords more tightly with the target job description.")

        return AIAnalysisResult(
            ats_score=final_score,
            resume_skills=sorted(resume_skills),
            matched_skills=sorted(matched_skills),
            missing_skills=sorted(missing_skills),
            experience_match=exp_match,
            ai_suggestions=suggestions[:6],
            score_breakdown=score_breakdown,
        )

nlp_engine = NLPService()
