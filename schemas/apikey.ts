import z from "zod";

export const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(60, "Name must be at most 60 characters long"),
});

export type ApiKeyInput = z.infer<typeof apiKeySchema>;
