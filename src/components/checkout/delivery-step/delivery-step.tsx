'use client';

import { useEffect, useState } from 'react';

import { AddressInput } from '@/components/ui/address-input';
import { DateSelect } from '@/components/ui/date-select';
import { PhoneInput } from '@/components/ui/phone-input';
import { TimeSelect } from '@/components/ui/time-select';
import { getSiteSettings, type DeliverySettings } from '@/shared/api/getSiteSettings';
import type { DeliveryMethod } from '@/shared/context/checkout-context';
import { useCheckout } from '@/shared/context/checkout-context';

import styles from './delivery-step.module.css';

export const DeliveryStep = () => {
  const { checkoutData, updateDeliveryData } = useCheckout();
  const { method, address, desiredDate, desiredTime, phone } = checkoutData.delivery;
  const personalPhone = checkoutData.personal.phone;
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);

  // Use delivery phone if set, otherwise fall back to personal phone
  const displayPhone = phone || personalPhone || '';

  // Load delivery settings on mount
  useEffect(() => {
    getSiteSettings()
      .then((settings) => {
        if (settings.delivery) {
          setDeliverySettings(settings.delivery);

          // Auto-select nearest available date if no date is selected
          if (!desiredDate && settings.delivery.available_dates && settings.delivery.available_dates.length > 0) {
            const nearestDate = settings.delivery.available_dates[0].value;

            updateDeliveryData({ desiredDate: nearestDate });
          }

          // Auto-select first time slot if no time is selected
          if (!desiredTime && settings.delivery.time_slots && settings.delivery.time_slots.length > 0) {
            const firstTime = settings.delivery.time_slots[0].start;

            updateDeliveryData({ desiredTime: firstTime });
          }
        }
      })
      .catch((error) => {
        console.error('Failed to load delivery settings:', error);
        // Use defaults if API fails
        // Generate default dates for next 14 days
        const defaultDates: {
          value: string
          label: string
        }[] = [];
        const today = new Date();
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        const dayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];

        for (let i = 1; i <= 14; i++) {
          const date = new Date(today);

          date.setDate(date.getDate() + i);
          const dateString = date.toISOString().split('T')[0];
          const day = date.getDate();
          const month = monthNames[date.getMonth()];
          const dayOfWeek = dayNames[date.getDay()];

          defaultDates.push({
            value: dateString,
            label: `${day} ${month}, ${dayOfWeek}`,
          });
        }

        const defaultTimeSlots = [
          {
            start: '09:00',
            end: '12:00',
            label: '09:00 - 12:00',
          },
          {
            start: '12:00',
            end: '15:00',
            label: '12:00 - 15:00',
          },
          {
            start: '15:00',
            end: '18:00',
            label: '15:00 - 18:00',
          },
          {
            start: '18:00',
            end: '21:00',
            label: '18:00 - 21:00',
          },
        ];

        setDeliverySettings({
          min_days: 1,
          max_days: 14,
          exclude_weekends: false,
          available_dates: defaultDates,
          time_slots: defaultTimeSlots,
        });

        // Auto-select nearest available date if no date is selected
        if (!desiredDate && defaultDates.length > 0) {
          const nearestDate = defaultDates[0].value;

          updateDeliveryData({ desiredDate: nearestDate });
        }

        // Auto-select first time slot if no time is selected
        if (!desiredTime && defaultTimeSlots.length > 0) {
          const firstTime = defaultTimeSlots[0].start;

          updateDeliveryData({ desiredTime: firstTime });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const handleMethodChange = (newMethod: DeliveryMethod) => {
    updateDeliveryData({ method: newMethod });
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.methodCard} ${method === 'courier' ? styles.selected : ''}`}
        onClick={() => handleMethodChange('courier')}
      >
        <div className={styles.radioButton}>
          <div className={`${styles.radioCircle} ${method === 'courier' ? styles.checked : ''}`} />
        </div>
        <div className={styles.methodContent}>
          <div className={styles.methodTitle}>Курьер</div>
          {method === 'courier' && (
            <div className={styles.methodFields}>
              <div className={styles.field}>
                <label htmlFor="checkout-address" className={styles.label}>Адрес</label>
                <AddressInput
                  id="checkout-address"
                  name="address"
                  value={address || ''}
                  onChange={(value) => updateDeliveryData({ address: value })}
                  className={styles.input}
                  placeholder="Введите адрес доставки"
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label htmlFor="checkout-date" className={styles.label}>Желаемая дата</label>
                  <DateSelect
                    id="checkout-date"
                    name="desired-date"
                    value={desiredDate || ''}
                    onChange={(value) => updateDeliveryData({ desiredDate: value })}
                    dateOptions={deliverySettings?.available_dates || []}
                    className={styles.input}
                    placeholder="Выберите дату"
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="checkout-time" className={styles.label}>Желаемое время</label>
                  <TimeSelect
                    id="checkout-time"
                    name="desired-time"
                    value={desiredTime || ''}
                    onChange={(value) => updateDeliveryData({ desiredTime: value })}
                    timeSlots={deliverySettings?.time_slots}
                    className={styles.input}
                    placeholder="Выберите время"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="checkout-delivery-phone" className={styles.label}>Номер телефона</label>
                <PhoneInput
                  id="checkout-delivery-phone"
                  name="delivery-phone"
                  value={displayPhone}
                  onChange={(value) => updateDeliveryData({ phone: value })}
                  className={styles.input}
                  placeholder="+7 (999) 999-99-99"
                />
              </div>
            </div>
          )}
          {method === 'courier' && (
            <div className={styles.note}>
              Менеджер свяжется для уточнения деталей
            </div>
          )}
        </div>
      </div>

      <div
        className={`${styles.methodCard} ${method === 'pickup' ? styles.selected : ''}`}
        onClick={() => handleMethodChange('pickup')}
      >
        <div className={styles.radioButton}>
          <div className={`${styles.radioCircle} ${method === 'pickup' ? styles.checked : ''}`} />
        </div>
        <div className={styles.methodContent}>
          <div className={styles.methodTitle}>Самовывоз</div>
        </div>
      </div>
    </div>
  );
};
