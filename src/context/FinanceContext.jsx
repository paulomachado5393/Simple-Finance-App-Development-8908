import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, addDays } from 'date-fns';

const FinanceContext = createContext();

const initialState = {
  expenses: [],
  budget: {
    alimentacao: 800,
    transporte: 400,
    moradia: 1200,
    saude: 300,
    educacao: 200,
    lazer: 250,
    outros: 150
  },
  notifications: [],
  categories: [
    { id: 'alimentacao', name: 'Alimentação', color: '#EF4444', icon: '🍽️' },
    { id: 'transporte', name: 'Transporte', color: '#3B82F6', icon: '🚗' },
    { id: 'moradia', name: 'Moradia', color: '#10B981', icon: '🏠' },
    { id: 'saude', name: 'Saúde', color: '#F59E0B', icon: '🏥' },
    { id: 'educacao', name: 'Educação', color: '#8B5CF6', icon: '📚' },
    { id: 'lazer', name: 'Lazer', color: '#EC4899', icon: '🎮' },
    { id: 'outros', name: 'Outros', color: '#6B7280', icon: '📦' }
  ]
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE':
      const newExpense = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      const updatedExpenses = [...state.expenses, newExpense];
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      return { ...state, expenses: updatedExpenses };

    case 'DELETE_EXPENSE':
      const filteredExpenses = state.expenses.filter(expense => expense.id !== action.payload);
      localStorage.setItem('expenses', JSON.stringify(filteredExpenses));
      return { ...state, expenses: filteredExpenses };

    case 'UPDATE_BUDGET':
      const updatedBudget = { ...state.budget, ...action.payload };
      localStorage.setItem('budget', JSON.stringify(updatedBudget));
      return { ...state, budget: updatedBudget };

    case 'LOAD_DATA':
      return { ...state, ...action.payload };

    case 'IMPORT_EXPENSES':
      const importedExpenses = [...state.expenses, ...action.payload];
      localStorage.setItem('expenses', JSON.stringify(importedExpenses));
      return { ...state, expenses: importedExpenses };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);

  useEffect(() => {
    // Carregar dados do localStorage
    const savedExpenses = localStorage.getItem('expenses');
    const savedBudget = localStorage.getItem('budget');
    
    if (savedExpenses || savedBudget) {
      dispatch({
        type: 'LOAD_DATA',
        payload: {
          expenses: savedExpenses ? JSON.parse(savedExpenses) : [],
          budget: savedBudget ? JSON.parse(savedBudget) : initialState.budget
        }
      });
    }
  }, []);

  // Função para calcular gastos por categoria no mês atual
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
    });
  };

  // Função para calcular total por categoria
  const getExpensesByCategory = () => {
    const monthlyExpenses = getCurrentMonthExpenses();
    const byCategory = {};
    
    state.categories.forEach(category => {
      byCategory[category.id] = monthlyExpenses
        .filter(expense => expense.category === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
    });
    
    return byCategory;
  };

  // Função para verificar contas próximas do vencimento
  const checkUpcomingBills = () => {
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    
    const upcomingBills = state.expenses.filter(expense => {
      if (!expense.dueDate) return false;
      const dueDate = new Date(expense.dueDate);
      return isWithinInterval(dueDate, { start: today, end: threeDaysFromNow });
    });
    
    return upcomingBills;
  };

  const value = {
    state,
    dispatch,
    getCurrentMonthExpenses,
    getExpensesByCategory,
    checkUpcomingBills
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}