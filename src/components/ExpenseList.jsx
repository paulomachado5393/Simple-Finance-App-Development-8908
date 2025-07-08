import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiTrash2, FiEdit, FiCalendar, FiClock } = FiIcons;

function ExpenseList({ expenses }) {
  const { state, dispatch } = useFinance();
  
  const handleDelete = (expenseId) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      dispatch({
        type: 'DELETE_EXPENSE',
        payload: expenseId
      });
    }
  };

  const getCategoryInfo = (categoryId) => {
    return state.categories.find(cat => cat.id === categoryId);
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="text-gray-400 mb-4">
          <SafeIcon icon={FiIcons.FiInbox} className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Nenhuma despesa encontrada</h3>
        <p className="text-gray-600">Adicione sua primeira despesa para começar a controlar suas finanças.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800">
          Despesas ({expenses.length})
        </h2>
      </div>
      
      <div className="divide-y divide-gray-100">
        {expenses.map((expense, index) => {
          const category = getCategoryInfo(expense.category);
          
          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{category?.icon}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {expense.description}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600">
                        {category?.name}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <SafeIcon icon={FiCalendar} className="w-3 h-3" />
                        <span>{format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                      {expense.dueDate && (
                        <div className="flex items-center space-x-1 text-sm text-orange-600">
                          <SafeIcon icon={FiClock} className="w-3 h-3" />
                          <span>Vence: {format(new Date(expense.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        </div>
                      )}
                    </div>
                    {expense.notes && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {expense.notes}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-800">
                      R$ {expense.amount.toFixed(2)}
                    </p>
                    {expense.isRecurring && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Recorrente
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ExpenseList;