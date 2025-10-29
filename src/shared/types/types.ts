export interface CategorySearchParams {
  page?: number
  per_page?: number
  orderby?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  on_sale?: boolean
  pa_brand?: string
  pa_model?: string
  pa_color?: string
  pa_memory?: string
  dual_sim?: boolean
}

export interface SeoContentBlock {
  type?: 'paragraph' | 'heading' | 'image' | string
  paragraphs?: string[]
  text?: string
  content?: string
  level?: string
  url?: string
  alt?: string
  id?: number
  caption?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  count?: number
  image?: string
  link?: string
  seo_blocks?: SeoContentBlock[]
  children?: Category[]
}

export interface PromoBanner {
  id: number
  title: string
  image?: string
  alt_text?: string
  link?: string
  new_tab?: boolean
  bg_color?: string
  order?: number
}

export interface InfoBlock {
  id: number
  title: string
  description?: string
  image?: string
  image_alt?: string
  mobile_image?: string
  mobile_image_alt?: string
  bg_color?: string
  link?: string
  order?: number
}

export interface Review {
  id: number
  title: string
  text?: string
  excerpt?: string
  author_name?: string
  rating?: number
  source?: string
  source_url?: string
  date?: string
  published_at?: string
  order?: number
}

export interface Product {
  id: number
  name: string
  slug: string
  category_slug?: string
  price: string
  regular_price?: string
  sale_price?: string
  on_sale?: boolean
  currency?: string
  image?: string
  link?: string
  rating?: number
  rating_count?: number
  in_stock?: boolean
}

export interface ProductImage {
  id: number
  url: string
  alt?: string
}

export interface ProductAttributeValue {
  id: number
  name: string
  slug: string
}

export interface ProductAttribute {
  name: string
  slug: string
  values: ProductAttributeValue[]
}

export interface ProductVariation {
  id: number
  price: string
  regular_price?: string
  sale_price?: string
  on_sale?: boolean
  sku?: string
  stock_quantity?: number
  in_stock?: boolean
  attributes: Record<string, string>
  image_id?: number
}

export interface ProductDimensions {
  length?: string
  width?: string
  height?: string
}

export interface ProductDetails extends Product {
  description?: string
  short_description?: string
  images: ProductImage[]
  attributes: ProductAttribute[]
  variations?: ProductVariation[]
  categories: Category[]
  related_products: Product[]
  stock_quantity?: number
  sku?: string
  weight?: string
  dimensions?: ProductDimensions
  date_created?: string
  date_modified?: string
}

export interface HomepageData {
  promoBanners: PromoBanner[]
  newProducts: Product[]
  infoBlocks: InfoBlock[]
  saleProducts: Product[]
  popularCategories: Category[]
  reviews: Review[]
}

export interface MenuItem {
  id: number
  title: string
  url: string
  target?: string
  parent_id?: number
  order?: number
}

export interface Header {
  top_menu: MenuItem[]
  categories_menu: MenuItem[]
}

export interface Contacts {
  address?: string
  phone_primary?: string
  phone_secondary?: string
  email?: string
  working_hours?: string
  map_iframe?: string
  map_src?: string
  coordinates?: string
}

export interface Social {
  id: string
  href: string
  alt: string
}

export interface PageMetadata {
  title?: string
  description?: string
  image?: string
  url?: string
  date?: string
  author?: string
}

export interface Footer { menu: MenuItem[] }

export interface LayoutData {
  header: Header
  contacts: Contacts
  social: Social[]
  page_metadata: PageMetadata
  footer: Footer
}

export interface FilterOption {
  value: string
  label: string
  count: number
  color?: string
}

export interface FilterSection {
  id: string
  title: string
  type: 'checkbox' | 'color' | 'price' | 'toggle'
  options: FilterOption[]
  isExpanded?: boolean
}

export interface FilterData {
  priceRange: {
    min: number
    max: number
    currentMin: number
    currentMax: number
  }
  sections: FilterSection[]
}

export interface SortOption {
  value: string
  label: string
}

export interface SortingOptions {
  default: string
  options: SortOption[]
}

export interface ProductTag {
  name: string
  href: string
}

export interface CategoryData {
  category: Category
  products: Product[]
  page: number
  per_page: number
  total: number
  total_pages: number
  has_more: boolean
  filters: FilterData
  sorting: SortingOptions
}
