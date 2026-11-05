import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDownRight, ArrowUpRight, Loader2, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';

const AVAILABLE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping & Retail',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare & Medical',
  'Education',
  'Investment',
  'Salary & Earnings',
  'Other & Miscellaneous',
];

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  editTransaction,
}) => {
  const { addTransaction, updateTransaction, settings } = useFinance();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [isCategoryManuallyModified, setIsCategoryManuallyModified] = useState(false);

  // AI prediction preview state
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictedCat, setPredictedCat] = useState<string | null>(null);
  const [predictedConfidence, setPredictedConfidence] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize or reset on open/edit
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setDescription(editTransaction.description);
      setAmount(editTransaction.amount.toString());
      setCategory(editTransaction.category);
      setDate(editTransaction.date);
      setNotes(editTransaction.notes || '');
      setPredictedCat(null);
      setIsCategoryManuallyModified(true);
    } else {
      setType('expense');
      setDescription('');
      setAmount('');
      setCategory('Food & Dining');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setPredictedCat(null);
      setIsCategoryManuallyModified(false);
    }
  }, [editTransaction, isOpen]);

  // Live AI Prediction debounce when typing description
  useEffect(() => {
    if (!description.trim() || editTransaction || type === 'income') {
      setPredictedCat(null);
      return;
    }

    const timer = setTimeout(async () => {
      if (description.trim().length >= 3) {
        setIsPredicting(true);
        try {
          const res = await api.predictCategory(description.trim());
          if (res && res.predicted_category) {
            setPredictedCat(res.predicted_category);
            setPredictedConfidence(res.confidence);
            // Auto-select only if the user hasn't explicitly chosen a different category
            if (!isCategoryManuallyModified) {
              setCategory(res.predicted_category);
            }
          }
        } catch {
          // ignore background prediction errors
        } finally {
          setIsPredicting(false);
        }
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [description, type, editTransaction, isCategoryManuallyModified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    try {
      if (editTransaction) {
        await updateTransaction(editTransaction.id, {
          description: description.trim(),
          amount: parseFloat(amount),
          type,
          category,
          date,
          notes: notes.trim() || undefined,
        });
      } else {
        await addTransaction({
          description: description.trim(),
          amount: parseFloat(amount),
          type,
          category,
          date,
          ai_categorized: Boolean(predictedCat && predictedCat === category),
          confidence: predictedConfidence || 1.0,
          notes: notes.trim() || undefined,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'Record New Transaction'}
      subtitle="Enter details below. FinWise AI will auto-categorize your expense in real-time."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setType('expense');
              if (category === 'Salary & Earnings') setCategory('Food & Dining');
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              type === 'expense'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setType('income');
              setCategory('Salary & Earnings');
              setPredictedCat(null);
            }}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              type === 'income'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Income</span>
          </button>
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Transaction Description <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="e.g. Swiggy lunch order, Uber ride, Amazon purchase"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            {isPredicting && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              </div>
            )}
          </div>

          {/* Real-time AI Categorisation Banner */}
          {predictedCat && type === 'expense' && (
            <div className="mt-2 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  AI Suggested: <strong>{predictedCat}</strong> ({Math.round((predictedConfidence || 0.8) * 100)}% match)
                </span>
              </div>
              {category === predictedCat ? (
                <span className="text-[10px] bg-emerald-200/60 font-semibold px-2 py-0.5 rounded-full text-emerald-800">
                  Auto-Selected
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCategory(predictedCat);
                    setIsCategoryManuallyModified(false);
                  }}
                  className="text-[10px] bg-emerald-600 hover:bg-emerald-700 font-semibold px-2 py-0.5 rounded-full text-white transition"
                >
                  Apply AI Choice
                </button>
              )}
            </div>
          )}
        </div>

        {/* Amount & Date in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amount ({settings.currency_symbol}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-400">
                {settings.currency_symbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setIsCategoryManuallyModified(true);
            }}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          >
            {AVAILABLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Notes / Tag (Optional)
          </label>
          <input
            type="text"
            placeholder="Add brief memo or reference tag"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-slate-600 hover:bg-stone-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{editTransaction ? 'Save Changes' : 'Record Transaction'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

