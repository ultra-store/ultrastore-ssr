'use client';
import { useState } from 'react';

import { ProductGrid } from '@/components/products/product-grid/product-grid';
import { SeoContentBlockComponent } from '@/components/seo-content/seo-content-block/seo-content-block';
import { ContactCard } from '@/components/ui/contact-card';
import { Filter, FiltersSection, FilterPopup, Multiselect, Range, Toggle } from '@/components/ui/filter';
import { useFilterPopup } from '@/components/ui/filter/filter-popup-context';
import type { Contacts, FilterData, Product, SeoContentBlock, Social, SortingOptions } from '@/shared/types/types';

import styles from './category-content.module.css';

interface CategoryContentProps {
  products: Product[]
  filterData?: FilterData
  sorting?: SortingOptions
  contacts?: Contacts
  social?: Social[]
  seoBlocks?: SeoContentBlock[]
}

const brandsMock = [
  {
    value: 'apple',
    label: 'Apple',
    count: 135,
  },
  {
    value: 'samsung',
    label: 'Samsung',
    count: 98,
  },
  {
    value: 'xiaomi',
    label: 'Xiaomi',
    count: 76,
  },
  {
    value: 'redmi',
    label: 'Redmi',
    count: 54,
  },
  {
    value: 'google',
    label: 'Google',
    count: 32,
  },
  {
    value: 'honor',
    label: 'Honor',
    count: 28,
  },
  {
    value: 'huawei',
    label: 'Huawei',
    count: 19,
  },
];

const colorsMock = [
  {
    value: 'black',
    label: 'Black',
    count: 135,
    color: '#000000',
  },
  {
    value: 'blue',
    label: 'Blue',
    count: 82,
    color: '#053556',
  },
  {
    value: 'green',
    label: 'Green',
    count: 64,
    color: '#ACE0CA',
  },
  {
    value: 'natural-titanium',
    label: 'Natural Titanium',
    count: 55,
    color: '#BBB5A9',
  },
  {
    value: 'pacific-blue',
    label: 'Pacific Blue',
    count: 43,
    color: '#335E6D',
  },
];

export const CategoryContent = ({ products, sorting, contacts, social, seoBlocks }: CategoryContentProps) => {
  const { isOpen: isFilterPopupOpen, setIsOpen: setIsFilterPopupOpen } = useFilterPopup();
  const [isToggleEnabled, setIsToggleEnabled] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([32990, 169990]);

  const handleToggle = () => {
    setIsToggleEnabled(!isToggleEnabled);
  };

  const handleBrandSelectionChange = (values: string[]) => {
    setSelectedBrands(values);
  };

  const handleColorSelectionChange = (values: string[]) => {
    setSelectedColors(values);
  };

  const handlePriceChange = (values: [number, number]) => {
    setSelectedPrice(values);
  };

  const handleClearAll = () => {
    setIsToggleEnabled(false);
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedPrice([32990, 169990]);
  };

  const handleFilterPopupToggle = () => {
    setIsFilterPopupOpen(!isFilterPopupOpen);
  };

  const handleFilterPopupClose = () => {
    setIsFilterPopupOpen(false);
  };

  const phoneText = contacts?.phone_primary || '+7 (999) 999-99-99';
  const emailText = contacts?.email || 'info@ultrastore.ru';

  // Convert sorting options to the format needed by SortSelect
  const sortingOptions = sorting?.options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  })) || [];

  const defaultSort = sorting?.default || 'price';

  const filtersContent = (
    <FiltersSection onClear={handleClearAll}>
      <Filter label="Dual SIM" collapsible={false} oneline>
        <Toggle isEnabled={isToggleEnabled} onToggle={handleToggle} paramName="dual_sim" />
      </Filter>
      <Filter label="Бренд">
        <Multiselect
          options={brandsMock}
          selectedValues={selectedBrands}
          onSelectionChange={handleBrandSelectionChange}
          paramName="pa_brand"
        />
      </Filter>
      <Filter label="Цвет">
        <Multiselect
          options={colorsMock}
          selectedValues={selectedColors}
          onSelectionChange={handleColorSelectionChange}
          type="color"
          paramName="pa_color"
        />
      </Filter>
      <Filter label="Цена">
        <Range min={32990} max={169990} value={selectedPrice} onChange={handlePriceChange} unit="₽" paramName="pa_price" />
      </Filter>
    </FiltersSection>
  );

  return (
    <>
      <div className={styles.content}>
        <aside className={styles.filters}>
          {filtersContent}
        </aside>
        <section className={styles.productsSection}>
          <ProductGrid
            products={products}
            sortingOptions={sortingOptions}
            defaultSort={defaultSort}
            onFilterButtonClick={handleFilterPopupToggle}
          />
          <ContactCard
            title="Не нашли нужный товар?"
            subtitle="Свяжитесь с нами, возможно, мы сможем помочь"
            phone={{
              label: 'Телефон',
              value: phoneText,
              href: `tel:${phoneText.replace(/[^+\d]/g, '')}`,
            }}
            email={{
              label: 'Почта',
              value: emailText,
              href: `mailto:${emailText}`,
            }}
            social={social}
          />
          {seoBlocks && seoBlocks.length > 0 && (
            <div className={styles.seoContent}>
              {seoBlocks.map((block, index) => (
                <SeoContentBlockComponent key={index} block={block} />
              ))}
            </div>
          )}
        </section>
      </div>
      <FilterPopup isOpen={isFilterPopupOpen} onClose={handleFilterPopupClose} onApply={handleFilterPopupClose}>
        {filtersContent}
      </FilterPopup>
    </>
  );
};
