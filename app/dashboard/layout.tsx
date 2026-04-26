import AppSidebar from "@/components/dashboard/app-sidebar";
import SelectionResetOnNavigation from "@/components/dashboard/selection-reset-on-navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard | Zipply",
    default: "Dashboard",
  },
  description: "Manage your links, API keys, and view analytics.",
  robots: {
    index: false,
    follow: false,
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <SelectionResetOnNavigation />
      </Suspense>
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
