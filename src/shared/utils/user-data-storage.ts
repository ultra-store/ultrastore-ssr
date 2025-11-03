/**
 * User data storage utilities
 * Stores user personal data locally for future order pre-filling
 */

export interface SavedUserData {
  name: string
  phone: string
  email: string
  address?: string
  deliveryPhone?: string
}

const USER_DATA_STORAGE_KEY = 'ultrastore_user_data';

/**
 * Save user data to localStorage
 */
export const saveUserData = (data: Partial<SavedUserData>): void => {
  try {
    const existingData = getUserData();
    const updatedData: SavedUserData = {
      ...existingData,
      ...data,
    };

    localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Failed to save user data to localStorage:', error);
  }
};

/**
 * Get saved user data from localStorage
 */
export const getUserData = (): SavedUserData => {
  try {
    const savedData = localStorage.getItem(USER_DATA_STORAGE_KEY);

    if (savedData) {
      return JSON.parse(savedData) as SavedUserData;
    }
  } catch (error) {
    console.error('Failed to load user data from localStorage:', error);
  }

  return {
    name: '',
    phone: '',
    email: '',
    address: '',
    deliveryPhone: '',
  };
};

/**
 * Clear saved user data from localStorage
 */
export const clearUserData = (): void => {
  try {
    localStorage.removeItem(USER_DATA_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear user data from localStorage:', error);
  }
};

/**
 * Save user data from checkout data
 */
export const saveUserDataFromCheckout = (
  personalData: {
    name: string
    phone: string
    email: string
  },
  deliveryData?: {
    address?: string
    phone?: string
  },
): void => {
  const userData: Partial<SavedUserData> = {
    name: personalData.name || '',
    phone: personalData.phone || '',
    email: personalData.email || '',
  };

  if (deliveryData) {
    if (deliveryData.address) {
      userData.address = deliveryData.address;
    }
    if (deliveryData.phone) {
      userData.deliveryPhone = deliveryData.phone;
    }
  }

  saveUserData(userData);
};
