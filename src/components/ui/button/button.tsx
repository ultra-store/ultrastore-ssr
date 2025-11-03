import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

import Image from 'next/image';

import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'compact' | 'outline' | 'outline-secondary'
  fullWidth?: boolean
  icon?: string
  active?: boolean
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  active = false,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-full-width={fullWidth || undefined}
      data-active={active || undefined}
      {...props}
    >
      {icon && <Image src={icon} alt="Icon" width={25} height={25} />}
      {children}
    </button>
  );
};
