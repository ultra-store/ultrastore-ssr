import Image from 'next/image';
import Link from 'next/link';

import { SocialButtons } from '@/components/social-buttons';
import { Section } from '@/components/ui/section';
import { getLayoutData } from '@/shared/api/getLayoutData';

import icons from '@/shared/icons';

import type { Contacts, Social } from '@/shared/types';

import { YandexMap } from './yandex-map';

import styles from './how-to-find-us.module.css';

export interface HowToFindUsProps {
  title?: string
  contacts?: Contacts
  socials?: Social[]
}

export const HowToFindUs = async ({ title = 'Как нас найти', contacts, socials }: HowToFindUsProps) => {
  let resolvedContacts = contacts;
  let resolvedSocials = socials;

  if (!resolvedContacts || !resolvedSocials) {
    const layout = await getLayoutData('front-page');

    resolvedContacts = resolvedContacts || layout.contacts;
    resolvedSocials = resolvedSocials || layout.social;
  }

  const coordinates = resolvedContacts?.coordinates;
  const url = resolvedContacts?.map_iframe || resolvedContacts?.map_src;
  const address = resolvedContacts?.address || 'Санкт-Петербург, Лиговский 71, м. Площадь Восстания';
  const phoneText = resolvedContacts?.phone_primary || '+7 (999) 999-99-99';
  const phoneHref = `tel:${phoneText.replace(/[^+\d]/g, '')}`;
  const emailText = resolvedContacts?.email || 'info@ultrastore.ru';
  const emailHref = `mailto:${emailText}`;
  const workingHours = resolvedContacts?.working_hours || 'Ежедневно с 10:00 до 22:00';

  return (
    <Section title={title} ariaLabel={title}>
      <div className={styles.panel}>
        <div className={styles.map}>
          <YandexMap url={url} coordinates={coordinates} />
        </div>
        <div className={styles.content}>
          <div className={styles.row}>
            <div className={styles.line}>
              <Image src={icons.pin} alt="Адрес" width={17} height={17} />
              <span className={styles.label}>Адрес</span>
            </div>
            <span className={styles.value}>{address}</span>
          </div>

          <div className={styles.row}>
            <div className={styles.line}>
              <Image src={icons.phone} alt="Телефон" width={17} height={17} />
              <span className={styles.label}>Телефон</span>
            </div>
            <Link href={phoneHref} className={styles.value}>
              {phoneText}
            </Link>
          </div>

          <div className={styles.row}>
            <div className={styles.line}>
              <Image src={icons.mail} alt="Почта" width={17} height={17} />
              <span className={styles.label}>Почта</span>
            </div>
            <Link href={emailHref} className={styles.value}>
              {emailText}
            </Link>
          </div>

          <div className={styles.row}>
            <div className={styles.line}>
              <Image src={icons.clock} alt="Режим работы" width={17} height={17} />
              <span className={styles.label}>Режим работы</span>
            </div>
            <span className={styles.value}>{workingHours}</span>
          </div>

          <div className={styles.socialsBlock}>
            <span className={styles.label}>Мы в соцсетях</span>
            <SocialButtons size="m" socials={resolvedSocials} />
          </div>
        </div>
      </div>
    </Section>
  );
};
