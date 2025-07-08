import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';

const { FiX, FiSave } = FiIcons;

function BudgetForm({ onClose }) {
  const { state, dispatch } = useFinance();
  const [budgetData, setBudgetData] = useState(state.budget);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    dispatch({
      type: 'UPDATE_BUDGET',
      payload: budgetData
    });
    
    onClose();
  };

  const handleCategoryChange = (categoryId, value) => {
    setBudgetData(prev => ({
      ...prev,
      [categoryId]: parseFloat(value) || 0
    }));
  };

  const totalBudget = Object.values(budgetData).reduce((sum, amount) => sum + amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Editar Orçamento</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {state.categories.map(category => (
            <div key={category.id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </label>
              <input
                type="number"
                step="0.01"
                value={budgetData[category.id] || ''}
                onChange={(e) => handleCategoryChange(category.id, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          ))}
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-gray-800">Total do Orçamento:</span>
              <span className="text-xl font-bold text-blue-600">
                R$ {totalBudget.toFixed(2)}
              </span>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiSave} className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default BudgetForm;