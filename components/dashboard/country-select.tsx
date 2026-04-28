"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvailableCountriesOutput, CountriesDataOutput } from "@/lib/tinybird";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { use } from "react";

interface CountrySelectProps {
  countries: Promise<AvailableCountriesOutput[] | CountriesDataOutput[]>;
}

const CountrySelect = ({ countries }: CountrySelectProps) => {
  const countriesData = use(countries);
  const countryList = countriesData.map((data) => data.country);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectedCountry = searchParams.get("country") || "all";
  const router = useRouter();

  const handleCountryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("country");
    } else {
      params.set("country", value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <Select onValueChange={handleCountryChange} value={selectedCountry}>
      <SelectTrigger>
        <SelectValue placeholder="Select Country" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">All Countries</SelectItem>
          {countryList.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
