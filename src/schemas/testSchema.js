import { z } from "zod";

export const testApiSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    count: z.number().int().positive("Count must be a positive integer"),
  }),
});
