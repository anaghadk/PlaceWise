// Mock data shaped to mirror likely FastAPI response contracts.
// Replace the exported functions in src/data/api.js with real fetch() calls —
// page components only import from api.js, never from here directly.

export const student = {
  id: 'STU-2027-0142',
  name: 'Anagha Deshpande',
  branch: 'Computer Science & Engineering',
  year: '3rd Year',
  cgpa: 8.42,
  backlog: false,
  skills: [
    { name: 'Data Structures & Algorithms', level: 72 },
    { name: 'System Design', level: 41 },
    { name: 'SQL', level: 78 },
    { name: 'Python', level: 85 },
    { name: 'React', level: 63 },
    { name: 'Aptitude & Reasoning', level: 58 },
  ],
  readinessScore: 68,
};

export const readinessHistory = [
  { month: 'Apr', score: 44 },
  { month: 'May', score: 51 },
  { month: 'Jun', score: 55 },
  { month: 'Jul', score: 61 },
  { month: 'Aug', score: 64 },
  { month: 'Sep', score: 68 },
];

export const companies = [
  {
    id: 'CMP-014',
    name: 'Astranet Systems',
    role: 'Software Engineer',
    type: 'Product',
    ctc: '18–24 LPA',
    minCgpa: 7.5,
    backlogAllowed: false,
    skillsWeighted: ['Data Structures & Algorithms', 'System Design', 'SQL'],
    rounds: ['Online Assessment', 'DSA Round', 'System Design', 'HR'],
    eligible: true,
    matchScore: 81,
  },
  {
    id: 'CMP-021',
    name: 'Verdant Analytics',
    role: 'Data Analyst',
    type: 'Analytics',
    ctc: '10–14 LPA',
    minCgpa: 7.0,
    backlogAllowed: false,
    skillsWeighted: ['SQL', 'Python', 'Aptitude & Reasoning'],
    rounds: ['Online Assessment', 'Case Study', 'HR'],
    eligible: true,
    matchScore: 88,
  },
  {
    id: 'CMP-033',
    name: 'Ferrow Cloud',
    role: 'Backend Engineer',
    type: 'Product',
    ctc: '16–20 LPA',
    minCgpa: 8.0,
    backlogAllowed: false,
    skillsWeighted: ['System Design', 'SQL', 'Data Structures & Algorithms'],
    rounds: ['Online Assessment', 'DSA Round', 'System Design', 'Managerial', 'HR'],
    eligible: true,
    matchScore: 64,
  },
  {
    id: 'CMP-045',
    name: 'Northline Consulting',
    role: 'Associate Consultant',
    type: 'Consulting',
    ctc: '9–12 LPA',
    minCgpa: 7.5,
    backlogAllowed: true,
    skillsWeighted: ['Aptitude & Reasoning', 'System Design'],
    rounds: ['Group Discussion', 'Case Study', 'HR'],
    eligible: true,
    matchScore: 55,
  },
  {
    id: 'CMP-052',
    name: 'Quorra Fintech',
    role: 'SDE — Platform',
    type: 'Product',
    ctc: '22–30 LPA',
    minCgpa: 8.5,
    backlogAllowed: false,
    skillsWeighted: ['Data Structures & Algorithms', 'System Design', 'React'],
    rounds: ['Online Assessment', 'DSA Round x2', 'System Design', 'HR'],
    eligible: false,
    matchScore: 46,
  },
];

export const skillGaps = [
  {
    skill: 'System Design',
    current: 41,
    target: 70,
    unlocks: ['Ferrow Cloud', 'Quorra Fintech'],
    resources: ['Grokking System Design — Ch. 1–6', 'Weekly HLD circle (Fridays, CS block)'],
  },
  {
    skill: 'Aptitude & Reasoning',
    current: 58,
    target: 75,
    unlocks: ['Northline Consulting'],
    resources: ['RS Aggarwal — Logical Reasoning', 'Timed mock: Quant + LR, 2x/week'],
  },
  {
    skill: 'Data Structures & Algorithms',
    current: 72,
    target: 85,
    unlocks: ['Quorra Fintech'],
    resources: ['Graphs & DP topic sprint', 'Contest: 1 rated round/week'],
  },
];

export const seniorInsights = [
  {
    id: 'SR-201',
    company: 'Astranet Systems',
    role: 'Software Engineer',
    year: '2025 batch',
    branch: 'CSE',
    rounds: 4,
    summary:
      'Two DSA rounds leaned heavily on graphs and greedy problems; the system design round asked for a URL shortener with a follow-up on rate limiting.',
    prepTime: '11 weeks',
    tags: ['DSA', 'System Design', 'HR'],
  },
  {
    id: 'SR-188',
    company: 'Verdant Analytics',
    role: 'Data Analyst',
    year: '2025 batch',
    branch: 'ISE',
    rounds: 3,
    summary:
      'Case study centered on a churn dataset; interviewers cared more about how candidates framed assumptions than the final SQL query.',
    prepTime: '6 weeks',
    tags: ['SQL', 'Case Study'],
  },
  {
    id: 'SR-176',
    company: 'Ferrow Cloud',
    role: 'Backend Engineer',
    year: '2024 batch',
    branch: 'CSE',
    rounds: 5,
    summary:
      'Managerial round focused on a past project deep-dive, especially trade-offs made under deadline pressure rather than the tech stack itself.',
    prepTime: '14 weeks',
    tags: ['System Design', 'Behavioral'],
  },
  {
    id: 'SR-162',
    company: 'Northline Consulting',
    role: 'Associate Consultant',
    year: '2024 batch',
    branch: 'ECE',
    rounds: 3,
    summary:
      'Group discussion topic was policy-driven (EV subsidy rollout); structure and airtime mattered more than raw domain knowledge.',
    prepTime: '5 weeks',
    tags: ['GD', 'Case Study'],
  },
];

export const publicStats = {
  studentsOnboarded: 2380,
  companiesTracked: 96,
  seniorStories: 410,
  avgReadinessLift: '+22 pts in 8 weeks',
};

export const eligibilityBands = [
  { band: '9.0+', students: 84 },
  { band: '8.0–8.9', students: 312 },
  { band: '7.0–7.9', students: 640 },
  { band: '6.0–6.9', students: 588 },
  { band: '< 6.0', students: 210 },
];

// Genie · core-CS baseline quiz --------------------------------------------
// 6 questions spanning DSA, OS, OOP and CN, roughly two per difficulty band.
// Genie uses this baseline (once wired to the backend) to seed a student's
// starting skill estimate before any resume/readiness data exists.
export const coreCSQuestions = [
  {
    id: 'q1',
    topic: 'DSA',
    difficulty: 'Easy',
    prompt: 'What is the time complexity of binary search on a sorted array of n elements?',
    options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
    correctIndex: 1,
    explain: 'Binary search halves the search space each step, giving O(log n).',
  },
  {
    id: 'q2',
    topic: 'OS',
    difficulty: 'Easy',
    prompt: 'A deadlock occurs when —',
    options: [
      'A process uses too much CPU time',
      'Two or more processes wait forever for resources held by each other',
      'A process is terminated by the kernel',
      'Memory is fragmented beyond use',
    ],
    correctIndex: 1,
    explain: 'Deadlock is a circular-wait condition — each process holds a resource the other needs.',
  },
  {
    id: 'q3',
    topic: 'DSA',
    difficulty: 'Medium',
    prompt: 'Which data structure natively gives LIFO (last-in, first-out) access?',
    options: ['Queue', 'Stack', 'Linked List', 'Heap'],
    correctIndex: 1,
    explain: 'A stack pushes/pops from the same end, so the last item in is the first out.',
  },
  {
    id: 'q4',
    topic: 'OOP',
    difficulty: 'Medium',
    prompt: 'Which OOP pillar lets a subclass provide its own implementation of a method defined in its parent?',
    options: ['Encapsulation', 'Abstraction', 'Polymorphism', 'Composition'],
    correctIndex: 2,
    explain: 'Method overriding is a form of runtime polymorphism.',
  },
  {
    id: 'q5',
    topic: 'CN',
    difficulty: 'Hard',
    prompt: 'Which OSI layer is responsible for logical addressing and routing between networks?',
    options: ['Data Link (Layer 2)', 'Network (Layer 3)', 'Transport (Layer 4)', 'Session (Layer 5)'],
    correctIndex: 1,
    explain: 'Layer 3 handles IP addressing and routes packets across networks.',
  },
  {
    id: 'q6',
    topic: 'DSA',
    difficulty: 'Hard',
    prompt: 'What is the time complexity of building a binary heap from n unordered elements?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correctIndex: 2,
    explain: 'Bottom-up heapify does more work near the leaves and less near the root, amortizing to O(n).',
  },
];
