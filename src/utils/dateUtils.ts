import { format, parseISO, isValid } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import type { i18n } from "i18next";

/**
 * Format a date string or Date object to a localized date string
 */
export const formatDate = (
  date: string | Date | null | undefined,
  formatStr = "PP",
  locale = "en",
): string => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) return "";

  return format(dateObj, formatStr, {
    locale: locale.startsWith("ar") ? arSA : enUS,
  });
};

/**
 * Get the start of the current month
 */
export const getStartOfMonth = (date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get the end of the current month
 */
export const getEndOfMonth = (date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
};

/**
 * Get the start of the current year
 */
export const getStartOfYear = (date = new Date()): Date => {
  return new Date(date.getFullYear(), 0, 1);
};

/**
 * Get the end of the current year
 */
export const getEndOfYear = (date = new Date()): Date => {
  return new Date(date.getFullYear(), 11, 31, 23, 59, 59);
};

/**
 * Format a date range for display
 */
export const formatDateRange = (
  startDate: Date | string | null | undefined,
  endDate: Date | string | null | undefined,
  i18n: i18n,
): string => {
  if (!startDate || !endDate) return "";

  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) return "";

  const isSameDay = start.toDateString() === end.toDateString();

  if (isSameDay) {
    return formatDate(start, "PP", i18n.language);
  }

  const isSameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (isSameMonth) {
    return `${formatDate(start, "d", i18n.language)} - ${formatDate(end, "d MMMM yyyy", i18n.language)}`;
  }

  const isSameYear = start.getFullYear() === end.getFullYear();

  if (isSameYear) {
    return `${formatDate(start, "d MMM", i18n.language)} - ${formatDate(end, "d MMM yyyy", i18n.language)}`;
  }

  return `${formatDate(start, "d MMM yyyy", i18n.language)} - ${formatDate(end, "d MMM yyyy", i18n.language)}`;
};

/**
 * Get an array of the last N months
 */
export const getLastNMonths = (
  n: number,
  includeCurrent = false,
): Array<{ value: string; label: string }> => {
  const months = [];
  const date = new Date();

  if (!includeCurrent) {
    date.setMonth(date.getMonth() - 1);
  }

  for (let i = 0; i < n; i++) {
    const monthDate = new Date(date);
    monthDate.setMonth(date.getMonth() - i);

    months.push({
      value: format(monthDate, "yyyy-MM"),
      label: format(monthDate, "MMMM yyyy"),
    });
  }

  return months.reverse();
};

/**
 * Check if a date is within a date range
 */
export const isDateInRange = (
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string,
): boolean => {
  const d = typeof date === "string" ? new Date(date) : date;
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return d >= start && d <= end;
};
