export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-KE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
    suspended: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
    revoked: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400',
    expired: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
    warning: 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400',
    safe: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
    final_warning: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
    suspension_review: 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
    submitted: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
    under_review: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400',
    approved: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
    rejected: 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400',
    issued: 'text-orange-600 bg-orange-50 dark:bg-orange-950 dark:text-orange-400',
    paid: 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400',
    contested: 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400',
    resolved: 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400',
  };
  return map[status] || 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
}

export function getRiskColor(score: number): string {
  if (score < 0.3) return 'text-green-600';
  if (score < 0.6) return 'text-yellow-600';
  return 'text-red-600';
}

export function getRiskLabel(score: number): string {
  if (!score) return 'Unknown';
  if (score < 0.3) return 'Low';
  if (score < 0.6) return 'Medium';
  return 'High';
}

export function getDemeritStatus(points: number): { label: string; color: string } {
  if (points >= 15) return { label: 'Safe', color: 'text-green-600' };
  if (points >= 10) return { label: 'Warning', color: 'text-yellow-600' };
  if (points >= 5) return { label: 'Final Warning', color: 'text-orange-600' };
  if (points >= 1) return { label: 'Suspension Review', color: 'text-purple-600' };
  return { label: 'Suspended', color: 'text-red-600' };
}