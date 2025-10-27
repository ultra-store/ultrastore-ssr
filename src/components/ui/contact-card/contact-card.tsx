import Image from 'next/image';

import icons from '@/shared/icons';

import type { Social } from '@/shared/types';

import styles from './contact-card.module.css';

export interface ContactInfo {
  label: string
  value: string
  href?: string
}

export interface ContactCardProps {
  title: string
  subtitle: string
  phone?: ContactInfo
  email?: ContactInfo
  social?: Social[]
}

export const ContactCard = ({ title, subtitle, phone, email, social }: ContactCardProps) => {
  const getIcon = (key: string): string => {
    const iconMap: Record<string, string> = {
      telegram: icons.telegram,
      whatsapp: icons.whatsapp,
      vk: icons.vk,
    };

    return iconMap[key] || icons.telegram;
  };

  return (
    <div className={styles.card}>
      <h2 className={`heading-1 text-primary ${styles.title}`}>{title}</h2>
      <p className={`large text-primary ${styles.subtitle}`}>{subtitle}</p>

      <div className={styles.infoSection}>
        {phone && (
          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <Image src={icons.phone} alt="" width={17} height={17} />
              <span className={`large text-placeholder ${styles.infoLabel}`}>{phone.label}</span>
            </div>
            <a href={phone.href || `tel:${phone.value}`} className={`large-bold text-primary ${styles.infoValue}`}>
              {phone.value}
            </a>
          </div>
        )}

        {email && (
          <div className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <Image src={icons.mail} alt="" width={17} height={17} />
              <span className={`large text-placeholder ${styles.infoLabel}`}>{email.label}</span>
            </div>
            <a href={email.href || `mailto:${email.value}`} className={`large-bold text-primary ${styles.infoValue}`}>
              {email.value}
            </a>
          </div>
        )}

        {social && social.length > 0 && (
          <div className={styles.socialItem}>
            <div className={styles.socialHeader}>
              <span className={`large text-placeholder ${styles.socialLabel}`}>Мы в соцсетях</span>
              <div className={styles.socialIcons}>
                {social.map((item) => {
                  const icon = icons[item.id] || getIcon(item.id);

                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className={styles.socialIconLink}
                      aria-label={item.alt}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={icon}
                        alt={item.alt}
                        width={25}
                        height={25}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
