'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button } from '@heroui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { state } = useCart();

  return (
    <Navbar
      className="bg-white shadow-sm border-b border-gray-200"
      maxWidth="full"
      classNames={{
        wrapper: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16',
      }}
    >
      <NavbarContent justify="start">
        <NavbarBrand>
          <Link href="/" className="text-xl font-bold text-gray-900">
            UltraStore
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden md:flex" justify="center">
        <NavbarItem>
          <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
            Главная
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/catalog" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">
            Каталог
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <div className="relative">
            <Button as={Link} href="/cart" variant="light" size="sm" className="text-gray-700 hover:text-blue-600">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="ml-1 text-sm font-medium">Корзина</span>
            </Button>
            {state.itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] leading-none font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                {state.itemCount > 99 ? '99+' : state.itemCount}
              </span>
            )}
          </div>
        </NavbarItem>
        
      </NavbarContent>
      
    </Navbar>
  );
}