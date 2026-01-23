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
