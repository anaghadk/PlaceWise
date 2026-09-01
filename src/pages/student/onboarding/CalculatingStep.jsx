import { useEffect, useState } from 'react';
import { submitOnboarding } from '../../../data/api';

const MESSAGES = [
  'Reading your resume…',
  'Comparing you against 96 tracked companies…',
  'Weighing your confidence ratings…',
  'Calibrating your readiness score…',
];

export default function CalculatingStep({ resume, answers, onDone }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 550);

    const start = Date.now();
    submitOnboarding({ resume, answers }).then((result) => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 2200 - elapsed);
      setTimeout(() => onDone(result), remaining);
    });

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ob-step ob-calculating">
      <div className="ob-pulse-ring" aria-hidden="true">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--line)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="52" fill="none" stroke="var(--cobalt)" strokeWidth="8"
            strokeDasharray="326" strokeDashoffset="90" strokeLinecap="round"
            className="ob-pulse-arc"
          />
        </svg>
      </div>
      <h1>Building your readiness profile</h1>
      <p className="ob-step-sub ob-calc-message">{MESSAGES[msgIndex]}</p>
    </div>
  );
}
