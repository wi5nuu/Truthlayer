export function validateDomain(domain: string): boolean {
  if (!domain || domain.length > 253) return false;
  return /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(domain);
}

export function truncate(str: string, max = 100): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 3) + '...' : str;
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  } catch { return iso; }
}

export function trustScoreColor(score: number): string {
  if (score >= 80) return '#059669';
  if (score >= 60) return '#10B981';
  if (score >= 40) return '#D97706';
  if (score >= 20) return '#F97316';
  return '#DC2626';
}

export function trustScoreLabel(score: number): string {
  if (score >= 80) return 'Highly Trustworthy';
  if (score >= 60) return 'Generally Trustworthy';
  if (score >= 40) return 'Use With Caution';
  if (score >= 20) return 'Potentially Manipulative';
  return 'High Risk';
}

export function manipulationLabel(level: string): string {
  const labels: Record<string, string> = { low: 'Low', medium: 'Medium', high: 'High', extreme: 'Extreme' };
  return labels[level] || level;
}

export function severityColor(severity: string): string {
  const colors: Record<string, string> = { low: '#64748B', medium: '#D97706', high: '#DC2626' };
  return colors[severity] || '#64748B';
}
