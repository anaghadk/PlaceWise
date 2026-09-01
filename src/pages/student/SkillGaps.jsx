import { useEffect, useState } from 'react';
import SkillBar from '../../components/SkillBar';
import { getSkillGaps } from '../../data/api';
import './SkillGaps.css';

export default function SkillGaps() {
  const [gaps, setGaps] = useState([]);

  useEffect(() => {
    getSkillGaps().then(setGaps);
  }, []);

  return (
    <div className="gaps-page">
      <p className="eyebrow">Skill Gaps</p>
      <h1>What's standing between you and your target roles</h1>
      <p className="gaps-intro">
        Ranked by how many opportunities each gap is currently blocking. The gold marker
        shows the score you'd need to clear that role's benchmark.
      </p>

      <div className="gaps-list">
        {gaps.map((g) => (
          <div className="gap-card card" key={g.skill}>
            <div className="gap-card-top">
              <div className="gap-card-title">
                <h3>{g.skill}</h3>
                <span className="gap-unlocks">Unlocks {g.unlocks.join(', ')}</span>
              </div>
            </div>
            <SkillBar name="Current vs. target" level={g.current} target={g.target} />
            <div className="gap-resources">
              <h4>Suggested next steps</h4>
              <ul>
                {g.resources.map((r) => <li key={r}>{r}</li>)}
              </ul>
            </div>
          </div>
        ))}
        {gaps.length === 0 && <div className="empty-state">No skill gaps loaded yet.</div>}
      </div>
    </div>
  );
}
