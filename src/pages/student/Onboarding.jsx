import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ResumeStep from './onboarding/ResumeStep';
import QuestionnaireStep from './onboarding/QuestionnaireStep';
import CalculatingStep from './onboarding/CalculatingStep';
import ResultStep from './onboarding/ResultStep';
import './Onboarding.css';

const STEPS = ['Resume', 'Readiness check', 'Analyzing', 'Your score'];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState(null);
  const [resumeSkills, setResumeSkills] = useState([]);
  const [answers, setAnswers] = useState(null);
  const [result, setResult] = useState(null);
  const { studentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  function handleFinish() {
    completeOnboarding({ readinessScore: result?.readinessScore, extractedSkills: resumeSkills });
    navigate('/portal', { replace: true });
  }

  return (
    <div className="ob-shell">
      <aside className="ob-rail">
        <Link to="/" className="wordmark ob-wordmark">PlaceWise</Link>
        <p className="ob-rail-greeting">Welcome, {studentUser?.name?.split(' ')[0] ?? 'there'}</p>
        <ol className="ob-rail-steps">
          {STEPS.map((label, i) => (
            <li key={label} className={i === step ? 'active' : i < step ? 'done' : ''}>
              <span className="ob-rail-index">{i < step ? <Check size={13} /> : i + 1}</span>
              {label}
            </li>
          ))}
        </ol>
        <p className="ob-rail-note">
          This takes about three minutes. Your answers shape your readiness score and what shows
          up first on your dashboard.
        </p>
      </aside>

      <div className="ob-content">
        <div className="ob-progress-mobile">
          <div className="ob-progress-mobile-bar" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        <div className="ob-content-inner">
          {step === 0 && (
            <ResumeStep
              onContinue={({ file, parsed }) => {
                setResume(file);
                setResumeSkills(parsed?.extractedSkills ?? []);
                setStep(1);
              }}
              onSkip={() => { setResume(null); setResumeSkills([]); setStep(1); }}
            />
          )}
          {step === 1 && (
            <QuestionnaireStep
              initial={answers}
              onBack={() => setStep(0)}
              onContinue={(a) => { setAnswers(a); setStep(2); }}
            />
          )}
          {step === 2 && (
            <CalculatingStep
              resume={resume}
              answers={answers}
              onDone={(res) => { setResult(res); setStep(3); }}
            />
          )}
          {step === 3 && result && (
            <ResultStep score={result.readinessScore} onFinish={handleFinish} />
          )}
        </div>
      </div>
    </div>
  );
}
