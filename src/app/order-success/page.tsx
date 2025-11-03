'use client';

import { Suspense } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import icons from '@/shared/icons';

import styles from './page.module.css';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <Section noPadding className={styles.container}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconCircle}>
            <Image
              src={icons.checkmark}
              alt="Успешно"
              width={64}
              height={64}
              className={styles.icon}
            />
          </div>
        </div>

        <h1 className={styles.title}>Заказ оформлен</h1>

        {orderId && (
          <div className={styles.orderInfo}>
            <p className={styles.orderLabel}>Номер заказа:</p>
            <p className={styles.orderId}>{orderId}</p>
          </div>
        )}

        <div className={styles.messageWrapper}>
          <p className={styles.message}>
            Скоро менеджер свяжется по указанному телефону для уточнения деталей
          </p>
          <p className={styles.subMessage}>
            Вы получите уведомление о статусе заказа по телефону или email
          </p>
        </div>

        <div className={styles.actions}>
          <Link href="/catalog" className={styles.actionLink}>
            <Button variant="secondary" fullWidth>
              Перейти в каталог
            </Button>
          </Link>
          <Link href="/" className={styles.actionLink}>
            <Button variant="primary" fullWidth>
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={(
      <Section noPadding className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <div className={styles.iconCircle}>
              <Image
                src={icons.checkmark}
                alt="Успешно"
                width={64}
                height={64}
                className={styles.icon}
              />
            </div>
          </div>
          <h1 className={styles.title}>Заказ оформлен</h1>
        </div>
      </Section>
    )}
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
