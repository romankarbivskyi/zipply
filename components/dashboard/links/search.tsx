"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  const handleInputChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const params = new URLSearchParams(searchParams);
      const value = e.target.value;

      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      router.push(`/dashboard/links?${params.toString()}`);
    },
    500,
  );

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Search"
        className="pl-8"
        defaultValue={search}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default Search;
