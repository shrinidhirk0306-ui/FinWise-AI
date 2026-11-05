import React, { useState, useEffect } from 'react';
import {
  User,
  Coins,
  RotateCcw,
  Save,
  Loader2,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';

const CURRENCY_OPTIONS = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' },
  { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'British Pound (GBP)' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham (AED)' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar (SGD)' },
];

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData } = useFinance();

  const [userName, setUserName] = useState(settings.user_name);
  const [email, setEmail] = useState(settings.email);
  const [currency, setCurrency] = useState(settings.currency);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currency_symbol);
  const [monthlyBudget, setMonthlyBudget] = useState(settings.monthly_budget.toString());
  const [savingsGoal, setSavingsGoal] = useState(settings.savings_goal_percentage.toString());

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    setUserName(settings.user_name);
    setEmail(settings.email);
    setCurrency(settings.currency);
    setCurrencySymbol(settings.currency_symbol);
    setMonthlyBudget(settings.monthly_budget.toString());
    setSavingsGoal(settings.savings_goal_percentage.toString());
  }, [settings]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = CURRENCY_OPTIONS.find((c) => c.code === e.target.value);
    if (selected) {
      setCurrency(selected.code);
      setCurrencySymbol(selected.symbol);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        user_name: userName.trim(),
        email: email.trim(),
        currency,
        currency_symbol: currencySymbol,
        monthly_budget: parseFloat(monthlyBudget) || 50000,
        savings_goal_percentage: parseFloat(savingsGoal) || 25,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = async () => {
    if (
      window.confirm(
        'Are you sure you want to reseed sample demo data? This will restore initial transaction records for demonstration.'
      )
    ) {
      setIsResetting(true);
      try {
        await resetDemoData();
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">System Settings</h2>
        <p className="text-xs text-slate-500">
          Configure personal preferences, default operational currency, and monthly budget limits.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* User Profile Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">User Profile</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Currency & Financial Configuration Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <Coins className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Currency & Budget Targets</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Currency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Default Currency
              </label>
              <select
                value={currency}
                onChange={handleCurrencyChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Monthly Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Budget ({currencySymbol})
              </label>
              <input
                type="number"
                step="500"
                min="1000"
                required
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Savings Goal % */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Savings Rate (%)
              </label>
              <input
                type="number"
                step="1"
                min="5"
                max="90"
                required
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving Preferences...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Demo Data Management Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Academic Demonstration Controls</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Reset database and restore the realistic initial seed dataset (57 realistic transactions, trends, and AI labels).
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetData}
            disabled={isResetting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold transition disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting Data...' : 'Reset Demo Dataset'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
