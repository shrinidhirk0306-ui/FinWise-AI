import {
  Transaction,
  FinancialSummary,
  SpendingTrendPoint,
  CategoryBreakdown,
  AIInsight,
  AISavingsRecommendation,
  CategoryPrediction,
  UserSettings,
  ModelMetrics,
} from '../types';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API error (${response.status}): ${errorBody || response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Transactions
  getTransactions: async (params?: {
    q?: string;
    category?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<Transaction[]> => {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.category) query.append('category', params.category);
    if (params?.type) query.append('type', params.type);
    if (params?.start_date) query.append('start_date', params.start_date);
    if (params?.end_date) query.append('end_date', params.end_date);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.offset) query.append('offset', params.offset.toString());

    return fetchJson<Transaction[]>(`${API_BASE_URL}/transactions?${query.toString()}`);
  },

  createTransaction: async (data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
    return fetchJson<Transaction>(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTransaction: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    return fetchJson<Transaction>(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTransaction: async (id: number): Promise<{ success: boolean; message: string }> => {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });
  },

  // AI Categorisation
  predictCategory: async (description: string): Promise<CategoryPrediction> => {
    return fetchJson<CategoryPrediction>(`${API_BASE_URL}/ai/predict`, {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  },

  getModelMetrics: async (): Promise<ModelMetrics> => {
    return fetchJson<ModelMetrics>(`${API_BASE_URL}/ai/metrics`);
  },

  retrainModel: async (): Promise<{
    success: boolean;
    message: string;
    accuracy: number;
    samples_count: number;
    categories: string[];
  }> => {
    return fetchJson(`${API_BASE_URL}/ai/retrain`, {
      method: 'POST',
    });
  },

  // Analytics
  getSummary: async (): Promise<FinancialSummary> => {
    return fetchJson<FinancialSummary>(`${API_BASE_URL}/analytics/summary`);
  },

  getMonthlyTrends: async (): Promise<SpendingTrendPoint[]> => {
    return fetchJson<SpendingTrendPoint[]>(`${API_BASE_URL}/analytics/monthly-trends`);
  },

  getCategoryBreakdown: async (): Promise<CategoryBreakdown[]> => {
    return fetchJson<CategoryBreakdown[]>(`${API_BASE_URL}/analytics/category-breakdown`);
  },

  getInsights: async (): Promise<AIInsight[]> => {
    return fetchJson<AIInsight[]>(`${API_BASE_URL}/analytics/insights`);
  },

  // Recommendations
  getSavingsRecommendations: async (): Promise<AISavingsRecommendation[]> => {
    return fetchJson<AISavingsRecommendation[]>(`${API_BASE_URL}/recommendations/savings`);
  },

  // Settings
  getSettings: async (): Promise<UserSettings> => {
    return fetchJson<UserSettings>(`${API_BASE_URL}/settings`);
  },

  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    return fetchJson<UserSettings>(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  resetDemoData: async (): Promise<{ success: boolean; message: string }> => {
    return fetchJson<{ success: boolean; message: string }>(`${API_BASE_URL}/settings/reset-seed`, {
      method: 'POST',
    });
  },
};

