# PlaceWise (CampusIQ) — Frontend

React + Vite frontend for both the public portal and the student portal.

## Run it

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. Build for production with `npm run build` (outputs to `dist/`).

## New student flow

Signing up now routes through a 3-step onboarding wizard before the dashboard:

1. **Resume upload** (`pages/student/onboarding/ResumeStep.jsx`) — drag/drop or
   browse, mock-parses the file and shows extracted skills. "Skip for now" is
   allowed.
2. **Readiness questionnaire** (`QuestionnaireStep.jsx`) — target roles,
   confidence sliders, weekly prep time, backlog status.
3. **Calculating** (`CalculatingStep.jsx`) → **Result** (`ResultStep.jsx`) —
   calls `submitOnboarding()` in `api.js`, animates the readiness ring up to
   the computed score, then hands off to the dashboard.

Logging in (an existing account) skips onboarding entirely — `AuthContext`
tracks an `onboarded` flag; `signup()` sets it `false`, `login()` sets it
`true`. `ProtectedRoute` redirects unonboarded students from `/portal/*` to
`/onboarding` automatically. When you wire up real auth, drive this flag from
whatever the backend returns (e.g. `student.onboarding_complete`).

## Structure

```
src/
  components/       shared layout + UI (PublicLayout, StudentLayout, ReadinessRing, SkillBar, ProtectedRoute)
  context/          AuthContext.jsx — mock student auth, swap for real JWT/session logic
  data/
    api.js          <-- integration point. Every page calls functions from here.
    mockData.js      raw mock data used by api.js today
  pages/
    public/         Home, Explore, Insights, About, Login, Signup
    student/        Dashboard, Opportunities, SkillGaps, WhatIf, SeniorInsights, Profile
  styles/tokens.css  design tokens (colors, type, spacing) — single source of truth
```

## Integrating with the backend

Every page imports data functions from `src/data/api.js` — no page talks to
`mockData.js` directly. To connect the real FastAPI backend:

1. Open `src/data/api.js`.
2. Replace each function body with a `fetch()` (or `axios`) call to the matching
   endpoint — suggested paths are listed in the comment at the top of the file.
3. Keep each function's return shape the same as it is now, or update the small
   number of call sites if a shape needs to change.
4. In `src/context/AuthContext.jsx`, swap the mock `login`/`signup` for real
   calls that store a token (e.g. in memory + an httpOnly cookie, or wherever
   the backend expects it) and attach it to subsequent requests from `api.js`.

No other file needs to change — routing, layout, and all components are
already wired to read from `api.js` and `AuthContext`.

## Design system

Tokens live in `src/styles/tokens.css` as CSS custom properties (`--bg`,
`--ink`, `--cobalt`, `--gold`, `--font-display`, etc.). Change a value there
and it updates everywhere. Fonts (Fraunces, IBM Plex Sans, IBM Plex Mono) are
loaded from Google Fonts in `index.html`.
