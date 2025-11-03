/**
 * Feature flags configuration
 * These flags control the visibility of features across the application.
 * Set environment variables with NEXT_PUBLIC_ prefix to enable/disable features.
 */

const parseBooleanEnv = (value: string | undefined, defaultValue = false): boolean => {
  if (!value) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true' || value === '1';
};

export const features = {
  comparison: { enabled: parseBooleanEnv(process.env.NEXT_PUBLIC_FEATURE_COMPARISON_ENABLED) },
  favorites: { enabled: parseBooleanEnv(process.env.NEXT_PUBLIC_FEATURE_FAVORITES_ENABLED) },
} as const;
