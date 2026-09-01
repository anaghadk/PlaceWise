import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import ReadinessRing from '../../../components/ReadinessRing';
import { getOpportunities } from '../../../data/api';

export default function ResultStep({ score, onFinish }) {
  const [topMatches, setTopMatches] = useState([]);

  useEffect(() => {
    getOpportunities().then((data) => {
      setTopMatches([...data].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3));
    });
  }, []);

  const headline =
    score >= 75 ? "You're in strong shape." : score >= 55 ? "You've got a solid base to build on." : "Let's get you moving — every point counts.";

  return (
    <div className="ob-step ob-result">
      <p className="eyebrow">All set</p>
      <h1>{headline}</h1>
      <p className="ob-step-sub">Here's your starting readiness score. It updates as you close skill gaps.</p>

      <div className="ob-result-ring">
        <ReadinessRing score={score} size={200} label="Overall readiness" />
      </div>

      <div className="ob-result-matches">
        <h4>Your top matches, based on this</h4>
        {topMatches.map((c) => (
          <div className="stat-row" key={c.id}>
            <div className="stat-row-label">{c.name}</div>
            <div className="stat-row-value mono">{c.matchScore}%</div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary ob-finish" onClick={onFinish}>
        Go to my dashboard <ArrowRight size={16} />
      </button>
    </div>
  );
}
