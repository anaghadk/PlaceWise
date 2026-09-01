import { useEffect, useState } from 'react';
import { getOpportunities } from '../../data/api';
import './Opportunities.css';

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    getOpportunities().then(setOpportunities);
  }, []);

  const shown = [...opportunities]
    .filter((c) => !onlyEligible || c.eligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="opp-page">
      <div className="dash-head">
        <div>
          <p className="eyebrow">Opportunities</p>
          <h1>Every role, matched to you</h1>
        </div>
        <label className="opp-toggle">
          <input type="checkbox" checked={onlyEligible} onChange={(e) => setOnlyEligible(e.target.checked)} />
          Eligible only
        </label>
      </div>

      <div className="opp-list">
        {shown.map((c) => (
          <div className="opp-card card" key={c.id}>
            <button className="opp-card-head" onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
              <div className="opp-card-main">
                <h3>{c.name}</h3>
                <span className="opp-role">{c.role} · {c.type} · <span className="mono">{c.ctc}</span></span>
              </div>
              <div className="opp-card-right">
                <span className={'tag ' + (c.eligible ? 'tag-eligible' : 'tag-gap')}>
                  {c.eligible ? 'Eligible' : 'Not eligible'}
                </span>
                <div className="opp-match">
                  <div className="opp-match-value mono">{c.matchScore}%</div>
                  <div className="opp-match-bar"><div style={{ width: `${c.matchScore}%` }} /></div>
                </div>
              </div>
            </button>

            {expanded === c.id && (
              <div className="opp-card-detail">
                <div className="opp-detail-col">
                  <h4>Eligibility</h4>
                  <p>Min. CGPA {c.minCgpa.toFixed(1)} · Backlogs {c.backlogAllowed ? 'allowed' : 'not allowed'}</p>
                </div>
                <div className="opp-detail-col">
                  <h4>Weighted skills</h4>
                  <div className="opp-detail-tags">
                    {c.skillsWeighted.map((s) => <span className="tag" key={s}>{s}</span>)}
                  </div>
                </div>
                <div className="opp-detail-col">
                  <h4>Interview rounds</h4>
                  <ol className="opp-rounds">
                    {c.rounds.map((r) => <li key={r}>{r}</li>)}
                  </ol>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
