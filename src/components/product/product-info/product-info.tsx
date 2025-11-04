'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import icons from '@/shared/icons';
import type { ProductAttribute, ProductAttributeGroup, ProductDetails, ProductVariation } from '@/shared/types/types';
import type { WithClassName } from '@/shared/types/utils';
import { formatPrice } from '@/shared/utils/format-price';
import { normalizeCurrency } from '@/shared/utils/normalize-currency';

import { ProductActions } from '../product-actions';
import { ProductDelivery } from '../product-delivery';
import { ProductHeader } from '../product-header/product-header';
import { ProductSpecs } from '../product-specs';

import styles from './product-info.module.css';

export interface ProductInfoProps {
  product: ProductDetails
  initialVariationSlug?: string
  onVariationChange?: (variation: ProductVariation | null) => void
}

export const ProductInfo = ({
  product,
  initialVariationSlug,
  onVariationChange,
  className,
}: WithClassName<ProductInfoProps>) => {
  const pathname = usePathname();

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
    delivery_options,
  } = product;

  // Helper to check if attributes is a grouped format
  const isAttributeGroup = useCallback((
    attrs: typeof attributes,
  ): attrs is ProductAttributeGroup[] => {
    if (!attrs || attrs.length === 0) {
      return false;
    }

    return 'group' in attrs[0] && 'attributes' in attrs[0];
  }, []);

  // Flatten attributes to array of ProductAttribute
  const flatAttributes = useMemo(() => {
    if (!attributes) {
      return [];
    }

    if (isAttributeGroup(attributes)) {
      return attributes.flatMap((group: ProductAttributeGroup) => group.attributes);
    }

    return attributes;
  }, [attributes, isAttributeGroup]);

  // Helper function to convert attribute slug to variation attribute key
  // API format: variation key = "pa_" + attribute slug
  const getVariationAttrKey = useMemo(() => {
    // Create a mapping of attribute slugs to their variation keys
    const attributeKeyMap: Record<string, string> = {};

    flatAttributes.forEach((attr) => {
      // Variation keys use format: "pa_" + attribute slug
      attributeKeyMap[attr.slug] = `pa_${attr.slug}`;
    });

    return (attrSlug: string): string => {
      // Check if we have a mapped key
      if (attributeKeyMap[attrSlug]) {
        return attributeKeyMap[attrSlug];
      }

      // Fallback: generate variation key using standard format
      return `pa_${attrSlug}`;
    };
  }, [flatAttributes]);

  // Initialize selected values from initial variation or default variation
  const initializeSelectedValues = useMemo((): Record<string, number> => {
    if (!variations || variations.length === 0 || flatAttributes.length === 0) {
      return {};
    }

    // Find the initial variation (by slug or first selected/default)
    let targetVariation = initialVariationSlug
      ? variations.find((v) => v.slug === initialVariationSlug)
      : variations.find((v) => (v as { selected?: boolean }).selected === true);

    if (!targetVariation && variations.length > 0) {
      targetVariation = variations[0];
    }

    if (!targetVariation || !targetVariation.attributes) {
      return {};
    }

    // Build selected values from variation attributes
    const initialValues: Record<string, number> = {};

    Object.entries(targetVariation.attributes).forEach(([variationKey, variationValue]) => {
      // Find matching attribute by checking if the variation key matches the transliterated slug
      const attribute = flatAttributes.find((attr) => {
        const transliteratedSlug = getVariationAttrKey(attr.slug);

        return transliteratedSlug.toLowerCase() === variationKey.toLowerCase();
      });

      if (attribute) {
        // Find matching value by slug (variation now uses slugs, not full names)
        const value = attribute.values.find((v: { slug: string }) => v.slug === variationValue);

        if (value && value.id !== undefined) {
          initialValues[attribute.name] = value.id;
        }
      }
    });

    return initialValues;
  }, [variations, flatAttributes, initialVariationSlug, getVariationAttrKey]);

  const [selectedValues, setSelectedValues] = useState<Record<string, number>>(initializeSelectedValues);

  // Update selected values when initialVariationSlug changes
  useEffect(() => {
    setSelectedValues(initializeSelectedValues);
  }, [initializeSelectedValues]);

  // Find matching variation based on selected attributes
  const matchedVariation = useMemo(() => {
    if (!variations || variations.length === 0 || flatAttributes.length === 0) {
      return null;
    }

    // Build a map of selected attribute values
    // Key: transliterated attribute slug (as used in variations), Value: attribute value name
    const selectedAttrs: Record<string, string> = {};

    Object.entries(selectedValues).forEach(([attrName, valueId]) => {
      if (valueId > 0) {
        const attribute = flatAttributes.find((attr) => attr.name === attrName);

        if (attribute) {
          const value = attribute.values.find((v: { id: number }) => v.id === valueId);

          if (value) {
            // Use variation key format: "pa_" + attribute slug
            const variationKey = getVariationAttrKey(attribute.slug);

            // Use value slug (variations now store slugs, not full names)
            selectedAttrs[variationKey] = value.slug;
          }
        }
      }
    });

    // If no attributes are selected, return null
    const selectedAttrKeys = Object.keys(selectedAttrs);

    if (selectedAttrKeys.length === 0) {
      return null;
    }

    // Find the variation that matches all selected attributes
    // When not all attributes are selected, find a variation that matches
    // the selected ones (unselected attributes can have any value)
    const matched = variations.find((variation) => {
      if (!variation.attributes || typeof variation.attributes !== 'object') {
        return false;
      }

      // Check that all selected attributes match the variation
      // All selected attribute values must be present and match in the variation
      return selectedAttrKeys.every((variationKey) => {
        const selectedValueSlug = selectedAttrs[variationKey];
        const variationAttrValue = variation.attributes[variationKey];

        // Value must exist and match (case-insensitive, trimmed)
        // Variation stores value slugs (e.g., "cosmic-orange", "256", "2-esim")
        return variationAttrValue !== undefined
          && variationAttrValue !== null
          && String(variationAttrValue).trim().toLowerCase() === String(selectedValueSlug).trim().toLowerCase();
      });
    });

    return matched || null;
  }, [variations, selectedValues, flatAttributes, getVariationAttrKey]);

  // Determine which attributes are used for variations
  const variationAttributes = useMemo(() => {
    if (!variations || variations.length === 0) {
      return new Set<string>();
    }

    const variationAttrKeys = new Set<string>();

    variations.forEach((variation) => {
      if (variation.attributes && typeof variation.attributes === 'object') {
        Object.keys(variation.attributes).forEach((key) => {
          variationAttrKeys.add(key.toLowerCase());
        });
      }
    });

    return variationAttrKeys;
  }, [variations]);

  // Check if an attribute is used for variations
  const isAttributeUsedForVariations = useMemo(() => {
    return (attributeSlug: string): boolean => {
      const variationKey = getVariationAttrKey(attributeSlug);

      return variationAttributes.has(variationKey.toLowerCase());
    };
  }, [variationAttributes, getVariationAttrKey]);

  // Separate attributes into variation attributes and specification attributes
  const { variationAttrs, specAttrs } = useMemo(() => {
    if (flatAttributes.length === 0) {
      return {
        variationAttrs: [],
        specAttrs: [],
      };
    }

    const variationAttrsArray: ProductAttribute[] = [];
    const specAttrsArray: ProductAttribute[] = [];

    flatAttributes.forEach((attr) => {
      if (isAttributeUsedForVariations(attr.slug)) {
        variationAttrsArray.push(attr);
      } else {
        specAttrsArray.push(attr);
      }
    });

    return {
      variationAttrs: variationAttrsArray,
      specAttrs: specAttrsArray,
    };
  }, [flatAttributes, isAttributeUsedForVariations]);

  // Check if a variation value is available (exists and is in stock)
  const isValueAvailable = useMemo(() => {
    return (
      attributeName: string,
      valueId: number,
      currentSelectedValues: Record<string, number>,
    ): boolean => {
      if (!variations || variations.length === 0) {
        return false;
      }

      // Find the attribute and value
      const attribute = flatAttributes.find((attr) => attr.name === attributeName);

      if (!attribute) {
        return false;
      }

      const value = attribute.values.find((v: { id: number }) => v.id === valueId);

      if (!value) {
        return false;
      }

      // Build a map of what attributes should be matched
      // Include current selection for all OTHER attributes, and the target value for THIS attribute
      const targetAttrs: Record<string, string> = {};

      // Add the target value for the current attribute
      const variationKey = getVariationAttrKey(attribute.slug);

      targetAttrs[variationKey] = value.slug;

      // Add selected values for all other attributes
      Object.entries(currentSelectedValues).forEach(([otherAttrName, otherValueId]) => {
        // Skip the current attribute
        if (otherAttrName === attributeName) {
          return;
        }

        if (otherValueId > 0) {
          const otherAttribute = flatAttributes.find((attr) => attr.name === otherAttrName);

          if (otherAttribute) {
            const otherValue = otherAttribute.values.find((v: { id: number }) => v.id === otherValueId);

            if (otherValue) {
              const otherVariationKey = getVariationAttrKey(otherAttribute.slug);

              targetAttrs[otherVariationKey] = otherValue.slug;
            }
          }
        }
      });

      // Find if there's any variation that matches all these attributes AND is in stock
      const matchingVariation = variations.find((variation) => {
        if (!variation.attributes || typeof variation.attributes !== 'object') {
          return false;
        }

        // Check that all target attributes match the variation
        const allMatch = Object.entries(targetAttrs).every(([variationKey, targetValueSlug]) => {
          const variationAttrValue = variation.attributes[variationKey];

          return variationAttrValue !== undefined
            && variationAttrValue !== null
            && String(variationAttrValue).trim().toLowerCase() === String(targetValueSlug).trim().toLowerCase();
        });

        return allMatch && variation.in_stock === true;
      });

      return !!matchingVariation;
    };
  }, [variations, flatAttributes, getVariationAttrKey]);

  // Update URL using History API to avoid page reload
  // This provides smooth URL updates without triggering Next.js router navigation
  useEffect(() => {
    if (matchedVariation) {
      // Build new URL with variation slug in path
      // Format: /category/product or /product/slug -> add variation-slug
      const pathSegments = pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];

      // Check if last segment is already a variation slug
      const isVariationSlug = variations?.some((v) => v.slug === lastSegment);

      let newPath: string;

      if (isVariationSlug) {
        // Replace existing variation slug
        pathSegments[pathSegments.length - 1] = matchedVariation.slug;
        newPath = `/${pathSegments.join('/')}`;
      } else {
        // Append variation slug
        newPath = `${pathname}/${matchedVariation.slug}`;
      }

      // Only update URL if variation slug has changed
      if (pathname !== newPath && typeof window !== 'undefined') {
        // Use History API to update URL without reloading the page
        // This is more performant than router.replace() as it doesn't trigger Next.js navigation
        window.history.replaceState(
          {
            ...window.history.state,
            as: newPath,
            url: newPath,
          },
          '',
          newPath,
        );
      }

      // Notify parent component about variation change
      onVariationChange?.(matchedVariation);
    } else {
      // If no variation matched, remove variation slug from URL (go back to parent product)
      const pathSegments = pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];

      const isVariationSlug = variations?.some((v) => v.slug === lastSegment);

      if (isVariationSlug && pathSegments.length > 1 && typeof window !== 'undefined') {
        // Remove variation slug from path
        pathSegments.pop();
        const parentPath = `/${pathSegments.join('/')}`;

        // Use History API to update URL without reloading the page
        window.history.replaceState(
          {
            ...window.history.state,
            as: parentPath,
            url: parentPath,
          },
          '',
          parentPath,
        );
      }

      // Notify parent that no variation is selected (fall back to product images)
      onVariationChange?.(null);
    }
  }, [matchedVariation, pathname, variations, onVariationChange]);

  // Initialize variation images on mount if initialVariationSlug is provided
  useEffect(() => {
    if (initialVariationSlug && variations && onVariationChange) {
      const initialVariation = variations.find((v) => v.slug === initialVariationSlug);

      if (initialVariation) {
        onVariationChange(initialVariation);
      }
    }
  }, [initialVariationSlug, variations, onVariationChange]);

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
  const normalizedCurrency = normalizeCurrency(currency);

  const formattedPrice = formatPrice(displayPrice, normalizedCurrency);

  const handleAttributeSelect = (attributeName: string, valueId: number) => {
    setSelectedValues((prev) => ({
      ...prev,
      [attributeName]: prev[attributeName] === valueId ? 0 : valueId,
    }));
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <ProductHeader name={name} sku={currentSku} variant="desktop" />

      <div className={styles.content}>
        {(variationAttrs.length > 0 || specAttrs.length > 0) && (
          <div className={styles.leftColumn}>
            {/* Variation attributes - displayed as selectors */}
            {variationAttrs.map((attribute: ProductAttribute, index) => (
              <div key={`variation-${attribute.slug}-${index}`} className={styles.attribute}>
                <span className={styles.attributeLabel}>
                  {attribute.name}
                  :
                </span>
                <div className={styles.attributeValues}>
                  {attribute.values.map((value, valueIndex) => {
                    const isSelected = isValueSelected(attribute.name, value.id);
                    const isAvailable = isValueAvailable(attribute.name, value.id, selectedValues);

                    return (
                      <button
                        key={`${attribute.slug}-${value.id}-${valueIndex}`}
                        type="button"
                        className={`
                          ${styles.attributeValue} 
                          ${isSelected ? styles.attributeValueSelected : ''}
                          ${!isAvailable ? styles.attributeValueDisabled : ''}
                        `}
                        onClick={() => handleAttributeSelect(attribute.name, value.id)}
                        disabled={!isAvailable}
                      >
                        {value.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Specification attributes - displayed as characteristic list */}
            {specAttrs.length > 0 && (
              <div className={styles.specsContainer}>
                <div className={styles.specsTitle}>Характеристики</div>
                <ProductSpecs
                  attributes={specAttrs.slice(0, 4)}
                  currentVariationSku={matchedVariation?.sku}
                  className={styles.specsList}
                  spaceBetween
                />
                <a
                  href="#product-specs"
                  className={styles.allSpecsLink}
                  onClick={(e) => {
                    e.preventDefault();

                    // Trigger click on specs tab - it will handle URL update internally
                    // This avoids updating URL separately which causes component remounting
                    const specsTab = document.querySelector('[data-tab="specs"]');

                    if (specsTab instanceof HTMLElement) {
                      specsTab.click();
                    }

                    // Wait for tab to switch, then scroll to section
                    setTimeout(() => {
                      const specsSection = document.getElementById('product-specs');

                      if (specsSection) {
                        specsSection.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 150);
                  }}
                >
                  <span className={styles.allSpecsLinkText}>Все характеристики</span>
                  <div className={styles.allSpecsIcon}>
                    <Image src={icons.arrowDown} alt="" width={15} height={15} />
                  </div>
                </a>
              </div>
            )}
          </div>
        )}

        <div className={styles.rightColumn}>
          <ProductActions
            price={formattedPrice}
            onSale={currentOnSale ?? false}
            inStock={currentStock ?? false}
            product={product}
            variation={matchedVariation}
            className={styles.productActions}
          />
          {delivery_options && delivery_options.length > 0 && (
            <ProductDelivery
              deliveryOptions={delivery_options}
              className={styles.productDelivery}
            />
          )}
        </div>
      </div>
    </div>
  );
};
