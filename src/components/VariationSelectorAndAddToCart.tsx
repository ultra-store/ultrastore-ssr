'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { woocommerce, formatPrice } from '@/lib/woocommerce';
import {
  WooCommerceProduct,
  WooCommerceProductVariation,
  WooCommerceVariationAttribute,
} from '@/types/woocommerce';
import { Card, CardBody, Select, SelectItem, Chip, Skeleton } from '@heroui/react';
import AddToCartButton from './AddToCartButton';

type Props = {
  product: WooCommerceProduct;
};

type AttributeSelection = Record<string, string>;

export default function VariationSelectorAndAddToCart({ product }: Props) {
  const [variations, setVariations] = useState<WooCommerceProductVariation[] | null>(
    product.type === 'variable' ? [] : null
  );
  const [loading, setLoading] = useState(product.type === 'variable');
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<AttributeSelection>(() => {
    const defaults: AttributeSelection = {};
    if (product.default_attributes) {
      product.default_attributes.forEach((attr) => {
        if (attr.variation && attr.name && attr.options && attr.options.length > 0) {
          // default_attributes in product have options[] in our type, but Woo default has {name, option}
        }
      });
    }
    // Woo product.default_attributes is an array of {id, name, option}
    // Our type simplification used WooCommerceAttribute, so we fallback to first option per attribute
    product.attributes
      .filter((a) => a.variation)
      .forEach((a) => {
        const key = normalizeAttributeName(a.name);
        if (!defaults[key] && a.options && a.options.length > 0) {
          defaults[key] = a.options[0];
        }
      });
    return defaults;
  });

  useEffect(() => {
    let mounted = true;
    async function fetchVariations() {
      if (product.type !== 'variable') return;
      setLoading(true);
      setError(null);
      try {
        const vars = await woocommerce.getProductVariations(product.id, { per_page: 100 });
        if (!mounted) return;
        setVariations(vars);
      } catch (e) {
        console.error('Error loading variations', e);
        if (mounted) setError('Не удалось загрузить варианты товара');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchVariations();
    return () => {
      mounted = false;
    };
  }, [product]);

  const variationAttributes = useMemo(
    () => product.attributes.filter((a) => a.variation),
    [product.attributes]
  );

  const selectedVariation: WooCommerceProductVariation | undefined = useMemo(() => {
    if (!variations || variations.length === 0) return undefined;
    const entries = Object.entries(selection);
    return variations.find((variation) => {
      // Each variation must match all selected attributes
      return entries.every(([key, value]) => {
        const va = variation.attributes.find(
          (a) => normalizeAttributeName(a.name) === key
        );
        if (!va) return false;
        return normalizeOption(va.option) === normalizeOption(value);
      });
    });
  }, [variations, selection]);

  const selectedAttributesForCart: WooCommerceVariationAttribute[] | undefined = useMemo(() => {
    if (!selectedVariation) return undefined;
    return selectedVariation.attributes;
  }, [selectedVariation]);

  if (product.type !== 'variable') {
    return <AddToCartButton product={product} />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {variationAttributes.map((attr) => {
          const key = normalizeAttributeName(attr.name);
          const value = selection[key] ?? '';
          return (
            <Select
              key={key}
              label={attr.name}
              selectedKeys={value ? [value] : []}
              onSelectionChange={(keys) => {
                const val = Array.from(keys)[0] as string | undefined;
                if (!val) return;
                setSelection((prev) => ({ ...prev, [key]: val }));
              }}
            >
              {attr.options.map((opt) => (
                <SelectItem key={opt} textValue={opt}>
                  {opt}
                </SelectItem>
              ))}
            </Select>
          );
        })}
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <Card className="bg-danger-50 border-danger-200">
          <CardBody className="py-3 text-danger-800">{error}</CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {selectedVariation && (
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(selectedVariation.price || product.price)}
              </span>
              {selectedVariation.on_sale && selectedVariation.regular_price && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(selectedVariation.regular_price)}
                  </span>
                  <Chip color="danger" size="sm" variant="solid">
                    СКИДКА
                  </Chip>
                </>
              )}
              {!selectedVariation.on_sale && product.on_sale && product.regular_price && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.regular_price)}
                  </span>
                </>
              )}
            </div>
          )}

          <AddToCartButton
            product={product}
            selectedVariation={selectedVariation}
            selectedAttributes={selectedAttributesForCart}
          />
        </div>
      )}
    </div>
  );
}

function normalizeAttributeName(name: string): string {
  return name.trim().toLowerCase();
}

function normalizeOption(option: string): string {
  return option.trim().toLowerCase();
}


