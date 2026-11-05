import React from 'react';
import { getCategoryStyle } from '../../utils/categoryColors';

interface BadgeProps {
  children: React.ReactNode;
  category?: string;
  variant?: 'emerald' | 'amber' | 'rose' | 'slate' | 'blue';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  category,
  variant,
  size = 'md',
  className = '',
}) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';

  if (category) {
    const catStyle = getCategoryStyle(category);
    styleClasses = `${catStyle.bg} ${catStyle.text} ${catStyle.border}`;
  } else if (variant === 'emerald') {
    styleClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  } else if (variant === 'amber') {
    styleClasses = 'bg-amber-50 text-amber-800 border-amber-200';
  } else if (variant === 'rose') {
    styleClasses = 'bg-rose-50 text-rose-800 border-rose-200';
  } else if (variant === 'blue') {
    styleClasses = 'bg-blue-50 text-blue-800 border-blue-200';
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${styleClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};

