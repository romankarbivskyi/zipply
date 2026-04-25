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
  tags: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .default("")
    .transform((val) => {
      if (Array.isArray(val)) return val;
      return val
        ? val
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];
    })
    .refine(
      (tags) => tags.every((t) => t.length > 0 && t.length <= 20),
      "Each tag must be between 1 and 20 characters",
    )
    .refine(
      (tags) => new Set(tags).size === tags.length,
      "Duplicate tags are not allowed",
    )
    .refine((tags) => tags.length <= 10, "You can add up to 10 tags"),
});

export type CreateLinkSchema = z.infer<typeof createLinkSchema>;
export type CreateLinkInput = z.input<typeof createLinkSchema>;
