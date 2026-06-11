'use client';

interface DarkPattern {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

interface DarkPatternBadgeProps {
  pattern: DarkPattern;
}

const severityColors: Record<string, string> = {
  low: 'bg-yellow-900/30 text-yellow-400 border-yellow-700',
  medium: 'bg-orange-900/30 text-orange-400 border-orange-700',
  high: 'bg-red-900/30 text-red-400 border-red-700'
};

const severityIcons: Record<string, string> = {
  low: '●',
  medium: '◆',
  high: '▲'
};

export default function DarkPatternBadge({ pattern }: DarkPatternBadgeProps) {
  const colorClass = severityColors[pattern.severity] || severityColors.low;

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${colorClass}`}>
      <span className="text-xs mt-0.5">{severityIcons[pattern.severity]}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            {pattern.type.replace(/_/g, ' ')}
          </span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-dark-800/50 capitalize`}>
            {pattern.severity}
          </span>
        </div>
        <p className="text-xs mt-0.5 opacity-80">{pattern.description}</p>
      </div>
    </div>
  );
}
