export function formatCurrency(
  amount: number,
  currencySymbol = '₹',
  currencyCode = 'INR'
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return `${currencySymbol}0`;
  }

  try {
    if (currencyCode === 'INR') {
      // Indian numbering system format (lakhs & crores)
      return `${currencySymbol}${amount.toLocaleString('en-IN', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      })}`;
    }
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    })}`;
  } catch {
    return `${currencySymbol}${amount.toFixed(0)}`;
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeDate(dateString: string): string {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`;

  return formatDate(dateString);
}

export function formatPercentage(val: number): string {
  if (isNaN(val) || val === null || val === undefined) return '0%';
  return `${Math.round(val)}%`;
}

