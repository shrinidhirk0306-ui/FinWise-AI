import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryBreakdown } from '../../types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { getCategoryStyle } from '../../utils/categoryColors';
import { useFinance } from '../../context/FinanceContext';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
  height?: number;
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  data,
  height = 280,
}) => {
  const { settings } = useFinance();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-xl text-xs space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: getCategoryStyle(item.category).chartColor }}
            />
            <span className="font-bold text-slate-800">{item.category}</span>
          </div>
          <p className="font-semibold text-slate-900">
            {formatCurrency(item.amount, settings.currency_symbol, settings.currency)} ({formatPercentage(item.percentage)})
          </p>
          <p className="text-[10px] text-slate-500">{item.count} transactions recorded</p>
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center text-xs text-slate-400 h-[280px]">
        No expense data recorded yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4" style={{ minHeight: height }}>
      <div className="w-full sm:w-1/2 h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="amount"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getCategoryStyle(entry.category).chartColor}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend list */}
      <div className="w-full sm:w-1/2 space-y-1.5 max-h-[220px] overflow-y-auto pr-2">
        {data.slice(0, 6).map((item) => (
          <div
            key={item.category}
            className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-none"
          >
            <div className="flex items-center gap-2 truncate">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: getCategoryStyle(item.category).chartColor }}
              />
              <span className="text-slate-700 font-medium truncate">{item.category}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="font-bold text-slate-900">
                {formatCurrency(item.amount, settings.currency_symbol, settings.currency)}
              </span>
              <span className="text-slate-400 text-[11px] w-8 text-right font-medium">
                {Math.round(item.percentage)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

