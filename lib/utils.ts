import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { TrendResult, User } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMM DD, YYYY");
};

export const simpleDate = (dateString: string): string => {
  return dayjs(dateString).format("MM/DD/YY");
};

export function isUser(data: any): data is User {
  return data && typeof data.email === "string";
}

export const calculateTrendChange = (
  countOfThisMonth: number,
  countOfLastMonth: number,
): TrendResult => {
  const change = countOfThisMonth - countOfLastMonth;

  if (change > 0) {
    return { trend: "increment", change };
  } else if (change < 0) {
    return { trend: "decrement", change: -change };
  } else {
    return { trend: "no change", change };
  }
};
