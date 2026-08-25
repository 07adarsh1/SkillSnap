import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parseResume } from '../services/parser.js';
import { nlpEngine } from '../services/nlpEngine.js';
import { aiService } from '../services/aiService.js';
import { getDatabase } from '../db/firebase.js';

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

function normalizePoints(items, limit = 4) {
  const normalized = [];
  const seen = new Set();

  for (const raw of items || []) {
    let text = String(raw || '').trim();
    if (!text) continue;

    if (text.length > 140) {
      text = `${text.slice(0, 137).trim()}...`;
    }

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    normalized.push(text);
    if (normalized.length >= limit) break;
  }

  return normalized;
}

function buildFallbackStrengths(result, resumeSkills, jobDescription) {
  const strengths = [];

  if (resumeSkills && resumeSkills.length > 0) {
    const topSkills = resumeSkills.slice(0, 3).join(', ');
    strengths.push(`Resume highlights relevant skills: ${topSkills}.`);
  }

  if (result.matched_skills && result.matched_skills.length > 0) {
    strengths.push(`Matched ${result.matched_skills.length} role-aligned skills from the JD.`);
  }

  if (result.score_breakdown) {
    const sectionScore = result.score_breakdown.section_coverage?.score || 0;
    if (sectionScore >= 10) {
      strengths.push('Resume structure includes multiple ATS-friendly sections.');
    }
  }

  if (!jobDescription || !jobDescription.trim()) {
    strengths.push('Resume is indexed and ready for JD comparison once a job description is added.');
  }

  if (result.ats_score >= 80) {
    strengths.push('Strong overall ATS readiness based on strict rubric scoring.');
  } else if (result.ats_score >= 65) {
    strengths.push('Moderate ATS readiness with clear room for targeted improvement.');
  } else {
    strengths.push('Resume needs targeted alignment to pass competitive ATS filters.');
  }

  return normalizePoints(strengths, 4);
}

// POST /api/upload-resume
router.post('/upload-resume', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }

    const userId = req.body.user_id || 'anonymous';
    const textContent = await parseResume(req.file);

    if (!textContent || !textContent.trim()) {
      return res.status(400).json({ detail: 'Unable to extract text from resume file' });
    }

    const db = getDatabase();
    const resumeId = uuidv4();
    const resumeDoc = {
      id: resumeId,
      user_id: userId,
      filename: req.file.originalname,
      content_text: textContent,
      uploaded_at: new Date().toISOString(),
      version: 1,
    };

    await db.collection('resumes').insertOne(resumeDoc);

    return res.json({
      message: 'Resume uploaded successfully',
      resume_id: resumeId,
      filename: req.file.originalname,
      text_preview: textContent.slice(0, 300),
    });
  } catch (err) {
    console.error('Upload Error:', err);
    return res.status(500).json({ detail: `Failed to process resume: ${err.message}` });
  }
});

// POST /api/analyze-resume
router.post('/analyze-resume', async (req, res) => {
  try {
    const { resume_id, job_description = '' } = req.body;

    if (!resume_id) {
      return res.status(400).json({ detail: 'resume_id is required' });
    }

    const db = getDatabase();
    const resume = await db.collection('resumes').findOne({ id: resume_id });

    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const resumeText = resume.content_text || '';

    // Compute deterministic NLP & Transformer Embedding Cosine Similarity
    const nlpResult = await nlpEngine.analyzeResumeVsJob(resumeText, job_description);

    let groqResult = {};
    try {
      groqResult = await aiService.analyzeResume(resumeText, job_description);
    } catch (err) {
      console.warn('Groq AI enhancement failed, using NLP result:', err.message);
    }

    const rawStrengths = groqResult.strengths?.length
      ? groqResult.strengths
      : buildFallbackStrengths(nlpResult, nlpResult.resume_skills, job_description);
    const strengths = normalizePoints(rawStrengths, 4);

    const rawTips = groqResult.improvement_tips?.length
      ? groqResult.improvement_tips
      : nlpResult.ai_suggestions;
    const suggestions = normalizePoints(rawTips, 4);

    const analysisPayload = {
      id: uuidv4(),
      resume_id,
      ats_score: nlpResult.ats_score,
      semantic_similarity: nlpResult.semantic_similarity,
      resume_skills: nlpResult.resume_skills,
      matched_skills: nlpResult.matched_skills,
      missing_skills: nlpResult.missing_skills,
      experience_match: groqResult.experience_match || nlpResult.experience_match,
      ai_suggestions: suggestions,
      strengths,
      score_breakdown: nlpResult.score_breakdown,
      section_scores: groqResult.section_scores || {
        education: Math.round(nlpResult.ats_score * 0.9),
        experience: Math.round(nlpResult.ats_score),
        projects: Math.round(nlpResult.ats_score * 0.95),
        skills: Math.round(nlpResult.ats_score * 1.05),
      },
      category: groqResult.resume_category || 'Experienced',
      created_at: new Date().toISOString(),
    };

    // Save analysis record and update resume
    await db.collection('analyses').insertOne(analysisPayload);
    await db.collection('resumes').updateOne(
      { id: resume_id },
      {
        $set: {
          analysis_result: analysisPayload,
          last_analysis: analysisPayload,
          ats_score: nlpResult.ats_score,
          updated_at: new Date().toISOString(),
        },
      }
    );

    return res.json(analysisPayload);
  } catch (err) {
    console.error('Analysis Error:', err);
    return res.status(500).json({ detail: `Failed to analyze resume: ${err.message}` });
  }
});

// GET /api/resumes/:userId
router.get('/resumes/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDatabase();

    const cursor = db.collection('resumes').find({ user_id: userId });
    const resumes = await (cursor.sort ? cursor.sort('uploaded_at', -1).toList(50) : cursor.toList(50));

    const formatted = (resumes || []).map((r) => ({
      ...r,
      analysis_result: r.analysis_result || r.last_analysis || null,
    }));

    return res.json(formatted);
  } catch (err) {
    console.error('History Fetch Error:', err);
    return res.status(500).json({ detail: `Failed to fetch history: ${err.message}` });
  }
});

// DELETE /api/resumes/:resumeId
router.delete('/resumes/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const db = getDatabase();

    const result = await db.collection('resumes').deleteOne({ id: resumeId });
    await db.collection('analyses').deleteOne({ resume_id: resumeId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    return res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    return res.status(500).json({ detail: `Failed to delete resume: ${err.message}` });
  }
});

export default router;
