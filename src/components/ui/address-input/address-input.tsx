'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './address-input.module.css';

interface AddressSuggestion {
  value: string
  data: {
    postal_code?: string
    country?: string
    region?: string
    city?: string
    street?: string
    house?: string
    geo_lat?: string
    geo_lon?: string
  }
}

interface AddressInputProps {
  id?: string
  name?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
  autoComplete?: string
}

/**
 * Address input with DaData Suggest autocomplete
 * Provides address suggestions as user types
 */
export const AddressInput = ({
  id,
  name,
  value,
  onChange,
  className = '',
  placeholder = 'Введите адрес доставки',
  autoComplete = 'street-address',
}: AddressInputProps) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch address suggestions from DaData API
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);

      return;
    }

    try {
      // Get API token from environment variable
      const apiToken = process.env.NEXT_PUBLIC_DADATA_API_TOKEN || '';

      if (!apiToken) {
        console.warn('DaData API token is not configured. Address suggestions will not work.');
        setSuggestions([]);
        setShowSuggestions(false);

        return;
      }

      // DaData API endpoint
      const response = await fetch(
        'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Token ${apiToken}`,
          },
          body: JSON.stringify({
            query,
            count: 5,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();

        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        console.error('DaData API error:', response.status, response.statusText);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Failed to fetch address suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  }, [fetchSuggestions]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    setInputValue(newValue);

    if (onChange) {
      onChange(newValue);
    }

    // Search for suggestions
    debouncedSearch(newValue);
  }, [onChange, debouncedSearch]);

  const handleSelectSuggestion = useCallback((suggestion: AddressSuggestion) => {
    setInputValue(suggestion.value);
    setShowSuggestions(false);
    setSelectedIndex(-1);

    if (onChange) {
      onChange(suggestion.value);
    }
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [showSuggestions, suggestions, selectedIndex, handleSelectSuggestion]);

  const handleBlur = useCallback(() => {
    // Hide suggestions after a short delay to allow clicks on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  }, []);

  const handleFocus = useCallback(() => {
    if (inputValue.length >= 3 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [inputValue, suggestions]);

  // Update input value when value prop changes (external update)
  useEffect(() => {
    if (value !== inputValue) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => setInputValue(value || ''), 0);
    }
  }, [value, inputValue]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current
        && !suggestionsRef.current.contains(event.target as Node)
        && inputRef.current
        && !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestions]);

  return (
    <div className={styles.addressInputWrapper}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        autoComplete={autoComplete}
        className={`${styles.addressInput} ${className}`}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`${styles.suggestion} ${index === selectedIndex ? styles.selected : ''}`}
              onClick={() => handleSelectSuggestion(suggestion)}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur before click
            >
              {suggestion.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
