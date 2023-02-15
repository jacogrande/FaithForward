import { Timestamp } from "@firebase/firestore";

export const ensureDate = (date: Date | Timestamp): Date => {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === "string") {
    return new Date(date);
  }

  if (date instanceof Timestamp) {
    return date.toDate();
  }

  return new Date();
};

export const formatDate = (date: Date | Timestamp): string => {
  const d = ensureDate(date);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
