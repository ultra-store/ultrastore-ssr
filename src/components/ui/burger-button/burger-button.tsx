import Image from 'next/image';

import icons from '@/shared/icons';

import type { WithClassName } from '@/shared/types/utils';

import styles from './burger-button.module.css';

export interface BurgerButtonProps {
  isOpen: boolean
  onClick: () => void
}

export const BurgerButton = ({ isOpen, onClick, className }: WithClassName<BurgerButtonProps>) => {
  return (
    <button
      className={`${styles.button} ${className}`}
      type="button"
      role="button"
      aria-label={isOpen ? 'Закрыть меню' : 'Открыть меню'}
      onClick={onClick}
    >
      <Image src={isOpen ? icons.close : icons.burger} alt="Burger" width={25} height={25} />
    </button>
  );
};
