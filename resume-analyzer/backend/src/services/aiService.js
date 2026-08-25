import { Groq } from 'groq-sdk';
import { config } from '../config/index.js';

export class AIService {
  constructor() {
    this.apiKey = config.GROQ_API_KEY;
    this.modelName = config.GROQ_MODEL || 'openai/gpt-oss-120b';
    this.client = this.apiKey ? new Groq({ apiKey: this.apiKey }) : null;
  }

  parseJsonResponse(responseText) {
    if (!responseText || typeof responseText !== 'string') return {};

    try {
      const startIdx = responseText.indexOf('{');
      const endIdx = responseText.lastIndexOf('}') + 1;

      if (startIdx !== -1 && endIdx > startIdx) {
        const jsonStr = responseText.slice(startIdx, endIdx);
        return JSON.parse(jsonStr);
      }
      return JSON.parse(responseText);
    } catch (err) {
      console.error('JSON Parse Error:', err.message, '\nRaw Response:', responseText);
      throw new Error(`Failed to parse JSON from AI model response: ${err.message}`);
    }
  }

  async generateJson(prompt) {
    if (!this.client) {
      console.warn('GROQ_API_KEY not configured. Returning fallback response.');
      throw new Error('GROQ_API_KEY is not configured. Set GROQ_API_KEY to enable AI endpoints.');
    }

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: [
        {
          role: 'system',
          content: 'You are a strict JSON API. Return only valid JSON with no markdown wrapping or additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    });

    const content = response.choices?.[0]?.message?.content || '{}';
    return this.parseJsonResponse(content);
  }

  async analyzeResume(resumeText, jobDescription = '') {
    const prompt = `You are an expert ATS (Applicant Tracking System) and resume analyzer.
Analyze the following resume and provide a comprehensive evaluation.

Resume Text:
${resumeText}

${jobDescription ? `Job Description: ${jobDescription}` : ''}

Provide your analysis in STRICT JSON format with the following structure:
{
    "resume_score": <number 0-100>,
    "ats_score": <number 0-100>,
    "skills": {
        "matched": [<list of skills found in resume>],
        "missing": [<list of important skills not found>],
        "recommended": [<list of skills to add>]
    },
    "section_scores": {
        "education": <number 0-100>,
        "experience": <number 0-100>,
        "projects": <number 0-100>,
        "skills": <number 0-100>
    },
    "strengths": [<list of 3-4 specific resume strengths>],
    "resume_category": "<Fresher or Experienced>",
    "improvement_tips": [<list of 3-4 specific actionable tips>],
    "experience_match": "<Strong or Moderate or Weak>"
}

Rules for strengths and improvement_tips:
- Keep each point concise (max 18 words).
- Avoid generic filler text.
- Focus on resume content and JD relevance.

IMPORTANT: Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async analyzeAtsHeatmap(resumeText) {
    const prompt = `You are an ATS (Applicant Tracking System) expert. Analyze the following resume and evaluate each section for ATS compatibility.

Resume Text:
${resumeText}

Provide your analysis in STRICT JSON format:
{
    "sections": [
        {
            "name": "Contact Information",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Professional Summary",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Work Experience",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Education",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Skills",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Projects",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Certifications",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        },
        {
            "name": "Keywords Density",
            "score": <number 0-100>,
            "status": "<excellent|good|moderate|needs-work|critical>",
            "feedback": "<specific feedback>"
        }
    ]
}

Status guidelines:
- excellent: 90-100
- good: 80-89
- moderate: 70-79
- needs-work: 50-69
- critical: 0-49

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async matchJob(resumeText, jobDescription) {
    const prompt = `You are an expert job matching AI. Compare the following resume with the job description and provide a detailed match analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide analysis in STRICT JSON format:
{
    "match_percentage": <number 0-100>,
    "matched_skills": [<list of skills that match>],
    "missing_skills": [<list of required skills not in resume>],
    "experience_match": "<low|medium|high>",
    "reasoning": "<detailed explanation of why this is a good/bad match>"
}

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async simulateImprovement(resumeText, addedItem, itemType, jobDescription = '') {
    const prompt = `You are a resume optimization expert. Analyze the impact of adding a new ${itemType} to the resume.

Original Resume:
${resumeText}

Added ${itemType}:
${addedItem}

${jobDescription ? `Target Job: ${jobDescription}` : ''}

Provide analysis in STRICT JSON format:
{
    "old_score": <number 0-100>,
    "new_score": <number 0-100>,
    "impact_percentage": <number representing improvement>,
    "old_job_match": <number 0-100>,
    "new_job_match": <number 0-100>,
    "impact_explanation": "<detailed explanation of the impact>"
}

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async generateCareerPath(currentRole, targetRole, currentSkills = []) {
    const skillsText = currentSkills && currentSkills.length ? `Current Skills: ${currentSkills.join(', ')}` : '';

    const prompt = `You are a career development expert. Create a detailed learning roadmap for transitioning from ${currentRole} to ${targetRole}.

${skillsText}

Provide a structured roadmap in STRICT JSON format:
{
    "total_duration": "<e.g., 7-11 months>",
    "roadmap": [
        {
            "phase": "Phase 1: <Name>",
            "duration": "<e.g., 2-3 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        },
        {
            "phase": "Phase 2: <Name>",
            "duration": "<e.g., 2-3 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        },
        {
            "phase": "Phase 3: <Name>",
            "duration": "<e.g., 1-2 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        },
        {
            "phase": "Phase 4: <Name>",
            "duration": "<e.g., 2-3 months>",
            "skills": [<list of skills to learn>],
            "resources": [<list of recommended resources>],
            "milestone": "<project or achievement to complete>"
        }
    ]
}

Provide 4 phases with specific, actionable skills and resources.
Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async optimizeResume(resumeText, jobDescription, companyName = '') {
    const companyContext = companyName ? ` at ${companyName}` : '';

    const prompt = `You are an expert resume writer and ATS optimization specialist.
Rewrite the following resume to perfectly match the job description${companyContext}.

CRITICAL RULES:
1. Preserve ALL factual information (dates, companies, education)
2. Enhance language to match job requirements
3. Add relevant ATS keywords from the job description
4. Improve action verbs and quantifiable achievements
5. Maintain professional tone

Original Resume:
${resumeText}

Job Description:
${jobDescription}

Provide optimization in STRICT JSON format:
{
    "optimized_summary": "<rewritten professional summary>",
    "optimized_skills": ["<skill 1>", "<skill 2>"],
    "optimized_experience": [
        {
            "original": "<original bullet point>",
            "optimized": "<improved bullet point>",
            "reason": "<why this change improves ATS score>"
        }
    ],
    "ats_improvement_score": <number 0-100 representing expected improvement>,
    "changes_explanation": "<summary of key optimizations made>"
}

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async generateInterviewQuestions(resumeText, jobDescription, missingSkills = []) {
    const missingContext = missingSkills && missingSkills.length ? `\nMissing Skills to Focus On: ${missingSkills.join(', ')}` : '';

    const prompt = `You are an expert technical interviewer. Generate comprehensive interview questions based on the candidate's resume and the job requirements.

Resume:
${resumeText}

Job Description:
${jobDescription}
${missingContext}

Generate questions in STRICT JSON format:
{
    "technical": [
        {
            "question": "<technical question>",
            "focus_area": "<skill/technology>",
            "difficulty": "easy|medium|hard"
        }
    ],
    "behavioral": [
        {
            "question": "<behavioral question>",
            "focus_area": "<competency>",
            "difficulty": "easy|medium|hard"
        }
    ],
    "situational": [
        {
            "question": "<situational question>",
            "focus_area": "<scenario type>",
            "difficulty": "easy|medium|hard"
        }
    ],
    "overall_difficulty": "easy|medium|hard",
    "preparation_tips": ["<tip 1>", "<tip 2>"]
}

Generate 3-5 questions per category. Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async explainScore(resumeText, jobDescription, atsScore, matchedSkills = [], missingSkills = []) {
    const prompt = `You are an AI explainability expert. Provide clear, actionable reasoning for why this resume received its ATS score.

Resume:
${resumeText}

Job Description:
${jobDescription}

Current ATS Score: ${atsScore}%
Matched Skills: ${matchedSkills.join(', ')}
Missing Skills: ${missingSkills.join(', ')}

Provide explanation in STRICT JSON format:
{
    "reasoning": "<detailed explanation of the score>",
    "positive_factors": [
        {
            "factor": "<what helped the score>",
            "impact": "high|medium|low",
            "evidence": "<specific example from resume>"
        }
    ],
    "negative_factors": [
        {
            "factor": "<what hurt the score>",
            "impact": "high|medium|low",
            "evidence": "<specific gap or issue>"
        }
    ],
    "improvement_actions": [
        {
            "action": "<specific action to take>",
            "expected_impact": "+<number> points",
            "priority": "high|medium|low"
        }
    ],
    "score_breakdown": {
        "skills_match": <0-100>,
        "experience_relevance": <0-100>,
        "keyword_optimization": <0-100>,
        "formatting_quality": <0-100>
    }
}

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async checkResumeQuality(resumeText) {
    const prompt = `You are a resume quality auditor. Analyze this resume for:
1. Weak/passive language
2. Buzzword overuse
3. Vague claims without evidence
4. Unrealistic skill claims
5. Inconsistencies

Resume:
${resumeText}

Provide analysis in STRICT JSON format:
{
    "confidence_score": <number 0-100>,
    "authenticity_score": <number 0-100>,
    "issues": [
        {
            "type": "weak_language|buzzwords|vague_claim|unrealistic|inconsistency",
            "severity": "high|medium|low",
            "location": "<where in resume>",
            "issue": "<description of the problem>",
            "example": "<specific text from resume>"
        }
    ],
    "suggestions": [
        {
            "issue_type": "<type>",
            "current": "<current text>",
            "suggested": "<improved text>",
            "reason": "<why this is better>"
        }
    ],
    "risk_level": "low|medium|high",
    "overall_assessment": "<summary of resume quality>"
}

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }

  async compareResumeVersions(version1Text, version2Text, version1Score = 70, version2Score = 85) {
    const prompt = `You are a resume improvement analyst. Compare these two resume versions and explain what changed and why it improved (or worsened) the score.

Version 1 (Score: ${version1Score}%):
${version1Text}

Version 2 (Score: ${version2Score}%):
${version2Text}

Provide comparison in STRICT JSON format:
{
    "score_change": {
        "previous": ${version1Score},
        "current": ${version2Score},
        "delta": ${version2Score - version1Score},
        "trend": "${version2Score >= version1Score ? 'improved' : 'declined'}"
    },
    "key_changes": [
        {
            "section": "<which section changed>",
            "change_type": "added|removed|modified",
            "description": "<what changed>",
            "impact": "positive|negative|neutral"
        }
    ],
    "improvements": ["<improvement 1>", "<improvement 2>"],
    "regressions": ["<regression 1>"],
    "recommendation": "<overall advice for next iteration>"
}

Return ONLY the JSON object.`;

    return await this.generateJson(prompt);
  }
}

export const aiService = new AIService();
