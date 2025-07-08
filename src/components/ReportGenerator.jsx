import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiDownload, FiMail, FiShare2 } = FiIcons;

function ReportGenerator({ reportType, selectedMonth, expenses, categories, budget }) {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Título do relatório
    doc.setFontSize(20);
    doc.text('Relatório Financeiro', 20, 20);
    
    // Período
    doc.setFontSize(12);
    doc.text(`Período: ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}`, 20, 35);
    
    // Resumo geral
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = Object.values(budget).reduce((sum, amount) => sum + amount, 0);
    
    doc.text(`Total de Despesas: R$ ${totalExpenses.toFixed(2)}`, 20, 50);
    doc.text(`Orçamento Total: R$ ${totalBudget.toFixed(2)}`, 20, 60);
    doc.text(`Saldo: R$ ${(totalBudget - totalExpenses).toFixed(2)}`, 20, 70);
    
    // Tabela de despesas por categoria
    const categoryData = categories.map(category => {
      const categoryExpenses = expenses.filter(expense => expense.category === category.id);
      const categoryTotal = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const categoryBudget = budget[category.id] || 0;
      
      return [
        category.name,
        `R$ ${categoryTotal.toFixed(2)}`,
        `R$ ${categoryBudget.toFixed(2)}`,
        `${categoryBudget > 0 ? ((categoryTotal / categoryBudget) * 100).toFixed(1) : 0}%`
      ];
    });
    
    doc.autoTable({
      head: [['Categoria', 'Gasto', 'Orçamento', '% Utilizado']],
      body: categoryData,
      startY: 85,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    // Tabela de despesas detalhadas
    if (reportType === 'detailed') {
      const expenseData = expenses.map(expense => {
        const category = categories.find(cat => cat.id === expense.category);
        return [
          format(new Date(expense.date), 'dd/MM/yyyy', { locale: ptBR }),
          expense.description,
          category?.name || 'Outros',
          `R$ ${expense.amount.toFixed(2)}`
        ];
      });
      
      doc.autoTable({
        head: [['Data', 'Descrição', 'Categoria', 'Valor']],
        body: expenseData,
        startY: doc.lastAutoTable.finalY + 20,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [59, 130, 246] }
      });
    }
    
    // Rodapé
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Gerado em ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })} - Página ${i} de ${pageCount}`,
        20,
        doc.internal.pageSize.height - 10
      );
    }
    
    // Download do PDF
    doc.save(`relatorio-financeiro-${format(selectedMonth, 'yyyy-MM')}.pdf`);
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Relatório Financeiro',
        text: `Relatório financeiro de ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}`,
        url: window.location.href
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const reportData = {
        periodo: format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR }),
        totalDespesas: expenses.reduce((sum, expense) => sum + expense.amount, 0),
        totalOrcamento: Object.values(budget).reduce((sum, amount) => sum + amount, 0),
        quantidadeDespesas: expenses.length
      };
      
      const shareText = `Relatório Financeiro - ${reportData.periodo}
      
Total de Despesas: R$ ${reportData.totalDespesas.toFixed(2)}
Total do Orçamento: R$ ${reportData.totalOrcamento.toFixed(2)}
Quantidade de Despesas: ${reportData.quantidadeDespesas}
Saldo: R$ ${(reportData.totalOrcamento - reportData.totalDespesas).toFixed(2)}`;
      
      navigator.clipboard.writeText(shareText);
      alert('Relatório copiado para a área de transferência!');
    }
  };

  const sendByEmail = () => {
    const subject = `Relatório Financeiro - ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}`;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = Object.values(budget).reduce((sum, amount) => sum + amount, 0);
    
    const body = `Relatório Financeiro
    
Período: ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}
Total de Despesas: R$ ${totalExpenses.toFixed(2)}
Total do Orçamento: R$ ${totalBudget.toFixed(2)}
Saldo: R$ ${(totalBudget - totalExpenses).toFixed(2)}
Quantidade de Despesas: ${expenses.length}

Despesas por Categoria:
${categories.map(category => {
  const categoryTotal = expenses
    .filter(expense => expense.category === category.id)
    .reduce((sum, expense) => sum + expense.amount, 0);
  return `${category.name}: R$ ${categoryTotal.toFixed(2)}`;
}).join('\n')}`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3"
    >
      <button
        onClick={generatePDF}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        <SafeIcon icon={FiDownload} className="w-4 h-4" />
        <span>Baixar PDF</span>
      </button>
      
      <button
        onClick={sendByEmail}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <SafeIcon icon={FiMail} className="w-4 h-4" />
        <span>Enviar por Email</span>
      </button>
      
      <button
        onClick={shareReport}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <SafeIcon icon={FiShare2} className="w-4 h-4" />
        <span>Compartilhar</span>
      </button>
    </motion.div>
  );
}

export default ReportGenerator;