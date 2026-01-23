import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const uploadResume = async (file, userId) => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
        formData.append('user_id', userId);
    }
    const response = await api.post('/upload-resume', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzeResume = async (resumeId, jobDescription) => {
    const response = await api.post('/analyze-resume', {
        resume_id: resumeId,
        job_description: jobDescription,
    });
    return response.data;
};

export const getUserAnalysisHistory = async (userId) => {
    const response = await api.get(`/resumes/${userId}`);
    return response.data;
};

export const deleteResume = async (resumeId) => {
    const response = await api.delete(`/resumes/${resumeId}`);
    return response.data;
};

// Gemini-powered endpoints
export const getATSHeatmap = async (resumeId) => {
    const response = await api.post('/ats-heatmap', {
        resume_id: resumeId
    });
    return response.data;
};

export const matchJob = async (resumeId, jobDescription) => {
    const response = await api.post('/job-match', {
        resume_id: resumeId,
        job_description: jobDescription
    });
    return response.data;
};

export const simulateImprovement = async (resumeId, addedItem, itemType, jobDescription = '') => {
    const response = await api.post('/simulate-improvement', {
        resume_id: resumeId,
        added_item: addedItem,
        item_type: itemType,
        job_description: jobDescription
    });
    return response.data;
};

export const generateCareerPath = async (currentRole, targetRole, currentSkills = []) => {
    const response = await api.post('/career-path', {
        current_role: currentRole,
        target_role: targetRole,
        current_skills: currentSkills
    });
    return response.data;
};

// ============================================
// ADVANCED FEATURES API
// ============================================

// Feature 1: Resume Optimization
export const optimizeResume = async (resumeId, jobDescription, companyName = '') => {
    // Demo Mode Mock
    if (resumeId && typeof resumeId === 'string' && resumeId.startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({
            optimized_summary: "Passionate Senior Full Stack Engineer with 5+ years of experience building scalable web applications. Expert in Python, React, and Cloud Architecture (AWS). Proven track record of leading teams and delivering high-impact projects.",
            optimized_skills: ["Python", "React", "AWS Lambda", "Docker", "Kubernetes", "FastAPI", "System Design"],
            optimized_experience: [
                {
                    original: "Worked as Lead Developer at TechCorp.",
                    optimized: "Architected a microservices-based platform serving 100k+ users as Lead Developer, reducing latency by 40%.",
                    reason: "Quantified impact and used stronger action verbs."
                },
                {
                    original: "Helped migrate old system to AWS.",
                    optimized: "Spearheaded the migration of legacy monolith to AWS, cutting infrastructure costs by 30% and improving uptime.",
                    reason: "Added specific technologies and outcomes."
                }
            ],
            ats_improvement_score: 15,
            changes_explanation: "Added strong action verbs, quantified achievements, and included key keywords from the job description (AWS, Microservices)."
        }), 1500));
    }

    const response = await api.post('/optimize-resume', {
        resume_id: resumeId,
        job_description: jobDescription,
        company_name: companyName
    });
    return response.data;
};

// Feature 2: Interview Questions
export const generateInterviewQuestions = async (resumeId, jobDescription) => {
    if (resumeId && typeof resumeId === 'string' && resumeId.startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({
            overall_difficulty: "medium",
            technical: [
                {
                    question: "Explain the difference between SQL and NoSQL databases. When would you choose one over the other?",
                    difficulty: "medium",
                    focus_area: "Database Design"
                },
                {
                    question: "How does React's Virtual DOM work, and how does it improve performance?",
                    difficulty: "easy",
                    focus_area: "Frontend Optimization"
                },
                {
                    question: "Describe a challenging bug you fixed in a distributed system.",
                    difficulty: "hard",
                    focus_area: "System Troubleshooting"
                }
            ],
            behavioral: [
                {
                    question: "Tell me about a time you had a conflict with a team member. How did you resolve it?",
                    difficulty: "medium",
                    focus_area: "Conflict Resolution"
                },
                {
                    question: "Describe a situation where you had to learn a new technology quickly.",
                    difficulty: "medium",
                    focus_area: "Adaptability"
                },
                {
                    question: "How do you handle tight deadlines and pressure?",
                    difficulty: "easy",
                    focus_area: "Time Management"
                }
            ],
            situational: [
                {
                    question: "If a production server goes down at 2 AM, what is your immediate response process?",
                    difficulty: "hard",
                    focus_area: "Incident Response"
                },
                {
                    question: "You realize a feature you designed has a security flaw. What do you do?",
                    difficulty: "hard",
                    focus_area: "Security & Ethics"
                }
            ],
            preparation_tips: [
                "Review the STAR method for behavioral questions.",
                "Brush up on system design concepts for the technical round.",
                "Be ready to discuss your specific contributions in the 'AI Resume Architect' project."
            ]
        }), 1500));
    }

    const response = await api.post('/interview-questions', {
        resume_id: resumeId,
        job_description: jobDescription
    });
    return response.data;
};

// Feature 3: Explainable AI
export const explainScore = async (resumeId, jobDescription) => {
    // Demo Mode Mock
    if (resumeId && typeof resumeId === 'string' && resumeId.startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({
            reasoning: "Your resume shows strong alignment with the technical skills required (Python, React). However, some leadership experience could be highlighted more effectively.",
            positive_factors: [
                { factor: "Technical Skills", impact: "high", evidence: "Strong match for 'Python' and 'React' keywords." },
                { factor: "Education", impact: "medium", evidence: "Clear education section with relevant degree." },
                { factor: "Action Verbs", impact: "low", evidence: "Good use of 'Architected', 'Spearheaded'." }
            ],
            negative_factors: [
                { factor: "Missing Skills", impact: "high", evidence: "Missing 'Kubernetes' experience mentioned in JD." },
                { factor: "Summary Length", impact: "medium", evidence: "Summary could be more concise (currently 5 lines)." },
                { factor: "Quantification", impact: "medium", evidence: "Lack of specific metrics in some project descriptions." }
            ],
            improvement_actions: [
                { action: "Add Containerization Project", expected_impact: "+5 pts", priority: "high" },
                { action: "Rewrite Summary", expected_impact: "+3 pts", priority: "medium" },
                { action: "Quantify Side Projects", expected_impact: "+2 pts", priority: "low" }
            ],
            score_breakdown: {
                skills_match: 85,
                experience_relevance: 90,
                formatting_quality: 95
            }
        }), 1500));
    }

    const response = await api.post('/explain-score', {
        resume_id: resumeId,
        job_description: jobDescription
    });
    return response.data;
};

// Feature 4: Version Control
export const getResumeVersions = async (resumeId) => {
    // Demo Mode Mock
    if (resumeId && typeof resumeId === 'string' && resumeId.startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({
            versions: [
                { id: "v3", version: 3, ats_score: 92, filename: "Resume_v3_Final.pdf", uploaded_at: new Date().toISOString(), is_optimized: true },
                { id: "v2", version: 2, ats_score: 85, filename: "Resume_v2_Optimized.pdf", uploaded_at: new Date(Date.now() - 86400000).toISOString(), is_optimized: false },
                { id: "v1", version: 1, ats_score: 70, filename: "Resume_v1_Draft.pdf", uploaded_at: new Date(Date.now() - 172800000).toISOString(), is_optimized: false }
            ]
        }), 1000));
    }

    const response = await api.get(`/resume-versions/${resumeId}`);
    return response.data;
};

export const compareVersions = async (resumeId, version1, version2) => {
    // Demo Mode Mock
    if (resumeId && typeof resumeId === 'string' && resumeId.startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({
            comparison: {
                score_change: {
                    previous: 85,
                    current: 92,
                    delta: 7,
                    trend: "improved"
                },
                key_changes: [
                    {
                        section: "Certifications",
                        description: "Added AWS Solution Architect Associate certification.",
                        impact: "positive",
                        change_type: "addition"
                    },
                    {
                        section: "Experience",
                        description: "Rewrote Project Manager role description with metrics.",
                        impact: "positive",
                        change_type: "modification"
                    },
                    {
                        section: "Formatting",
                        description: "Fixed inconsistent date formats.",
                        impact: "neutral",
                        change_type: "fix"
                    }
                ],
                recommendation: "Great improvement! The addition of certifications and metrics boosted your score significantly. Consider optimizing the Skills section next."
            }
        }), 1500));
    }

    const response = await api.post('/compare-versions', {
        resume_id: resumeId,
        version1: version1,
        version2: version2
    });
    return response.data;
};

// Feature 5: Quality Check
export const checkResumeQuality = async (resumeId) => {
    // Demo Mode Mock
    if (resumeId && typeof resumeId === 'string' && resumeId.startsWith('demo-')) {
        return new Promise(resolve => setTimeout(() => resolve({
            confidence_score: 88,
            authenticity_score: 95,
            issues: [
                { type: "weak_language", severity: "low", location: "Experience Section", example: "Responsible for managing...", issue: "Passive voice usage" },
                { type: "repetition", severity: "low", location: "Summary", example: "Passionate about... Passionate regarding...", issue: "Repetitive phrasing" }
            ],
            suggestions: [
                { issue_type: "weak_language", current: "Responsible for managing", suggested: "Managed / Orchardstrated", reason: "Use strong action verbs." },
                { issue_type: "formatting", current: "Inconsistent bullets", suggested: "Standardize bullet points", reason: " improves readability." }
            ],
            risk_level: "low",
            overall_assessment: "Your resume appears authentic and confident. Minor stylistic polish needed."
        }), 1500));
    }

    const response = await api.post('/resume-quality-check', {
        resume_id: resumeId
    });
    return response.data;
};
