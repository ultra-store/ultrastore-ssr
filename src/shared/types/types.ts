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

export interface HomepageData {
  promoBanners: PromoBanner[]
  infoBlocks: InfoBlock[]
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
}

export interface Social {
  telegram?: string
  whatsapp?: string
  vk?: string
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
