'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';

import type { ProductAttribute, ProductDetails } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';
import { formatPrice } from '@/shared/utils/format-price';

import styles from './product-info.module.css';

export interface ProductInfoProps { product: ProductDetails }

export const ProductInfo = ({ product, className }: WithClassName<ProductInfoProps>) => {
  const {
    name,
    price,
    sale_price,
    on_sale,
    currency = '₽',
    in_stock,
    sku,
    attributes,
    variations,
  } = product;

  const [selectedValues, setSelectedValues] = useState<Record<string, number>>({});

  // Find matching variation based on selected attributes
  const matchedVariation = useMemo(() => {
    if (!variations || variations.length === 0) {
      return null;
    }

    // Build a map of selected attribute slugs
    const selectedAttrs: Record<string, string> = {};

    Object.entries(selectedValues).forEach(([attrName, valueId]) => {
      if (valueId > 0) {
        const attribute = attributes?.find((attr) => attr.name === attrName);

        if (attribute) {
          const value = attribute.values.find((v) => v.id === valueId);

          if (value) {
            selectedAttrs[attribute.slug] = value.slug;
          }
        }
      }
    });

    // Find the variation that matches all selected attributes
    return variations.find((variation) => {
      return Object.entries(selectedAttrs).every(
        ([key, value]) => variation.attributes[key] === value,
      );
    });
  }, [variations, selectedValues, attributes]);

  const isValueSelected = (attrName: string, valueId: number) => {
    return selectedValues[attrName] === valueId;
  };

  // Use variation data if matched, otherwise use base product
  const displayPrice = matchedVariation
    ? (matchedVariation.on_sale && matchedVariation.sale_price ? matchedVariation.sale_price : matchedVariation.price)
    : (on_sale && sale_price ? sale_price : price);

  const currentStock = matchedVariation?.in_stock ?? in_stock;
  const currentSku = matchedVariation?.sku || sku;
  const currentOnSale = matchedVariation?.on_sale ?? on_sale;

  const formattedPrice = formatPrice(displayPrice, currency);

  const handleAttributeSelect = (attributeName: string, valueId: number) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attributeName]: prev[attributeName] === valueId ? 0 : valueId,
    }));
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <h1 className={`heading-1 text-primary ${styles.title}`}>{name}</h1>
        {currentSku && (
          <div className={`medium text-primary ${styles.sku}`}>
            <span className={styles.skuLabel}>Артикул</span>
            <span className={styles.skuValue}>{currentSku}</span>
          </div>
        )}
      </div>

      <div className={styles.content}>
        {attributes && attributes.length > 0 && (
          <div className={styles.leftColumn}>
            {attributes.map((attribute: ProductAttribute, index) => (
              <div key={index} className={styles.attribute}>
                <span className={styles.attributeLabel}>
                  {attribute.name}
                  :
                </span>
                <div className={styles.attributeValues}>
                  {attribute.values.map((value, valueIndex) => {
                    const isSelected = isValueSelected(attribute.name, value.id);

                    return (
                      <button
                        key={`${attribute.slug}-${value.id}-${valueIndex}`}
                        type="button"
                        className={`
                          ${styles.attributeValue} 
                          ${isSelected ? styles.attributeValueSelected : ''}
                        `}
                        onClick={() => handleAttributeSelect(attribute.name, value.id)}
                      >
                        {value.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.rightColumn}>
          <div className={styles.priceSection}>
            <span className={`number ${styles.price} ${currentOnSale ? styles.salePrice : ''}`}>
              {formattedPrice}
            </span>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              fullWidth
              disabled={!currentStock}
              className={styles.addToCartButton}
            >
              {currentStock ? 'В корзину' : 'Нет в наличии'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
