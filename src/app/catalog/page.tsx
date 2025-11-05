import { ContactCard } from '@/components/ui/contact-card';
import { Section } from '@/components/ui/section';
import { getLayoutData } from '@/shared/api/getLayoutData';

export default async function CatalogPage() {
  const { contacts, social } = await getLayoutData('catalog');

  return (
    <Section ariaLabel="Каталог">
      <ContactCard
        title="Не нашли нужный товар?"
        subtitle="Свяжитесь с нами, возможно, мы сможем помочь"
        phone={{
          label: 'Телефон',
          value: contacts.phone_primary || '',
          href: `tel:${contacts.phone_primary?.replace(/[^+\d]/g, '')}`,
        }}
        email={{
          label: 'Почта',
          value: contacts.email || '',
          href: `mailto:${contacts.email || ''}`,
        }}
        social={social}
      />
    </Section>
  );
}
