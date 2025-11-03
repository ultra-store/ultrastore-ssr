'use client';

import { useCallback, useMemo } from 'react';

import type {
  ProductAttributeGroup,
  ProductAttributes,
  ProductDimensions,
} from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';

import styles from './product-specs.module.css';

export interface ProductSpecsProps {
  attributes?: ProductAttributes
  sku?: string
  weight?: string
  dimensions?: ProductDimensions
  currentVariationSku?: string
  className?: string
  spaceBetween?: boolean
}

export const ProductSpecs = ({
  attributes,
  weight,
  dimensions,
  className,
  spaceBetween = false,
}: WithClassName<ProductSpecsProps>) => {
  // Helper to check if attributes is a grouped format
  const isAttributeGroup = useCallback((
    attrs: ProductAttributes,
  ): attrs is ProductAttributeGroup[] => {
    if (!attrs || attrs.length === 0) {
      return false;
    }

    return 'group' in attrs[0] && 'attributes' in attrs[0];
  }, []);

  // Build specs rows from attributes and additional product data
  const specsRows = useMemo(() => {
    const rows: {
      id: string
      label: string
      value: string
      group?: string
    }[] = [];

    if (weight) {
      rows.push({
        id: `spec-weight-${weight}`,
        label: 'Вес',
        value: weight,
      });
    }

    if (dimensions) {
      const { length, width, height } = dimensions;
      const parts = [length, width, height].filter(Boolean).join(' × ');

      if (parts) {
        rows.push({
          id: `spec-dimensions-${parts.replace(/\s+/g, '-')}`,
          label: 'Габариты',
          value: parts,
        });
      }
    }

    // Add attributes
    if (attributes) {
      if (isAttributeGroup(attributes)) {
        // Handle grouped attributes
        attributes.forEach((group, groupIdx) => {
          group.attributes.forEach((attr, attrIdx) => {
            const value = attr.values.map((v) => v.name).join(', ');

            if (value) {
              rows.push({
                id: `spec-${group.group}-${attr.slug || attr.name}-${groupIdx}-${attrIdx}`,
                label: attr.name,
                value,
                group: group.group,
              });
            }
          });
        });
      } else {
        // Handle flat array of attributes
        attributes.forEach((attr, idx) => {
          const value = attr.values.map((v) => v.name).join(', ');

          if (value) {
            rows.push({
              id: `spec-${attr.slug || attr.name}-${idx}`,
              label: attr.name,
              value,
            });
          }
        });
      }
    }

    return rows;
  }, [attributes, weight, dimensions, isAttributeGroup]);

  // Group rows by group name for display
  const groupedSpecsRows = useMemo(() => {
    const groups: Record<string, typeof specsRows> = {};
    const ungrouped: typeof specsRows = [];

    specsRows.forEach((row) => {
      if (row.group) {
        if (!groups[row.group]) {
          groups[row.group] = [];
        }

        groups[row.group].push(row);
      } else {
        ungrouped.push(row);
      }
    });

    return {
      groups,
      ungrouped,
    };
  }, [specsRows]);

  if (specsRows.length === 0) {
    return (
      <div className={`${styles.container} ${className || ''}`}>
        <div className={styles.empty}>Характеристики не указаны</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.specsTable}>
        {/* Render ungrouped rows first */}
        {groupedSpecsRows.ungrouped.length > 0 && (
          <ul className={styles.specRowContainer}>
            {groupedSpecsRows.ungrouped.map((row, idx) => (
              <li key={row.id} className={styles.specListItem}>
                <div className={`${styles.specRow} ${spaceBetween ? styles.specRowSpaceBetween : ''}`}>
                  <div className={`${styles.specLabel} ${spaceBetween ? styles.specLabelAuto : ''}`}>{row.label}</div>
                  <div className={styles.specValue}>{row.value}</div>
                </div>
                {idx < groupedSpecsRows.ungrouped.length - 1 && (
                  <div className={styles.specDivider} />
                )}
              </li>
            ))}
          </ul>
        )}

        {/* Render grouped rows */}
        {Object.entries(groupedSpecsRows.groups).map(([groupName, rows]) => (
          <div key={`group-${groupName}`} className={styles.specGroup}>
            <div className={styles.specGroupTitle}>{groupName}</div>
            <ul className={styles.specRowContainer}>
              {rows.map((row, idx) => (
                <li key={row.id} className={styles.specListItem}>
                  <div className={`${styles.specRow} ${spaceBetween ? styles.specRowSpaceBetween : ''}`}>
                    <div className={`${styles.specLabel} ${spaceBetween ? styles.specLabelAuto : ''}`}>{row.label}</div>
                    <div className={styles.specValue}>{row.value}</div>
                  </div>
                  {idx < rows.length - 1 && (
                    <div className={styles.specDivider} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
