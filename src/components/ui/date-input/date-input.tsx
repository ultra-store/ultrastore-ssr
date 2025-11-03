'use client';

import { useCallback, useEffect, useState } from 'react';

import styles from './date-input.module.css';

interface DateInputProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * Date input with Russian format (DD.MM.YYYY)
 * Converts between internal ISO format (YYYY-MM-DD) and display format (DD.MM.YYYY)
 */
export const DateInput = ({
  id,
  name,
  value,
  onChange,
  className = '',
  placeholder = 'дд.мм.гггг',
  autoComplete = 'off',
}: DateInputProps) => {
  const [displayValue, setDisplayValue] = useState(() => {
    // Convert ISO date (YYYY-MM-DD) to Russian format (DD.MM.YYYY)
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-');

      return `${day}.${month}.${year}`;
    }

    return value || '';
  });

  // Convert Russian format (DD.MM.YYYY) to ISO format (YYYY-MM-DD)
  const formatToISO = useCallback((dateStr: string): string => {
    // Remove all non-digits
    const digits = dateStr.replace(/\D/g, '');

    if (digits.length === 0) {
      return '';
    }

    // Parse DD.MM.YYYY
    if (digits.length >= 8) {
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);

      // Basic validation
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1900) {
        // Format as YYYY-MM-DD
        return `${year}-${month}-${day}`;
      }
    }

    return '';
  }, []);

  // Format display value (DD.MM.YYYY)
  const formatDisplay = useCallback((str: string): string => {
    // Remove all non-digits
    const digits = str.replace(/\D/g, '');

    if (digits.length === 0) {
      return '';
    }

    // Add dots at appropriate positions
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    } else {
      return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatDisplay(inputValue);

    setDisplayValue(formatted);

    // Convert to ISO format and notify parent
    if (onChange) {
      const isoValue = formatToISO(formatted);

      onChange(isoValue);
    }
  }, [formatDisplay, formatToISO, onChange]);

  const handleBlur = useCallback(() => {
    // Convert display value to ISO format on blur
    const isoValue = formatToISO(displayValue);

    if (isoValue && onChange) {
      onChange(isoValue);
    }
  }, [displayValue, formatToISO, onChange]);

  // Update display value when value prop changes (external update)
  useEffect(() => {
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = value.split('-');
      const formatted = `${day}.${month}.${year}`;

      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setDisplayValue(formatted), 0);
    } else if (!value) {
      setTimeout(() => setDisplayValue(''), 0);
    }
  }, [value]);

  return (
    <input
      id={id}
      name={name}
      type="text"
      inputMode="numeric"
      autoComplete={autoComplete}
      className={`${styles.dateInput} ${className}`}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={10}
    />
  );
};
