import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { Suspense } from "react";
import CountrySelect from "@/components/dashboard/country-select";
import type { AvailableCountriesOutput } from "@/lib/tinybird";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange }: { children: React.ReactNode; onValueChange: (value: string) => void }) => (
    <div data-testid="select">
      {children}
      <button
        data-testid="change-country-all"
        onClick={() => onValueChange("all")}
      >
        All
      </button>
      <button
        data-testid="change-country-us"
        onClick={() => onValueChange("US")}
      >
        US
      </button>
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid={`item-${value}`}>{children}</div>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <div>{placeholder}</div>,
}));

describe("CountrySelect", () => {
  it("renders countries from promise and handles selection changes", async () => {
    const mockPromise: Promise<AvailableCountriesOutput[]> = Promise.resolve([{ country: "US" }, { country: "CA" }]);

    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <CountrySelect countries={mockPromise} />
        </Suspense>,
      );
    });

    expect(screen.getByTestId("item-US")).toHaveTextContent("US");

    fireEvent.click(screen.getByTestId("change-country-us"));
    expect(mockReplace).toHaveBeenCalledWith("/dashboard?country=US");

    fireEvent.click(screen.getByTestId("change-country-all"));
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });
});
