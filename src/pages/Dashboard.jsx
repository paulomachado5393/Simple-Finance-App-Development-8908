import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import ExpenseChart from '../components/ExpenseChart';
import BudgetProgress from '../components/BudgetProgress';
import QuickAddExpense from '../components/QuickAddExpense';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiTrendingUp, FiTrendingDown, FiAlertCircle } = FiIcons;

function Dashboard() {
  const { state, getCurrentMonthExpenses, getExpensesByCategory, checkUpcomingBills } = useFinance();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  
  const monthlyExpenses = getCurrentMonthExpenses();
  const expensesByCategory = getExpensesByCategory();
  const upcomingBills = checkUpcomingBills();
  
  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = Object.values(state.budget).reduce((sum, amount) => sum + amount, 0);
  const budgetUsed = (totalExpenses / totalBudget) * 100;

  const stats = [
    {
      title: 'Gastos do Mês',
      value: `R$ ${totalExpenses.toFixed(2)}`,
      icon: () => <span className="text-blue-600 font-bold text-lg">R$</span>,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Orçamento Total',
      value: `R$ ${totalBudget.toFixed(2)}`,
      icon: FiTrendingUp,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      title: 'Restante',
      value: `R$ ${(totalBudget - totalExpenses).toFixed(2)}`,
      icon: FiTrendingDown,
      color: totalBudget - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600',
      bg: totalBudget - totalExpenses >= 0 ? 'bg-green-100' : 'bg-red-100'
    },
    {
      title: 'Contas Próximas',
      value: upcomingBills.length.toString(),
      icon: FiAlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    }
  ];

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Painel</h1>
        <p className="text-gray-600">
          {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                {typeof stat.icon === 'function' ? (
                  stat.icon()
                ) : (
                  <SafeIcon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                )}
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-lg font-semibold text-gray-800">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Budget Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <BudgetProgress />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ExpenseChart />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Gastos por Categoria</h3>
          <div className="space-y-3">
            {state.categories.map(category => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  R$ {(expensesByCategory[category.id] || 0).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Add Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        onClick={() => setShowQuickAdd(true)}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
      >
        <SafeIcon icon={FiIcons.FiPlus} className="w-6 h-6" />
      </motion.button>

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <QuickAddExpense onClose={() => setShowQuickAdd(false)} />
      )}
    </div>
  );
}

export default Dashboard;