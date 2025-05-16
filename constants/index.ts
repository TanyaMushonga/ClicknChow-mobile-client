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

export const merchants = [
  {
    id: "1",
    name: "Burger Palace",
    category: "American • Burgers",
    rating: 4.8,
    deliveryTime: "15-20 min",
    image: images.burger,
    isOpen: true,
    deliveryFee: "$4.88",
    isFavorite: false,
    orders: 1245,
    distance: "0.5 km",
    isSponsored: true,
  },
  {
    id: "2",
    name: "Pasta Paradise",
    category: "Italian • Pasta",
    rating: 4.6,
    deliveryTime: "20-25 min",
    image: images.pasta,
    isOpen: true,
    deliveryFee: "$2.88",
    isFavorite: true,
    orders: 892,
    distance: "0.8 km",
    isSponsored: false,
  },
  {
    id: "3",
    name: "Sushi World",
    category: "Japanese • Sushi",
    rating: 4.9,
    deliveryTime: "25-30 min",
    image: images.sushi,
    isOpen: false,
    deliveryFee: "$6.88",
    isFavorite: false,
    orders: 756,
    distance: "1.2 km",
    isSponsored: true,
  },
  {
    id: "4",
    name: "Pizza Heaven",
    category: "Italian • Pizza",
    rating: 4.7,
    deliveryTime: "10-15 min",
    image: images.pizza,
    isOpen: true,
    deliveryFee: "$5.88",
    isFavorite: false,
    orders: 1532,
    distance: "0.3 km",
    isSponsored: false,
  },
];
