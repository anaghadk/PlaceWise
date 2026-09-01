export default function SkillBar({ name, level, target }) {
  return (
    <div className="skillbar">
      <div className="skillbar-head">
        <span>{name}</span>
        <span className="mono skillbar-level">{level}{target ? ` → ${target}` : ''}</span>
      </div>
      <div className="skillbar-track">
        <div className="skillbar-fill" style={{ width: `${level}%` }} />
        {target && <div className="skillbar-target" style={{ left: `${target}%` }} />}
      </div>
    </div>
  );
}
