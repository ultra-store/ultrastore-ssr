'use client';

import { useState } from 'react';

import styles from './filter.module.css';

export interface FilterProps {
  label: string
  collapsible?: boolean
  oneline?: boolean
  defaultOpen?: boolean
  children?: React.ReactNode
}

export const Filter = ({ label, collapsible = true, oneline = false, defaultOpen = false, children }: FilterProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(defaultOpen);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <section
      className={styles.filter}
      data-oneline={oneline}
      data-open={isDropdownOpen}
    >
      <button
        className={styles.filterHeader}
        onClick={handleDropdownClick}
        disabled={!collapsible || oneline}
        aria-expanded={isDropdownOpen}
        aria-label={`${isDropdownOpen ? 'Collapse' : 'Expand'} ${label}`}
      >
        <span className={`medium-bold text-placeholder ${styles.filterLabel}`}>{label}</span>
        {collapsible && !oneline && (
          <span
            className={styles.dropdownButton}
            data-open={isDropdownOpen}
          />
        )}
      </button>
      {children && !oneline && (
        <div
          className={styles.filterContentWrapper}
          data-open={isDropdownOpen}
          data-collapsible={collapsible}
        >
          <div className={styles.filterContent}>
            {children}
          </div>
        </div>
      )}
      {children && oneline && (
        <div className={styles.filterContent}>
          {children}
        </div>
      )}
    </section>
  );
};
