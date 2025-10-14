import { ContactLinks } from '@/components/contact-links';
import { HeaderUtilityNav } from '@/components/header-utility-nav';
import { SocialButtons } from '@/components/social-buttons';

import styles from './header-top-bar.module.css';

export const HeaderTopBar = () => {
  return (
    <div className={styles.topBar} role="banner">
      <HeaderUtilityNav />
      <div className={styles.contactSection}>
        <ContactLinks />
        <SocialButtons size="xs" />
      </div>
    </div>
  );
};
