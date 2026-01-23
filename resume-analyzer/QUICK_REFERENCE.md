# 🚀 Quick Reference Card

## API Endpoints

### Resume Optimization
```
POST /api/optimize-resume
Body: { resume_id, job_description, company_name }
```

### Interview Questions
```
POST /api/interview-questions
Body: { resume_id, job_description }
```

### Score Explanation
```
POST /api/explain-score
Body: { resume_id, job_description }
```

### Version History
```
GET /api/resume-versions/{resume_id}
```

### Version Comparison
```
POST /api/compare-versions
Body: { resume_id, version1, version2 }
```

### Quality Check
```
POST /api/resume-quality-check
Body: { resume_id }
```

---

## React Components

### Import
```javascript
import ResumeOptimizer from './components/dashboard/ResumeOptimizer';
import InterviewPrep from './components/dashboard/InterviewPrep';
import ExplainableAI from './components/dashboard/ExplainableAI';
import VersionControl from './components/dashboard/VersionControl';
import QualityCheck from './components/dashboard/QualityCheck';
```

### Usage
```javascript
<ResumeOptimizer resumeId={id} onClose={() => {}} />
<InterviewPrep resumeId={id} onClose={() => {}} />
<ExplainableAI resumeId={id} currentScore={score} jobDescription={jd} onClose={() => {}} />
<VersionControl resumeId={id} onClose={() => {}} />
<QualityCheck resumeId={id} onClose={() => {}} />
```

---

## API Methods

```javascript
import {
  optimizeResume,
  generateInterviewQuestions,
  explainScore,
  getResumeVersions,
  compareVersions,
  checkResumeQuality
} from './services/api';

// Usage
const result = await optimizeResume(resumeId, jobDesc, company);
const questions = await generateInterviewQuestions(resumeId, jobDesc);
const explanation = await explainScore(resumeId, jobDesc);
const versions = await getResumeVersions(resumeId);
const comparison = await compareVersions(resumeId, v1, v2);
const quality = await checkResumeQuality(resumeId);
```

---

## Testing URLs

- **Swagger UI**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173
- **Backend Health**: http://localhost:8000/

---

## File Locations

### Backend
- Routes: `backend/routes/advanced_features.py`
- Service: `backend/services/gemini_service.py`
- Main: `backend/main.py`

### Frontend
- Components: `frontend/src/components/dashboard/`
- API: `frontend/src/services/api.js`

### Docs
- Features: `ADVANCED_FEATURES.md`
- Summary: `IMPLEMENTATION_SUMMARY.md`
- Integration: `GEMINI_INTEGRATION.md`

---

## Common Workflows

### 1. Optimize Resume
```
Upload Resume → Get resume_id → Call optimize-resume → Display results
```

### 2. Interview Prep
```
Have resume_id → Paste job description → Generate questions → Study
```

### 3. Explain Score
```
Analyze resume → Get score → Click "Why?" → View explanation
```

### 4. Track Progress
```
Create versions → View history → Compare versions → See improvements
```

### 5. Quality Check
```
Upload resume → Run quality check → Fix issues → Re-check
```

---

## Quick Commands

### Start Backend
```bash
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Test API
```bash
# Visit http://localhost:8000/docs
# Click "Advanced Features" tag
# Try each endpoint
```

---

## Props Reference

### ResumeOptimizer
- `resumeId` (string, required)
- `onClose` (function, required)

### InterviewPrep
- `resumeId` (string, required)
- `onClose` (function, required)

### ExplainableAI
- `resumeId` (string, required)
- `currentScore` (number, required)
- `jobDescription` (string, required)
- `onClose` (function, required)

### VersionControl
- `resumeId` (string, required)
- `onClose` (function, required)

### QualityCheck
- `resumeId` (string, required)
- `onClose` (function, required)

---

## Response Formats

### Optimize Resume
```json
{
  "optimized_summary": "...",
  "optimized_skills": ["..."],
  "optimized_experience": [{
    "original": "...",
    "optimized": "...",
    "reason": "..."
  }],
  "ats_improvement_score": 15,
  "changes_explanation": "..."
}
```

### Interview Questions
```json
{
  "technical": [{ "question": "...", "focus_area": "...", "difficulty": "..." }],
  "behavioral": [...],
  "situational": [...],
  "overall_difficulty": "medium",
  "preparation_tips": ["..."]
}
```

### Explain Score
```json
{
  "reasoning": "...",
  "positive_factors": [{ "factor": "...", "impact": "...", "evidence": "..." }],
  "negative_factors": [...],
  "improvement_actions": [{ "action": "...", "expected_impact": "...", "priority": "..." }],
  "score_breakdown": { "skills_match": 85, ... }
}
```

### Quality Check
```json
{
  "confidence_score": 85,
  "authenticity_score": 90,
  "issues": [{ "type": "...", "severity": "...", "issue": "...", "example": "..." }],
  "suggestions": [{ "current": "...", "suggested": "...", "reason": "..." }],
  "risk_level": "low",
  "overall_assessment": "..."
}
```

---

**Last Updated**: January 2026
**Status**: Production Ready ✅
