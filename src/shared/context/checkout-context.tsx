'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getUserData } from '../utils/user-data-storage';

export type CheckoutStep = 'personal' | 'delivery' | 'payment';

export type DeliveryMethod = 'courier' | 'pickup';

export type PaymentMethod = 'cash' | 'card' | 'sbp' | 'installment';

export interface PersonalData {
  name: string
  phone: string
  email: string
}

export interface DeliveryData {
  method: DeliveryMethod
  address?: string
  desiredDate?: string
  desiredTime?: string
  phone?: string
}

export interface PaymentData { method?: PaymentMethod }

export interface CheckoutData {
  personal: PersonalData
  delivery: DeliveryData
  payment: PaymentData
}

interface CheckoutContextType {
  currentStep: CheckoutStep
  checkoutData: CheckoutData
  setStep: (step: CheckoutStep) => void
  updatePersonalData: (data: Partial<PersonalData>) => void
  updateDeliveryData: (data: Partial<DeliveryData>) => void
  updatePaymentData: (data: Partial<PaymentData>) => void
  canProceedToNextStep: () => boolean
  canGoToStep: (step: CheckoutStep) => boolean
  resetCheckout: () => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const CHECKOUT_STORAGE_KEY = 'ultrastore_checkout';

const defaultCheckoutData: CheckoutData = {
  personal: {
    name: '',
    phone: '',
    email: '',
  },
  delivery: {
    method: 'courier',
    address: '',
    desiredDate: '',
    desiredTime: '',
    phone: '',
  },
  payment: { method: 'cash' },
};

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('personal');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(defaultCheckoutData);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load checkout data from localStorage on mount
  useEffect(() => {
    try {
      // First, load saved user data for pre-filling
      const savedUserData = getUserData();

      // Prepare initial data with saved user data
      let initialData: CheckoutData = {
        personal: {
          name: savedUserData.name || '',
          phone: savedUserData.phone || '',
          email: savedUserData.email || '',
        },
        delivery: {
          method: 'courier',
          address: savedUserData.address || '',
          desiredDate: '',
          desiredTime: '',
          phone: savedUserData.deliveryPhone || '',
        },
        payment: { method: undefined },
      };

      let initialStep: CheckoutStep = 'personal';

      // Load saved checkout session data if exists
      const savedCheckout = localStorage.getItem(CHECKOUT_STORAGE_KEY);

      if (savedCheckout) {
        const parsed = JSON.parse(savedCheckout) as {
          step?: CheckoutStep
          data: CheckoutData
        };

        // Restore the step we were on
        if (parsed.step) {
          initialStep = parsed.step;
        } else {
          // Determine step based on filled data if step wasn't saved
          if (parsed.data.personal.name && parsed.data.personal.phone) {
            if (parsed.data.payment.method) {
              initialStep = 'payment';
            } else if (parsed.data.delivery.method) {
              initialStep = 'delivery';
            }
          }
        }

        // Merge saved checkout data with user data (user data as fallback)
        initialData = {
          personal: {
            name: parsed.data.personal.name || savedUserData.name || '',
            phone: parsed.data.personal.phone || savedUserData.phone || '',
            email: parsed.data.personal.email || savedUserData.email || '',
          },
          delivery: {
            method: parsed.data.delivery.method || 'courier',
            address: parsed.data.delivery.address || savedUserData.address || '',
            desiredDate: parsed.data.delivery.desiredDate || '',
            desiredTime: parsed.data.delivery.desiredTime || '',
            phone: parsed.data.delivery.phone || savedUserData.deliveryPhone || '',
          },
          payment: parsed.data.payment || initialData.payment,
        };
      }

      setCurrentStep(initialStep);
      setCheckoutData(initialData);
    } catch (error) {
      console.error('Failed to load checkout data from localStorage:', error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save checkout data to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify({
          step: currentStep,
          data: checkoutData,
        }));
      } catch (error) {
        console.error('Failed to save checkout data to localStorage:', error);
      }
    }
  }, [currentStep, checkoutData, isHydrated]);

  const setStep = useCallback((step: CheckoutStep) => {
    setCurrentStep(step);
  }, []);

  const updatePersonalData = useCallback((data: Partial<PersonalData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        ...data,
      },
    }));
  }, []);

  const updateDeliveryData = useCallback((data: Partial<DeliveryData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        ...data,
      },
    }));
  }, []);

  const updatePaymentData = useCallback((data: Partial<PaymentData>) => {
    setCheckoutData((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        ...data,
      },
    }));
  }, []);

  const canProceedToNextStep = useCallback(() => {
    switch (currentStep) {
      case 'personal':
        return !!(checkoutData.personal.name && checkoutData.personal.phone);
      case 'delivery':
        if (checkoutData.delivery.method === 'courier') {
          const phone = checkoutData.delivery.phone || checkoutData.personal.phone;

          return !!(checkoutData.delivery.address && phone);
        }

        return true; // Pickup doesn't require additional fields
      case 'payment':
        return !!checkoutData.payment.method;
      default:
        return false;
    }
  }, [currentStep, checkoutData]);

  const canGoToStep = useCallback((step: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ['personal', 'delivery', 'payment'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(step);

    return targetIndex <= currentIndex;
  }, [currentStep]);

  const resetCheckout = useCallback(() => {
    setCurrentStep('personal');

    // Reload user data for next checkout
    const savedUserData = getUserData();
    const resetData: CheckoutData = {
      personal: {
        name: savedUserData.name || '',
        phone: savedUserData.phone || '',
        email: savedUserData.email || '',
      },
      delivery: {
        method: 'courier',
        address: savedUserData.address || '',
        desiredDate: '',
        desiredTime: '',
        phone: savedUserData.deliveryPhone || '',
      },
      payment: { method: undefined },
    };

    setCheckoutData(resetData);

    try {
      localStorage.removeItem(CHECKOUT_STORAGE_KEY);
      // Note: We don't clear user data, only checkout session data
    } catch (error) {
      console.error('Failed to clear checkout data from localStorage:', error);
    }
  }, []);

  const value: CheckoutContextType = {
    currentStep,
    checkoutData,
    setStep,
    updatePersonalData,
    updateDeliveryData,
    updatePaymentData,
    canProceedToNextStep,
    canGoToStep,
    resetCheckout,
  };

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);

  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }

  return context;
};
