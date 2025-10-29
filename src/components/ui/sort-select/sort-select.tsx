'use client';

import { useState, useRef, useEffect } from 'react';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import icons from '@/shared/icons';
import type { SortOption } from '@/shared/types';

import styles from './sort-select.module.css';

interface SortSelectProps {
  options: SortOption[]
  defaultValue: string
  paramName?: string
}

export const SortSelect = ({ options, defaultValue, paramName = 'orderby' }: SortSelectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get(paramName) || defaultValue;
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === currentSort) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateQueryParam = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === defaultValue) {
      params.delete(paramName);
    } else {
      params.set(paramName, value);
    }

    // Reset to page 1 when changing sort
    params.delete('page');

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOptionClick = (option: SortOption) => {
    updateQueryParam(option.value);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.sortSelect} ref={dropdownRef} data-open={isOpen}>
      <button
        type="button"
        className={styles.trigger}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="large">{selectedOption.label}</span>
        <span className={styles.iconContainer}>
          <span className={styles.icon} data-open={isOpen}></span>
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} role="listbox">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.option} ${selectedOption.value === option.value ? styles.optionSelected : ''}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedOption.value === option.value}
            >
              <span className="medium">{option.label}</span>
              {selectedOption.value === option.value && (
                <span className={styles.checkmarkIcon}>
                  <Image src={icons.checkmark} alt="Selected" width={15} height={15} />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
