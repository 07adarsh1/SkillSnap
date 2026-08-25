import { COMMON_SKILLS } from '../utils/skillsDb.js';
import { embeddingService } from './embeddings.js';

export class NLPService {
  constructor() {
    this.skills = Array.from(COMMON_SKILLS).map((s) => s.trim().toLowerCase());
    this.requiredSections = ['summary', 'experience', 'education', 'skills', 'projects'];
    this.criticalSections = ['experience', 'skills', 'education'];
    this.actionVerbs = new Set([
      'built', 'led', 'managed', 'designed', 'developed', 'implemented', 'optimized',
      'improved', 'launched', 'scaled', 'automated', 'delivered', 'created', 'reduced',
      'increased', 'spearheaded', 'architected', 'achieved',
    ]);
    this.sectionHeadings = new Set([
      'experience', 'education', 'projects', 'summary', 'certifications',
      'achievements', 'work experience', 'profile', 'objective',
    ]);
    this.fallbackStopwords = new Set([
      'and', 'or', 'with', 'using', 'in', 'of', 'the', 'to', 'for', 'a', 'an',
      'skills', 'technologies', 'tools', 'frameworks', 'languages', 'proficient', 'knowledge',
    ]);
  }

  tokenize(text) {
    if (!text) return new Set();
    const matches = text.toLowerCase().match(/[a-zA-Z0-9+#.-]+/g) || [];
    return new Set(matches);
  }

  extractFallbackSkills(text = '') {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const collected = [];
    let capture = false;

    for (const line of lines) {
      const lower = line.toLowerCase().replace(/^[:|\-\t]+|[:|\-\t]+$/g, '').trim();

      if (lower.includes('skill')) {
        capture = true;
        continue;
      }

      if (capture && this.sectionHeadings.has(lower)) {
        break;
      }

      if (capture) {
        collected.push(line);
      }
    }

    const sourceText = (collected.length ? collected.slice(0, 20) : lines.slice(0, 30)).join('\n');
    const candidates = [];
    const rawParts = sourceText.split(/[,|/•;\n]+/);

    for (const part of rawParts) {
      const chunk = part.replace(/\s+/g, ' ').replace(/^[-:\t]+|[-:\t]+$/g, '').trim();
      if (!chunk) continue;

      const words = chunk.match(/[A-Za-z0-9+#.-]+/g) || [];
      if (!words.length || words.length > 4) continue;

      const normalized = words.join(' ').toLowerCase();
      if (this.fallbackStopwords.has(normalized)) continue;
      if (words.some((w) => this.fallbackStopwords.has(w)) && words.length === 1) continue;
      if (!/[a-zA-Z]/.test(normalized)) continue;

      candidates.push(normalized);
    }

    const seen = new Set();
    const ordered = [];
    for (const skill of candidates) {
      if (!seen.has(skill)) {
        seen.add(skill);
        ordered.push(skill);
        if (ordered.length >= 18) break;
      }
    }

    return ordered;
  }

  extractSkills(text = '') {
    const textLower = text.toLowerCase();
    const tokens = this.tokenize(text);
    const skills = new Set();

    for (const skill of this.skills) {
      if (skill.includes(' ')) {
        if (textLower.includes(skill)) {
          skills.add(skill);
        }
      } else if (tokens.has(skill)) {
        skills.add(skill);
      }
    }

    if (skills.size < 3) {
      for (const fallback of this.extractFallbackSkills(text)) {
        skills.add(fallback);
      }
    }

    return Array.from(skills).sort();
  }

  scoreSections(resumeText = '') {
    const text = resumeText.toLowerCase();
    const found = [];
    const missing = [];

    const sectionAliases = {
      summary: ['summary', 'professional summary', 'profile', 'about', 'objective', 'about me'],
      experience: ['experience', 'work experience', 'employment', 'work history', 'professional experience', 'internship'],
      education: ['education', 'academic', 'academics', 'qualification', 'qualifications', 'degree', 'university', 'college'],
      skills: ['skills', 'technical skills', 'core competencies', 'competencies', 'technologies', 'tools', 'expertise'],
      projects: ['projects', 'personal projects', 'academic projects', 'key projects', 'portfolio', 'work samples'],
    };

    for (const [sectionKey, aliases] of Object.entries(sectionAliases)) {
      const pattern = new RegExp(`\\b(${aliases.map((a) => a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'i');
      if (pattern.test(text)) {
        found.push(sectionKey);
      } else {
        missing.push(sectionKey);
      }
    }

    const sectionScore = (found.length / Object.keys(sectionAliases).length) * 20;
    return { sectionScore, missingSections: missing, foundSections: found };
  }

  scoreImpactSignals(resumeText = '') {
    const text = resumeText.toLowerCase();
    const tokens = this.tokenize(text);

    const metricRegex = /\b(\d+(\.\d+)?%|\$\d+[\d,]*[kKmM]?|\d+\+?\s*(years|yrs|months|users|clients|customers|projects|features|engineers|team|members|downloads|stars|requests|tps|ms|fps|sales|revenue))\b/gi;
    const metricMatches = text.match(metricRegex) || [];
    const generalNumbers = text.match(/\b\d+([.,]\d+)?\+?\b/g) || [];
    const metricCount = metricMatches.length + Math.max(0, Math.min(Math.floor(generalNumbers.length / 3), 5));

    let verbCount = 0;
    for (const token of tokens) {
      if (this.actionVerbs.has(token)) {
        verbCount++;
      }
    }

    const metricsComponent = (Math.min(metricCount, 6) / 6) * 6;
    const verbsComponent = (Math.min(verbCount, 6) / 6) * 4;
    return { impactScore: metricsComponent + verbsComponent, metricCount, verbCount };
  }

  scoreFormatting(resumeText = '') {
    const text = resumeText || '';
    const suggestions = [];
    let score = 0.0;

    const emailPresent = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/.test(text);
    const phonePresent = /(\+?\d[\d\-\s]{8,}\d)/.test(text);
    const bulletMatches = text.match(/(^\s*[-*•]|\n\s*[-*•])/gm) || [];
    const bulletCount = bulletMatches.length;
    const length = text.length;

    if (emailPresent) {
      score += 3;
    } else {
      suggestions.push('Add a professional email in contact details.');
    }

    if (phonePresent) {
      score += 2;
    } else {
      suggestions.push('Include a phone number for ATS completeness.');
    }

    if (length >= 450 && length <= 9000) {
      score += 3;
    } else if (length < 450) {
      suggestions.push('Resume content is too short; add role impact and project details.');
    } else {
      suggestions.push('Resume content is too long; keep it concise and ATS-friendly.');
    }

    if (bulletCount >= 4) {
      score += 2;
    } else {
      suggestions.push('Use bullet points to improve ATS parsing and readability.');
    }

    return { formattingScore: score, formattingSuggestions: suggestions, bulletCount };
  }

  keywordStuffingPenalty(resumeText = '', jobSkills = []) {
    const text = (resumeText || '').toLowerCase();
    if (!text || !jobSkills || jobSkills.length === 0) return { penalty: 0, stuffedKeywords: 0 };

    let repeatedCount = 0;
    for (const skill of jobSkills) {
      const pattern = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const occurrences = (text.match(pattern) || []).length;
      if (occurrences >= 6) {
        repeatedCount++;
      }
    }

    const penalty = Math.min(repeatedCount * 2.0, 8.0);
    return { penalty, stuffedKeywords: repeatedCount };
  }

  strictCaps(baseScore, jobSkillCount, skillCoverage, missingSections, metricCount, bulletCount) {
    let cappedScore = baseScore;
    const capReasons = [];

    const missingCritical = this.criticalSections.filter((s) => missingSections.includes(s));

    if (jobSkillCount > 0) {
      if (skillCoverage < 0.25) {
        cappedScore -= 15.0;
        capReasons.push('Very low role-skill coverage (<25%).');
      } else if (skillCoverage < 0.40) {
        cappedScore -= 8.0;
        capReasons.push('Low role-skill coverage (<40%).');
      }
    }

    if (missingCritical.length >= 2) {
      cappedScore -= 12.0;
      capReasons.push('Missing multiple critical sections (Experience/Skills/Education).');
    } else if (missingCritical.length === 1) {
      cappedScore -= 5.0;
      capReasons.push(`Missing ${missingCritical[0].toUpperCase()} section.`);
    }

    if (metricCount === 0) {
      cappedScore -= 6.0;
      capReasons.push('No quantifiable impact metrics detected.');
    }

    if (bulletCount < 3) {
      cappedScore -= 4.0;
      capReasons.push('Insufficient bullet structure for ATS parsing.');
    }

    return {
      cappedScore: Math.max(0.0, Math.min(100.0, cappedScore)),
      capReasons,
    };
  }

  async analyzeResumeVsJob(resumeText = '', jobDesc = '') {
    const resumeSkills = this.extractSkills(resumeText);
    const jobSkills = this.extractSkills(jobDesc);

    const resumeSkillsSet = new Set(resumeSkills);
    const jobSkillsSet = new Set(jobSkills);

    const matchedSkills = jobSkills.filter((s) => resumeSkillsSet.has(s));
    const missingSkills = jobSkills.filter((s) => !resumeSkillsSet.has(s));

    // Vector Embedding & Cosine Similarity for Semantic Relevance
    let semanticSimilarity = 0.0;
    try {
      if (resumeText.trim() && jobDesc.trim()) {
        const [vecA, vecB] = await Promise.all([
          embeddingService.generateEmbedding(resumeText),
          embeddingService.generateEmbedding(jobDesc),
        ]);
        semanticSimilarity = embeddingService.cosineSimilarity(vecA, vecB);
      }
    } catch (err) {
      console.warn('[NLP] Embedding calculation fallback:', err.message);
      semanticSimilarity = 0.5;
    }

    // ATS Rubric calculation
    let skillCoverage = 0.0;
    let skillsComponent = 0.0;
    if (jobSkills.length > 0) {
      skillCoverage = matchedSkills.length / jobSkills.length;
      skillsComponent = skillCoverage * 45;
    } else {
      skillCoverage = 0.0;
      skillsComponent = (Math.min(resumeSkills.length, 18) / 18) * 45;
    }

    const semanticComponent = semanticSimilarity * 15;
    const { sectionScore, missingSections } = this.scoreSections(resumeText);
    const { impactScore, metricCount, verbCount } = this.scoreImpactSignals(resumeText);
    const { formattingScore, formattingSuggestions, bulletCount } = this.scoreFormatting(resumeText);

    const { penalty: stuffingPenalty, stuffedKeywords } = this.keywordStuffingPenalty(resumeText, jobSkills);
    const weakImpactPenalty = metricCount < 2 ? 4.0 : 0.0;
    const weakActionPenalty = verbCount < 3 ? 2.0 : 0.0;
    const deductions = stuffingPenalty + weakImpactPenalty + weakActionPenalty;

    let finalScore = skillsComponent + semanticComponent + sectionScore + impactScore + formattingScore - deductions;
    const { cappedScore, capReasons } = this.strictCaps(
      finalScore,
      jobSkills.length,
      skillCoverage,
      missingSections,
      metricCount,
      bulletCount
    );
    finalScore = Number(Math.min(100, Math.max(0, cappedScore)).toFixed(1));

    const scoreBreakdown = {
      skills_alignment: { score: Number(skillsComponent.toFixed(1)), max: 45.0 },
      semantic_relevance: { score: Number(semanticComponent.toFixed(1)), max: 15.0 },
      section_coverage: { score: Number(sectionScore.toFixed(1)), max: 20.0 },
      impact_evidence: { score: Number(impactScore.toFixed(1)), max: 10.0 },
      formatting_quality: { score: Number(formattingScore.toFixed(1)), max: 10.0 },
      strictness_deductions: { score: Number(deductions.toFixed(1)), max: 14.0 },
      total: { score: finalScore, max: 100.0 },
    };

    const expMatch = finalScore >= 85 ? 'Strong' : finalScore >= 65 ? 'Moderate' : 'Weak';

    const suggestions = [];
    if (missingSkills.length > 0) {
      suggestions.push(`Consider acquiring: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    if (missingSections.length > 0) {
      suggestions.push(`Add missing sections: ${missingSections.slice(0, 2).join(', ')}.`);
    }
    if (metricCount < 3) {
      suggestions.push('Add quantified achievements (numbers, %, impact metrics).');
    }
    if (verbCount < 4) {
      suggestions.push('Use stronger action verbs to improve ATS relevance.');
    }
    suggestions.push(...formattingSuggestions.slice(0, 2));

    if (stuffedKeywords > 0) {
      suggestions.push('Reduce repetitive keyword stuffing and use natural, role-relevant phrasing.');
    }
    if (capReasons.length > 0) {
      suggestions.push(...capReasons.slice(0, 2).map((r) => `Score cap applied: ${r}`));
    }
    if (finalScore < 70) {
      suggestions.push('Align resume keywords more tightly with the target job description.');
    }

    return {
      ats_score: finalScore,
      semantic_similarity: Number((semanticSimilarity * 100).toFixed(1)),
      resume_skills: resumeSkills,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      experience_match: expMatch,
      ai_suggestions: suggestions.slice(0, 6),
      score_breakdown: scoreBreakdown,
    };
  }
}

export const nlpEngine = new NLPService();
