import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AppSidebar from "@/components/dashboard/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const mockPush = vi.fn();
const mockSignOut = vi
  .fn()
  .mockImplementation(
    ({ fetchOptions }: { fetchOptions?: { onSuccess?: () => void } }) => {
      if (fetchOptions?.onSuccess) {
        fetchOptions.onSuccess();
      }
      return Promise.resolve();
    },
  );

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/",
}));

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: {
        user: { name: "Test User", email: "test@example.com" },
      },
    }),
    signOut: (...args: unknown[]) => mockSignOut(...args),
  },
}));

vi.mock("@/constants", () => ({
  DASHBOARD_NAVIGATION: [
    {
      title: "Dashboard Home",
      href: "/dashboard",
      icon: () => <svg data-testid="icon" />,
    },
  ],
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <div onClick={onClick} data-testid="dropdown-item">
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <div />,
}));

const renderWithProvider = () => {
  return render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>,
  );
};

describe("AppSidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user information", () => {
    renderWithProvider();
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    renderWithProvider();
    expect(screen.getByText("Dashboard Home")).toBeInTheDocument();
    expect(screen.getByText("Create New")).toBeInTheDocument();
  });

  it("handles sign out through dropdown", async () => {
    renderWithProvider();

    const signOutBtn = screen.getByText("Sign out");
    fireEvent.click(signOutBtn);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/sign-in");
    });
  });
});
