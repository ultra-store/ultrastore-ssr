import type { Category, ProductTag } from '../types';

export const categoriesToTags = (categories: Category[]): ProductTag[] => {
  return categories.map((category) => ({
    name: category.name,
    href: category.slug,
  }));
};
