import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/aiService.js';
import { getDatabase } from '../db/firebase.js';

const router = express.Router();

// POST /api/optimize-resume
router.post('/optimize-resume', async (req, res) => {
  try {
    const { resume_id, job_description, company_name = '' } = req.body;
    if (!resume_id || !job_description) {
      return res.status(400).json({ detail: 'resume_id and job_description are required' });
    }

    const db = getDatabase();
    const resume = await db.collection('resumes').findOne({ id: resume_id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const optimizationResult = await aiService.optimizeResume(
      resume.content_text,
      job_description,
      company_name
    );

    const versionNumber = (resume.version || 1) + 1;
    const optimizedResumeId = uuidv4();

    const optimizedResumeData = {
      id: optimizedResumeId,
      user_id: resume.user_id,
      filename: `${resume.filename}_optimized_v${versionNumber}`,
      content_text: resume.content_text,
      optimized_content: optimizationResult,
      uploaded_at: new Date().toISOString(),
      version: versionNumber,
      parent_resume_id: resume_id,
      optimization_metadata: {
        job_description,
        company_name,
        optimized_at: new Date().toISOString(),
      },
    };

    await db.collection('resumes').insertOne(optimizedResumeData);

    return res.json({
      ...optimizationResult,
      optimized_resume_id: optimizedResumeId,
      version: versionNumber,
    });
  } catch (err) {
    console.error('Optimization Error:', err);
    return res.status(500).json({ detail: `Failed to optimize resume: ${err.message}` });
  }
});

// POST /api/interview-questions
router.post('/interview-questions', async (req, res) => {
  try {
    const { resume_id, job_description } = req.body;
    if (!resume_id || !job_description) {
      return res.status(400).json({ detail: 'resume_id and job_description are required' });
    }

    const db = getDatabase();
    const resume = await db.collection('resumes').findOne({ id: resume_id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const missingSkills = resume.last_analysis?.missing_skills || [];

    const questions = await aiService.generateInterviewQuestions(
      resume.content_text,
      job_description,
      missingSkills
    );

    await db.collection('resumes').updateOne(
      { id: resume_id },
      {
        $set: {
          interview_prep: questions,
          interview_prep_generated_at: new Date().toISOString(),
        },
      }
    );

    return res.json(questions);
  } catch (err) {
    console.error('Interview Questions Error:', err);
    return res.status(500).json({ detail: `Failed to generate questions: ${err.message}` });
  }
});

// POST /api/explain-score
router.post('/explain-score', async (req, res) => {
  try {
    const { resume_id, job_description } = req.body;
    if (!resume_id) {
      return res.status(400).json({ detail: 'resume_id is required' });
    }

    const db = getDatabase();
    const resume = await db.collection('resumes').findOne({ id: resume_id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const analysis = resume.last_analysis || {};
    const atsScore = analysis.ats_score || resume.ats_score || 70;
    const matchedSkills = analysis.matched_skills || [];
    const missingSkills = analysis.missing_skills || [];

    const explanation = await aiService.explainScore(
      resume.content_text,
      job_description || '',
      atsScore,
      matchedSkills,
      missingSkills
    );

    await db.collection('resumes').updateOne(
      { id: resume_id },
      {
        $set: {
          score_explanation: explanation,
          explanation_generated_at: new Date().toISOString(),
        },
      }
    );

    return res.json(explanation);
  } catch (err) {
    console.error('Explain Score Error:', err);
    return res.status(500).json({ detail: `Failed to explain score: ${err.message}` });
  }
});

// GET /api/resume-versions/:resumeId
router.get('/resume-versions/:resumeId', async (req, res) => {
  try {
    const { resumeId } = req.params;
    const db = getDatabase();

    const original = await db.collection('resumes').findOne({ id: resumeId });
    if (!original) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const cursor = db.collection('resumes').find({
      $or: [{ id: resumeId }, { parent_resume_id: resumeId }],
    });

    const versions = await (cursor.sort ? cursor.sort('version', 1).toList(100) : cursor.toList(100));

    const versionHistory = versions.map((v) => ({
      id: v.id,
      version: v.version || 1,
      filename: v.filename,
      uploaded_at: v.uploaded_at,
      ats_score: v.ats_score,
      is_optimized: Boolean(v.optimized_content),
      optimization_metadata: v.optimization_metadata,
    }));

    return res.json({
      resume_id: resumeId,
      total_versions: versionHistory.length,
      versions: versionHistory,
    });
  } catch (err) {
    console.error('Version History Error:', err);
    return res.status(500).json({ detail: `Failed to get versions: ${err.message}` });
  }
});

// POST /api/compare-versions
router.post('/compare-versions', async (req, res) => {
  try {
    const { resume_id, version1, version2 } = req.body;
    if (!resume_id) {
      return res.status(400).json({ detail: 'resume_id is required' });
    }

    const db = getDatabase();
    const cursor = db.collection('resumes').find({
      $or: [{ id: resume_id }, { parent_resume_id: resume_id }],
    });

    const versions = await (cursor.sort ? cursor.sort('version', 1).toList(100) : cursor.toList(100));
    if (versions.length < 2) {
      return res.status(400).json({ detail: 'Not enough versions to compare' });
    }

    const v1 = versions.find((v) => (v.version || 1) === version1);
    const v2 = versions.find((v) => (v.version || 1) === version2);

    if (!v1 || !v2) {
      return res.status(404).json({ detail: 'One or both versions not found' });
    }

    const comparison = await aiService.compareResumeVersions(
      v1.content_text,
      v2.content_text,
      v1.ats_score || 70,
      v2.ats_score || 85
    );

    return res.json({
      version1: { id: v1.id, version: v1.version || 1, score: v1.ats_score || 0 },
      version2: { id: v2.id, version: v2.version || 1, score: v2.ats_score || 0 },
      comparison,
    });
  } catch (err) {
    console.error('Version Comparison Error:', err);
    return res.status(500).json({ detail: `Failed to compare versions: ${err.message}` });
  }
});

// POST /api/resume-quality-check & /api/quality-check
const handleQualityCheck = async (req, res) => {
  try {
    const { resume_id } = req.body;
    if (!resume_id) {
      return res.status(400).json({ detail: 'resume_id is required' });
    }

    const db = getDatabase();
    const resume = await db.collection('resumes').findOne({ id: resume_id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const qualityReport = await aiService.checkResumeQuality(resume.content_text);

    await db.collection('resumes').updateOne(
      { id: resume_id },
      {
        $set: {
          quality_check: qualityReport,
          quality_checked_at: new Date().toISOString(),
        },
      }
    );

    return res.json(qualityReport);
  } catch (err) {
    console.error('Quality Check Error:', err);
    return res.status(500).json({ detail: `Failed to check quality: ${err.message}` });
  }
};

router.post('/resume-quality-check', handleQualityCheck);
router.post('/quality-check', handleQualityCheck);

export default router;
