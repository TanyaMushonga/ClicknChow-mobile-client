export interface CartItem {
  id: string;
  name: string;
  image: string;
  customizations: string;
  price: number;
  quantity: number;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  deliveryTime: string;
  deliveryType: "Delivery" | "Pickup" | "Dine In";
  isExpanded: boolean;
  items: CartItem[];
  deliveryFee: number;
  tax: number;
}

export interface SavedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  storeId: string;
}

export interface CartData {
  stores: Store[];
  savedForLater: SavedItem[];
}
