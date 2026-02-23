"use client";

import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter } from "next/navigation";

const DateRangeSelect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeRange = searchParams.get("timeRange") || "30d";

  const handleTimeRangeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("timeRange", value);
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

  return (
    <Select defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Time Range" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="7d">Last 7 Days</SelectItem>
        <SelectItem value="30d">Last 30 Days</SelectItem>
        <SelectItem value="90d">Last 90 Days</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DateRangeSelect;
