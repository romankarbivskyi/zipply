import z from "zod";

export const getAuthSchema = (type: "sign-in" | "sign-up") =>
  z
    .object({
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword:
        type === "sign-up"
          ? z.string().min(8, "Password must be at least 8 characters long")
          : z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
