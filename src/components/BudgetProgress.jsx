import React from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';

function BudgetProgress() {
  const { state, getExpensesByCategory } = useFinance();
  const expensesByCategory = getExpensesByCategory();

  const totalBudget = Object.values(state.budget).reduce((sum, amount) => sum + amount, 0);
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
  const percentage = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Progresso do Orçamento</h3>
        <span className="text-sm text-gray-600">
          {percentage.toFixed(1)}% utilizado
        </span>
      </div>
      
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-3 rounded-full ${
              percentage > 100 ? 'bg-red-500' : 
              percentage > 80 ? 'bg-yellow-500' : 
              'bg-green-500'
            }`}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">
          Gastos: R$ {totalExpenses.toFixed(2)}
        </span>
        <span className="text-gray-600">
          Orçamento: R$ {totalBudget.toFixed(2)}
        </span>
      </div>
      
      {percentage > 100 && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            ⚠️ Você excedeu seu orçamento em R$ {(totalExpenses - totalBudget).toFixed(2)}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default BudgetProgress;