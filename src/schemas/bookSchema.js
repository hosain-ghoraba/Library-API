import { z } from "zod";

const openApi = {
  title: { example: "The Great Gatsby", description: "Book title" },
  author: { example: "F. Scott Fitzgerald", description: "Author name" },
  isbn: { example: "978-0-7432-7356-5", description: "ISBN" },
  baseQuantity: { example: 5, description: "Total copies" },
  shelfLocation: { example: "A-101", description: "Shelf location" },
  id: { example: 1, description: "Book ID" },
  availableQuantity: { example: 5, description: "Copies available" },
  createdAt: { example: "2026-01-31T12:00:00.000Z", description: "Created at" },
  updatedAt: { example: "2026-01-31T12:00:00.000Z", description: "Updated at" },
  messageAdded: { example: "Book added successfully" },
};

export const addBookBodySchema = z
  .object({
    title: z.string().trim().min(1).openapi(openApi.title),
    author: z.string().trim().min(1).openapi(openApi.author),
    isbn: z.string().trim().min(1).openapi(openApi.isbn),
    baseQuantity: z.number().int().min(0).openapi(openApi.baseQuantity),
    shelfLocation: z.string().trim().min(1).openapi(openApi.shelfLocation),
  })
  .openapi("AddBookRequest");

export const addBookSchema = z.object({
  body: addBookBodySchema,
});

export const bookResponseSchema = z
  .object({
    id: z.number().int().openapi(openApi.id),
    title: z.string().openapi(openApi.title),
    author: z.string().openapi(openApi.author),
    isbn: z.string().openapi(openApi.isbn),
    baseQuantity: z.number().int().openapi(openApi.baseQuantity),
    availableQuantity: z.number().int().openapi(openApi.availableQuantity),
    shelfLocation: z.string().openapi(openApi.shelfLocation),
    createdAt: z.string().datetime().openapi(openApi.createdAt),
    updatedAt: z.string().datetime().openapi(openApi.updatedAt),
  })
  .openapi("Book");

export const addBookSuccessSchema = z
  .object({
    message: z.string().openapi(openApi.messageAdded),
    data: bookResponseSchema,
  })
  .openapi("AddBookSuccess");
