import { useAuth } from '../../context/AuthContext';
import SkillBar from '../../components/SkillBar';
import './Profile.css';

export default function Profile() {
  const { studentUser } = useAuth();
  if (!studentUser) return null;

  return (
    <div className="profile-page">
      <p className="eyebrow">Profile</p>
      <h1>{studentUser.name}</h1>
      <p className="id-badge profile-id">{studentUser.id}</p>

      <div className="profile-grid">
        <div className="card profile-card">
          <div className="panel-title"><h3>Academics</h3></div>
          <div className="stat-row"><div className="stat-row-label">Branch</div><div className="stat-row-value">{studentUser.branch}</div></div>
          <div className="stat-row"><div className="stat-row-label">Year</div><div className="stat-row-value">{studentUser.year}</div></div>
          <div className="stat-row"><div className="stat-row-label">CGPA</div><div className="stat-row-value mono">{studentUser.cgpa.toFixed(2)}</div></div>
          <div className="stat-row"><div className="stat-row-label">Backlogs</div><div className="stat-row-value">{studentUser.backlog ? 'Yes' : 'None'}</div></div>
        </div>

        <div className="card profile-card">
          <div className="panel-title"><h3>Skills</h3></div>
          {studentUser.skills.map((s) => (
            <SkillBar key={s.name} name={s.name} level={s.level} />
          ))}
        </div>
      </div>
    </div>
  );
}
