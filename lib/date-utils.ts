import { eachDayOfInterval, parseISO, format } from "date-fns";
import { logger } from "@/lib/logger";

interface DateRow {
  date: string;
  [key: string]: unknown;
}

export const fillMissingDates = (
  data: DateRow[],
  fromDate: string,
  toDate: string,
): DateRow[] => {
  if (!fromDate || !toDate || data.length === 0) {
    return data;
  }

  try {
    const start = parseISO(fromDate);
    const end = parseISO(toDate);
    const allDates = eachDayOfInterval({ start, end });

    const dataMap = new Map(data.map((d) => [d.date, d]));
    const template = data[0];

    return allDates.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      if (dataMap.has(dateStr)) {
        return dataMap.get(dateStr) as DateRow;
      }

      const newRow: DateRow = { date: dateStr };
      for (const key of Object.keys(template)) {
        if (key !== "date" && typeof template[key] === "number") {
          newRow[key] = 0;
        }
      }
      return newRow;
    });
  } catch (error) {
    logger.error({ error }, "Error filling missing dates");
    return data;
  }
};

export const formatDateRange = (fromDate: string, toDate: string): string => {
  try {
    const start = parseISO(fromDate);
    const end = parseISO(toDate);
    const startStr = format(start, "MMM d, yyyy");
    const endStr = format(end, "MMM d, yyyy");
    return `${startStr} - ${endStr}`;
  } catch (error) {
    logger.error({ error }, "Error formatting date range");
    return "the selected period";
  }
};

export const dateToISO8601 = (dateStr: string): string => {
  try {
    return parseISO(dateStr).toISOString();
  } catch {
    return new Date(dateStr).toISOString();
  }
};
