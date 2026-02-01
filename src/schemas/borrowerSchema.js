import { z } from "zod";

const openApi = {
  name: { example: "Jane Doe", description: "Borrower full name" },
  email: {
    example: "jane@example.com",
    description: "Borrower email (unique)",
  },
  password: {
    example: "securePassword123",
    description: "Password (min 8 characters)",
  },
  id: { example: 1, description: "Borrower ID" },
  registeredDate: {
    example: "2026-02-01T12:00:00.000Z",
    description: "Registration date",
  },
  updatedAt: {
    example: "2026-02-01T12:00:00.000Z",
    description: "Last updated",
  },
};

export const registerBorrowerSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).openapi(openApi.name),
      email: z.string().trim().email().openapi(openApi.email),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .openapi(openApi.password),
    })
    .openapi("RegisterBorrowerRequest"),
});

export const borrowerResponseSchema = z
  .object({
    id: z.number().int().openapi(openApi.id),
    name: z.string().openapi(openApi.name),
    email: z.string().openapi(openApi.email),
    registeredDate: z.string().datetime().openapi(openApi.registeredDate),
    updatedAt: z.string().datetime().openapi(openApi.updatedAt),
  })
  .openapi("Borrower");
