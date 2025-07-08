import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import BudgetForm from '../components/BudgetForm';

const { FiEdit, FiSave, FiX } = FiIcons;

function Budget() {
  const { state, dispatch, getExpensesByCategory } = useFinance();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue] = useState('');
  
  const expensesByCategory = getExpensesByCategory();

  const handleEdit = (categoryId, currentValue) => {
    setEditingCategory(categoryId);
    setEditValue(currentValue.toString());
  };

  const handleSave = (categoryId) => {
    const newValue = parseFloat(editValue) || 0;
    dispatch({
      type: 'UPDATE_BUDGET',
      payload: { [categoryId]: newValue }
    });
    setEditingCategory(null);
    setEditValue('');
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setEditValue('');
  };

  const totalBudget = Object.values(state.budget).reduce((sum, amount) => sum + amount, 0);
  const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Orçamento</h1>
        <p className="text-gray-600">Gerencie seu orçamento mensal por categoria</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm text-gray-600 mb-2">Orçamento Total</h3>
          <p className="text-2xl font-bold text-blue-600">R$ {totalBudget.toFixed(2)}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm text-gray-600 mb-2">Gastos Atuais</h3>
          <p className="text-2xl font-bold text-orange-600">R$ {totalExpenses.toFixed(2)}</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm text-gray-600 mb-2">Saldo Restante</h3>
          <p className={`text-2xl font-bold ${totalBudget - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {(totalBudget - totalExpenses).toFixed(2)}
          </p>
        </motion.div>
      </div>

      {/* Budget Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Categorias de Orçamento</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {state.categories.map((category, index) => {
              const budgetAmount = state.budget[category.id] || 0;
              const expenseAmount = expensesByCategory[category.id] || 0;
              const percentage = budgetAmount > 0 ? (expenseAmount / budgetAmount) * 100 : 0;
              const isOverBudget = percentage > 100;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <h3 className="font-medium text-gray-800">{category.name}</h3>
                        <p className="text-sm text-gray-600">
                          R$ {expenseAmount.toFixed(2)} de R$ {budgetAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {editingCategory === category.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0.00"
                          />
                          <button
                            onClick={() => handleSave(category.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                          >
                            <SafeIcon icon={FiSave} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <SafeIcon icon={FiX} className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(category.id, budgetAmount)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <SafeIcon icon={FiEdit} className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{percentage.toFixed(1)}%</span>
                      <span className={isOverBudget ? 'text-red-600 font-medium' : ''}>
                        {isOverBudget ? 'Acima do orçamento!' : 'Dentro do orçamento'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Budget;