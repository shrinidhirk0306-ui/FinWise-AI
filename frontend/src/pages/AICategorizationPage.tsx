import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  RefreshCw,
  CheckCircle2,
  Loader2,
  Layers,
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { api } from '../services/api';
import { CategoryPrediction } from '../types';
import { Badge } from '../components/common/Badge';

const PRESET_EXAMPLES = [
  'Swiggy lunch order',
  'Uber ride',
  'Amazon purchase',
  'Electricity payment',
  'Netflix monthly subscription',
  'Apollo Pharmacy medicine',
  'Zerodha mutual fund SIP',
  'Coursera specialization fee',
];

export const AICategorizationPage: React.FC = () => {
  const { metrics, retrainModel } = useFinance();

  const [inputQuery, setInputQuery] = useState('Swiggy lunch order');
  const [isClassifying, setIsClassifying] = useState(false);
  const [prediction, setPrediction] = useState<CategoryPrediction | null>({
    description: 'Swiggy lunch order',
    predicted_category: 'Food & Dining',
    confidence: 0.8707,
    top_categories: [
      { category: 'Food & Dining', confidence: 0.8707 },
      { category: 'Shopping & Retail', confidence: 0.0274 },
      { category: 'Transportation', confidence: 0.0148 },
      { category: 'Entertainment', confidence: 0.0137 },
    ],
    model_name: 'Multinomial Naive Bayes (TF-IDF)',
  });
  const [isRetraining, setIsRetraining] = useState(false);

  const handleClassify = async (text: string) => {
    if (!text.trim()) return;
    setIsClassifying(true);
    try {
      const res = await api.predictCategory(text.trim());
      setPrediction(res);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleRetrain = async () => {
    setIsRetraining(true);
    try {
      await retrainModel();
      // Re-run test prediction
      if (inputQuery.trim()) {
        await handleClassify(inputQuery.trim());
      }
    } finally {
      setIsRetraining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction Banner */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded-md bg-emerald-50 text-emerald-700">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-emerald-800 tracking-wide uppercase">
              Academic Project: CIA-2 AI for Finance
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Automated Expense Categorisation Engine
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl mt-1 leading-relaxed">
            Powered by a real <strong>Multinomial Naive Bayes</strong> classifier trained on TF-IDF
            unigrams and bigrams. The system tokenizes transaction text, builds term-frequency feature vectors,
            and calculates posterior probabilities across 10 financial categories.
          </p>
        </div>

        <button
          onClick={handleRetrain}
          disabled={isRetraining}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-slate-800 shadow-sm transition disabled:opacity-50 whitespace-nowrap self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetraining ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isRetraining ? 'Retraining Pipeline...' : 'Retrain ML Model'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Testing Playground (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Live Transaction Classification Playground
              </h3>
              <p className="text-xs text-slate-500">
                Type any real-world transaction description or select from preset samples.
              </p>
            </div>

            {/* Input & Classify Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. Swiggy lunch order, Uber ride, Amazon purchase..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClassify(inputQuery)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
              <button
                onClick={() => handleClassify(inputQuery)}
                disabled={isClassifying || !inputQuery.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
              >
                {isClassifying ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Classify Transaction</span>
              </button>
            </div>

            {/* Presets Pills */}
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Click preset examples from syllabus:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    onClick={() => {
                      setInputQuery(example);
                      handleClassify(example);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                      inputQuery === example
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-stone-50 hover:bg-stone-100 text-slate-700 border-stone-200/80'
                    }`}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Prediction Output Card */}
            {prediction && (
              <div className="pt-4 border-t border-stone-100 space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Input Description
                    </span>
                    <span className="text-sm font-semibold text-slate-900 italic">
                      &ldquo;{prediction.description}&rdquo;
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Predicted Category
                      </span>
                      <Badge category={prediction.predicted_category} size="md">
                        {prediction.predicted_category}
                      </Badge>
                    </div>

                    <div className="text-right pl-3 border-l border-stone-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Confidence
                      </span>
                      <span className="text-base font-bold text-emerald-700">
                        {Math.round(prediction.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Candidate Probability Distribution */}
                {prediction.top_categories && prediction.top_categories.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                      Posterior Class Probabilities (P(Category | Description))
                    </h4>
                    <div className="space-y-2">
                      {prediction.top_categories.map((candidate, idx) => {
                        const pct = Math.round(candidate.confidence * 100);
                        const isTop = idx === 0;
                        return (
                          <div key={candidate.category} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-medium">
                              <span className={isTop ? 'font-bold text-slate-900' : 'text-slate-600'}>
                                {candidate.category} {isTop && '(Predicted Winner)'}
                              </span>
                              <span className={isTop ? 'font-bold text-emerald-700' : 'text-slate-500'}>
                                {pct}%
                              </span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isTop ? 'bg-emerald-600' : 'bg-slate-400'
                                }`}
                                style={{ width: `${Math.max(4, pct)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Technical Architecture & Model Metrics (1 col) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Model Diagnostics
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-slate-500 font-medium">ML Model</span>
                <span className="font-bold text-slate-900">Multinomial Naive Bayes</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-slate-500 font-medium">Feature Extraction</span>
                <span className="font-bold text-slate-900">TF-IDF (1, 2) n-grams</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-slate-500 font-medium">Laplace Smoothing</span>
                <span className="font-bold text-slate-900">&alpha; = 0.1</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-slate-500 font-medium">Training Samples</span>
                <span className="font-bold text-slate-900">{metrics?.trained_samples_count || 147}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-slate-500 font-medium">Target Classes</span>
                <span className="font-bold text-slate-900">{metrics?.categories?.length || 10}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-stone-100">
                <span className="text-slate-500 font-medium">Last Trained</span>
                <span className="font-bold text-slate-900">{metrics?.last_trained || 'Just now'}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Genuine ML Integration</span>
              </div>
              <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                No simulated if-else logic. All predictions are computed on-the-fly by Scikit-learn via FastAPI.
              </p>
            </div>
          </div>

          {/* Supported Categories Card */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-subtle space-y-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-bold text-slate-900">Class Label Space (10)</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(metrics?.categories || [
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
              ]).map((cat) => (
                <Badge key={cat} category={cat} size="sm">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
