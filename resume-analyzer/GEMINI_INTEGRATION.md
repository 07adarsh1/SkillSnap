# Google Gemini AI Integration - Resume Analyzer

## Overview
This document describes the integration of Google Gemini AI API for real-time resume analysis, job matching, and career path generation.

## Backend Architecture

### 1. Gemini Service (`backend/services/gemini_service.py`)

**Purpose**: Centralized service for all Gemini AI interactions

**Key Methods**:
- `analyze_resume(resume_text, job_description)` - Comprehensive resume analysis
- `analyze_ats_heatmap(resume_text)` - Section-by-section ATS compatibility
- `match_job(resume_text, job_description)` - Job-resume matching
- `simulate_improvement(resume_text, added_item, item_type, job_description)` - Impact simulation
- `generate_career_path(current_role, target_role, current_skills)` - Career roadmap generation

**Features**:
- JSON-only responses enforced via prompts
- Automatic JSON parsing with error handling
- Fallback mechanisms for API failures
- Rate limit handling

### 2. API Endpoints (`backend/routes/gemini_routes.py`)

#### POST `/api/analyze-resume`
**Input**:
```json
{
  "resume_id": "string",
  "job_description": "string (optional)"
}
```

**Output**:
```json
{
  "ats_score": 85,
  "matched_skills": ["React", "Python", "AWS"],
  "missing_skills": ["Kubernetes", "GraphQL"],
  "experience_match": "Strong",
  "ai_suggestions": ["Add quantifiable metrics...", "..."]
}
```

#### POST `/api/ats-heatmap`
**Input**:
```json
{
  "resume_id": "string"
}
```

**Output**:
```json
{
  "sections": [
    {
      "name": "Contact Information",
      "score": 95,
      "status": "excellent",
      "feedback": "All required contact details present..."
    }
  ]
}
```

#### POST `/api/job-match`
**Input**:
```json
{
  "resume_id": "string",
  "job_description": "string"
}
```

**Output**:
```json
{
  "match_percentage": 92,
  "matched_skills": ["React", "Python"],
  "missing_skills": ["GraphQL"],
  "experience_match": "high",
  "reasoning": "Strong alignment with required skills..."
}
```

#### POST `/api/simulate-improvement`
**Input**:
```json
{
  "resume_id": "string",
  "added_item": "TypeScript",
  "item_type": "skill",
  "job_description": "string (optional)"
}
```

**Output**:
```json
{
  "old_score": 75,
  "new_score": 83,
  "impact_percentage": 8,
  "old_job_match": 68,
  "new_job_match": 76,
  "impact_explanation": "Adding TypeScript significantly improves..."
}
```

#### POST `/api/career-path`
**Input**:
```json
{
  "current_role": "Frontend Developer",
  "target_role": "Full Stack Developer",
  "current_skills": ["React", "JavaScript"]
}
```

**Output**:
```json
{
  "total_duration": "7-11 months",
  "roadmap": [
    {
      "phase": "Phase 1: Foundation",
      "duration": "2-3 months",
      "skills": ["TypeScript", "Advanced React Patterns"],
      "resources": ["Official TypeScript Docs"],
      "milestone": "Build a complex dashboard application"
    }
  ]
}
```

## Frontend Integration

### API Service (`frontend/src/services/api.js`)

**New Functions**:
```javascript
// Fetch ATS heatmap
export const getATSHeatmap = async (resumeId) => { ... }

// Match job with resume
export const matchJob = async (resumeId, jobDescription) => { ... }

// Simulate adding skill/project
export const simulateImprovement = async (resumeId, addedItem, itemType, jobDescription) => { ... }

// Generate career roadmap
export const generateCareerPath = async (currentRole, targetRole, currentSkills) => { ... }
```

### Component Updates

#### 1. ATSHeatmap Component
- **Location**: `frontend/src/components/dashboard/ATSHeatmap.jsx`
- **Features**:
  - Fetches real-time ATS analysis from Gemini
  - Loading states with spinner
  - Error handling with retry button
  - Color-coded sections (excellent → critical)
  - Hover tooltips with feedback

#### 2. ResumeSimulator Component
- **Location**: `frontend/src/components/dashboard/ResumeSimulator.jsx`
- **Integration**: Ready to connect to `/api/simulate-improvement`
- **Features**:
  - Real-time impact calculation
  - Before/after comparison charts
  - Multiple item types (skill, project, certification, experience)

#### 3. CareerPathGenerator Component
- **Location**: `frontend/src/components/dashboard/CareerPathGenerator.jsx`
- **Integration**: Ready to connect to `/api/career-path`
- **Features**:
  - Personalized 4-phase roadmap
  - Skills, resources, and milestones per phase
  - Timeline visualization

## Environment Setup

### Backend (.env)
```
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=resume_analyzer_db
```

### Dependencies
```
google-generativeai==latest
fastapi
uvicorn
motor
python-dotenv
```

## Prompting Strategy

### Key Principles:
1. **JSON-Only Output**: All prompts explicitly request "STRICT JSON format" and "Return ONLY the JSON object"
2. **Structured Schemas**: Provide exact JSON structure in prompts
3. **Clear Guidelines**: Include scoring thresholds and status definitions
4. **Error Handling**: Parse JSON with fallback mechanisms

### Example Prompt Template:
```
You are an expert [role]. Analyze the following [content].

[Content here]

Provide your analysis in STRICT JSON format:
{
  "field1": <type>,
  "field2": [<array>]
}

IMPORTANT: Return ONLY the JSON object, no additional text or explanation.
```

## Error Handling

### Backend:
- Try-catch blocks around all Gemini calls
- Fallback to basic analysis if Gemini fails
- Detailed error logging
- HTTP 500 with descriptive messages

### Frontend:
- Loading states during API calls
- Error messages with retry buttons
- Graceful degradation to mock data if needed
- User-friendly error notifications

## Testing

### Backend Testing:
```bash
# Start backend
cd backend
.\venv\Scripts\activate
uvicorn main:app --reload

# Test endpoints
curl -X POST http://localhost:8000/api/ats-heatmap \
  -H "Content-Type: application/json" \
  -d '{"resume_id": "your_resume_id"}'
```

### Frontend Testing:
```bash
# Start frontend
cd frontend
npm run dev

# Navigate to dashboard and test features
```

## Performance Considerations

1. **Caching**: Store Gemini responses in MongoDB to avoid redundant API calls
2. **Rate Limiting**: Implement request throttling for Gemini API
3. **Async Operations**: All Gemini calls are async to prevent blocking
4. **Loading States**: Show spinners during AI processing

## Security

1. **API Key Protection**: Never expose GEMINI_API_KEY in frontend
2. **Input Validation**: Sanitize all user inputs before sending to Gemini
3. **CORS**: Properly configured for frontend-backend communication
4. **Authentication**: Integrate with Clerk for user-specific data

## Future Enhancements

1. **Streaming Responses**: Implement real-time streaming for long analyses
2. **Batch Processing**: Analyze multiple resumes simultaneously
3. **Custom Prompts**: Allow users to customize analysis criteria
4. **A/B Testing**: Compare different prompt strategies
5. **Analytics**: Track Gemini API usage and costs

## Troubleshooting

### Common Issues:

**Issue**: "GEMINI_API_KEY not found"
**Solution**: Ensure `.env` file exists in backend directory with valid API key

**Issue**: JSON parse errors
**Solution**: Check Gemini response format, update prompt if needed

**Issue**: Rate limit exceeded
**Solution**: Implement exponential backoff and request queuing

**Issue**: Slow responses
**Solution**: Cache results, use smaller prompts, consider streaming

## API Costs

- Monitor Gemini API usage in Google Cloud Console
- Implement usage tracking and alerts
- Consider caching strategies to reduce API calls
- Set up budget alerts

## Deployment Checklist

- [ ] Set GEMINI_API_KEY in production environment
- [ ] Configure MongoDB connection
- [ ] Set up CORS for production domain
- [ ] Enable API rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure caching layer (Redis)
- [ ] Set up API usage tracking
- [ ] Test all endpoints in production
- [ ] Monitor Gemini API costs

## Contact & Support

For issues or questions:
- Check Gemini API documentation: https://ai.google.dev/docs
- Review error logs in backend console
- Test endpoints using Swagger UI: http://localhost:8000/docs
