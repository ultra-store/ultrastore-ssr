'use client';

import styles from './time-select.module.css';

export interface TimeSlot {
  start: string
  end: string
  label: string
}

interface TimeSelectProps {
  id?: string
  name?: string
  value?: string // Time in format HH:MM
  onChange?: (value: string) => void
  timeSlots?: TimeSlot[]
  className?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * Time select with configurable time slots
 * Value is in format HH:MM
 */
export const TimeSelect = ({
  id,
  name,
  value,
  onChange,
  timeSlots = [],
  className = '',
  placeholder = 'Выберите время',
  autoComplete = 'off',
}: TimeSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    if (onChange) {
      onChange(newValue || '');
    }
  };

  // Default time slots if none provided
  const defaultTimeSlots: TimeSlot[] = [
    {
      start: '09:00',
      end: '12:00',
      label: '09:00 - 12:00',
    },
    {
      start: '12:00',
      end: '15:00',
      label: '12:00 - 15:00',
    },
    {
      start: '15:00',
      end: '18:00',
      label: '15:00 - 18:00',
    },
    {
      start: '18:00',
      end: '21:00',
      label: '18:00 - 21:00',
    },
  ];

  const slots = timeSlots.length > 0 ? timeSlots : defaultTimeSlots;

  // Convert slots to select options
  // Use start time as value
  const options = slots.map((slot) => ({
    value: slot.start,
    label: slot.label,
  }));

  // Find selected option to display correct label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption ? selectedOption.value : value || '';

  return (
    <div className={styles.timeSelect}>
      <select
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        autoComplete={autoComplete}
        className={`${styles.select} ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
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
