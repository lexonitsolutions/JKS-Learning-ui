export function ScoreRing({
  score,
  size = 140,
  label = "Overall Score",
  variant = "light",
}: {
  score: number;
  size?: number;
  label?: string;
  variant?: "light" | "dark";
}) {
  const stroke = size * 0.09;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, score)) / 100) * circumference;
  const isDark = variant === "dark";

  return (
    <div className="inline-flex flex-col items-center gap-2 select-none">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="scoreRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "rgba(255, 255, 255, 0.12)" : "var(--color-border)"}
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={isDark ? "url(#scoreRingGrad)" : "var(--color-primary-blue)"}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />

        {/* Score Value */}
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isDark ? "#FFFFFF" : "var(--color-text-heading, #0F172A)"}
          style={{ fontSize: size * 0.23, fontWeight: 800, fontFamily: "inherit" }}
        >
          {score}
        </text>

        {/* Total Max */}
        <text
          x="50%"
          y="65%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isDark ? "#94A3B8" : "var(--color-text-body, #64748B)"}
          style={{ fontSize: size * 0.085, fontWeight: 600, fontFamily: "inherit" }}
        >
          / 100
        </text>
      </svg>
      {label && (
        <span
          className={`text-[11px] font-bold uppercase tracking-wider ${
            isDark ? "text-slate-300" : "text-text-body"
          }`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

