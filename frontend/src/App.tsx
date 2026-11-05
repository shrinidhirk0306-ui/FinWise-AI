import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { AICategorizationPage } from './pages/AICategorizationPage';
import { SpendingAnalysisPage } from './pages/SpendingAnalysisPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const { isLoading } = useFinance();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'transactions':
        return <TransactionsPage />;
      case 'ai-categorisation':
        return <AICategorizationPage />;
      case 'spending-analysis':
        return <SpendingAnalysisPage />;
      case 'savings-recommendations':
        return <RecommendationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading FinWise AI environment...</p>
        </div>
      ) : (
        renderActivePage()
      )}
    </Layout>
  );
};

export function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;
