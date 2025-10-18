'use client';

import React, { useState, useRef, useEffect } from 'react';

import Image from 'next/image';

import icons from '@/shared/icons';

import styles from './search-bar.module.css';

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export const SearchBar = ({ placeholder = 'Поиск', onSearch, className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      if (query) {
        handleSubmit(e);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <form
      ref={formRef}
      className={`${styles.searchBar} ${isExpanded ? styles.expanded : ''} ${className}`}
      onSubmit={handleSubmit}
    >
      <input
        aria-label="Поиск"
        name="search"
        ref={inputRef}
        type="text"
        autoComplete="off"
        className={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      <button type="button" className={styles.searchButton} aria-label="Поиск" onClick={handleIconClick}>
        <Image src={icons.search} alt="Поиск" width={25} height={25} />
      </button>
    </form>
  );
};
