import React from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { useFinance } from '../context/FinanceContext';

function ExpenseChart() {
  const { state, getExpensesByCategory } = useFinance();
  const expensesByCategory = getExpensesByCategory();

  const chartData = state.categories.map(category => ({
    name: category.name,
    value: expensesByCategory[category.id] || 0,
    itemStyle: { color: category.color }
  })).filter(item => item.value > 0);

  const option = {
    title: {
      text: 'Gastos por Categoria',
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#374151'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: R$ {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      textStyle: {
        fontSize: 12,
        color: '#6B7280'
      }
    },
    series: [
      {
        name: 'Gastos',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
    >
      {chartData.length > 0 ? (
        <ReactECharts option={option} style={{ height: '300px' }} />
      ) : (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Nenhum gasto registrado este mês</p>
        </div>
      )}
    </motion.div>
  );
}

export default ExpenseChart;