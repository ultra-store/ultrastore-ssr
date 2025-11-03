'use client';

import { PhoneInput } from '@/components/ui/phone-input';
import { useCheckout } from '@/shared/context/checkout-context';

import styles from './personal-data-step.module.css';

export const PersonalDataStep = () => {
  const { checkoutData, updatePersonalData } = useCheckout();
  const { name, phone, email } = checkoutData.personal;

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor="checkout-name" className={styles.label}>Имя*</label>
        <input
          id="checkout-name"
          type="text"
          name="name"
          autoComplete="given-name"
          className={styles.input}
          value={name}
          onChange={(e) => updatePersonalData({ name: e.target.value })}
          placeholder="Введите ваше имя"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="checkout-phone" className={styles.label}>Телефон*</label>
        <PhoneInput
          id="checkout-phone"
          name="phone"
          value={phone}
          onChange={(value) => updatePersonalData({ phone: value })}
          className={styles.input}
          placeholder="+7 (999) 999-99-99"
          required
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="checkout-email" className={styles.label}>Почта</label>
        <input
          id="checkout-email"
          type="email"
          name="email"
          autoComplete="email"
          className={styles.input}
          value={email}
          onChange={(e) => updatePersonalData({ email: e.target.value })}
          placeholder="example@mail.ru"
        />
      </div>
    </div>
  );
};
