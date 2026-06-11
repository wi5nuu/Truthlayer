'use client';

interface TrustScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function TrustScore({ score, size = 'md', showLabel = true }: TrustScoreProps) {
  const dimensions = size === 'sm' ? 80 : size === 'lg' ? 200 : 140;
  const strokeWidth = size === 'sm' ? 6 : size === 'lg' ? 12 : 8;
  const radius = (dimensions - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = dimensions / 2;

  const color = score >= 80 ? '#059669' : score >= 60 ? '#10B981' : score >= 40 ? '#D97706' : score >= 20 ? '#F97316' : '#DC2626';

  const label = score >= 80 ? 'Highly Trustworthy' : score >= 60 ? 'Generally Trustworthy' : score >= 40 ? 'Use With Caution' : score >= 20 ? 'Potentially Manipulative' : 'High Risk';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={dimensions} height={dimensions} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: dimensions, height: dimensions }}>
        <span className={`font-bold ${size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-5xl' : 'text-3xl'}`} style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-dark-400">/100</span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium" style={{ color }}>
          {label}
        </span>
      )}
    </div>
  );
}
