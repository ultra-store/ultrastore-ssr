import { ContactLink } from '@/components/ui/contact-link';
import icons from '@/shared/icons';

import styles from './contact-links.module.css';

interface ContactLinksProps {
  city?: string
  phone?: string
}

const DEFAULT_CITY = 'Санкт-Петербург';
const DEFAULT_PHONE = '+7 (999) 999-99-99';

export const ContactLinks = ({ city = DEFAULT_CITY, phone = DEFAULT_PHONE }: ContactLinksProps) => {
  const telHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  return (
    <address className={`${styles.contactLinks}`}>
      <ContactLink href="#" icon={icons.pin} text={city} aria-label="Выбрать город" />
      <ContactLink
        href={telHref}
        icon={icons.phone}
        text={phone || DEFAULT_PHONE || ''}
        bold
        aria-label={`Позвонить по номеру ${phone}`}
      />
    </address>
  );
};
