import { SocialButton } from '@/components/ui/social-button';

import icons from '@/shared/icons';

import type { Social } from '@/shared/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './social-buttons.module.css';

interface SocialButtonsProps {
  size?: 'xs' | 'sm' | 's' | 'm'
  socials?: Social[]
}

export const SocialButtons = ({
  className,
  size = 'm',
  socials = [],
}: WithClassName<SocialButtonsProps>) => {
  const sizeConfig = {
    xs: {
      iconSize: 20,
      gap: '10px',
    },
    sm: {
      iconSize: 25,
      gap: '15px',
    },
    s: {
      iconSize: 30,
      gap: '15px',
    },
    m: {
      iconSize: 40,
      gap: '15px',
    },
  };

  const { iconSize } = sizeConfig[size];

  return (
    <div
      className={`${styles.socialButtons} ${className || ''}`}
      data-size={size}
      role="list"
      aria-label="Социальные сети"
    >
      {socials.map((button) => (
        <SocialButton
          key={button.id}
          href={button.href}
          icon={icons[button.id as keyof typeof icons]}
          alt={button.alt}
          size={iconSize}
          variant={size === 'xs' ? 'greyscale' : 'default'}
        />
      ))}
    </div>
  );
};
