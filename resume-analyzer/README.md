# 🧠 AI Powered Resume Analyzer & Job Matcher

A production-ready full-stack application that parses resumes (PDF/DOCX), extracts skills using NLP, calculates matches against job descriptions using Semantic Embeddings, and provides AI-driven feedback.

## 🚀 Features

- **Resume Parsing**: Robust extraction from PDF and DOCX files.
- **AI Skill Extraction**: Uses Spacy and Keyword matching to identify technical and soft skills.
- **Smart Matching**: Uses `Sentence-Transformers` (SBERT) for semantic similarity scoring (Resume vs Job Description).
- **ATS Scoring**: Weighted scoring system (Skills + Content Similarity).
- **AI Feedback**: Generates actionable improvement suggestions (Mocked or OpenAI integrated).
- **Modern UI**: Polished React interface with Tailwind CSS, Framer Motion, and Recharts.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts.
- **Backend**: Python FastAPI, Firebase Admin SDK.
- **AI/ML**: Spacy, Sentence-Transformers, OpenAI (Optional).
- **Database**: Firebase Firestore.

## 📂 Project Structure

```
resume-analyzer/
├── backend/            # FastAPI Application
│   ├── main.py        # Entry Point
│   ├── routes/        # API Endpoints
│   ├── services/      # Business Logic (NLP, Parsing)
│   ├── models/        # Pydantic Schemas
│   └── core/          # Config
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   └── tailwind.config.js
└── README.md
```

## ⚡ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- Firebase project with Firestore enabled

### 1. Backend Setup

```bash
cd backend

# Create virtual environment (Optional but Recommended)
# Windows:
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Download Spacy Model
python -m spacy download en_core_web_sm

# Run Server
# IMPORTANT: Run from inside the backend directory
uvicorn main:app --reload
```
Backend will run at `http://localhost:8000`. API Docs at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install Dependencies (if not already installed)
npm install

# Run Frontend
npm run dev
```
Frontend will run at `http://localhost:5173`.

### 3. Environment Variables

Create a `.env` file in the `backend/` folder if you want to use OpenAI API features:

```env
FIREBASE_PROJECT_ID=ai-resume-400b1
FIREBASE_CREDENTIALS_PATH=/absolute/path/to/service-account.json
FIREBASE_CREDENTIALS_JSON=
OPENAI_API_KEY=sk-...
```

Create a `.env` file in the `frontend/` folder for frontend SDK keys:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=ai-resume-400b1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ai-resume-400b1
VITE_FIREBASE_STORAGE_BUCKET=ai-resume-400b1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=290679156507
VITE_FIREBASE_APP_ID=1:290679156507:web:8ed6e44a15e47f252c2dbe
```

## 🧪 Usage Flow

1. **Upload Resume**: Drag and drop your PDF/DOCX resume.
2. **Job Description**: Paste the JD of the role you are applying for.
3. **Analyze**: Click "Analyze Match".
4. **View Results**: See your ATS Score, matched skills, missing skills, and detailed AI feedback.

## ☁️ Deploy On Render

This repo now includes a top-level [render.yaml](render.yaml) blueprint to deploy both backend and frontend.

### 1. Push repository to GitHub

Render blueprints are pulled from your Git repository, so make sure latest changes are pushed.

### 2. Create Blueprint in Render

1. Open Render Dashboard.
2. Click **New** → **Blueprint**.
3. Connect your GitHub repo and select this project.
4. Render will detect [render.yaml](render.yaml) and propose two services:
	- `resume-analyzer-api` (FastAPI backend)
	- `resume-analyzer-frontend` (static Vite frontend)

### 3. Set required environment variables

Set these in the Render dashboard for the backend service:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CREDENTIALS_JSON` (recommended for cloud deploy)
- `GROQ_API_KEY` (required for AI-powered Groq routes)

Optional:

- `GROQ_MODEL`

### 4. Update frontend API URL after first backend deploy

By default, [render.yaml](render.yaml) points `VITE_API_URL` to:

`https://resume-analyzer-api.onrender.com/api`

If your backend gets a different Render URL, update `VITE_API_URL` in the frontend service env vars and redeploy frontend.

### 5. Notes

- Backend now starts even without `GROQ_API_KEY`; only Groq AI endpoints will return an error until the key is set.
- If Firebase credentials are missing, the app falls back to in-memory mock mode.
