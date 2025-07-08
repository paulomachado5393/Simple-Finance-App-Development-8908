import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import ImportExpenses from '../components/ImportExpenses';
import { format } from 'date-fns';

const { FiPlus, FiUpload, FiFilter } = FiIcons;

function Expenses() {
  const { state } = useFinance();
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredExpenses = filter === 'all' 
    ? state.expenses 
    : state.expenses.filter(expense => expense.category === filter);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Despesas</h1>
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Nova Despesa</span>
          </button>
          
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <SafeIcon icon={FiUpload} className="w-4 h-4" />
            <span>Importar CSV</span>
          </button>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as categorias</option>
            {state.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Expenses List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ExpenseList expenses={filteredExpenses} />
      </motion.div>

      {/* Modals */}
      {showForm && (
        <ExpenseForm onClose={() => setShowForm(false)} />
      )}
      
      {showImport && (
        <ImportExpenses onClose={() => setShowImport(false)} />
      )}
    </div>
  );
}

export default Expenses;