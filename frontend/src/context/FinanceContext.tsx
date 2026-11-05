import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Transaction,
  FinancialSummary,
  SpendingTrendPoint,
  CategoryBreakdown,
  AIInsight,
  AISavingsRecommendation,
  UserSettings,
  ModelMetrics,
} from '../types';
import { api } from '../services/api';

interface FinanceContextType {
  transactions: Transaction[];
  summary: FinancialSummary | null;
  trends: SpendingTrendPoint[];
  categories: CategoryBreakdown[];
  insights: AIInsight[];
  recommendations: AISavingsRecommendation[];
  settings: UserSettings;
  metrics: ModelMetrics | null;
  isLoading: boolean;
  isBackendConnected: boolean;
  toastMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  refreshAll: () => Promise<void>;
  addTransaction: (data: Omit<Transaction, 'id' | 'created_at'>) => Promise<Transaction>;
  updateTransaction: (id: number, data: Partial<Transaction>) => Promise<Transaction>;
  deleteTransaction: (id: number) => Promise<void>;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
  resetDemoData: () => Promise<void>;
  retrainModel: () => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  user_name: 'Shrinivas',
  email: 'shrinivas@finwise.ai',
  currency: 'INR',
  currency_symbol: '₹',
  monthly_budget: 50000,
  savings_goal_percentage: 25,
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [trends, setTrends] = useState<SpendingTrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<AISavingsRecommendation[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        txData,
        sumData,
        trendsData,
        catData,
        insightsData,
        recsData,
        settingsData,
        metricsData,
      ] = await Promise.all([
        api.getTransactions({ limit: 100 }),
        api.getSummary(),
        api.getMonthlyTrends(),
        api.getCategoryBreakdown(),
        api.getInsights(),
        api.getSavingsRecommendations(),
        api.getSettings(),
        api.getModelMetrics(),
      ]);

      setTransactions(txData);
      setSummary(sumData);
      setTrends(trendsData);
      setCategories(catData);
      setInsights(insightsData);
      setRecommendations(recsData);
      setSettings(settingsData);
      setMetrics(metricsData);
      setIsBackendConnected(true);
    } catch (err) {
      console.error('Failed to load data from backend:', err);
      setIsBackendConnected(false);
      showToast('Backend connection error. Please ensure FastAPI server is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
    try {
      const newTx = await api.createTransaction(data);
      showToast(`Added "${newTx.description}" successfully!`);
      await refreshAll();
      return newTx;
    } catch (err) {
      showToast('Failed to add transaction.', 'error');
      throw err;
    }
  };

  const updateTransaction = async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    try {
      const updated = await api.updateTransaction(id, data);
      showToast(`Updated transaction #${id}`);
      await refreshAll();
      return updated;
    } catch (err) {
      showToast('Failed to update transaction.', 'error');
      throw err;
    }
  };

  const deleteTransaction = async (id: number): Promise<void> => {
    try {
      await api.deleteTransaction(id);
      showToast(`Transaction deleted`);
      await refreshAll();
    } catch (err) {
      showToast('Failed to delete transaction.', 'error');
      throw err;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    try {
      const saved = await api.updateSettings(newSettings);
      setSettings(saved);
      showToast('Settings saved successfully!');
      await refreshAll();
    } catch (err) {
      showToast('Failed to save settings.', 'error');
      throw err;
    }
  };

  const resetDemoData = async (): Promise<void> => {
    try {
      await api.resetDemoData();
      showToast('Database reset and re-seeded with demo data!');
      await refreshAll();
    } catch (err) {
      showToast('Failed to reset demo data.', 'error');
      throw err;
    }
  };

  const retrainModel = async (): Promise<void> => {
    try {
      const res = await api.retrainModel();
      showToast(res.message);
      const updatedMetrics = await api.getModelMetrics();
      setMetrics(updatedMetrics);
    } catch (err) {
      showToast('Failed to retrain model.', 'error');
      throw err;
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        summary,
        trends,
        categories,
        insights,
        recommendations,
        settings,
        metrics,
        isLoading,
        isBackendConnected,
        toastMessage,
        showToast,
        hideToast,
        refreshAll,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateSettings,
        resetDemoData,
        retrainModel,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};

