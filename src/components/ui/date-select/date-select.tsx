'use client';

import styles from './date-select.module.css';

export interface DateOption {
  value: string // ISO format: YYYY-MM-DD
  label: string
  short_label?: string
  day?: number
  month?: number
  year?: number
  day_of_week?: string
}

interface DateSelectProps {
  id?: string
  name?: string
  value?: string // ISO format: YYYY-MM-DD
  onChange?: (value: string) => void
  dateOptions?: DateOption[]
  className?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * Date select with configurable date options
 * Value is in ISO format (YYYY-MM-DD)
 */
export const DateSelect = ({
  id,
  name,
  value,
  onChange,
  dateOptions = [],
  className = '',
  placeholder = 'Выберите дату',
  autoComplete = 'off',
}: DateSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (onChange) {
      onChange(newValue || '');
    }
  };

  // Find selected option to ensure correct display
  const selectedOption = dateOptions.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.value : value || '';

  return (
    <div className={styles.dateSelect}>
      <select
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        autoComplete={autoComplete}
        className={`${styles.select} ${className}`}
      >
        <option value="">{placeholder}</option>
        {dateOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        className={styles.arrowIcon}
        width="12"
        height="8"
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1 1L6 6L11 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
