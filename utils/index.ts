import { StoreHours } from "@/types";

export const isStoreOpen = (
  openingHours: { [day: string]: { open: string; close: string } } | StoreHours
): boolean => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Initialize currentDate as a Date object
  const currentDate = new Date();

  const currentDay = daysOfWeek[currentDate.getDay()];
  const currentTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

const todayHours = openingHours[currentDay as keyof StoreHours];

  if (!todayHours) {
    return false; // Return false if the store is closed
  }

  const { open, close } = todayHours;

  if (currentTime >= open && currentTime <= close) {
    return true; // Return true if the store is open
  }

  return false; // Return false if the store is closed
};