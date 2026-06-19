/**
 * Shared date range helpers used by budget aggregation, income filter,
 * and heatmap generation. All functions are pure with no side effects.
 */

import { format } from "date-fns";

/** Returns a new Date at the first moment of the given date's month. */
export const startOfMonthDate = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

/** Returns a new Date at the last moment of the given date's month. */
export const endOfMonthDate = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
};

/** Returns a new Date at the most recent Monday (start of ISO week). */
export const startOfWeekDate = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun ... 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Returns a new Date at the Sunday following startOfWeekDate. */
export const endOfWeekDate = (date: Date = new Date()): Date => {
  const start = startOfWeekDate(date);
  const d = new Date(start);
  d.setDate(d.getDate() + 6);
  d.setHours(23, 59, 59, 999);
  return d;
};

/** Returns a new Date at January 1st of the given date's year. */
export const startOfYearDate = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0, 0);
};

/** Returns a new Date at December 31st of the given date's year. */
export const endOfYearDate = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);
};

type Period = "WEEKLY" | "MONTHLY" | "YEARLY";

/**
 * Returns the { start, end } date range for a given budget period.
 * Used by getBudgetsWithSpend() spend aggregation and income period filter.
 */
export const dateRangeForPeriod = (
  period: Period,
  from: Date = new Date(),
): { start: Date; end: Date } => {
  switch (period) {
    case "WEEKLY":
      return { start: startOfWeekDate(from), end: endOfWeekDate(from) };
    case "MONTHLY":
      return { start: startOfMonthDate(from), end: endOfMonthDate(from) };
    case "YEARLY":
      return { start: startOfYearDate(from), end: endOfYearDate(from) };
  }
};

/**
 * Returns the date range for "last month" relative to the given date.
 */
export const lastMonthRange = (
  date: Date = new Date(),
): { start: Date; end: Date } => {
  const lastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return {
    start: startOfMonthDate(lastMonth),
    end: endOfMonthDate(lastMonth),
  };
};

/**
 * Thin wrapper over date-fns format() that centralizes the import.
 * @param date - Date object or ISO string
 * @param fmt  - date-fns format string (e.g. "dd/MM/yyyy")
 */
export const formatDateDisplay = (
  date: Date | string,
  fmt: string = "dd/MM/yyyy",
): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, fmt);
};

/**
 * Returns whether a given date falls on today (calendar day comparison).
 */
export const isToday = (date: Date): boolean => {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
};

/**
 * Returns an array of Date objects for the last N calendar days (inclusive of today).
 * Used for contribution heatmap generation.
 */
export const getLastNDays = (n: number): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
};

/**
 * Converts a Date to a "YYYY-MM-DD" string using local time (not UTC).
 * Used for HabitLog date keys and comparisons.
 */
export const dateToString = (date: Date = new Date()): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
