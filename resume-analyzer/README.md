# ⚡ SkillSnap – Intelligent AI Resume Analyzer & Career Intelligence Platform

SkillSnap is a production-grade full-stack web application designed to parse resumes (PDF/DOCX), compute sub-second dense vector embeddings for semantic job matching, calculate rigorous ATS compatibility scores, and deliver autonomous LLM career optimization tools.

---

## 🌟 Key Features

- **Multi-Format Document Parsing:** Ingests PDF and DOCX files (`pdf-parse` & `mammoth`) with robust regex tokenization and heuristics.
- **Dense Vector Semantic Matching:** Uses `@xenova/transformers` (`all-MiniLM-L6-v2`) to produce 384-dimensional sentence embeddings for real-time **Cosine Similarity** between candidate profiles and Job Descriptions.
- **Dynamic Job Description Matching:** Optional JD input with instant on-the-fly re-scoring and skill-gap attribution directly from the dashboard.
- **Comprehensive ATS Scoring Engine:** Evaluates skill match, section formatting, action-verb density, quantifiable metrics, and penalizes formatting flaws.
- **AI-Powered Resume Optimizer (STAR Method):** Rewrites resume bullet points using the Situation, Task, Action, Result framework with Groq Cloud LLMs.
- **AI Interview Prep Generator:** Dynamically generates role-specific Technical, Behavioral, and Situational interview questions with STAR sample answers.
- **Explainable AI (XAI) Attribution:** Transparent breakdown of positive score drivers and actionable penalty mitigation steps.
- **Resume Version Control & Timeline:** Tracks ATS score evolution across sequential upload iterations with snapshot diffs.
- **Interactive "What-If" Simulator:** Real-time sandbox allowing candidates to test how adding certifications, skills, or metrics elevates their ATS score.
- **AI Career Path Generator:** Personalized step-by-step milestone roadmaps based on target aspirational roles.
- **Premium Light UI/UX:** Built with React 19, Tailwind CSS v4, Framer Motion, and Recharts.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide Icons |
| **Backend** | Node.js (ES Modules), Express.js, Multer |
| **NLP & AI Engine** | Transformers.js (`Xenova/all-MiniLM-L6-v2`), Groq Cloud SDK (`openai/gpt-oss-120b` / `llama-3.3-70b-versatile`) |
| **Database & Auth** | Firebase Firestore, Firebase Authentication (Google OAuth & Email/Password), Firebase Admin SDK |
| **Document Parsers** | `pdf-parse`, `mammoth` (DOCX) |

---

## 📂 Project Structure

```
resume-analyzer/
├── backend/
│   ├── src/
│   │   ├── config/             # Firebase & Environment configurations
│   │   ├── routes/             # Express API routes (resume, AI, advanced)
│   │   ├── services/           # Embeddings, NLP Engine, Parser, Groq AI
│   │   ├── utils/              # Hard/Soft skills dictionary & heuristics
│   │   └── server.js           # Server entry point
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/                 # Static assets & SVG brand logos
│   ├── src/
│   │   ├── components/         # Modals, LandingPage, ResultsDashboard, UploadSection
│   │   │   ├── dashboard/      # Overview, JobMatcher, Optimizer, InterviewPrep, etc.
│   │   │   ├── layout/         # DashboardLayout, Sidebar
│   │   │   └── ui/             # BrandLogo, Card, Badge, Button, Auth
│   │   ├── services/           # Axios API layer & Firebase Client SDK
│   │   ├── App.jsx             # Main Application Routing
│   │   └── index.css           # Design tokens & Light Theme styling
│   ├── package.json
│   └── vercel.json
├── render.yaml                 # Infrastructure as Code for Render deployment
└── README.md
```

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v9.x or higher
- **Firebase Project**: Firestore & Authentication enabled
- **Groq API Key**: (Free at [console.groq.com](https://console.groq.com))

---

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
# (Populate with your Firebase & Groq credentials)
cp .env.example .env

# Run development server
npm run dev
# or production start
npm start
```
*Backend runs on `http://localhost:8000`.*  
*Health Check: `http://localhost:8000/health`*

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🔑 Environment Variables

### `backend/.env`
```env
PORT=8000
NODE_ENV=development

# Groq Cloud
GROQ_API_KEY=gsk_...
GROQ_MODEL=openai/gpt-oss-120b

# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CREDENTIALS_JSON={"type":"service_account",...}
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:8000/api

# Firebase Client
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...
```

---

## ☁️ Deployment Guide

### Deploying on Render (Backend & Fullstack)
1. Push your repository to GitHub.
2. In Render, select **New Blueprint** and link your repository (`render.yaml` will auto-configure services).
3. Under Environment Variables for `resume-analyzer-api`:
   - Set `NODE_VERSION` to `20.18.0`
   - Add `GROQ_API_KEY` and `FIREBASE_CREDENTIALS_JSON`

### Deploying Frontend on Vercel
1. Import the repository into **Vercel**.
2. Set Root Directory to `frontend`.
3. Add Environment Variable:
   - `VITE_API_URL` = `https://<YOUR-RENDER-BACKEND-URL>/api`
4. Click **Deploy**.

---

## 📄 License
MIT License. Built for developers and job seekers looking to optimize their career trajectory with transparent AI intelligence.
