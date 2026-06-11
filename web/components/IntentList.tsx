'use client';

interface Intent {
  rank: number;
  intent: string;
  confidence: number;
  evidence?: string[];
}

interface IntentListProps {
  intents: Intent[];
  title?: string;
}

export default function IntentList({ intents, title = 'Hidden Intents' }: IntentListProps) {
  if (!intents || intents.length === 0) {
    return (
      <div className="p-4 bg-dark-800 rounded-lg">
        <p className="text-dark-400 text-sm">No intents detected</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h3 className="text-xs font-semibold uppercase tracking-wider text-dark-400 mb-3">{title}</h3>}
      <div className="space-y-2">
        {intents.map((intent) => (
          <div key={intent.rank} className="flex gap-3 p-3 bg-dark-800 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
              {intent.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-dark-100">{intent.intent}</p>
              {intent.evidence && intent.evidence.length > 0 && (
                <p className="text-xs text-dark-400 mt-1 truncate">
                  {intent.evidence.slice(0, 3).join(', ')}
                </p>
              )}
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${Math.round(intent.confidence * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] text-dark-400 font-mono">
                  {Math.round(intent.confidence * 100)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
