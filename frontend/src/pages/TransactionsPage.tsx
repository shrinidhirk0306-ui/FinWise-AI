import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionFilters } from '../components/transactions/TransactionFilters';
import { TransactionFormModal } from '../components/transactions/TransactionFormModal';

export const TransactionsPage: React.FC = () => {
  const { transactions, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Transaction | null>(null);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const descMatch = tx.description.toLowerCase().includes(q);
        const notesMatch = tx.notes?.toLowerCase().includes(q);
        if (!descMatch && !notesMatch) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && tx.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== 'All' && tx.type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, selectedCategory, selectedType]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedType('All');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">All Transactions</h2>
          <p className="text-xs text-slate-500">
            Manage your ledger, inspect AI classification accuracy, and record new activities.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Search and Filters */}
      <TransactionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onReset={handleResetFilters}
      />

      {/* Transaction Data Table */}
      <TransactionList
        transactions={filteredTransactions}
        onEdit={(tx) => setEditTarget(tx)}
        onDelete={(id) => deleteTransaction(id)}
      />

      {/* Add / Edit Modal */}
      <TransactionFormModal
        isOpen={isAddModalOpen || editTarget !== null}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditTarget(null);
        }}
        editTransaction={editTarget}
      />
    </div>
  );
};

