import food1 from "../assets/images/onboarding/food1.jpg";
import food2 from "../assets/images/onboarding/food2.jpg";
import food3 from "../assets/images/onboarding/food3.jpg";
import placeholder from "../assets/placeholder.png";
import burger from "../assets/burger.jpg";
import pasta from "../assets/pasta.jpg";
import chicken from "../assets/chicken.jpg";
import pizza from "../assets/pizza.jpg";
import sushi from "../assets/sushi.jpg";

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
