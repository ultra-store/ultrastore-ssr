'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { state } = useCart();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              UltraStore
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Главная
            </Link>
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Каталог
            </Link>
          </nav>

          {/* Cart */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/cart"
              className="relative text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <div className="flex items-center space-x-1">
                {/* Cart Icon */}
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.8 9.2M7 13l1.8-9.2M7 13v6a2 2 0 002 2h8a2 2 0 002-2v-6M9 19v2m6-2v2" 
                  />
                </svg>
                <span className="text-sm font-medium">Корзина</span>
              </div>
              
              {/* Cart Badge */}
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount > 99 ? '99+' : state.itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-3">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Главная
            </Link>
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Каталог
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}