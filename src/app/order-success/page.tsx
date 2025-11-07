'use client';

import { useEffect } from 'react';

import { Message } from '@/components/ui/message';
import { Section } from '@/components/ui/section';

export default function OrderSuccessPage() {
  useEffect(() => {
    // Remove cookie after page is displayed
    document.cookie = 'ultrastore_order_success=; path=/; max-age=0';
  }, []);

  return (
    <Section noPadding>
      <Message
        title="Заказ оформлен"
        description="Скоро менеджер свяжется по указанному телефону для уточнения деталей"
      />
    </Section>
  );
}
