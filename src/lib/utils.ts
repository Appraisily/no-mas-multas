import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge className strings with Tailwind's style conflict resolution
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a date with options
export function formatDate(date: Date | string | number, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Date(date).toLocaleDateString(undefined, mergedOptions);
}

// Format currency amounts
export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.NumberFormat(undefined, mergedOptions).format(amount);
}

// Calculate how many days between two dates
export function daysBetween(date1: Date | string | number, date2: Date | string | number = new Date()): number {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1);
  const secondDate = new Date(date2);
  
  // Calculate the time difference in days
  const diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
  
  return diffDays;
}

// Truncate text with ellipsis if it exceeds maxLength
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

// Convert kebab-case to Title Case
export function titleCase(text: string): string {
  return text
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format a percentage value
export function formatPercentage(value: number, options: Intl.NumberFormatOptions = {}): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Intl.NumberFormat(undefined, mergedOptions).format(value / 100);
}

// Get initials from a name (e.g., "John Doe" => "JD")
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

// Debounce function for handling frequent updates (like searching)
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
} 