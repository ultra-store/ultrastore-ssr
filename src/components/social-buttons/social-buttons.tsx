import type { StaticImageData } from 'next/image';

import { SocialButton } from '@/components/ui/social-button';

import icons from '@/shared/icons';

import type { WithClassName } from '@/shared/types/utils';

import styles from './social-buttons.module.css';

export interface SocialButtonConfig {
  id: string
  href: string
  icon: string | StaticImageData
  alt: string
}

interface SocialButtonsProps {
  size?: 'xs' | 's' | 'm'
  buttons?: SocialButtonConfig[]
}

const DEFAULT_BUTTONS: SocialButtonConfig[] = [
  {
    id: 'telegram',
    href: 'https://t.me/ultrastore',
    icon: icons.telegram,
    alt: 'Написать в Telegram',
  },
  {
    id: 'vk',
    href: 'https://vk.com/ultrastore',
    icon: icons.vk,
    alt: 'Перейти в группу ВКонтакте',
  },
  {
    id: 'whatsapp',
    href: 'https://wa.me/79999999999',
    icon: icons.whatsapp,
    alt: 'Написать в WhatsApp',
  },
];

export const SocialButtons = ({
  className,
  size = 'm',
  buttons = DEFAULT_BUTTONS,
}: WithClassName<SocialButtonsProps>) => {
  const sizeConfig = {
    xs: {
      iconSize: 20,
      gap: '10px',
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
      {buttons.map((button) => (
        <SocialButton
          key={button.id}
          href={button.href}
          icon={button.icon}
          alt={button.alt}
          size={iconSize}
          variant={size === 'xs' ? 'greyscale' : 'default'}
        />
      ))}
    </div>
  );
};
