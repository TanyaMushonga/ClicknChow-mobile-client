import { OpeningHours, StoreHours } from "@/types";

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

  const currentDate = new Date();

  const currentDay = daysOfWeek[currentDate.getDay()];
  const currentTime = `${currentDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${currentDate.getMinutes().toString().padStart(2, "0")}`;

  const todayHours = openingHours[currentDay as keyof StoreHours];
  if (!todayHours) {
    return false;
  }
  const { open, close } = todayHours;
  if (currentTime >= open && currentTime <= close) {
    return true;
  }
  return false;
};

export const getOpeningHoursForToday = (openingHours: OpeningHours): string => {
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const today = new Date().getDay();

  const todayKey = daysOfWeek[today];
  const todayHours = openingHours[todayKey];

  return `${todayHours.open}-${todayHours.close}`;
};
