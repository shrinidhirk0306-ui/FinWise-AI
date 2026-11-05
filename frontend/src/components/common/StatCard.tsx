import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: LucideIcon;
  variant?: 'default' | 'emerald' | 'navy';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
  variant = 'default',
}) => {
  const getIconStyles = () => {
    switch (variant) {
      case 'emerald':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'navy':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200/60';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-subtle hover:shadow-card transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{amount}</h3>
        </div>
        <div className={`p-2.5 rounded-xl border ${getIconStyles()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trendValue) && (
        <div className="mt-4 flex items-center gap-2 text-xs">
          {trendValue && (
            <span
              className={`inline-flex items-center font-semibold px-1.5 py-0.5 rounded-md ${
                trend === 'up'
                  ? 'bg-emerald-50 text-emerald-700'
                  : trend === 'down'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-slate-50 text-slate-600'
              }`}
            >
              {trend === 'up' ? '↑ ' : trend === 'down' ? '↓ ' : '• '}
              {trendValue}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

