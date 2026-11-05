export interface CategoryStyle {
  bg: string;
  text: string;
  border: string;
  chartColor: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Food & Dining': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    chartColor: '#F59E0B',
  },
  'Food': {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    chartColor: '#F59E0B',
  },
  'Transportation': {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    chartColor: '#3B82F6',
  },
  'Travel': {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    chartColor: '#3B82F6',
  },
  'Shopping & Retail': {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    chartColor: '#8B5CF6',
  },
  'Shopping': {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    chartColor: '#8B5CF6',
  },
  'Bills & Utilities': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    chartColor: '#10B981',
  },
  'Utilities': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    chartColor: '#10B981',
  },
  'Entertainment': {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    chartColor: '#F43F5E',
  },
  'Healthcare & Medical': {
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    chartColor: '#14B8A6',
  },
  'Health': {
    bg: 'bg-teal-50',
    text: 'text-teal-800',
    border: 'border-teal-200',
    chartColor: '#14B8A6',
  },
  'Education': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-800',
    border: 'border-indigo-200',
    chartColor: '#6366F1',
  },
  'Investment': {
    bg: 'bg-cyan-50',
    text: 'text-cyan-800',
    border: 'border-cyan-200',
    chartColor: '#06B6D4',
  },
  'Salary & Earnings': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-300',
    chartColor: '#059669',
  },
  'Salary': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-300',
    chartColor: '#059669',
  },
  'Other & Miscellaneous': {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    chartColor: '#64748B',
  },
  'Other': {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    chartColor: '#64748B',
  },
};

export const DEFAULT_STYLE: CategoryStyle = {
  bg: 'bg-slate-50',
  text: 'text-slate-700',
  border: 'border-slate-200',
  chartColor: '#94A3B8',
};

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] || DEFAULT_STYLE;
}

