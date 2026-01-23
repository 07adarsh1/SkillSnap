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
- **Backend**: Python FastAPI, Motor (Async MongoDB).
- **AI/ML**: Spacy, Sentence-Transformers, OpenAI (Optional).
- **Database**: MongoDB.

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
- MongoDB (Running locally on default port 27017)

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
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=resume_analyzer_db
OPENAI_API_KEY=sk-...
```

## 🧪 Usage Flow

1. **Upload Resume**: Drag and drop your PDF/DOCX resume.
2. **Job Description**: Paste the JD of the role you are applying for.
3. **Analyze**: Click "Analyze Match".
4. **View Results**: See your ATS Score, matched skills, missing skills, and detailed AI feedback.
