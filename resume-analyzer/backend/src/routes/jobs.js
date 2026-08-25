import express from 'express';
import { jobsService } from '../services/jobsService.js';

const router = express.Router();

// GET /api/jobs - Get real cached jobs with search, category, and personalized resume match scoring
router.get('/', async (req, res) => {
  try {
    const { search, category, resumeId, limit } = req.query;

    const data = await jobsService.getJobs({
      search: search || '',
      category: category || '',
      resumeId: resumeId || '',
      limit: limit || 50,
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ detail: 'Failed to fetch jobs' });
  }
});

// POST /api/jobs/sync - Trigger manual refresh from Remotive
router.post('/sync', async (req, res) => {
  try {
    const jobs = await jobsService.syncJobsFromRemotive();
    res.json({
      message: 'Successfully refreshed jobs cache from Remotive',
      total_cached: jobs.length,
      synced_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error syncing jobs:', error);
    res.status(500).json({ detail: 'Failed to sync jobs from external source' });
  }
});

export default router;
