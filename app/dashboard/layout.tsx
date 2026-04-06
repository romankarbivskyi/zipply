import AppSidebar from "@/components/dashboard/app-sidebar";
import SelectionResetOnNavigation from "@/components/dashboard/selection-reset-on-navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SelectionResetOnNavigation />
      <AppSidebar />
      <SidebarInset>
        <main className="flex flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
