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

interface ProductVariant {
  id: string;
  name: string;
  priceUSD: number;
  priceZIG: number;
}

interface ProductAddon {
  id: string;
  name: string;
  priceUSD: number;
  priceZIG: number;
}

interface ProductAllergy {
  id: string;
  name: string;
  contains: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  imageUrls?: string[];
  ratings: string;
  priceUSD: number;
  priceZIG: number;
  originalPrice?: number;
  isFeatured: boolean;
  badge?: string;
  availableFor: string[];
  preparationTime: number;
  stock?: number;
  reviewCount?: number;
  frequentlyBoughtTogether?: string[];
  ingredients?: string[];
  nutritionalInfo?: {
    servingSize: string;
    calories: {
      value: number;
      unit: string;
    };
    macronutrients: Array<{
      name: string;
      value: number;
      unit: string;
      dailyValue?: string;
    }>;
    micronutrients?: Array<{
      name: string;
      value: number;
      unit: string;
      dailyValue?: string;
    }>;
  };
  customizationOptions?: Array<{
    id: string;
    title: string;
    type: "single" | "multiple";
    required: boolean;
    options: Array<{
      id: string;
      name: string;
      price: number;
      description?: string;
    }>;
  }>;
  allergies?: Array<{
    id: string;
    name: string;
    contains: string;
  }>;
  metrics?: {
    popularity?: number;
    calories?: number;
    spiceLevel?: number;
    isVegetarian?: boolean;
    isVegan?: boolean;
  };
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  userImage?: string;
  helpfulCount?: number;
}

export interface StoreHours {
  monday: { open: string; close: string };
  tuesday: { open: string; close: string };
  wednesday: { open: string; close: string };
  thursday: { open: string; close: string };
  friday: { open: string; close: string };
  saturday: { open: string; close: string };
  sunday: { open: string; close: string };
}

export type OpeningHours = {
  [day: string]: { open: string; close: string };
};

export interface MerchantsResponse {
  id: string;
  name: string;
  category: string;
  rating: number;
  numberOfRatings: number;
  orders: number;
  deliveryTime: string;
  pickupTime: string;
  distance: string;
  status: string;
  openingHours: StoreHours;
  logo: string;
  coverImage: string;
  isFavorite: boolean;
  isSponsored: boolean;
  deliveryFeeUSD: number;
  deliveryFeeZIG: number;
  minOrderUSD: number;
  minOrderZIG: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  about: {
    description: string;
    dateJoined: string;
    phone: string;
    email: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
  menu: {
    categories: {
      id: string;
      name: string;
      products: Product[];
    }[];
  };
  reviews?: Review[] | null;
}

export interface Menu {
  categories: {
    id: string;
    name: string;
    products: Product[];
  }[];
}

export interface FeaturedProductsType {
  menu: {
    categories: {
      id: string;
      name: string;
      products: Product[];
    }[];
  };
}
