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
