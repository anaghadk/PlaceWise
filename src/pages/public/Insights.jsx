import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { getPublicSeniorInsights } from '../../data/api';
import './Insights.css';

export default function Insights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    getPublicSeniorInsights().then(setInsights);
  }, []);

  return (
    <div className="container insights-page">
      <p className="eyebrow">Senior Insights</p>
      <h1>Learn from the batch before you</h1>
      <p className="explore-intro">
        Anonymized accounts from seniors who've been through the process — what got tested,
        how long they prepped, and what they'd do differently.
      </p>

      <div className="insight-list">
        {insights.map((s) => (
          <article className="insight-card card" key={s.id}>
            <div className="insight-card-head">
              <div>
                <h3>{s.company} — {s.role}</h3>
                <p className="insight-meta mono">{s.year} · {s.branch} · {s.rounds} rounds · {s.prepTime} prep</p>
              </div>
            </div>
            <p className="insight-summary">{s.summary}</p>
            <div className="insight-tags">
              {s.tags.map((t) => <span className="tag tag-insight" key={t}>{t}</span>)}
            </div>
          </article>
        ))}

        <div className="insight-locked card">
          <Lock size={18} strokeWidth={1.6} />
          <div>
            <h3>408 more stories, filtered to your target companies</h3>
            <p>Log in to search senior insights by role, branch, and the exact rounds you're prepping for.</p>
          </div>
          <Link to="/signup" className="btn btn-primary">Unlock insights</Link>
        </div>
      </div>
    </div>
  );
}
