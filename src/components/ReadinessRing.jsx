import { useEffect, useState } from 'react';

export default function ReadinessRing({ score = 0, size = 168, label = 'Readiness', animate = true }) {
  const stroke = size * 0.07;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setDisplayScore(score);
      return;
    }
    const raf = requestAnimationFrame(() => setDisplayScore(score));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  const offset = c - (Math.min(Math.max(displayScore, 0), 100) / 100) * c;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label}: ${score} out of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--cobalt)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-display)"
          fontSize={size * 0.26}
          fontWeight="600"
          fill="var(--ink)"
        >
          {Math.round(displayScore)}
        </text>
        <text
          x="50%"
          y="66%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono)"
          fontSize={size * 0.075}
          fill="var(--ink-faint)"
        >
          / 100
        </text>
      </svg>
      <span className="eyebrow">{label}</span>
    </div>
  );
}
