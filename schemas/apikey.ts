import z from "zod";

export const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type ApiKeyInput = z.infer<typeof apiKeySchema>;
