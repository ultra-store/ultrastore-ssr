'use client';

import React, { useState } from 'react';

import Image from 'next/image';

import icons from '@/shared/icons';

import styles from './search-bar.module.css';

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export const SearchBar = ({
  placeholder = 'Поиск',
  onSearch,
  className = '',
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form className={`${styles.searchBar} ${className}`} onSubmit={handleSubmit}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      <button type="submit" className={styles.searchButton} aria-label="Search">
        <Image src={icons.search} alt="Search" width={25} height={25} />
      </button>
    </form>
  );
};
