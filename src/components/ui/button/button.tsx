import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

import Image from 'next/image';

import styles from './button.module.css';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'compact' | 'outline' | 'outline-secondary'
  fullWidth?: boolean
  icon?: string
  active?: boolean
  value?: ReactNode
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  active = false,
  value,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-full-width={fullWidth || undefined}
      data-active={active || undefined}
      data-has-value={value ? true : undefined}
      {...props}
    >
      <span className={styles.buttonContent}>
        {icon && <Image src={icon} alt="Icon" width={25} height={25} />}
        {children}
      </span>
      {value && <span className={styles.buttonValue}>{value}</span>}
    </button>
  );
};
