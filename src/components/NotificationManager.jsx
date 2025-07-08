import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useFinance } from '../context/FinanceContext';
import { format, isWithinInterval, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { FiX, FiAlertCircle, FiBell } = FiIcons;

function NotificationManager() {
  const { checkUpcomingBills, state } = useFinance();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    // Verificar contas próximas do vencimento
    const upcomingBills = checkUpcomingBills();
    
    const billNotifications = upcomingBills.map(bill => ({
      id: `bill-${bill.id}`,
      type: 'warning',
      title: 'Conta próxima do vencimento',
      message: `${bill.description} - R$ ${bill.amount.toFixed(2)}`,
      dueDate: bill.dueDate,
      action: () => {
        // Navegar para a página de despesas ou abrir modal de edição
        console.log('Abrir despesa:', bill.id);
      }
    }));
    
    setNotifications(billNotifications);
    
    // Configurar notificações do navegador se permitido
    if ('Notification' in window && Notification.permission === 'granted') {
      upcomingBills.forEach(bill => {
        new Notification('Conta próxima do vencimento', {
          body: `${bill.description} - R$ ${bill.amount.toFixed(2)} vence em breve`,
          icon: '/favicon.ico'
        });
      });
    }
  }, [state.expenses]);

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissAll = () => {
    setNotifications([]);
  };

  if (notifications.length === 0) return null;

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed top-20 right-4 z-50 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
      >
        <SafeIcon icon={FiBell} className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </motion.button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-32 right-4 z-40 bg-white rounded-xl shadow-lg border border-gray-200 w-80 max-w-[calc(100vw-2rem)]"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notificações</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={dismissAll}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Limpar tudo
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(notification => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <SafeIcon 
                        icon={FiAlertCircle} 
                        className="w-5 h-5 text-orange-500" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-800">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.dueDate && (
                        <p className="text-xs text-gray-500 mt-1">
                          Vence em: {format(new Date(notification.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                    >
                      <SafeIcon icon={FiX} className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={requestNotificationPermission}
                className="w-full text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ativar notificações do navegador
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default NotificationManager;