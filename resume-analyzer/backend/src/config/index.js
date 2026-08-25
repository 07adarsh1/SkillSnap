import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PROJECT_NAME: 'AI Resume Analyzer',
  VERSION: '1.0.0',
  PORT: process.env.PORT || 8000,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'ai-resume-400b1',
  FIREBASE_CREDENTIALS_PATH: process.env.FIREBASE_CREDENTIALS_PATH || '',
  FIREBASE_CREDENTIALS_JSON: process.env.FIREBASE_CREDENTIALS_JSON || '',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
  EMBEDDING_MODEL: 'Xenova/all-MiniLM-L6-v2',
};
