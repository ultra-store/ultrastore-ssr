export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  count?: number
  image?: string
  link?: string
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
