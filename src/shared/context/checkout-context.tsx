'use client';

import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useState } from 'react';

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

const getInitialCheckoutData = (): CheckoutData => {
  try {
    // Load saved user data for pre-filling
    const savedUserData = getUserData();

    // Prepare initial data with saved user data
    return {
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
  } catch (error) {
    console.error('Failed to load user data:', error);

    return defaultCheckoutData;
  }
};

export const CheckoutProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('personal');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>(getInitialCheckoutData);

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
