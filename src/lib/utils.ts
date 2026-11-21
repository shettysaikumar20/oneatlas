import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format price in USD per 1M tokens with smart decimal precision.
 * e.g., 0.15 -> "$0.15 / 1M", 0.0375 -> "$0.0375 / 1M", 0 -> "Free"
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "N/A";
  if (price === 0) return "Free";
  if (price < 0.01) {
    return `$${price.toFixed(4)} / 1M`;
  }
  if (price < 1) {
    return `$${price.toFixed(2)} / 1M`;
  }
  return `$${price.toFixed(2)} / 1M`;
}

/**
 * Format context window into human readable notation.
 * e.g., 128000 -> "128K", 1048576 -> "1M", 2097152 -> "2M"
 */
export function formatContext(tokens: number | null | undefined): string {
  if (!tokens) return "N/A";
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    const thousands = Math.round(tokens / 1_000);
    return `${thousands}K`;
  }
  return tokens.toLocaleString();
}

/**
 * Format date to standard readable format.
 * e.g., "Dec 2024" or "Dec 15, 2024"
 */
export function formatDate(date: string | Date | null | undefined, includeDay = false): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  if (includeDay) {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

/**
 * Format throughput (tokens per second).
 */
export function formatThroughput(tps: number | null | undefined): string {
  if (!tps) return "N/A";
  return `${Math.round(tps)} tps`;
}

/**
 * Format latency in milliseconds.
 */
export function formatLatency(ms: number | null | undefined): string {
  if (!ms) return "N/A";
  return `${Math.round(ms)} ms`;
}
