import { ContactLinks } from '@/components/contact-links';
import { HeaderUtilityNav } from '@/components/header/utility-nav';
import { SocialButtons } from '@/components/social-buttons';

import type { Contacts, MenuItem, Social } from '@/shared/types';

import styles from './header-top-bar.module.css';

export interface HeaderTopBarProps {
  menu?: MenuItem[]
  contacts?: Contacts
  socials?: Social[]
}

export const HeaderTopBar = ({ menu, contacts, socials }: HeaderTopBarProps) => {
  return (
    <div className={styles.topBar} role="banner">
      <HeaderUtilityNav menu={menu} />
      <div className={styles.contactSection}>
        <ContactLinks city="Санкт-Петербург" phone={contacts?.phone_primary} />
        <SocialButtons size="xs" socials={socials} />
      </div>
    </div>
  );
};
