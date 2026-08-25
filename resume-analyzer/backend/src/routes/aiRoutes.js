import express from 'express';
import { aiService } from '../services/aiService.js';
import { getDatabase } from '../db/firebase.js';

const router = express.Router();

// POST /api/ats-heatmap
router.post('/ats-heatmap', async (req, res) => {
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

    const heatmapData = await aiService.analyzeAtsHeatmap(resume.content_text);

    await db.collection('resumes').updateOne(
      { id: resume_id },
      { $set: { ats_heatmap: heatmapData } }
    );

    return res.json(heatmapData);
  } catch (err) {
    console.error('ATS Heatmap Error:', err);
    return res.status(500).json({ detail: `Failed to generate ATS heatmap: ${err.message}` });
  }
});

// POST /api/job-match
router.post('/job-match', async (req, res) => {
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

    const matchData = await aiService.matchJob(resume.content_text, job_description);

    await db.collection('resumes').updateOne(
      { id: resume_id },
      { $set: { last_job_match: matchData } }
    );

    return res.json(matchData);
  } catch (err) {
    console.error('Job Match Error:', err);
    return res.status(500).json({ detail: `Failed to match job: ${err.message}` });
  }
});

// POST /api/simulate-improvement
router.post('/simulate-improvement', async (req, res) => {
  try {
    const { resume_id, added_item, item_type = 'skill', job_description = '' } = req.body;
    if (!resume_id || !added_item) {
      return res.status(400).json({ detail: 'resume_id and added_item are required' });
    }

    const db = getDatabase();
    const resume = await db.collection('resumes').findOne({ id: resume_id });
    if (!resume) {
      return res.status(404).json({ detail: 'Resume not found' });
    }

    const simulationData = await aiService.simulateImprovement(
      resume.content_text,
      added_item,
      item_type,
      job_description
    );

    return res.json(simulationData);
  } catch (err) {
    console.error('Simulate Improvement Error:', err);
    return res.status(500).json({ detail: `Failed to simulate improvement: ${err.message}` });
  }
});

// POST /api/career-path
router.post('/career-path', async (req, res) => {
  try {
    const { current_role, target_role, current_skills = [] } = req.body;
    if (!current_role || !target_role) {
      return res.status(400).json({ detail: 'current_role and target_role are required' });
    }

    const careerPathData = await aiService.generateCareerPath(
      current_role,
      target_role,
      current_skills
    );

    return res.json(careerPathData);
  } catch (err) {
    console.error('Career Path Error:', err);
    return res.status(500).json({ detail: `Failed to generate career path: ${err.message}` });
  }
});

export default router;
