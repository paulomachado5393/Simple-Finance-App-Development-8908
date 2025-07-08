import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiHome, FiCreditCard, FiTarget, FiFileText, FiMenu } = FiIcons;

function Header() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: FiHome, label: 'Painel' },
    { path: '/expenses', icon: FiCreditCard, label: 'Despesas' },
    { path: '/budget', icon: FiTarget, label: 'Orçamento' },
    { path: '/reports', icon: FiFileText, label: 'Relatórios' }
  ];

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo e Nome */}
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg">
            <span className="text-white font-bold text-lg">R$</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">FinanFácil</h1>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5 mr-2" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button - Visível apenas em mobile */}
        <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <SafeIcon icon={FiMenu} className="w-6 h-6" />
        </button>
      </div>
    </motion.header>
  );
}

export default Header;