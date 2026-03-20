import z from "zod";

export const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  shortCode: z
    .string()
    .min(3, "Short code must be at least 3 characters")
    .max(20, "Short code must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, hyphens, and underscores",
    )
    .optional()
    .or(z.literal("")),
});

export type CreateLinkSchema = z.infer<typeof createLinkSchema>;
