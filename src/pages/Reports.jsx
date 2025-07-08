import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import ReportGenerator from '../components/ReportGenerator';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiDownload, FiMail, FiFileText, FiCalendar } = FiIcons;

function Reports() {
  const { state, getCurrentMonthExpenses, getExpensesByCategory } = useFinance();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [reportType, setReportType] = useState('monthly');
  
  const monthlyExpenses = getCurrentMonthExpenses();
  const expensesByCategory = getExpensesByCategory();
  
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const date = subMonths(currentDate, i);
      options.push({
        value: date,
        label: format(date, "MMMM 'de' yyyy", { locale: ptBR })
      });
    }
    
    return options;
  };

  const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBudget = Object.values(state.budget).reduce((sum, amount) => sum + amount, 0);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Relatórios</h1>
        <p className="text-gray-600">Gere relatórios detalhados das suas finanças</p>
      </motion.div>

      {/* Report Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Configurações do Relatório</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Relatório Mensal</option>
              <option value="category">Por Categoria</option>
              <option value="detailed">Detalhado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período
            </label>
            <select
              value={selectedMonth.toISOString()}
              onChange={(e) => setSelectedMonth(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {generateMonthOptions().map(option => (
                <option key={option.value.toISOString()} value={option.value.toISOString()}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <ReportGenerator
          reportType={reportType}
          selectedMonth={selectedMonth}
          expenses={monthlyExpenses}
          categories={state.categories}
          budget={state.budget}
        />
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiFileText} className="w-6 h-6 text-blue-600" />
            <span className="text-sm text-gray-600">Total</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            {monthlyExpenses.length}
          </p>
          <p className="text-sm text-gray-600">Despesas</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiIcons.FiDollarSign} className="w-6 h-6 text-green-600" />
            <span className="text-sm text-gray-600">Valor</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            R$ {totalExpenses.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Gastos</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiIcons.FiTarget} className="w-6 h-6 text-orange-600" />
            <span className="text-sm text-gray-600">Orçamento</span>
          </div>
          <p className="text-xl font-bold text-gray-800">
            R$ {totalBudget.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Total</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <SafeIcon icon={FiIcons.FiTrendingUp} className="w-6 h-6 text-purple-600" />
            <span className="text-sm text-gray-600">Economia</span>
          </div>
          <p className={`text-xl font-bold ${totalBudget - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {(totalBudget - totalExpenses).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Saldo</p>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Resumo por Categoria</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {state.categories.map((category, index) => {
              const amount = expensesByCategory[category.id] || 0;
              const budgetAmount = state.budget[category.id] || 0;
              const percentage = budgetAmount > 0 ? (amount / budgetAmount) * 100 : 0;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-600">
                        {percentage.toFixed(1)}% do orçamento
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      R$ {amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      de R$ {budgetAmount.toFixed(2)}
                    </p>
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

export default Reports;