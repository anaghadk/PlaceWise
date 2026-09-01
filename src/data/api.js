// ---------------------------------------------------------------------------
// API layer. Every page imports from here, never from mockData.js directly.
// To integrate with the real FastAPI backend, replace each function body with
// a fetch() call and keep the same return shape (or update call sites once).
//
// Suggested real endpoints (align with Member 3 / backend):
//   GET  /api/public/stats
//   GET  /api/public/companies
//   POST /api/auth/login            { email, password }
//   POST /api/auth/signup           { name, email, password, usn, branch }
//   GET  /api/student/me            (auth)
//   GET  /api/student/opportunities (auth)
//   GET  /api/student/skill-gaps    (auth)
//   GET  /api/student/senior-insights                    (auth)
// ---------------------------------------------------------------------------

import {
  student,
  readinessHistory,
  companies,
  skillGaps,
  seniorInsights,
  publicStats,
  eligibilityBands,
  coreCSQuestions,
} from './mockData';

const delay = (ms = 260) => new Promise((res) => setTimeout(res, ms));

export async function getPublicStats() {
  await delay();
  return publicStats;
}

export async function getEligibilityBands() {
  await delay();
  return eligibilityBands;
}

export async function getPublicCompanies() {
  await delay();
  // Public portal only sees eligibility criteria, not personalized match scores.
  return companies.map(({ matchScore, eligible, ...rest }) => rest);
}

export async function getPublicSeniorInsights() {
  await delay();
  return seniorInsights.slice(0, 2);
}

export async function login({ email, password }) {
  await delay(400);
  if (!email || !password) throw new Error('Enter your email and password.');
  // Returning student — in a real backend this comes back keyed off the
  // authenticated account, so the same name/profile follows them everywhere.
  return { token: 'mock-token', student: { ...student, email } };
}

export async function signup(payload) {
  await delay(500);
  if (!payload.email || !payload.password || !payload.name) {
    throw new Error('Fill in every field to create your account.');
  }
  // Seed the new account from the mock template but keep what the student
  // actually entered, so their real name/branch/USN follow them across the
  // whole app until they log out.
  return {
    token: 'mock-token',
    student: {
      ...student,
      name: payload.name,
      email: payload.email,
      id: payload.usn || student.id,
      branch: payload.branch || student.branch,
    },
  };
}

// Onboarding: resume parse + readiness questionnaire -----------------------

export async function parseResume(file) {
  await delay(1400); // stands in for an actual resume-parsing call
  return {
    fileName: file?.name ?? 'resume.pdf',
    extractedSkills: ['Python', 'SQL', 'React', 'Data Structures & Algorithms', 'Git'],
    detectedRoles: ['Software Engineer', 'Data Analyst'],
  };
}

export async function submitOnboarding({ resume, answers }) {
  await delay(1600); // stands in for the Genie readiness computation
  const confidenceValues = Object.values(answers.confidence ?? {});
  const avgConfidence = confidenceValues.length
    ? confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length
    : 3;
  const resumeBonus = resume ? 8 : 0;
  const prepBonus = { '<3': 0, '3-6': 4, '6-10': 8, '10+': 12 }[answers.prepHours] ?? 0;
  const score = Math.round(Math.min(96, avgConfidence * 14 + resumeBonus + prepBonus));

  return {
    readinessScore: score,
    skills: student.skills.map((s) => ({ ...s })),
  };
}

export async function getStudentProfile() {
  await delay();
  return student;
}

export async function getReadinessHistory() {
  await delay();
  return readinessHistory;
}

export async function getOpportunities() {
  await delay();
  return companies;
}

export async function getSkillGaps() {
  await delay();
  return skillGaps;
}

export async function getSeniorInsights() {
  await delay();
  return seniorInsights;
}

// Genie chatbot ---------------------------------------------------------
// Suggested real endpoints once the Genie service (Member 3/4) is wired up:
//   GET  /api/genie/baseline-quiz          -> { questions: [...] }
//   POST /api/genie/leetcode                { profileUrl }  -> stats
//   POST /api/genie/chat                    { message, history } -> reply
// Everything below is a local stand-in with the same return shape.

export async function getCoreCSQuestions() {
  await delay(300);
  return coreCSQuestions;
}

function usernameFromLeetCodeUrl(url) {
  try {
    const clean = url.trim().replace(/\/+$/, '');
    const match = clean.match(/leetcode\.com\/(?:u\/)?([a-zA-Z0-9_-]+)/i);
    return match ? match[1] : clean.split('/').pop();
  } catch {
    return 'coder';
  }
}

export async function extractLeetCodeStats(profileUrl) {
  await delay(1500); // stands in for the real LeetCode-profile extraction call
  if (!profileUrl || !profileUrl.trim()) {
    throw new Error('Paste a LeetCode profile link first.');
  }
  const username = usernameFromLeetCodeUrl(profileUrl);

  // Deterministic-ish mock numbers seeded off the username so the same
  // profile link always returns the same "stats" during a demo.
  let seed = 0;
  for (const ch of username) seed = (seed * 31 + ch.charCodeAt(0)) % 9973;
  const easy = 60 + (seed % 90);
  const medium = 30 + ((seed >> 2) % 140);
  const hard = 5 + ((seed >> 4) % 35);
  const total = easy + medium + hard;

  return {
    username,
    profileUrl,
    totalSolved: total,
    easySolved: easy,
    mediumSolved: medium,
    hardSolved: hard,
    ranking: 40000 + ((seed * 17) % 380000),
    acceptanceRate: (58 + (seed % 30)) / 1 + '%',
    contestsAttended: 2 + (seed % 12),
    badges: seed % 3 === 0 ? ['Knight'] : seed % 3 === 1 ? ['50 Days Badge'] : [],
  };
}

export async function sendGenieMessage(message, context = {}) {
  await delay(700);
  const text = message.toLowerCase();
  if (text.includes('leetcode') || text.includes('dsa')) {
    return "Keep stacking easy + medium reps daily — consistency beats cramming. Once I'm fully connected, I'll tailor this to your actual solved list.";
  }
  if (text.includes('resume')) {
    return 'Lead with impact, not duties — quantify what changed because of your work. I\'ll be able to review your actual resume once Genie is fully wired up.';
  }
  if (text.includes('interview')) {
    return "For interviews: think out loud, clarify constraints first, and always state a brute-force approach before optimizing. I'll pull in company-specific patterns once I'm connected to live data.";
  }
  return "Noted! I'm still a preview of Genie — full personalized, data-backed answers are coming in a later step. For now I can chat about DSA, OS/CN fundamentals, resumes, and interview strategy." + (context.leetcode ? ` I can already see you've solved ${context.leetcode.totalSolved}+ problems on LeetCode — nice base.` : '');
}
