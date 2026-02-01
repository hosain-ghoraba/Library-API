import { z } from "zod";
import { inputIdSchema } from "./inputIdSchema.js";

const openApi = {
  borrowerId: { example: 1, description: "Borrower ID" },
  bookId: { example: 1, description: "Book ID" },
  id: { example: 1, description: "Borrowing record ID" },
  borrowedAt: {
    example: "2026-02-01T12:00:00.000Z",
    description: "When the book was borrowed",
  },
  dueDate: {
    example: "2026-02-15T12:00:00.000Z",
    description: "When the book should be returned",
  },
  returnedAt: {
    example: null,
    description: "When the book was returned (null if not yet returned)",
  },
};

export const borrowBookSchema = z.object({
  body: z
    .object({
      borrowerId: inputIdSchema.openapi(openApi.borrowerId),
      bookId: inputIdSchema.openapi(openApi.bookId),
    })
    .openapi("BorrowBookRequest"),
});

export const borrowingResponseSchema = z
  .object({
    id: z.number().int().openapi(openApi.id),
    borrowerId: z.number().int().openapi(openApi.borrowerId),
    bookId: z.number().int().openapi(openApi.bookId),
    borrowedAt: z.string().datetime().openapi(openApi.borrowedAt),
    dueDate: z.string().datetime().openapi(openApi.dueDate),
    returnedAt: z.string().datetime().nullable().openapi(openApi.returnedAt),
  })
  .openapi("Borrowing");
