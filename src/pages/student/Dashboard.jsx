import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ReadinessRing from '../../components/ReadinessRing';
import { getOpportunities, getSkillGaps, getReadinessHistory } from '../../data/api';
import './Dashboard.css';

export default function Dashboard() {
  const { studentUser } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getOpportunities().then(setOpportunities);
    getSkillGaps().then(setGaps);
    getReadinessHistory().then(setHistory);
  }, []);

  const topMatches = [...opportunities].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  const firstName = studentUser?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="dash-page">
      <div className="dash-head">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Hey {firstName}, here's where you stand.</h1>
        </div>
        <span className="id-badge">{studentUser?.id}</span>
      </div>

      <div className="dash-grid">
        <div className="card dash-readiness">
          <div className="panel-title"><h3>Overall readiness</h3></div>
          <div className="dash-readiness-body">
            <ReadinessRing score={studentUser?.readinessScore ?? 0} size={140} />
            <div className="dash-sparkline">
              <Sparkline data={history} />
              <p className="dash-sparkline-caption">
                Up {history.length > 1 ? history.at(-1).score - history[0].score : 0} pts since {history[0]?.month ?? '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="card dash-matches">
          <div className="panel-title">
            <h3>Your top matches</h3>
            <Link to="/portal/opportunities" className="btn-text">See all <ArrowUpRight size={14} /></Link>
          </div>
          {topMatches.map((c) => (
            <div className="stat-row" key={c.id}>
              <div>
                <div className="stat-row-label">{c.name}</div>
                <div className="stat-row-sub">{c.role} · {c.ctc}</div>
              </div>
              <div className="stat-row-value">{c.matchScore}%</div>
            </div>
          ))}
        </div>

        <div className="card dash-gaps">
          <div className="panel-title">
            <h3>Focus next</h3>
            <Link to="/portal/skill-gaps" className="btn-text">See all <ArrowUpRight size={14} /></Link>
          </div>
          {gaps.slice(0, 2).map((g) => (
            <div className="stat-row" key={g.skill}>
              <div>
                <div className="stat-row-label">{g.skill}</div>
                <div className="stat-row-sub">Unlocks {g.unlocks.join(', ')}</div>
              </div>
              <div className="stat-row-value mono">{g.current} → {g.target}</div>
            </div>
          ))}
        </div>

        <div className="card dash-skills">
          <div className="panel-title">
            <h3>Skills identified</h3>
            <Link to="/portal/profile" className="btn-text">Full profile <ArrowUpRight size={14} /></Link>
          </div>
          {studentUser?.extractedSkills?.length ? (
            <div className="dash-skills-chips">
              {studentUser.extractedSkills.map((s) => (
                <span className="tag tag-eligible" key={s}>{s}</span>
              ))}
            </div>
          ) : (
            <p className="dash-skills-empty">
              Upload your resume during onboarding and we'll pull your skills out automatically.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Sparkline({ data }) {
  if (!data.length) return null;
  const w = 220;
  const h = 60;
  const max = Math.max(...data.map((d) => d.score));
  const min = Math.min(...data.map((d) => d.score));
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.score - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points.join(' ')} fill="none" stroke="var(--cobalt)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={points.at(-1).split(',')[0]} cy={points.at(-1).split(',')[1]} r="3" fill="var(--gold)" />
    </svg>
  );
}
