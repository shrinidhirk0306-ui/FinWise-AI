import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Sparkles,
  ArrowDownRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { useFinance } from '../../context/FinanceContext';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
  itemsPerPage?: number;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  itemsPerPage = 12,
}) => {
  const { settings } = useFinance();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = transactions.slice(startIndex, startIndex + itemsPerPage);

  const handleExportCSV = () => {
    if (transactions.length === 0) return;
    const headers = ['ID', 'Date', 'Type', 'Description', 'Category', 'Amount', 'AI Categorized', 'Confidence', 'Notes'];
    const rows = transactions.map((t) => [
      t.id,
      t.date,
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.category}"`,
      t.amount,
      t.ai_categorized ? 'Yes' : 'No',
      t.confidence ? `${Math.round(t.confidence * 100)}%` : 'N/A',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FinWise_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <FileSpreadsheet className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-900">No transactions found</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Try adjusting your search criteria or filter options, or click &ldquo;Add Transaction&rdquo; above.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-subtle overflow-hidden">
      {/* Table Header Controls */}
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length} records
        </span>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#FAF9F5] text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-stone-100">
            <tr>
              <th className="py-3.5 px-6">Date</th>
              <th className="py-3.5 px-6">Description</th>
              <th className="py-3.5 px-6">Category</th>
              <th className="py-3.5 px-6 text-right">Amount</th>
              <th className="py-3.5 px-6 text-center">AI Confidence</th>
              <th className="py-3.5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-slate-700 font-medium">
            {currentItems.map((tx) => {
              const isIncome = tx.type === 'income';
              return (
                <tr key={tx.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Date */}
                  <td className="py-3.5 px-6 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-stone-100 text-slate-600'
                        }`}
                      >
                        {isIncome ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 tracking-tight">
                          {tx.description}
                        </div>
                        {tx.notes && (
                          <div className="text-[11px] text-slate-400 font-normal">{tx.notes}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-3.5 px-6 whitespace-nowrap">
                    <Badge category={tx.category} size="sm">
                      {tx.category}
                    </Badge>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3.5 px-6 text-right font-bold whitespace-nowrap ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount, settings.currency_symbol, settings.currency)}
                  </td>

                  {/* AI Categorisation Tag */}
                  <td className="py-3.5 px-6 text-center whitespace-nowrap">
                    {tx.ai_categorized ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                        <Sparkles className="w-2.5 h-2.5" />
                        {tx.confidence ? `${Math.round(tx.confidence * 100)}%` : 'AI'}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-normal">Manual</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 transition"
                        title="Edit Transaction"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${tx.description}"?`)) {
                            onDelete(tx.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-6 py-3.5 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-slate-600 bg-[#FAF9F5]">
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-stone-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-stone-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

