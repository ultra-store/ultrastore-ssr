'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import styles from './date-picker.module.css';

interface DatePickerProps {
  id?: string
  name?: string
  value?: string // ISO format: YYYY-MM-DD
  onChange?: (value: string) => void
  minDays?: number // Minimum days from today
  className?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * Date picker with minimum date restriction
 * Value is in ISO format (YYYY-MM-DD) internally
 * Displays in Russian format (DD.MM.YYYY)
 */
export const DatePicker = ({
  id,
  name,
  value,
  onChange,
  minDays = 1,
  className = '',
  placeholder = 'дд.мм.гггг',
  autoComplete = 'off',
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate minimum date (today + minDays)
  const minDate = useMemo(() => {
    const date = new Date();

    date.setDate(date.getDate() + minDays);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }, [minDays]);

  // Convert ISO date (YYYY-MM-DD) to Russian format (DD.MM.YYYY) for display
  const displayValue = useMemo(() => {
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-');

      return `${day}.${month}.${year}`;
    }

    return '';
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (onChange && newValue) {
      onChange(newValue);
      setIsOpen(false);
    }
  }, [onChange]);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  return (
    <div ref={containerRef} className={`${styles.datePicker} ${className}`}>
      <div
        className={styles.inputWrapper}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        aria-label="Выберите дату"
      >
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder}
          className={styles.displayInput}
        />
        <svg
          className={styles.calendarIcon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 2V4M14 2V4M3 8H17M4 4H16C16.5523 4 17 4.44772 17 5V17C17 17.5523 16.5523 18 16 18H4C3.44772 18 3 17.5523 3 17V5C3 4.44772 3.44772 4 4 4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {isOpen && (
        <div className={styles.calendarWrapper}>
          <input
            id={id}
            name={name}
            type="date"
            min={minDate}
            value={value || ''}
            onChange={handleChange}
            autoComplete={autoComplete}
            className={styles.dateInput}
          />
        </div>
      )}
    </div>
  );
};
