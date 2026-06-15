import { useEffect, useState } from "react";

interface Props {
  score: number;
  color: "success" | "warn" | "danger";
}

const colorMap = {
  success: "var(--success)",
  warn: "var(--warn)",
  danger: "var(--danger)",
};

export function ScoreCircle({ score, color }: Props) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 800;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative h-48 w-48">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={radius} stroke="var(--hairline)" strokeWidth="12" fill="none" />
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke={colorMap[color]}
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-bold tracking-tight text-ink">
          {animated}
          <span className="text-2xl text-ink-muted">%</span>
        </div>
        <div className="mt-1 text-xs uppercase tracking-wider text-ink-muted">Punkte</div>
      </div>
    </div>
  );
}