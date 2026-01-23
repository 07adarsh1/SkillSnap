// Mock data for development and testing

export const mockResumeData = {
    ats_score: 85,
    matched_skills: ["React", "Python", "AWS", "Docker", "FastAPI", "MongoDB"],
    missing_skills: ["Kubernetes", "GraphQL", "TypeScript"],
    experience_match: "Strong",
    ai_suggestions: [
        "Add quantifiable metrics to your project descriptions (e.g., 'Improved performance by 40%')",
        "Include specific AWS services used in your cloud projects (Lambda, S3, EC2)",
        "Add a 'Certifications' section to showcase your AWS or React credentials",
        "Use more action verbs at the beginning of bullet points (Led, Developed, Implemented)"
    ]
};

export const mockJobMatches = [
    {
        id: 1,
        title: "Senior Full Stack Engineer",
        company: "TechFlow Solutions",
        location: "San Francisco, CA (Remote)",
        type: "Full-time",
        salary: "$140k - $180k",
        match_score: 94,
        skills_matched: ["React", "Python", "AWS", "Docker", "FastAPI"],
        skills_missing: ["GraphQL"],
        description: "We are looking for a senior engineer to lead our core platform team...",
        logo_color: "blue"
    },
    {
        id: 2,
        title: "Backend Developer",
        company: "DataStream Inc.",
        location: "New York, NY (Hybrid)",
        type: "Full-time",
        salary: "$130k - $160k",
        match_score: 82,
        skills_matched: ["Python", "Docker", "PostgreSQL"],
        skills_missing: ["Kubernetes", "Redis"],
        description: "Join our data team to build high-scale pipelines...",
        logo_color: "green"
    }
];

export const mockATSSections = [
    { name: 'Contact Information', score: 95, status: 'excellent', feedback: 'All required contact details present and properly formatted' },
    { name: 'Professional Summary', score: 85, status: 'good', feedback: 'Strong summary with relevant keywords' },
    { name: 'Work Experience', score: 70, status: 'moderate', feedback: 'Add more quantifiable achievements and action verbs' },
    { name: 'Education', score: 90, status: 'excellent', feedback: 'Education section is well-structured' },
    { name: 'Skills', score: 60, status: 'needs-work', feedback: 'Missing several key technical skills for target role' },
    { name: 'Projects', score: 75, status: 'good', feedback: 'Good project descriptions, add more technical details' },
    { name: 'Certifications', score: 40, status: 'critical', feedback: 'Consider adding relevant certifications' },
    { name: 'Keywords Density', score: 65, status: 'moderate', feedback: 'Increase industry-specific keywords by 20%' },
];

export const mockScoreTrend = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 72 },
    { name: 'Wed', score: 68 },
    { name: 'Thu', score: 85 },
    { name: 'Fri', score: 82 },
    { name: 'Sat', score: 90 },
    { name: 'Sun', score: 88 },
];

export const mockCareerRoadmap = [
    {
        phase: 'Phase 1: Foundation',
        duration: '2-3 months',
        skills: ['TypeScript', 'Advanced React Patterns', 'State Management (Redux/Zustand)'],
        resources: ['Official TypeScript Docs', 'React Advanced Patterns Course', 'Redux Toolkit Tutorial'],
        milestone: 'Build a complex dashboard application'
    },
    {
        phase: 'Phase 2: Backend & APIs',
        duration: '2-3 months',
        skills: ['Node.js/Express', 'RESTful APIs', 'Database Design (PostgreSQL)'],
        resources: ['Node.js Complete Guide', 'API Design Best Practices', 'PostgreSQL Mastery'],
        milestone: 'Create a full-stack CRUD application'
    },
    {
        phase: 'Phase 3: DevOps & Deployment',
        duration: '1-2 months',
        skills: ['Docker', 'CI/CD (GitHub Actions)', 'AWS/Cloud Deployment'],
        resources: ['Docker for Developers', 'GitHub Actions Tutorial', 'AWS Fundamentals'],
        milestone: 'Deploy application to production with CI/CD'
    },
    {
        phase: 'Phase 4: System Design & Scale',
        duration: '2-3 months',
        skills: ['System Design', 'Microservices', 'Performance Optimization'],
        resources: ['System Design Interview Prep', 'Microservices Patterns', 'Web Performance Guide'],
        milestone: 'Design and document a scalable system architecture'
    }
];
