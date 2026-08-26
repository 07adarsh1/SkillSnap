import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { parseResume } from '../services/parser.js';
import { nlpEngine } from '../services/nlpEngine.js';
import { aiService } from '../services/aiService.js';
import { getDatabase } from '../db/firebase.js';
import { requireAuth } from '../middleware/auth.js';

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

/**
 * POST /api/ats/guest-scan
 * Public endpoint: Runs ATS analysis without login, stores temporary guest scan,
 * and returns a high-level preview.
 */
router.post('/guest-scan', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'No resume file uploaded' });
    }

    const jobDescription = req.body.job_description || '';
    const textContent = await parseResume(req.file);

    if (!textContent || !textContent.trim()) {
      return res.status(400).json({ detail: 'Unable to extract text from resume file' });
    }

    // Run deterministic NLP analysis
    const nlpResult = await nlpEngine.analyzeResumeVsJob(textContent, jobDescription);

    // AI enhancement
    let groqResult = {};
    try {
      groqResult = await aiService.analyzeResume(textContent, jobDescription);
    } catch (err) {
      console.warn('Groq AI enhancement failed in guest scan, using NLP fallback:', err.message);
    }

    const rawStrengths = groqResult.strengths?.length
      ? groqResult.strengths
      : buildFallbackStrengths(nlpResult, nlpResult.resume_skills, jobDescription);
    const strengths = normalizePoints(rawStrengths, 4);

    const rawTips = groqResult.improvement_tips?.length
      ? groqResult.improvement_tips
      : nlpResult.ai_suggestions;
    const suggestions = normalizePoints(rawTips, 4);

    const analysisPayload = {
      id: uuidv4(),
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

    const scanId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24-hour expiration

    const guestScanRecord = {
      id: scanId,
      scanId,
      userId: null,
      status: 'guest',
      filename: req.file.originalname,
      resume_text: textContent,
      job_description: jobDescription,
      analysis_result: analysisPayload,
      created_at: new Date().toISOString(),
      expires_at: expiresAt,
    };

    const db = getDatabase();
    await db.collection('guest_scans').insertOne(guestScanRecord);

    // Calculate preview summary
    const totalSkills = (analysisPayload.matched_skills?.length || 0) + (analysisPayload.missing_skills?.length || 0);
    const keywordMatch = totalSkills > 0
      ? Math.round(((analysisPayload.matched_skills?.length || 0) / totalSkills) * 100)
      : (analysisPayload.semantic_similarity ? Math.round(analysisPayload.semantic_similarity * 100) : Math.round(analysisPayload.ats_score * 0.9));

    const issues = [];
    if (analysisPayload.missing_skills?.length > 0) {
      issues.push(`Missing key keywords: ${analysisPayload.missing_skills.slice(0, 3).join(', ')}`);
    }
    if (suggestions.length > 0) {
      suggestions.slice(0, 2).forEach((s) => issues.push(s));
    }
    if (issues.length === 0) {
      issues.push('Resume formatting and section structure can be optimized for higher parsing confidence.');
    }

    return res.json({
      scanId,
      preview: {
        score: analysisPayload.ats_score,
        keywordMatch,
        issues: issues.slice(0, 3),
      },
    });
  } catch (err) {
    console.error('Guest Scan Error:', err);
    return res.status(500).json({ detail: `Failed to process guest scan: ${err.message}` });
  }
});

/**
 * POST /api/ats/claim-scan
 * Protected endpoint: Authenticated user claims a previous guest scan.
 * User ID is strictly derived from verified JWT (req.user.uid).
 */
router.post('/claim-scan', requireAuth, async (req, res) => {
  try {
    const { scanId } = req.body;
    if (!scanId) {
      return res.status(400).json({ detail: 'scanId is required in request body' });
    }

    const authenticatedUserId = req.user.uid;
    const db = getDatabase();

    // Query scan in guest_scans
    const scan =
      (await db.collection('guest_scans').findOne({ id: scanId })) ||
      (await db.collection('guest_scans').findOne({ scanId: scanId }));

    if (!scan) {
      // Check if it was already claimed and saved as a resume
      const existingResume = await db.collection('resumes').findOne({
        claimed_from_scan_id: scanId,
        user_id: authenticatedUserId,
      });

      if (existingResume) {
        return res.json({
          success: true,
          scanId,
          resumeId: existingResume.id,
          alreadyClaimed: true,
        });
      }

      return res.status(404).json({ detail: 'Scan record not found' });
    }

    // Check expiration
    if (scan.expires_at && new Date(scan.expires_at) < new Date()) {
      return res.status(410).json({
        detail: 'Your free scan has expired. Please run a new scan.',
        expired: true,
      });
    }

    // Check existing claim ownership
    if (scan.userId && scan.userId !== authenticatedUserId) {
      return res.status(403).json({
        detail: 'This scan has already been claimed by another user.',
      });
    }

    // Idempotent success if already claimed by this user
    if (scan.userId === authenticatedUserId && scan.status === 'claimed') {
      return res.json({
        success: true,
        scanId,
        resumeId: scan.resumeId || scan.id,
        alreadyClaimed: true,
      });
    }

    // Unclaimed scan: migrate to authenticated user's permanent profile
    const resumeId = uuidv4();
    const resumeDoc = {
      id: resumeId,
      user_id: authenticatedUserId,
      filename: scan.filename || 'Uploaded Resume.pdf',
      content_text: scan.resume_text,
      job_description: scan.job_description || '',
      analysis_result: scan.analysis_result,
      last_analysis: scan.analysis_result,
      ats_score: scan.analysis_result?.ats_score || 0,
      uploaded_at: new Date().toISOString(),
      version: 1,
      claimed_from_scan_id: scan.scanId || scan.id,
    };

    await db.collection('resumes').insertOne(resumeDoc);
    await db.collection('analyses').insertOne({
      ...scan.analysis_result,
      resume_id: resumeId,
      user_id: authenticatedUserId,
    });

    await db.collection('guest_scans').updateOne(
      { id: scan.id },
      {
        $set: {
          userId: authenticatedUserId,
          status: 'claimed',
          resumeId,
          claimed_at: new Date().toISOString(),
        },
      }
    );

    return res.json({
      success: true,
      scanId: scan.scanId || scan.id,
      resumeId,
    });
  } catch (err) {
    console.error('Claim Scan Error:', err);
    return res.status(500).json({ detail: `Failed to claim scan: ${err.message}` });
  }
});

/**
 * GET /api/ats/scans/:scanId
 * Protected endpoint: Retrieves the full analysis report for a claimed scan.
 * Verifies that the authenticated user owns the scan.
 */
router.get('/scans/:scanId', requireAuth, async (req, res) => {
  try {
    const { scanId } = req.params;
    const authenticatedUserId = req.user.uid;
    const db = getDatabase();

    const scan =
      (await db.collection('guest_scans').findOne({ id: scanId })) ||
      (await db.collection('guest_scans').findOne({ scanId: scanId }));

    if (scan) {
      if (scan.userId !== authenticatedUserId) {
        return res.status(403).json({ detail: 'Access denied: You do not own this scan.' });
      }

      return res.json({
        scanId: scan.scanId || scan.id,
        status: scan.status,
        filename: scan.filename,
        job_description: scan.job_description,
        analysis_result: scan.analysis_result,
        resume_id: scan.resumeId,
      });
    }

    // Fallback: check resumes collection by claimed_from_scan_id or id
    const resume =
      (await db.collection('resumes').findOne({ claimed_from_scan_id: scanId, user_id: authenticatedUserId })) ||
      (await db.collection('resumes').findOne({ id: scanId, user_id: authenticatedUserId }));

    if (resume) {
      return res.json({
        scanId,
        status: 'claimed',
        filename: resume.filename,
        job_description: resume.job_description,
        analysis_result: resume.analysis_result || resume.last_analysis,
        resume_id: resume.id,
      });
    }

    return res.status(404).json({ detail: 'Scan report not found.' });
  } catch (err) {
    console.error('Fetch Full Scan Error:', err);
    return res.status(500).json({ detail: `Failed to fetch full scan: ${err.message}` });
  }
});

export default router;
