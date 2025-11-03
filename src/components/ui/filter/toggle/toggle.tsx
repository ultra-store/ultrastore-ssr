'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { WithClassName } from '@/shared/types/utils';

import styles from './toggle.module.css';

export interface ToggleProps {
  isEnabled?: boolean
  onToggle?: (enabled: boolean) => void
  disabled?: boolean
  paramName?: string
}

export const Toggle = ({
  isEnabled = false,
  onToggle,
  disabled = false,
  className = '',
  paramName,
}: WithClassName<ToggleProps>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const syncParam = (enabled: boolean) => {
    if (!paramName) {
      return;
    }
    const params = new URLSearchParams(searchParams?.toString());

    if (enabled) {
      params.set(paramName, '1');
    } else {
      params.delete(paramName);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleToggle = () => {
    if (!disabled) {
      const next = !isEnabled;

      if (onToggle) {
        // Let parent component handle debouncing via onToggle callback
        onToggle(next);
      } else if (paramName) {
        // Fallback: update URL directly if no onToggle handler provided
        syncParam(next);
      }
    }
  };

  return (
    <div
      className={`${styles.toggleContainer} ${isEnabled ? styles.toggleContainerActive : ''} ${disabled ? styles.toggleContainerDisabled : ''} ${className}`}
      onClick={handleToggle}
      role="switch"
      aria-checked={isEnabled}
      aria-disabled={disabled}
      style={disabled
        ? {
            pointerEvents: 'none',
            opacity: 0.5,
            cursor: 'not-allowed',
          }
        : undefined}
    >
      <div className={`${styles.toggleHandle} ${isEnabled ? styles.toggleHandleActive : ''}`} />
    </div>
  );
};
