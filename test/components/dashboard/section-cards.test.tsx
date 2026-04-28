import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Suspense } from "react";
import SectionCards from "@/components/dashboard/section-cards";
import type { DashboardMetrics } from "@/data/links";

describe("SectionCards", () => {
  it("renders metric cards with data from promise", async () => {
    const mockData: Promise<DashboardMetrics> = Promise.resolve({
      totalLinks: 500,
      totalClicks: 1500,
      uniqueVisitors: 800,
    });

    await act(async () => {
      render(
        <Suspense fallback={<div>Loading...</div>}>
          <SectionCards
            data={mockData}
            from="2023-01-01"
            to="2023-01-31"
          />
        </Suspense>,
      );
    });

    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("1.5K")).toBeInTheDocument();
    expect(screen.getByText("800")).toBeInTheDocument();

    expect(screen.getByText("Total Links")).toBeInTheDocument();
    expect(screen.getByText("Total Clicks")).toBeInTheDocument();
    expect(screen.getByText("Unique Users")).toBeInTheDocument();
  });
});
