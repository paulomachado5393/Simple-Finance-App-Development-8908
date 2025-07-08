import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import Papa from 'papaparse';

const { FiX, FiUpload, FiFileText, FiCheck } = FiIcons;

function ImportExpenses({ onClose }) {
  const { dispatch } = useFinance();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        const validData = results.data
          .filter(row => row.description && row.amount)
          .map(row => ({
            description: row.description || row.descricao,
            amount: parseFloat(row.amount || row.valor) || 0,
            category: row.category || row.categoria || 'outros',
            date: row.date || row.data || new Date().toISOString().split('T')[0],
            notes: row.notes || row.observacoes || ''
          }));
        
        setPreview(validData);
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Erro ao processar CSV:', error);
        setIsLoading(false);
      }
    });
  };

  const handleImport = () => {
    if (preview.length === 0) return;

    dispatch({
      type: 'IMPORT_EXPENSES',
      payload: preview
    });

    onClose();
  };

  const downloadTemplate = () => {
    const template = [
      {
        description: 'Almoço no restaurante',
        amount: 25.50,
        category: 'alimentacao',
        date: '2024-01-15',
        notes: 'Restaurante do centro'
      },
      {
        description: 'Combustível',
        amount: 80.00,
        category: 'transporte',
        date: '2024-01-14',
        notes: 'Posto XYZ'
      }
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template_despesas.csv';
    link.click();
  };

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
        className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Importar Despesas</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">Instruções para importação:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• O arquivo deve estar no formato CSV</li>
            <li>• Colunas obrigatórias: description, amount</li>
            <li>• Colunas opcionais: category, date, notes</li>
            <li>• Categorias válidas: alimentacao, transporte, moradia, saude, educacao, lazer, outros</li>
          </ul>
          <button
            onClick={downloadTemplate}
            className="mt-3 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4" />
            <span>Baixar template de exemplo</span>
          </button>
        </div>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <SafeIcon icon={FiUpload} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Arraste um arquivo CSV aqui ou clique para selecionar</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <SafeIcon icon={FiFileText} className="w-4 h-4 mr-2" />
            Selecionar arquivo
          </label>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Processando arquivo...</p>
          </div>
        )}

        {/* Preview */}
        {preview.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">
              Prévia ({preview.length} despesas encontradas)
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {preview.slice(0, 5).map((expense, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                    <div>
                      <p className="font-medium text-gray-800">{expense.description}</p>
                      <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                    </div>
                    <span className="font-medium text-gray-800">R$ {expense.amount.toFixed(2)}</span>
                  </div>
                ))}
                {preview.length > 5 && (
                  <p className="text-sm text-gray-600 text-center py-2">
                    ... e mais {preview.length - 5} despesas
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiCheck} className="w-4 h-4" />
            <span>Importar {preview.length} despesas</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ImportExpenses;