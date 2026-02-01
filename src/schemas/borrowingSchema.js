import { z } from "zod";
import { inputIdSchema } from "./inputIdSchema.js";

const openApi = {
  bookName: {
    example: "The Great Gatsby",
    description: "Title of the borrowed book",
  },
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
  overdueCount: {
    example: 2,
    description: "Number of copies currently overdue",
  },
};

const borrowOrReturnBodySchema = z
  .object({
    borrowerId: inputIdSchema.openapi(openApi.borrowerId),
    bookId: inputIdSchema.openapi(openApi.bookId),
  })
  .openapi("BorrowOrReturnBookRequest");

export const borrowBookSchema = z.object({
  body: borrowOrReturnBodySchema,
});

export const returnBookSchema = z.object({
  body: borrowOrReturnBodySchema,
});

export const getBorrowingsByBorrowerSchema = z.object({
  params: z.object({
    borrowerId: inputIdSchema.openapi(openApi.borrowerId),
  }),
});

export const currentBorrowingItemSchema = z
  .object({
    bookName: z.string().openapi(openApi.bookName),
    borrowedAt: z.string().datetime().openapi(openApi.borrowedAt),
    dueDate: z.string().datetime().openapi(openApi.dueDate),
  })
  .openapi("CurrentBorrowingItem");

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

const overdueBookItemSchema = z
  .object({
    bookId: z.number().int().openapi(openApi.bookId),
    bookName: z.string().openapi(openApi.bookName),
    overdueCount: z.number().int().openapi(openApi.overdueCount),
  })
  .openapi("OverdueBookItem");

export const overdueBooksResponseSchema = z
  .array(overdueBookItemSchema)
  .openapi("OverdueBooksList");
