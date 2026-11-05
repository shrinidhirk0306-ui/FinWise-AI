import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface NavbarProps {
  activeTab: string;
  onOpenMobileMenu: () => void;
  onOpenAddModal: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Financial Dashboard',
    subtitle: 'Overview of your cashflow, spending breakdown, and AI insights',
  },
  transactions: {
    title: 'Transaction Management',
    subtitle: 'Track, search, filter and categorize your income and expenses',
  },
  'ai-categorisation': {
    title: 'AI Expense Categorisation Engine',
    subtitle: 'Powered by Scikit-learn TF-IDF Multinomial Naive Bayes',
  },
  'spending-analysis': {
    title: 'Spending Pattern Analysis',
    subtitle: 'Interactive visualisations and monthly comparison benchmarks',
  },
  'savings-recommendations': {
    title: 'AI Savings Recommendations',
    subtitle: 'Tailored recommendations calculated directly from your transaction logs',
  },
  settings: {
    title: 'Application Settings',
    subtitle: 'User profile, monthly budgets, and currency configuration',
  },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onOpenMobileMenu,
  onOpenAddModal,
}) => {
  const { settings } = useFinance();
  const currentTabInfo = TAB_TITLES[activeTab] || {
    title: 'FinWise AI',
    subtitle: 'Intelligent Personal Finance Management',
  };

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left Title & Mobile Menu Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-stone-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
            {currentTabInfo.title}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">{currentTabInfo.subtitle}</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Date Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-slate-600">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayFormatted}</span>
        </div>

        {/* Currency Pill */}
        <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
          <span>{settings.currency}</span>
          <span>({settings.currency_symbol})</span>
        </div>

        {/* New Transaction CTA */}
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>

        {/* Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
          {settings.user_name ? settings.user_name.charAt(0).toUpperCase() : 'S'}
        </div>
      </div>
    </header>
  );
};
