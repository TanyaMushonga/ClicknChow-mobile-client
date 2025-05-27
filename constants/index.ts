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

export const merchantsData = [
  {
    id: "1",
    name: "Burger Palace",
    category: "American • Burgers",
    rating: 4.8,
    numberOfRatings: 428,
    orders: 1245,
    deliveryTime: "15-20 min",
    pickupTime: "10-15 min",
    distance: "0.5 km",
    status: "open",
    openingHours: {
      monday: { open: "08:00", close: "22:00" },
      tuesday: { open: "08:00", close: "22:00" },
      wednesday: { open: "08:00", close: "22:00" },
      thursday: { open: "08:00", close: "22:00" },
      friday: { open: "08:00", close: "23:00" },
      saturday: { open: "09:00", close: "23:00" },
      sunday: { open: "10:00", close: "22:00" },
    },
    image: images.burger,
    logo: images.burger1,
    coverImage: images.burger,
    isFavorite: false,
    isSponsored: true,
    deliveryFeeUSD: 4.88,
    deliveryFeeZIG: 120,
    minOrderUSD: 10,
    minOrderZIG: 250,
    coordinates: { latitude: -17.824858, longitude: 31.053028 },
    about: {
      description:
        "Home of the juiciest burgers since 2015. 100% organic beef.",
      dateJoined: "2020-05-15",
      phone: "+263772123456",
      email: "info@burgerpalace.com",
      website: "www.burgerpalace.com",
      socialMedia: {
        facebook: "facebook.com/burgerpalace",
        instagram: "instagram.com/burgerpalace",
      },
    },
    menu: {
      categories: [
        {
          id: "burgers",
          name: "Burgers",
          products: [
            {
              id: "b1",
              name: "Classic Burger",
              description: "Beef patty with lettuce, tomato, and special sauce",
              priceUSD: 8.99,
              priceZIG: 225,
              isFeatured: true,
              availableFor: ["delivery", "pickup"],
              preparationTime: 15,
              variants: [
                { id: "b1v1", name: "Single", priceUSD: 8.99, priceZIG: 225 },
                { id: "b1v2", name: "Double", priceUSD: 11.99, priceZIG: 300 },
              ],
              addons: [
                { id: "b1a1", name: "Cheese", priceUSD: 1.5, priceZIG: 38 },
                { id: "b1a2", name: "Bacon", priceUSD: 2.0, priceZIG: 50 },
              ],
              allergies: [
                { id: "b1al1", name: "Gluten", contains: "Wheat bun" },
                { id: "b1al2", name: "Dairy", contains: "Cheese" },
              ],
              metrics: { popularity: 95, calories: 650, spiceLevel: 2 },
            },
          ],
        },
        {
          id: "sides",
          name: "Sides",
          products: [
            {
              id: "s1",
              name: "French Fries",
              priceUSD: 3.99,
              priceZIG: 100,
              availableFor: ["delivery", "pickup"],
              preparationTime: 8,
            },
            // 4 more sides...
          ],
        },
      ],
      reviews: [
        {
          id: "r1",
          userId: "user123",
          userName: "John D.",
          rating: 5,
          comment: "Best burgers in town!",
          date: "2023-05-15",
        },
      ],
    },
  },

  {
    id: "2",
    name: "Pasta Paradise",
    category: "Italian • Pasta",
    rating: 4.6,
    numberOfRatings: 312,
    orders: 892,
    deliveryTime: "20-25 min",
    pickupTime: "15-20 min",
    distance: "0.8 km",
    status: "busy",
    openingHours: {
      // ...opening hours
    },
    // ...other properties
    menu: {
      categories: [
        {
          id: "pastas",
          name: "Pasta",
          products: [
            {
              id: "p1",
              name: "Spaghetti Carbonara",
              description: "Classic Roman pasta with eggs, cheese, pancetta",
              priceUSD: 12.99,
              priceZIG: 325,
              isFeatured: true,
              // ...other product details
            },
            // 4 more pastas...
          ],
        },
      ],
    },
  },

  // 3. Sushi World
  {
    id: "3",
    name: "Sushi World",
    category: "Japanese • Sushi",
    rating: 4.9,
    // ...other properties
    menu: {
      categories: [
        {
          id: "sushi",
          name: "Sushi Rolls",
          products: [
            {
              id: "s1",
              name: "California Roll",
              description: "Crab, avocado and cucumber",
              priceUSD: 14.99,
              priceZIG: 375,
              // ...variants for 6pc/12pc
            },
          ],
        },
        {
          id: "sashimi",
          name: "Sashimi",
          products: [
            // 5 sashimi items
          ],
        },
      ],
    },
  },

  // 4-10. Additional merchants (Pizza, Indian, Mexican, etc.)
  {
    id: "4",
    name: "Pizza Heaven",
    category: "Italian • Pizza",
    // ...full details
  },
  {
    id: "5",
    name: "Curry House",
    category: "Indian • Curry",
    // ...full details
  },
  {
    id: "6",
    name: "Taco Fiesta",
    category: "Mexican • Tacos",
    // ...full details
  },
  {
    id: "7",
    name: "Dragon Wok",
    category: "Chinese • Asian",
    // ...full details
  },
  {
    id: "8",
    name: "Steak Master",
    category: "American • Grill",
    // ...full details
  },
  {
    id: "9",
    name: "Green Garden",
    category: "Vegetarian • Healthy",
    // ...full details
  },
  {
    id: "10",
    name: "Seafood Cove",
    category: "Seafood • Fish",
    // ...full details
  },
];
