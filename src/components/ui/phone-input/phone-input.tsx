'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './phone-input.module.css';

interface PhoneInputProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  autoComplete?: string
  required?: boolean
}

// Format phone number for display: +7 (999) 999-99-99
const formatPhoneForDisplay = (phone: string): string => {
  if (!phone) {
    return '';
  }

  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 0) {
    return '';
  }

  // If starts with 8, replace with 7
  let normalizedDigits = digits;

  if (normalizedDigits.startsWith('8') && normalizedDigits.length > 1) {
    normalizedDigits = '7' + normalizedDigits.slice(1);
  }

  // If doesn't start with 7, prepend 7
  if (!normalizedDigits.startsWith('7') && normalizedDigits.length > 0) {
    normalizedDigits = '7' + normalizedDigits;
  }

  // Format: +7 (XXX) XXX-XX-XX
  if (normalizedDigits.length <= 1) {
    return normalizedDigits === '7' ? '+7' : `+${normalizedDigits}`;
  } else if (normalizedDigits.length <= 4) {
    return `+7 (${normalizedDigits.slice(1)}`;
  } else if (normalizedDigits.length <= 7) {
    return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4)}`;
  } else if (normalizedDigits.length <= 9) {
    return `+7 (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7)}`;
  } else {
    const part1 = normalizedDigits.slice(1, 4);
    const part2 = normalizedDigits.slice(4, 7);
    const part3 = normalizedDigits.slice(7, 9);
    const part4 = normalizedDigits.slice(9, 11);
    const formatted = `+7 (${part1}) ${part2}-${part3}-${part4}`;

    return formatted;
  }
};

// Convert display format to raw digits (7XXXXXXXXXX)
const formatPhoneForStorage = (display: string): string => {
  const digits = display.replace(/\D/g, '');

  // If starts with 8, replace with 7
  if (digits.startsWith('8') && digits.length > 1) {
    return '7' + digits.slice(1);
  }

  // If doesn't start with 7, prepend 7
  if (digits.length > 0 && !digits.startsWith('7')) {
    return '7' + digits;
  }

  return digits;
};

/**
 * Phone input with Russian format mask (+7 (999) 999-99-99)
 * Formats input automatically as user types
 */
export const PhoneInput = ({
  id,
  name,
  value,
  onChange,
  className = '',
  placeholder = '+7 (999) 999-99-99',
  autoComplete = 'tel',
  required = false,
}: PhoneInputProps) => {
  const [displayValue, setDisplayValue] = useState(() => {
    // Convert stored phone value to display format
    return formatPhoneForDisplay(value || '');
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatPhoneForDisplay(inputValue);

    // Limit to 18 characters (+7 (999) 999-99-99)
    const limitedFormatted = formatted.slice(0, 18);

    setDisplayValue(limitedFormatted);

    // Convert to storage format and notify parent
    if (onChange) {
      const storageValue = formatPhoneForStorage(limitedFormatted);

      onChange(storageValue);
    }
  }, [onChange]);

  // Update display value when value prop changes (external update)
  // This effect synchronizes external value prop with internal display state
  useEffect(() => {
    const formatted = formatPhoneForDisplay(value || '');

    // Only update if formatted value is different from current display
    // Use setTimeout to avoid synchronous setState in effect
    setTimeout(() => {
      setDisplayValue((prev) => {
        if (prev !== formatted) {
          return formatted;
        }

        return prev;
      });
    }, 0);
  }, [value]);

  return (
    <input
      ref={inputRef}
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete={autoComplete}
      className={`${styles.phoneInput} ${className}`}
      value={displayValue}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      maxLength={18}
    />
  );
};
