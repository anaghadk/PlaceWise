import { useState } from 'react';

const ROLE_OPTIONS = ['Software Engineer', 'Data Analyst', 'Consultant', 'Core / Hardware', "Not sure yet"];
const PREP_OPTIONS = [
  { id: '<3', label: '< 3 hrs' },
  { id: '3-6', label: '3–6 hrs' },
  { id: '6-10', label: '6–10 hrs' },
  { id: '10+', label: '10+ hrs' },
];
const CONFIDENCE_SKILLS = ['Data Structures & Algorithms', 'System Design', 'SQL', 'Communication'];

export default function QuestionnaireStep({ initial, onContinue, onBack }) {
  const [roles, setRoles] = useState(initial?.roles ?? []);
  const [confidence, setConfidence] = useState(
    initial?.confidence ?? Object.fromEntries(CONFIDENCE_SKILLS.map((s) => [s, 3]))
  );
  const [prepHours, setPrepHours] = useState(initial?.prepHours ?? '');
  const [backlog, setBacklog] = useState(initial?.backlog ?? null);

  function toggleRole(role) {
    setRoles((r) => (r.includes(role) ? r.filter((x) => x !== role) : [...r, role]));
  }

  const canContinue = roles.length > 0 && prepHours && backlog !== null;

  return (
    <div className="ob-step">
      <p className="eyebrow">Step 2 of 3</p>
      <h1>Tell us where you're aiming</h1>
      <p className="ob-step-sub">Four quick questions — this calibrates your readiness score.</p>

      <div className="ob-question">
        <h4>Which roles are you targeting?</h4>
        <div className="ob-chip-row">
          {ROLE_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              className={'ob-chip' + (roles.includes(r) ? ' active' : '')}
              onClick={() => toggleRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="ob-question">
        <h4>How confident do you feel right now?</h4>
        <div className="ob-sliders">
          {CONFIDENCE_SKILLS.map((skill) => (
            <div className="ob-slider-row" key={skill}>
              <div className="ob-slider-label">
                <span>{skill}</span>
                <span className="mono">{confidence[skill]}/5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={confidence[skill]}
                onChange={(e) => setConfidence((c) => ({ ...c, [skill]: Number(e.target.value) }))}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="ob-question">
        <h4>How much time can you prep per week?</h4>
        <div className="ob-chip-row">
          {PREP_OPTIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={'ob-chip' + (prepHours === p.id ? ' active' : '')}
              onClick={() => setPrepHours(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ob-question">
        <h4>Any active backlogs?</h4>
        <div className="ob-chip-row">
          <button type="button" className={'ob-chip' + (backlog === false ? ' active' : '')} onClick={() => setBacklog(false)}>None</button>
          <button type="button" className={'ob-chip' + (backlog === true ? ' active' : '')} onClick={() => setBacklog(true)}>Yes, at least one</button>
        </div>
      </div>

      <div className="ob-actions">
        <button
          className="btn btn-primary"
          disabled={!canContinue}
          onClick={() => onContinue({ roles, confidence, prepHours, backlog })}
        >
          See my readiness score
        </button>
        <button className="btn-text" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
