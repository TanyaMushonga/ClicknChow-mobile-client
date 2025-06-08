import food1 from "../assets/images/onboarding/food1.jpg";
import food2 from "../assets/images/onboarding/food2.jpg";
import food3 from "../assets/images/onboarding/food3.jpg";
import placeholder from "../assets/placeholder.png";
import burger from "../assets/burger.jpg";
import burger1 from "../assets/burger1.jpg";
import burger2 from "../assets/burger2.jpg";
import pasta from "../assets/pasta.jpg";
import pasta1 from "../assets/pasta1.jpg";
import pasta2 from "../assets/pasta2.jpg";
import chicken from "../assets/chicken.jpg";
import pizza from "../assets/pizza.jpg";
import pizza1 from "../assets/pizza1.jpg";
import pizza2 from "../assets/pizza2.jpg";
import sushi from "../assets/sushi.jpg";
import sushi1 from "../assets/sushi1.jpg";
import sushi2 from "../assets/sushi2.jpg";
import chicken1 from "../assets/chicken1.jpg";
import chicken2 from "../assets/chicken2.jpg";
import chicken3 from "../assets/chicken3.jpg";
import { ProductDetails } from "@/types/product";

export const images = {
  food1,
  food2,
  food3,
  placeholder,
  burger,
  pasta,
  chicken,
  pizza,
  sushi,
  chicken1,
  chicken2,
  chicken3,
  pasta1,
  pasta2,
  sushi1,
  sushi2,
  pizza1,
  pizza2,
  burger1,
  burger2,
};

export const onboarding = [
  {
    id: 1,
    title: "Welcome to Click n Chow",
    description: "Delicious meals delivered right to your doorstep.",
    image: images.food1,
  },
  {
    id: 2,
    title: "Easy Ordering Process",
    description:
      "Browse restaurants, customize your meals, and order in just a few taps.",
    image: images.food2,
  },
  {
    id: 3,
    title: "Track Your Delivery",
    description:
      "Stay updated with real-time tracking and never miss a meal again.",
    image: images.food3,
  },
];

export const deliveryTimes = [
  { label: "Any", value: null },
  { label: "≤ 15 min", value: 15 },
  { label: "≤ 30 min", value: 30 },
  { label: "≤ 45 min", value: 45 },
];

export const dummyProduct: ProductDetails = {
  id: "burger_001",
  name: "Classic Beef Burger",
  description:
    "Juicy beef patty with fresh lettuce, melted cheese, and our signature secret sauce on a toasted sesame bun",
  price: 12.0,
  originalPrice: 15.9,
  rating: 4.8,
  reviewCount: 250,
  imageUrls: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
    "https://images.unsplash.com/photo-1553979459-d2229ba7433b",
  ],
  stock: 3,
  customizationOptions: {
    sauces: {
      title: "Choose Sauce",
      type: "single",
      options: [
        { id: "sauce_bbq", name: "BBQ Sauce", price: 0 },
        { id: "sauce_mayo", name: "Mayo", price: 0 },
        { id: "sauce_spicy", name: "Spicy Sauce", price: 0, isSpicy: true },
      ],
    },
    addOns: {
      title: "Add-on",
      type: "multiple",
      options: [
        { id: "addon_cheese", name: "Extra Cheese", price: 1.3 },
        { id: "addon_bacon", name: "Bacon", price: 2.0 },
        { id: "addon_avocado", name: "Avocado", price: 1.75 },
      ],
    },
    removables: {
      title: "Remove Ingredients",
      type: "multiple",
      options: [
        { id: "remove_cheese", name: "No Cheese" },
        { id: "remove_onion", name: "No Onion" },
        { id: "remove_tomato", name: "No Tomato" },
      ],
    },
    portionSize: {
      title: "Portion Size",
      type: "single",
      options: [
        { id: "size_regular", name: "Regular", price: 0 },
        { id: "size_large", name: "Large", price: 3.0 },
      ],
    },
  },
  ingredients: ["Beef", "Cheese", "Lettuce", "Tomato", "Onion", "Sesame Bun"],
  nutritionalInfo: {
    calories: 750,
    protein: "35g",
  },
};
