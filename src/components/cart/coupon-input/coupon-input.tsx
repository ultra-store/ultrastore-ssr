'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

import styles from './coupon-input.module.css';

interface CouponInputProps {
  onApply?: (code: string) => void
  className?: string
}

export const CouponInput = ({ onApply, className = '' }: CouponInputProps) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    if (code.trim() && onApply) {
      onApply(code.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <label className={styles.label}>Код купона</label>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          name="coupon-code"
          autoComplete="off"
          className={styles.input}
          placeholder="Введите код купона"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="primary"
          onClick={handleApply}
          disabled={!code.trim()}
          className={styles.button}
        >
          Активировать
        </Button>
      </div>
    </div>
  );
};
