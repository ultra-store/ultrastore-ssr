import { ContactLink } from '@/components/ui/contact-link';
import icons from '@/shared/icons';

import styles from './contact-links.module.css';

export const ContactLinks = () => {
  return (
    <address className={`${styles.contactLinks}`}>
      <ContactLink href="#" icon={icons.pin} text="Санкт-Петербург" aria-label="Выбрать город" />
      <ContactLink
        href="tel:+79999999999"
        icon={icons.phone}
        text="+7 999 999 99 99"
        bold
        aria-label="Позвонить по номеру +7 999 999 99 99"
      />
    </address>
  );
};
