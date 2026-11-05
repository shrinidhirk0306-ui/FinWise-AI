export type TransactionType = 'income' | 'expense';

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping & Retail'
  | 'Bills & Utilities'
  | 'Entertainment'
  | 'Healthcare & Medical'
  | 'Education'
  | 'Investment'
  | 'Salary & Earnings'
  | 'Other & Miscellaneous';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  ai_categorized?: boolean;
  confidence?: number;
  notes?: string;
  created_at?: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  current_balance: number;
  total_savings: number;
  savings_rate: number; // percentage
  monthly_budget: number;
  budget_spent_percentage: number;
  highest_spending_category: string;
  highest_category_amount: number;
  recent_trend: 'up' | 'down' | 'neutral';
}

export interface SpendingTrendPoint {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  count: number;
  color?: string;
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'success' | 'info';
  title: string;
  description: string;
  category?: string;
  impact_amount?: number;
}

export interface AISavingsRecommendation {
  id: string;
  category: string;
  current_spend: number;
  suggested_limit: number;
  potential_savings: number;
  insight: string;
  urgency: 'low' | 'medium' | 'high';
  actionable_tip: string;
}

export interface CategoryPrediction {
  description: string;
  predicted_category: string;
  confidence: number; // 0.0 - 1.0 or 0 - 100%
  top_categories?: Array<{
    category: string;
    confidence: number;
  }>;
  model_name?: string;
}

export interface UserSettings {
  user_name: string;
  email: string;
  currency: string;
  currency_symbol: string;
  monthly_budget: number;
  savings_goal_percentage: number;
}

export interface ModelMetrics {
  model_name: string;
  accuracy: number;
  trained_samples_count: number;
  categories: string[];
  last_trained: string;
}

