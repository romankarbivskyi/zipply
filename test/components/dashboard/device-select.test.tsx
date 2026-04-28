import { describe, it, expect, vi } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { Suspense } from "react";
import DeviceSelect from "@/components/dashboard/device-select";
import type { AvailableDevicesOutput } from "@/lib/tinybird";

const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    onValueChange,
  }: {
    children: React.ReactNode;
    onValueChange: (value: string) => void;
  }) => (
    <div data-testid="select">
      {children}
      <button
        data-testid="change-device-all"
        onClick={() => onValueChange("all")}
      ></button>
      <button
        data-testid="change-device-mobile"
        onClick={() => onValueChange("mobile")}
      ></button>
    </div>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectGroup: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <div data-testid={`item-${value}`}>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SelectValue: ({ placeholder }: { placeholder: string }) => (
    <div>{placeholder}</div>
  ),
}));

describe("DeviceSelect", () => {
  it("renders devices from promise and handles selection changes", async () => {
    const mockPromise: Promise<AvailableDevicesOutput[]> = Promise.resolve([
      { device: "desktop" },
      { device: "mobile" },
    ]);

    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <DeviceSelect devices={mockPromise} />
        </Suspense>,
      );
    });

    expect(screen.getByTestId("item-desktop")).toHaveTextContent("Desktop");
    expect(screen.getByTestId("item-mobile")).toHaveTextContent("Mobile");

    fireEvent.click(screen.getByTestId("change-device-mobile"));
    expect(mockReplace).toHaveBeenCalledWith("/dashboard?device=mobile");

    fireEvent.click(screen.getByTestId("change-device-all"));
    expect(mockReplace).toHaveBeenCalledWith("/dashboard");
  });
});
