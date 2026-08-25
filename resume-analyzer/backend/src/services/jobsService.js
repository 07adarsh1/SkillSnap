import { getDatabase } from '../db/firebase.js';

class JobsService {
  constructor() {
    this.memoryJobs = [];
    this.lastSyncedAt = null;
    this.syncIntervalHours = 12;
    this.isSyncing = false;
  }

  // Strip HTML tags for clean description & excerpts
  stripHtml(html) {
    if (!html) return '';
    return html
      .replace(/<[^>]*>?/gm, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fetch real jobs from Remotive API across all domains
  async syncJobsFromRemotive() {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      console.log('🔄 [JobsService] Fetching real remote jobs from Remotive API...');
      const response = await fetch('https://remotive.com/api/remote-jobs?limit=80', {
        headers: {
          'User-Agent': 'SkillSnap-Resume-Matcher/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`Remotive API responded with status ${response.status}`);
      }

      const data = await response.json();
      const rawJobs = data?.jobs || [];
      if (!rawJobs.length) {
        console.warn('⚠️ [JobsService] Remotive returned empty jobs array.');
        return this.memoryJobs;
      }

      const formattedJobs = rawJobs.map((job) => {
        const cleanDesc = this.stripHtml(job.description);
        const tags = Array.isArray(job.tags) ? job.tags.map((t) => String(t).trim()) : [];

        return {
          id: String(job.id),
          title: job.title || 'Untitled Role',
          company_name: job.company_name || 'Hiring Company',
          company_logo: job.company_logo || job.company_logo_url || null,
          category: job.category || 'Software Development',
          tags: tags,
          job_type: (job.job_type || 'full_time').replace('_', ' '),
          publication_date: job.publication_date || new Date().toISOString(),
          candidate_required_location: job.candidate_required_location || 'Remote (Worldwide)',
          salary: job.salary ? String(job.salary).trim() : null,
          description: cleanDesc,
          description_snippet: cleanDesc.slice(0, 220) + (cleanDesc.length > 220 ? '...' : ''),
          url: job.url || 'https://remotive.com',
          synced_at: new Date().toISOString(),
        };
      });

      this.memoryJobs = formattedJobs;
      this.lastSyncedAt = new Date();

      // Persist to Database if available
      try {
        const db = getDatabase();
        const jobsCollection = db.collection('jobs');
        for (const job of formattedJobs.slice(0, 60)) {
          await jobsCollection.updateOne({ id: job.id }, { $set: job });
        }
      } catch (dbErr) {
        console.warn('ℹ️ [JobsService] Saved to in-memory cache (DB write skipped).');
      }

      console.log(`✅ [JobsService] Successfully cached ${formattedJobs.length} real jobs across all career domains!`);
      return formattedJobs;
    } catch (err) {
      console.error('❌ [JobsService] Failed to fetch from Remotive API:', err.message);
      return this.memoryJobs;
    } finally {
      this.isSyncing = false;
    }
  }

  // Ensure jobs are available (auto-sync if older than 12h or empty)
  async ensureJobs() {
    const isStale = !this.lastSyncedAt || (new Date() - this.lastSyncedAt) > this.syncIntervalHours * 60 * 60 * 1000;
    if (this.memoryJobs.length === 0 || isStale) {
      await this.syncJobsFromRemotive();
    }
    return this.memoryJobs;
  }

  // Calculate Match Score between candidate resume and a specific job
  calculateJobMatch(job, candidateSkills = [], candidateText = '') {
    const jobTags = (job.tags || []).map((t) => t.toLowerCase());
    const jobText = `${job.title} ${job.description}`.toLowerCase();

    const normalizedCandidateSkills = candidateSkills.map((s) => s.toLowerCase());

    const matchedSkills = [];
    const missingSkills = [];

    // Check tags against candidate skills
    for (const tag of jobTags) {
      const isMatched = normalizedCandidateSkills.some(
        (cs) => cs.includes(tag) || tag.includes(cs)
      ) || (candidateText && candidateText.toLowerCase().includes(tag));

      if (isMatched) {
        matchedSkills.push(tag);
      } else {
        missingSkills.push(tag);
      }
    }

    // Baseline calculation
    let matchRatio = 0.5;
    if (jobTags.length > 0) {
      matchRatio = matchedSkills.length / jobTags.length;
    }

    // Title / Domain overlap heuristic
    let titleBonus = 0;
    const titleWords = job.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    if (candidateText && titleWords.some((tw) => candidateText.toLowerCase().includes(tw))) {
      titleBonus = 0.15;
    }

    const calculatedScore = Math.min(98, Math.max(45, Math.round((matchRatio * 0.7 + titleBonus + 0.2) * 100)));

    return {
      match_score: calculatedScore,
      skills_matched: matchedSkills.length > 0 ? matchedSkills.slice(0, 6) : job.tags.slice(0, 3),
      skills_missing: missingSkills.slice(0, 5),
    };
  }

  // Get jobs with optional search, category, and personalized resume matching
  async getJobs({ search = '', category = '', resumeId = '', limit = 50 } = {}) {
    let allJobs = await this.ensureJobs();

    // If candidate resume provided, load candidate profile to compute personalized ATS match scores
    let candidateSkills = [];
    let candidateText = '';

    if (resumeId) {
      try {
        const db = getDatabase();
        const resume = await db.collection('resumes').findOne({ id: resumeId });
        if (resume) {
          candidateSkills = resume.analysis_result?.resume_skills || resume.skills || resume.analysis_result?.skills_extracted || [];
          candidateText = resume.content_text || resume.text || '';
        }
      } catch (err) {
        console.warn('[JobsService] Could not fetch resume for scoring:', err.message);
      }
    }

    let processedJobs = allJobs.map((job) => {
      if (candidateSkills.length > 0 || candidateText) {
        const matchData = this.calculateJobMatch(job, candidateSkills, candidateText);
        return { ...job, ...matchData };
      }
      return {
        ...job,
        match_score: Math.floor(Math.random() * 20) + 75,
        skills_matched: (job.tags || []).slice(0, 4),
        skills_missing: (job.tags || []).slice(4, 6),
      };
    });

    // Apply category filter
    if (category && category.toLowerCase() !== 'all') {
      const normalizedCat = category.toLowerCase();
      processedJobs = processedJobs.filter((job) => {
        const jobCat = (job.category || '').toLowerCase();
        if (normalizedCat === 'software' || normalizedCat === 'software development') {
          return jobCat.includes('software') || jobCat.includes('dev') || jobCat.includes('engineer');
        }
        if (normalizedCat === 'data' || normalizedCat === 'ai') {
          return jobCat.includes('data') || jobCat.includes('artificial') || jobCat.includes('intelligence');
        }
        if (normalizedCat === 'design') {
          return jobCat.includes('design') || jobCat.includes('ui') || jobCat.includes('ux');
        }
        if (normalizedCat === 'product') {
          return jobCat.includes('product') || jobCat.includes('project');
        }
        if (normalizedCat === 'marketing') {
          return jobCat.includes('marketing') || jobCat.includes('writing') || jobCat.includes('sales');
        }
        if (normalizedCat === 'finance') {
          return jobCat.includes('finance') || jobCat.includes('legal') || jobCat.includes('business');
        }
        if (normalizedCat === 'qa') {
          return jobCat.includes('quality') || jobCat.includes('qa');
        }
        return jobCat.includes(normalizedCat);
      });
    }

    // Apply keyword search
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      processedJobs = processedJobs.filter((job) => {
        return (
          job.title.toLowerCase().includes(q) ||
          job.company_name.toLowerCase().includes(q) ||
          job.candidate_required_location.toLowerCase().includes(q) ||
          (job.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Sort by match score descending
    processedJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    return {
      jobs: processedJobs.slice(0, Number(limit) || 50),
      total: processedJobs.length,
      last_synced_at: this.lastSyncedAt,
      source: 'Remotive Public API',
    };
  }

  // Start periodic 12h background sync
  startPeriodicSync() {
    // Initial sync
    setTimeout(() => {
      this.syncJobsFromRemotive().catch((e) => console.warn('Initial jobs sync warning:', e.message));
    }, 2000);

    // Refresh every 12 hours
    setInterval(() => {
      this.syncJobsFromRemotive().catch((e) => console.warn('Periodic jobs sync warning:', e.message));
    }, this.syncIntervalHours * 60 * 60 * 1000);
  }
}

export const jobsService = new JobsService();
