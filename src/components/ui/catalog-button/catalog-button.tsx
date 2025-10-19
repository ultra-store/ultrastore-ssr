import { Button } from '@/components/ui/button';

import icons from '@/shared/icons';

import styles from './catalog-button.module.css';

interface CatalogButtonProps {
  onClick?: () => void
  className?: string
}

export const CatalogButton = ({ onClick, className }: CatalogButtonProps) => {
  return (
    <div className={`${styles.catalogButtonWrapper} ${className || ''}`}>
      <Button
        icon={icons.catalog}
        variant="compact"
        onClick={onClick}
        aria-label="Открыть каталог"
        className={styles.catalogButton}
      >
        <span>Каталог</span>
      </Button>
    </div>
  );
};
