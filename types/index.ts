export interface DietaryFilters {
  vegan: boolean;
  vegetarian: boolean;
  glutenFree: boolean;
}

export interface FeatureFilters {
  freeDelivery: boolean;
  openNow: boolean;
  deals: boolean;
}

export interface Filters {
  deliveryTime: number | null;
  priceRange: [number, number];
  dietary: DietaryFilters;
  features: FeatureFilters;
}
export interface UpdatePriceRange {
  (index: number, value: number): void;
}

export interface Merchant {
  id: string;
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  image: any;
  isOpen: boolean;
  deliveryFee: string;
  isFavorite: boolean;
  orders: number;
  distance: string;
  isSponsored: boolean;
}
