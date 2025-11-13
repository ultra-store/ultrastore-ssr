'use client';

import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import icons from '@/shared/icons';

import type { FilterOption } from '@/shared/types';

import styles from './multiselect.module.css';

export interface MultiselectProps {
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (selectedValues: string[]) => void
  type?: 'checkbox' | 'color'
  paramName?: string
  disabled?: boolean
}

export const Multiselect = ({ options, selectedValues, onSelectionChange, type = 'checkbox', paramName, disabled = false }: MultiselectProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateQueryParam = (name: string, values: string[]) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (values.length === 0) {
      params.delete(name);
    } else {
      params.set(name, values.join(','));
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleOptionToggle = (optionValue: string) => {
    if (disabled) {
      return;
    }

    if (selectedValues.includes(optionValue)) {
      const next = selectedValues.filter((value) => value !== optionValue);

      onSelectionChange(next);
      // Don't update URL here - let parent component handle debouncing
      // Only update if onSelectionChange is not provided (fallback)
      if (paramName && !onSelectionChange) {
        updateQueryParam(paramName, next);
      }
    } else {
      const next = [...selectedValues, optionValue];

      onSelectionChange(next);
      // Don't update URL here - let parent component handle debouncing
      // Only update if onSelectionChange is not provided (fallback)
      if (paramName && !onSelectionChange) {
        updateQueryParam(paramName, next);
      }
    }
  };

  return (
    <div className={`${styles.multiselect} ${type === 'color' ? styles.multiselectColor : ''}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        const isColorOption = type === 'color' && option.color;

        return (
          <div
            key={option.value}
            className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${isColorOption ? styles.optionColor : ''} ${disabled ? styles.optionDisabled : ''}`}
            onClick={() => handleOptionToggle(option.value)}
            style={disabled
              ? {
                  pointerEvents: 'none',
                  opacity: 0.5,
                }
              : undefined}
          >
            {isColorOption && (
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: option.color }}
              />
            )}
            {!isColorOption && (
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleOptionToggle(option.value)}
                  className={styles.checkboxInput}
                  disabled={disabled}
                />
              </div>
            )}
            <span className={`medium ${styles.optionLabel}`}>{option.label}</span>
            {option.count !== undefined && (
              <div className={styles.optionCountContainer}>
                {isSelected
                  ? (
                      <Image
                        src={icons.close}
                        alt="Close"
                        width={15}
                        height={15}
                        className={styles.closeIcon}
                      />
                    )
                  : (
                      <span className={`medium text-placeholder ${styles.optionCount}`}>{option.count}</span>
                    )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
