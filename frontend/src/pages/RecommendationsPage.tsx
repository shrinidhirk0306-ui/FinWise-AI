import React from 'react';
import {
  Sparkles,
  Lightbulb,
  Target,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';
import { Badge } from '../components/common/Badge';

export const RecommendationsPage: React.FC = () => {
  const { recommendations, summary, settings } = useFinance();

  const totalMonthlySavings = recommendations.reduce(
    (acc, item) => acc + item.potential_savings,
    0
  );
  const totalAnnualSavings = totalMonthlySavings * 12;

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            Moderate
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Optimization
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Savings Potential Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 sm:p-8 rounded-2xl shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Cashflow Diagnostic</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Personalized Savings Roadmap</h2>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            By analyzing your actual transaction frequency and category spending patterns, FinWise AI
            identified concrete optimization opportunities without compromising your lifestyle essentials.
          </p>
        </div>

        <div className="flex items-center gap-6 bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/10 self-start md:self-auto">
          <div>
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              Monthly Savings Potential
            </span>
            <span className="text-2xl font-bold text-emerald-400">
              {formatCurrency(totalMonthlySavings, settings.currency_symbol, settings.currency)}
            </span>
          </div>
          <div className="pl-6 border-l border-white/20">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
              Projected 1-Year Gain
            </span>
            <span className="text-2xl font-bold text-white">
              {formatCurrency(totalAnnualSavings, settings.currency_symbol, settings.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* 50/30/20 Benchmark Guideline Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">50 / 30 / 20 Financial Health Benchmark</h3>
        </div>
        <p className="text-xs text-slate-500">
          Standard personal finance framework recommending 50% for Needs (Rent, Utilities, Groceries),
          30% for Wants (Dining, Shopping, Entertainment), and 20% for Savings & Investments.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Needs (Target 50%)
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">Utilities & Groceries</span>
            <span className="text-xs text-emerald-700 font-semibold mt-1 inline-block">Well Balanced</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Wants (Target 30%)
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">Dining & Shopping</span>
            <span className="text-xs text-amber-800 font-semibold mt-1 inline-block">Opportunity to optimize</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Savings (Target 20%)
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              Current Rate: {Math.round(summary?.savings_rate || 0)}%
            </span>
            <span className="text-xs text-emerald-800 font-semibold mt-1 inline-block">
              {summary && summary.savings_rate >= 20 ? 'Above Milestone Target' : 'Approaching Target'}
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          Specific Category Optimization Strategies ({recommendations.length})
        </h3>

        {recommendations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-200/80 text-center text-xs text-slate-500">
            No spending anomalies detected. Keep logging transactions to receive fine-grained recommendations.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle hover:shadow-card transition flex flex-col justify-between space-y-4"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge category={rec.category} size="md">
                      {rec.category}
                    </Badge>
                    {getUrgencyBadge(rec.urgency)}
                  </div>

                  {/* Spending comparison metrics */}
                  <div className="mt-3 grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#FAF9F5] border border-stone-100 text-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Current Avg.
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {formatCurrency(rec.current_spend, settings.currency_symbol, settings.currency)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Suggested Cap
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        {formatCurrency(rec.suggested_limit, settings.currency_symbol, settings.currency)}/mo
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Monthly Save
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-emerald-700">
                        +{formatCurrency(rec.potential_savings, settings.currency_symbol, settings.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Diagnostic Insight */}
                  <div className="mt-3 text-xs text-slate-600 leading-relaxed">
                    <p>{rec.insight}</p>
                  </div>
                </div>

                {/* Actionable Tip Box */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-950 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold block text-[11px] text-emerald-800">
                      Actionable Strategy:
                    </strong>
                    <span className="text-[11px] leading-relaxed">{rec.actionable_tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
