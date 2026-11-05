import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import { MonthlyComparisonBar } from '../components/charts/MonthlyComparisonBar';
import { SpendingTrendChart } from '../components/charts/SpendingTrendChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { Badge } from '../components/common/Badge';

export const SpendingAnalysisPage: React.FC = () => {
  const { summary, trends, categories, settings } = useFinance();

  const avgMonthlyExpense = trends.length > 0
    ? Math.round(trends.reduce((acc, curr) => acc + curr.expenses, 0) / trends.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Spending Category */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Top Expense Driver
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-1 truncate">
            {summary?.highest_spending_category || 'N/A'}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Total:{' '}
            <strong className="text-slate-800">
              {formatCurrency(summary?.highest_category_amount || 0, settings.currency_symbol, settings.currency)}
            </strong>
          </p>
        </div>

        {/* Savings Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Savings Rate
          </p>
          <h3 className="text-xl font-bold text-emerald-700 mt-1">
            {formatPercentage(summary?.savings_rate || 0)}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Target benchmark:{' '}
            <strong className="text-slate-800">{settings.savings_goal_percentage}%</strong>
          </p>
        </div>

        {/* Average Monthly Outflow */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Avg. Monthly Outflow
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(avgMonthlyExpense, settings.currency_symbol, settings.currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Calculated over past {trends.length} months
          </p>
        </div>

        {/* Budget Health */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-subtle">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Budget Cap
          </p>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(settings.monthly_budget, settings.currency_symbol, settings.currency)}
          </h3>
          <p className="text-xs text-slate-500 mt-2">
            Spent this month: <strong className="text-slate-800">{summary?.budget_spent_percentage || 0}%</strong>
          </p>
        </div>
      </div>

      {/* Primary Chart: Monthly Income vs Expenses Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Monthly Inflow vs Outflow Comparison
            </h3>
            <p className="text-xs text-slate-500">
              Side-by-side bar chart showing total monthly earnings vs operational expenses
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-slate-700 self-start sm:self-auto">
            {trends.length} Months Tracked
          </span>
        </div>
        <MonthlyComparisonBar data={trends} height={320} />
      </div>

      {/* Secondary Charts: Category Breakdown & Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Share */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Expense Distribution by Category
            </h3>
            <p className="text-xs text-slate-500">Proportional allocation of all recorded expenses</p>
          </div>
          <CategoryPieChart data={categories} height={260} />
        </div>

        {/* Long-term Cumulative Trend */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Cashflow Momentum Trend
            </h3>
            <p className="text-xs text-slate-500">Cumulative trajectory of income vs expenditures</p>
          </div>
          <SpendingTrendChart data={trends} height={260} />
        </div>
      </div>

      {/* Category Breakdown Detailed Table */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Comprehensive Category Breakdown
          </h3>
          <p className="text-xs text-slate-500">Sorted by total expenditure volume</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#FAF9F5] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-stone-100">
              <tr>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6 text-right">Total Amount</th>
                <th className="py-3.5 px-6 text-right">Share of Total</th>
                <th className="py-3.5 px-6 text-center">Transactions</th>
                <th className="py-3.5 px-6 text-right">Avg. per Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-slate-700 font-medium">
              {categories.map((cat) => {
                const avgSpend = cat.count > 0 ? cat.amount / cat.count : 0;
                return (
                  <tr key={cat.category} className="hover:bg-stone-50/70 transition">
                    <td className="py-3.5 px-6">
                      <Badge category={cat.category} size="md">
                        {cat.category}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900">
                      {formatCurrency(cat.amount, settings.currency_symbol, settings.currency)}
                    </td>
                    <td className="py-3.5 px-6 text-right font-semibold text-slate-600">
                      {formatPercentage(cat.percentage)}
                    </td>
                    <td className="py-3.5 px-6 text-center text-xs text-slate-500">
                      {cat.count} txns
                    </td>
                    <td className="py-3.5 px-6 text-right text-xs font-semibold text-slate-700">
                      {formatCurrency(avgSpend, settings.currency_symbol, settings.currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
