import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { ForgotPasswordDialog } from "@/components/auth/forgot-password-dialog";

const mockRequestPasswordReset = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("@/lib/auth-client", () => ({
  authClient: {
    requestPasswordReset: (...args: unknown[]) =>
      mockRequestPasswordReset(...args),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

describe("ForgotPasswordDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders trigger button", () => {
    render(<ForgotPasswordDialog />);
    expect(screen.getByText("Forgot password?")).toBeInTheDocument();
  });

  it("opens dialog on trigger click", async () => {
    render(<ForgotPasswordDialog />);

    const trigger = screen.getByText("Forgot password?");
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText("Reset Password")).toBeInTheDocument();
    });
  });

  it("shows error toast when request fails", async () => {
    mockRequestPasswordReset.mockResolvedValueOnce({
      error: { message: "User not found" },
    });

    render(<ForgotPasswordDialog />);

    fireEvent.click(screen.getByText("Forgot password?"));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("name@example.com"),
      ).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });

    const submitButton = screen.getByText("Send reset link");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRequestPasswordReset).toHaveBeenCalledWith({
        email: "test@example.com",
        redirectTo: "/reset-password",
      });
      expect(mockToastError).toHaveBeenCalledWith("User not found");
    });
  });

  it("shows success toast on success", async () => {
    mockRequestPasswordReset.mockResolvedValueOnce({ error: null });

    render(<ForgotPasswordDialog />);

    fireEvent.click(screen.getByText("Forgot password?"));

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText("name@example.com"),
      ).toBeInTheDocument();
    });

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "success@example.com" } });

    const submitButton = screen.getByText("Send reset link");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Password reset email sent! Check your inbox.",
      );
    });
  });
});
