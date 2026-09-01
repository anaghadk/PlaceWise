import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ReadinessRing from '../../components/ReadinessRing';
import { getPublicStats } from '../../data/api';
import './Home.css';

export default function Home() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPublicStats().then(setStats);
  }, []);

  return (
    <>
      <section className="hero-band">
      <div className="hero container">
        <div className="hero-copy">
          <span className="pill"><span className="pill-dot" /> Live · Fall 2026 placement cycle</span>
          <h1>Your placement prep,<br />scattered no more.</h1>
          <p className="hero-sub">
            PlaceWise pulls eligibility criteria, skill benchmarks and senior interview
            experiences into one place, then lines them up against your own profile —
            so you always know what to work on next.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary">Check your readiness <ArrowUpRight size={16} /></Link>
            <Link to="/explore" className="btn btn-ghost">Browse opportunities</Link>
          </div>
        </div>
        <div className="hero-demo card">
          <p className="eyebrow">Sample readiness snapshot</p>
          <div className="hero-demo-body">
            <ReadinessRing score={68} label="Overall readiness" />
            <ul className="hero-demo-list">
              <li><span className="tag tag-eligible">Eligible</span> Verdant Analytics — 88% match</li>
              <li><span className="tag tag-eligible">Eligible</span> Astranet Systems — 81% match</li>
              <li><span className="tag tag-gap">Gap: System Design</span> Ferrow Cloud — 64% match</li>
            </ul>
          </div>
        </div>
      </div>
      </section>

      <section className="container stats-strip">
        <hr className="rule" />
        <div className="stats-grid">
          <StatCell value={stats?.studentsOnboarded} label="Students onboarded" />
          <StatCell value={stats?.companiesTracked} label="Companies tracked" />
          <StatCell value={stats?.seniorStories} label="Senior stories logged" />
          <StatCell value={stats?.avgReadinessLift} label="Avg. readiness lift" wide />
        </div>
        <hr className="rule" />
      </section>

      <section className="container how-it-works">
        <p className="eyebrow">How it works</p>
        <h2>Three inputs, one clear next step</h2>
        <div className="how-grid">
          <div className="how-card">
            <span className="how-index mono">01</span>
            <h3>Your profile</h3>
            <p>Academics, skills, and past assessment scores, kept current as you learn.</p>
          </div>
          <div className="how-card">
            <span className="how-index mono">02</span>
            <h3>Company criteria</h3>
            <p>Eligibility rules and role requirements, pulled straight from placement data.</p>
          </div>
          <div className="how-card">
            <span className="how-index mono">03</span>
            <h3>Senior experience</h3>
            <p>Anonymized accounts of interview rounds, subjects tested, and prep time spent.</p>
          </div>
        </div>
      </section>

      <section className="container cta-band">
        <div className="cta-band-inner card">
          <div>
            <h2>See exactly where you stand.</h2>
            <p>Create a student account to unlock your personalized readiness score, skill gaps, and senior insights.</p>
          </div>
          <Link to="/signup" className="btn btn-primary">Get started</Link>
        </div>
      </section>
    </>
  );
}

function StatCell({ value, label, wide }) {
  return (
    <div className={'stat-cell' + (wide ? ' wide' : '')}>
      <div className="stat-cell-value mono">{value ?? '—'}</div>
      <div className="stat-cell-label">{label}</div>
    </div>
  );
}
