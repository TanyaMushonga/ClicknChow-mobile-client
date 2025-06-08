export interface ProductDetails {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  imageUrls: string[];
  stock: number;
  customizationOptions: {
    sauces: {
      title: string;
      type: "single";
      options: {
        id: string;
        name: string;
        price: number;
        isSpicy?: boolean;
      }[];
    };
    addOns: {
      title: string;
      type: "multiple";
      options: {
        id: string;
        name: string;
        price: number;
      }[];
    };
    removables: {
      title: string;
      type: "multiple";
      options: {
        id: string;
        name: string;
      }[];
    };
    portionSize: {
      title: string;
      type: "single";
      options: {
        id: string;
        name: string;
        price: number;
      }[];
    };
  };
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: string;
  };
}
