'use client';

import { useCallback, useEffect, useState } from 'react';

import styles from './time-input.module.css';

interface TimeInputProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * Time input with 24-hour format (HH:MM)
 * Displays and accepts time in 24-hour format
 */
export const TimeInput = ({
  id,
  name,
  value,
  onChange,
  className = '',
  placeholder = 'чч:мм',
  autoComplete = 'off',
}: TimeInputProps) => {
  const [displayValue, setDisplayValue] = useState(() => {
    // Value is already in HH:MM format (24-hour)
    return value || '';
  });

  // Format display value (HH:MM)
  const formatDisplay = useCallback((str: string): string => {
    // Remove all non-digits
    const digits = str.replace(/\D/g, '');

    if (digits.length === 0) {
      return '';
    }

    // Limit to 4 digits (HHMM)
    const limitedDigits = digits.slice(0, 4);

    // Add colon at appropriate position
    if (limitedDigits.length <= 2) {
      return limitedDigits;
    } else {
      return `${limitedDigits.slice(0, 2)}:${limitedDigits.slice(2)}`;
    }
  }, []);

  // Validate time format (HH:MM)
  const validateTime = useCallback((timeStr: string): boolean => {
    if (!timeStr.match(/^\d{2}:\d{2}$/)) {
      return false;
    }

    const [hours, minutes] = timeStr.split(':').map(Number);

    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatDisplay(inputValue);

    setDisplayValue(formatted);

    // Validate and notify parent if valid
    if (onChange && formatted.match(/^\d{2}:\d{2}$/)) {
      if (validateTime(formatted)) {
        onChange(formatted);
      }
    }
  }, [formatDisplay, validateTime, onChange]);

  const handleBlur = useCallback(() => {
    // Validate and notify parent on blur
    if (displayValue && displayValue.match(/^\d{2}:\d{2}$/)) {
      if (validateTime(displayValue) && onChange) {
        onChange(displayValue);
      }
    }
  }, [displayValue, validateTime, onChange]);

  // Update display value when value prop changes (external update)
  useEffect(() => {
    if (value && value.match(/^\d{2}:\d{2}$/)) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setDisplayValue(value), 0);
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
      className={`${styles.timeInput} ${className}`}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      maxLength={5}
    />
  );
};
