const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
] as const;

/**
 * Formats YYYY-MM-DD (or YYYY-MM) as "MON YYYY" using calendar parts
 * rather than Date/locale APIs — avoids UTC midnight month shifts and
 * server/client hydration mismatches.
 */
export function formatMonthYear(iso: string): string {
  const [year, month] = iso.split("-").map(Number);
  return `${MONTHS[(month || 1) - 1]} ${year}`;
}
