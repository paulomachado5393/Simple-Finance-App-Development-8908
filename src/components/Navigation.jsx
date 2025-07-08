import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiCreditCard, FiTarget, FiFileText } = FiIcons;

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: FiHome, label: 'Painel' },
    { path: '/expenses', icon: FiCreditCard, label: 'Despesas' },
    { path: '/budget', icon: FiTarget, label: 'Orçamento' },
    { path: '/reports', icon: FiFileText, label: 'Relatórios' }
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:hidden"
    >
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={item.icon} className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}

export default Navigation;