import './About.css';

const team = [
  { role: 'Data Engineer', focus: 'Databricks pipelines, placement datasets' },
  { role: 'Genie Engineer', focus: 'Intelligence layer, personalized recommendations' },
  { role: 'Backend', focus: 'FastAPI services, auth, data contracts' },
  { role: 'Public Portal', focus: 'Frontend — this shell' },
  { role: 'Student Portal', focus: 'Frontend — this shell' },
];

export default function About() {
  return (
    <div className="container about-page">
      <p className="eyebrow">About</p>
      <h1>Why we built CampusIQ</h1>
      <p className="about-lede">
        Placement information at most campuses lives in five different places — a WhatsApp
        group, a shared spreadsheet, a noticeboard, and whatever the last batch remembers.
        PlaceWise brings it together and connects it to each student's own profile, so
        preparation stops being guesswork.
      </p>

      <h2>What it does</h2>
      <ul className="about-list">
        <li>Matches your academic profile and skills against live company eligibility criteria.</li>
        <li>Scores your placement readiness and tracks it over time.</li>
        <li>Surfaces the specific skill gaps standing between you and a role you want.</li>
        <li>Shares anonymized senior experiences: rounds, subjects tested, prep time.</li>
      </ul>

      <h2>Team</h2>
      <div className="team-list">
        {team.map((m) => (
          <div className="stat-row" key={m.role}>
            <div>
              <div className="stat-row-label">{m.role}</div>
              <div className="stat-row-sub">{m.focus}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
