import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPublicCompanies } from '../../data/api';
import './Explore.css';

export default function Explore() {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getPublicCompanies().then(setCompanies);
  }, []);

  const types = ['All', ...new Set(companies.map((c) => c.type))];
  const shown = filter === 'All' ? companies : companies.filter((c) => c.type === filter);

  return (
    <div className="container explore-page">
      <p className="eyebrow">Explore Opportunities</p>
      <h1>Roles hiring from campus right now</h1>
      <p className="explore-intro">
        General eligibility criteria for every company currently tracked. Log in to see your
        personal match score and required rounds side by side with your own skill levels.
      </p>

      <div className="explore-filters">
        {types.map((t) => (
          <button
            key={t}
            className={'filter-chip' + (filter === t ? ' active' : '')}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="explore-list">
        <div className="explore-row explore-row-head">
          <span>Company &amp; Role</span>
          <span>CTC</span>
          <span>Min. CGPA</span>
          <span>Backlogs</span>
          <span>Rounds</span>
        </div>
        {shown.map((c) => (
          <div className="explore-row" key={c.id}>
            <span className="explore-company">
              <strong>{c.name}</strong>
              <span className="explore-role">{c.role}</span>
            </span>
            <span className="mono">{c.ctc}</span>
            <span className="mono">{c.minCgpa.toFixed(1)}</span>
            <span>
              <span className={'tag ' + (c.backlogAllowed ? 'tag-eligible' : 'tag-gap')}>
                {c.backlogAllowed ? 'Allowed' : 'None'}
              </span>
            </span>
            <span className="explore-rounds">{c.rounds.length} rounds</span>
          </div>
        ))}
      </div>

      <div className="explore-cta card">
        <div>
          <h3>Want to know your odds at each of these?</h3>
          <p>Sign in to see your match score, missing skills, and what would need to change.</p>
        </div>
        <Link to="/signup" className="btn btn-primary">Check my readiness</Link>
      </div>
    </div>
  );
}
