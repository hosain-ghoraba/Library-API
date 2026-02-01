import { z } from "zod";

export const inputIdSchema = z.coerce
  .number()
  .int()
  .positive()
  .openapi({ example: 1, description: "Resource ID" });
