import { useEffect, useState } from 'react';
import { getSeniorInsights } from '../../data/api';
import './SeniorInsights.css';

export default function SeniorInsights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    getSeniorInsights().then(setInsights);
  }, []);

  return (
    <div className="si-page">
      <div className="dash-head">
        <div>
          <p className="eyebrow">Senior Insights</p>
          <h1>What actually happened in these interviews</h1>
        </div>
      </div>

      <div className="si-list">
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
        {insights.length === 0 && <div className="empty-state">No stories logged yet.</div>}
      </div>
    </div>
  );
}
