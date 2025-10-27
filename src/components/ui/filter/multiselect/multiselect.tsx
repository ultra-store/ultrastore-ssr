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
}

export const Multiselect = ({ options, selectedValues, onSelectionChange, type = 'checkbox', paramName }: MultiselectProps) => {
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
    if (selectedValues.includes(optionValue)) {
      const next = selectedValues.filter((value) => value !== optionValue);

      onSelectionChange(next);
      if (paramName) {
        updateQueryParam(paramName, next);
      }
    } else {
      const next = [...selectedValues, optionValue];

      onSelectionChange(next);
      if (paramName) {
        updateQueryParam(paramName, next);
      }
    }
  };

  return (
    <div className={`${styles.multiselect} ${type === 'color' ? styles.multiselectColor : ''}`}>
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <div
            key={option.value}
            className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${type === 'color' ? styles.optionColor : ''}`}
            onClick={() => handleOptionToggle(option.value)}
          >
            {type === 'color' && option.color && (
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: option.color }}
              />
            )}
            {type === 'checkbox' && (
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleOptionToggle(option.value)}
                  className={styles.checkboxInput}
                />
              </div>
            )}
            <span className={`medium ${styles.optionLabel}`}>{option.label}</span>
            {type === 'color'
              ? (
                  <div className={styles.optionCountContainer}>
                    <Image
                      src={icons.close}
                      alt="Close"
                      width={15}
                      height={15}
                      className={styles.closeIcon}
                    />
                  </div>
                )
              : (
                  option.count !== undefined && (
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
                  )
                )}
          </div>
        );
      })}
    </div>
  );
};
