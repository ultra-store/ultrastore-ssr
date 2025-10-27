import Image from 'next/image';

import icons from '@/shared/icons';

import type { WithClassName } from '@/shared/types/utils';

import styles from './filter-button.module.css';

interface FilterButtonProps {
  onClick?: () => void
  isOpen?: boolean
}

export const FilterButton = ({ onClick, isOpen, className }: WithClassName<FilterButtonProps>) => {
  return (
    <button className={`${styles.filterButton} ${className}`} onClick={onClick}>
      <Image src={isOpen ? icons.close : icons.sliders} alt="Фильтры" width={15} height={15} />
    </button>
  );
};
