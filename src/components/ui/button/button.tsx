import type { ButtonHTMLAttributes, ReactNode } from 'react';
import React from 'react';

import Image from 'next/image';

import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'compact'
  fullWidth?: boolean
  icon?: string
}

export const Button = ({
  children,
  variant = 'primary',
  fullWidth = false,
  icon,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      data-variant={variant}
      data-full-width={fullWidth || undefined}
      {...props}
    >
      {icon && <Image src={icon} alt="Icon" width={25} height={25} />}
      {children}
    </button>
  );
};
