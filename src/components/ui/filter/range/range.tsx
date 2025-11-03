'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import styles from './range.module.css';

export interface RangeFilterProps {
  min: number
  max: number
  value: [number, number]
  onChange: (value: [number, number]) => void
  step?: number
  unit?: string
  paramName?: string
  disabled?: boolean
}

// Helpers
const clamp = (val: number, min: number, max: number) => {
  return Math.max(min, Math.min(max, val));
};

const autoStep = (range: number) => {
  if (range >= 1000000) {
    return 1000;
  }

  if (range >= 100000) {
    return 100;
  }

  if (range >= 10000) {
    return 10;
  }

  if (range >= 1000) {
    return 1;
  }

  return 1;
};

const snapToStep = (rawValue: number, step: number, min: number, max: number) => {
  if (Math.abs(rawValue - min) < step / 2) {
    return min;
  }

  if (Math.abs(rawValue - max) < step / 2) {
    return max;
  }

  return Math.round(rawValue / step) * step;
};

export const Range = ({ min, max, value, onChange, step, unit, paramName, disabled = false }: RangeFilterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localInputValues, setLocalInputValues] = useState({
    min: value[0].toString(),
    max: value[1].toString(),
  });

  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef<null | 'min' | 'max'>(null);
  const rafIdRef = useRef<number | null>(null);

  const valueRef = useRef<[number, number]>(value);
  const onChangeRef = useRef(onChange);
  const minRef = useRef(min);
  const maxRef = useRef(max);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    minRef.current = min;
  }, [min]);

  useEffect(() => {
    maxRef.current = max;
  }, [max]);

  const effectiveStep = useMemo(() => step ?? autoStep(max - min), [step, max, min]);
  const effectiveStepRef = useRef(effectiveStep);

  useEffect(() => {
    effectiveStepRef.current = effectiveStep;
  }, [effectiveStep]);

  // Unit helpers
  const parseValueWithUnit = useCallback(
    (inputValue: string) => {
      if (!unit) {
        return parseFloat(inputValue.replace(/[^\d.-]/g, ''));
      }

      const cleanValue = inputValue.replace(
        new RegExp(`\\s*${unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'g'),
        '',
      );

      return parseFloat(cleanValue.replace(/[^\d.-]/g, '').replace(/\s/g, ''));
    },
    [unit],
  );

  const formatValueWithUnit = useCallback(
    (val: number) => {
      if (!unit) {
        return val.toString();
      }

      return `${val.toLocaleString('ru-RU')} ${unit}`;
    },
    [unit],
  );

  const updateParam = useCallback((name: string, next: [number, number]) => {
    if (!name) {
      return;
    }

    const params = new URLSearchParams(searchParams?.toString());

    params.set(`${name}_min`, String(next[0]));
    params.set(`${name}_max`, String(next[1]));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams]);

  const updateFromPointer = useCallback((clientX: number) => {
    const type = draggingRef.current;
    const track = trackRef.current;

    if (!type || !track || disabled) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const percentage = rect.width > 0 ? clamp((clientX - rect.left) / rect.width, 0, 1) : 0;
    const newValueRaw = minRef.current + (maxRef.current - minRef.current) * percentage;

    const stepVal = effectiveStepRef.current;
    const steppedValue = snapToStep(newValueRaw, stepVal, minRef.current, maxRef.current);

    const [curMin, curMax] = valueRef.current;

    if (type === 'min') {
      const clamped = clamp(steppedValue, minRef.current, curMax - stepVal);
      const finalMin = clamp(clamped, minRef.current, maxRef.current);

      const next: [number, number] = [finalMin, curMax];

      onChangeRef.current(next);

      if (paramName) {
        updateParam(paramName, next);
      }
    } else {
      const clamped = clamp(steppedValue, curMin + stepVal, maxRef.current);
      const finalMax = clamp(clamped, minRef.current, maxRef.current);

      const next: [number, number] = [curMin, finalMax];

      onChangeRef.current(next);

      if (paramName) {
        updateParam(paramName, next);
      }
    }
  }, [paramName, updateParam, disabled]);

  const handlePointerMoveRef = useRef<(e: PointerEvent) => void>(() => {
    // Handler will be set via useEffect
  });
  const handlePointerUpRef = useRef<() => void>(() => {
    // Handler will be set via useEffect
  });
  const handlePointerCancelRef = useRef<() => void>(() => {
    // Handler will be set via useEffect
  });

  const handlePointerMove = useCallback((e: PointerEvent) => {
    e.preventDefault();

    // Cancel any pending animation frame and process immediately for smoother touch
    if (rafIdRef.current != null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    updateFromPointer(e.clientX);

    // Schedule next frame for potential cleanup, but don't block new events
    rafIdRef.current = window.requestAnimationFrame(() => {
      rafIdRef.current = null;
    });
  }, [updateFromPointer]);

  const cleanupDrag = useCallback(() => {
    draggingRef.current = null;
    window.removeEventListener('pointermove', handlePointerMoveRef.current);
    window.removeEventListener('pointerup', handlePointerUpRef.current);
    window.removeEventListener('pointercancel', handlePointerCancelRef.current);
    if (rafIdRef.current != null) {
      window.cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const handlePointerCancel = useCallback(() => {
    cleanupDrag();
  }, [cleanupDrag]);

  const handlePointerUp = useCallback(() => {
    cleanupDrag();
  }, [cleanupDrag]);

  // Update refs when handlers change
  useEffect(() => {
    handlePointerMoveRef.current = handlePointerMove;
  }, [handlePointerMove]);

  useEffect(() => {
    handlePointerUpRef.current = handlePointerUp;
  }, [handlePointerUp]);

  useEffect(() => {
    handlePointerCancelRef.current = handlePointerCancel;
  }, [handlePointerCancel]);

  const handlePointerDown = useCallback((type: 'min' | 'max') => (e: React.PointerEvent) => {
    if (disabled) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    draggingRef.current = type;
    (e.currentTarget as HTMLElement).focus();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    window.addEventListener('pointermove', handlePointerMoveRef.current, { passive: false });
    window.addEventListener('pointerup', handlePointerUpRef.current, { once: true });
    window.addEventListener('pointercancel', handlePointerCancelRef.current, { once: true });

    // Process initial position
    updateFromPointer(e.clientX);
  }, [updateFromPointer, disabled]);

  useEffect(() => {
    return () => {
      cleanupDrag();
    };
  }, [cleanupDrag]);

  const handleInputChange = useCallback((type: 'min' | 'max', inputValue: string) => {
    setLocalInputValues((prev) => ({
      ...prev,
      [type]: inputValue,
    }));
  }, []);

  const applyInputValue = useCallback((type: 'min' | 'max', numericValue: number) => {
    if (disabled) {
      return;
    }

    const stepVal = effectiveStepRef.current;
    const clamped = clamp(numericValue, minRef.current, maxRef.current);
    const stepped = snapToStep(clamped, stepVal, minRef.current, maxRef.current);
    const [curMin, curMax] = valueRef.current;

    if (type === 'min') {
      const nextMin = clamp(stepped, minRef.current, curMax - stepVal);

      const next: [number, number] = [nextMin, curMax];

      onChangeRef.current(next);

      if (paramName) {
        updateParam(paramName, next);
      }
      setLocalInputValues((prev) => ({
        ...prev,
        min: formatValueWithUnit(nextMin),
      }));
    } else {
      const nextMax = clamp(stepped, curMin + stepVal, maxRef.current);

      const next: [number, number] = [curMin, nextMax];

      onChangeRef.current(next);

      if (paramName) {
        updateParam(paramName, next);
      }
      setLocalInputValues((prev) => ({
        ...prev,
        max: formatValueWithUnit(nextMax),
      }));
    }
  }, [formatValueWithUnit, paramName, updateParam, disabled]);

  const handleInputBlur = useCallback((type: 'min' | 'max') => {
    const raw = localInputValues[type].trim();

    if (raw === '') {
      if (type === 'min') {
        const next: [number, number] = [minRef.current, valueRef.current[1]];

        onChangeRef.current(next);

        if (paramName) {
          updateParam(paramName, next);
        }
        setLocalInputValues((prev) => ({
          ...prev,
          min: formatValueWithUnit(minRef.current),
        }));
        setIsEditingMin(false);
      } else {
        const next: [number, number] = [valueRef.current[0], maxRef.current];

        onChangeRef.current(next);

        if (paramName) {
          updateParam(paramName, next);
        }
        setLocalInputValues((prev) => ({
          ...prev,
          max: formatValueWithUnit(maxRef.current),
        }));
        setIsEditingMax(false);
      }

      return;
    }

    const numericValue = parseValueWithUnit(raw);

    if (!isNaN(numericValue)) {
      applyInputValue(type, numericValue);
    } else {
      setLocalInputValues((prev) => ({
        ...prev,
        [type]: formatValueWithUnit(valueRef.current[type === 'min' ? 0 : 1]),
      }));
    }

    if (type === 'min') {
      setIsEditingMin(false);
    } else {
      setIsEditingMax(false);
    }
  }, [applyInputValue, formatValueWithUnit, localInputValues, parseValueWithUnit, paramName, updateParam]);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent, type: 'min' | 'max') => {
    if (e.key === 'Enter') {
      handleInputBlur(type);
    }
  }, [handleInputBlur]);

  // Derived display values for inputs (avoid setState in effects)
  const formattedMin = useMemo(() => {
    const stepMin = snapToStep(value[0], effectiveStep, min, max);

    return formatValueWithUnit(stepMin);
  }, [value, effectiveStep, min, max, formatValueWithUnit]);

  const formattedMax = useMemo(() => {
    const stepMax = snapToStep(value[1], effectiveStep, min, max);

    return formatValueWithUnit(stepMax);
  }, [value, effectiveStep, min, max, formatValueWithUnit]);

  const getPosition = useCallback((val: number) => {
    const denom = max - min;

    if (denom <= 0) {
      return 0;
    }

    return ((val - min) / denom) * 100;
  }, [min, max]);

  const minPos = useMemo(() => getPosition(value[0]), [getPosition, value]);
  const maxPos = useMemo(() => getPosition(value[1]), [getPosition, value]);

  // keyboard controls removed as requested

  const handleMinFocus = useCallback(() => {
    setIsEditingMin(true);

    setLocalInputValues((prev) => ({
      ...prev,
      min: formattedMin,
    }));
  }, [formattedMin]);

  const handleMaxFocus = useCallback(() => {
    setIsEditingMax(true);

    setLocalInputValues((prev) => ({
      ...prev,
      max: formattedMax,
    }));
  }, [formattedMax]);

  return (
    <div className={styles.rangeFilter}>
      <div className={styles.rangeValues}>
        <input
          type="text"
          className={`large text-primary ${styles.rangeInput}`}
          value={isEditingMin ? localInputValues.min : formattedMin}
          onChange={(e) => handleInputChange('min', e.target.value)}
          onFocus={handleMinFocus}
          onBlur={() => handleInputBlur('min')}
          onKeyDown={(e) => handleInputKeyDown(e, 'min')}
          aria-label="Minimum value"
          disabled={disabled}
        />

        <span className={`large text-primary ${styles.rangeSeparator}`}>—</span>

        <input
          type="text"
          className={`large text-primary ${styles.rangeInput}`}
          value={isEditingMax ? localInputValues.max : formattedMax}
          onChange={(e) => handleInputChange('max', e.target.value)}
          onFocus={handleMaxFocus}
          onBlur={() => handleInputBlur('max')}
          onKeyDown={(e) => handleInputKeyDown(e, 'max')}
          aria-label="Maximum value"
          disabled={disabled}
        />
      </div>

      <div className={styles.rangeSlider} ref={trackRef}>
        <div className={styles.rangeTrack} />

        <div
          className={styles.rangeSelected}
          style={{
            left: `${minPos}%`,
            width: `${maxPos - minPos}%`,
          }}
        />

        <button
          type="button"
          className={styles.rangeHandle}
          style={{ left: `${minPos}%` }}
          onPointerDown={handlePointerDown('min')}
          aria-label="Minimum value"
          disabled={disabled}
        />

        <button
          type="button"
          className={styles.rangeHandle}
          style={{ left: `${maxPos}%` }}
          onPointerDown={handlePointerDown('max')}
          aria-label="Maximum value"
          disabled={disabled}
        />
      </div>
    </div>
  );
};
