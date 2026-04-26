"use client";

import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "../ui/calendar";
import { useMemo } from "react";
import { DateRange } from "react-day-picker";
import { addDays, parse, format } from "date-fns";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";

const CalendarRange = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const dateRange: DateRange | undefined = useMemo(() => {
    if (from && to) {
      return {
        from: parse(from, "yyyy-MM-dd", new Date()),
        to: parse(to, "yyyy-MM-dd", new Date()),
      };
    }
    const today = new Date();
    const thirtyDaysAgo = addDays(today, -30);
    return {
      from: thirtyDaysAgo,
      to: today,
    };
  }, [from, to]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range?.from || !range?.to) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("from", format(range.from, "yyyy-MM-dd"));
    params.set("to", format(range.to, "yyyy-MM-dd"));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from && dateRange?.to
            ? format(dateRange.from, "LLL dd, y") +
              " - " +
              format(dateRange.to, "LLL dd, y")
            : "Select a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-auto flex-col-reverse gap-2 p-0 md:flex-row"
        align="start"
      >
        <div className="flex flex-col gap-2 p-2">
          <Button
            variant="outline"
            onClick={() =>
              handleDateRangeChange({ from: new Date(), to: new Date() })
            }
          >
            Today
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleDateRangeChange({
                from: addDays(new Date(), -7),
                to: new Date(),
              })
            }
          >
            Last 7 Days
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleDateRangeChange({
                from: addDays(new Date(), -30),
                to: new Date(),
              })
            }
          >
            Last 30 Days
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleDateRangeChange({
                from: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1,
                ),
                to: new Date(),
              })
            }
          >
            This Month
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleDateRangeChange({
                from: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() - 1,
                  1,
                ),
                to: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  0,
                ),
              })
            }
          >
            Last Month
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              handleDateRangeChange({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date(),
              })
            }
          >
            This Year
          </Button>
        </div>
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleDateRangeChange}
          numberOfMonths={2}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export default CalendarRange;
