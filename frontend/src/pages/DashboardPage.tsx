import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Target,
  Plus,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { StatCard } from '../components/common/StatCard';
import { SpendingTrendChart } from '../components/charts/SpendingTrendChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { Badge } from '../components/common/Badge';
import { TransactionFormModal } from '../components/transactions/TransactionFormModal';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { summary, trends, categories, transactions, insights, settings } = useFinance();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const recentTransactions = transactions.slice(0, 6);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-indigo-600 flex-shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />;
    }
  };

  const getInsightBg = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50/70 border-amber-200/80 text-amber-950';
      case 'success':
        return 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950';
      case 'tip':
        return 'bg-indigo-50/70 border-indigo-200/80 text-indigo-950';
      default:
        return 'bg-blue-50/70 border-blue-200/80 text-blue-950';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          amount={formatCurrency(summary?.total_income || 0, settings.currency_symbol, settings.currency)}
          subtitle="All recorded inflows"
          icon={ArrowUpRight}
          variant="emerald"
        />
        <StatCard
          title="Total Expenses"
          amount={formatCurrency(summary?.total_expenses || 0, settings.currency_symbol, settings.currency)}
          subtitle="All recorded outflows"
          icon={ArrowDownRight}
          variant="navy"
        />
        <StatCard
          title="Current Balance"
          amount={formatCurrency(summary?.current_balance || 0, settings.currency_symbol, settings.currency)}
          subtitle={`Net balance in ${settings.currency}`}
          trend={summary && summary.current_balance >= 0 ? 'up' : 'down'}
          trendValue={summary && summary.total_income > 0 ? `${Math.round((summary.current_balance / summary.total_income) * 100)}% retained` : undefined}
          icon={Wallet}
          variant="emerald"
        />
        <StatCard
          title="Total Savings"
          amount={formatCurrency(summary?.total_savings || 0, settings.currency_symbol, settings.currency)}
          subtitle={`Savings Rate: ${formatPercentage(summary?.savings_rate || 0)}`}
          trend={summary && summary.savings_rate >= 20 ? 'up' : 'neutral'}
          trendValue={summary ? `${Math.round(summary.savings_rate)}% rate` : undefined}
          icon={PiggyBank}
        />
      </div>

      {/* Monthly Budget Progress Bar Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">Monthly Budget Tracking</h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-slate-600">
                Target: {formatCurrency(settings.monthly_budget, settings.currency_symbol, settings.currency)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Current month usage stands at {summary?.budget_spent_percentage || 0}% of budget cap.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 min-w-[240px] md:max-w-xs w-full">
          <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (summary?.budget_spent_percentage || 0) > 90
                  ? 'bg-rose-500'
                  : (summary?.budget_spent_percentage || 0) > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, summary?.budget_spent_percentage || 0)}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-900 w-12 text-right">
            {summary?.budget_spent_percentage || 0}%
          </span>
        </div>
      </div>

      {/* Charts Section: Monthly Spending + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Cashflow & Spending Trend
              </h3>
              <p className="text-xs text-slate-500">Historical monthly comparison (Income vs Outflows)</p>
            </div>
            <button
              onClick={() => onNavigate('spending-analysis')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <SpendingTrendChart data={trends} height={280} />
        </div>

        {/* Expense Category Breakdown (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Expense Categories</h3>
              <span className="text-xs font-semibold text-slate-400">Share %</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Proportional expenditure allocation</p>
            <CategoryPieChart data={categories} height={240} />
          </div>
          {summary?.highest_spending_category && summary.highest_spending_category !== 'None' && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Top Category:</span>
              <span className="font-bold text-slate-900">
                {summary.highest_spending_category} ({formatCurrency(summary.highest_category_amount, settings.currency_symbol, settings.currency)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lower Section: AI Financial Insights & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Financial Insights (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                AI Financial Insights
              </h3>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              Active
            </span>
          </div>

          <div className="space-y-2.5">
            {insights.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Log more transactions to reveal tailored AI insights.
              </p>
            ) : (
              insights.map((ins) => (
                <div
                  key={ins.id}
                  className={`p-3.5 rounded-xl border ${getInsightBg(ins.type)} transition`}
                >
                  <div className="flex items-start gap-2.5">
                    {getInsightIcon(ins.type)}
                    <div>
                      <h4 className="text-xs font-bold leading-tight">{ins.title}</h4>
                      <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
                        {ins.description}
                      </p>
                      {ins.impact_amount && (
                        <div className="mt-2 text-[10px] font-bold text-emerald-700">
                          Potential Savings Impact: {formatCurrency(ins.impact_amount, settings.currency_symbol, settings.currency)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => onNavigate('savings-recommendations')}
            className="w-full mt-2 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-slate-700 hover:bg-stone-50 flex items-center justify-center gap-1.5 transition"
          >
            <span>Explore All AI Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Transactions (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Recent Activity
                </h3>
                <p className="text-xs text-slate-500">Latest income and expense entries</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => onNavigate('transactions')}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition"
                >
                  <span>View All ({transactions.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-stone-100">
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                return (
                  <div
                    key={tx.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-stone-50/50 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-stone-100 text-slate-700'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0 truncate">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {tx.description}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <Badge category={tx.category} size="sm">
                            {tx.category}
                          </Badge>
                          {tx.ai_categorized && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-700 font-semibold">
                              <Sparkles className="w-2.5 h-2.5" />
                              AI
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`text-xs font-bold flex-shrink-0 ${
                        isIncome ? 'text-emerald-600' : 'text-slate-900'
                      }`}
                    >
                      {isIncome ? '+' : '-'}
                      {formatCurrency(tx.amount, settings.currency_symbol, settings.currency)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <TransactionFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

