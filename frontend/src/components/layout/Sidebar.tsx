import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Sparkles,
  PieChart,
  PiggyBank,
  Settings,
  Cpu,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const { metrics, isBackendConnected } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'ai-categorisation', label: 'AI Categorisation', icon: Sparkles, badge: 'ML' },
    { id: 'spending-analysis', label: 'Spending Analysis', icon: PieChart },
    { id: 'savings-recommendations', label: 'AI Savings', icon: PiggyBank },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center gap-3 px-6 border-b border-stone-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 tracking-tight text-base">FinWise</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-none">Smart Finance SaaS</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-stone-100/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Model Status Card */}
        <div className="p-4 m-4 rounded-xl bg-stone-50 border border-stone-200/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Classifier</span>
            </div>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                isBackendConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              <CheckCircle2 className="w-2.5 h-2.5" />
              {isBackendConnected ? 'Online' : 'Offline'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mb-2">
            Multinomial Naive Bayes model trained with TF-IDF vectorization.
          </p>
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 pt-2 border-t border-stone-200/60">
            <span>Accuracy:</span>
            <span className="text-emerald-700 font-bold">
              {metrics ? `${Math.round(metrics.accuracy * 100)}%` : '94%'}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

