'use client';

import Image from 'next/image';

import type { CheckoutStep } from '@/shared/context/checkout-context';
import { useCheckout } from '@/shared/context/checkout-context';
import icons from '@/shared/icons';

import styles from './checkout-progress.module.css';

interface CheckoutProgressProps { className?: string }

const steps: {
  key: CheckoutStep
  label: string
}[] = [
  {
    key: 'personal',
    label: 'Личные данные',
  },
  {
    key: 'delivery',
    label: 'Доставка',
  },
  {
    key: 'payment',
    label: 'Оплата',
  },
];

export const CheckoutProgress = ({ className = '' }: CheckoutProgressProps) => {
  const { currentStep, setStep, canGoToStep } = useCheckout();
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

  return (
    <div className={`${styles.container} ${className}`}>
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isCompleted = index < currentStepIndex;
        const canClick = canGoToStep(step.key);

        return (
          <div key={step.key} className={styles.stepGroup}>
            <button
              type="button"
              className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              onClick={() => canClick && setStep(step.key)}
              disabled={!canClick}
            >
              {step.label}
            </button>
            {index < steps.length - 1 && (
              <div className={styles.separator}>
                <Image src={icons.dash} alt="" width={25} height={25} className={styles.separatorIcon} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
