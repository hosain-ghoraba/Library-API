import express from "express";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  borrowBookSchema,
  returnBookSchema,
  borrowingResponseSchema,
  overdueBooksResponseSchema,
} from "../schemas/borrowingSchema.js";
import {
  borrowBook,
  returnBook,
  listOverdueBooks,
} from "../controllers/borrowingController.js";

const router = express.Router();

// -----------------------------------------
registry.registerPath({
  method: "post",
  path: "/borrowings",
  tags: ["Borrowings"],
  summary: "Borrow a book",
  description:
    "Creates a borrowing record for a borrower and a book. At least one copy of the book must be available",
  request: {
    body: {
      content: {
        "application/json": {
          schema: borrowBookSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Book borrowed successfully",
      content: {
        "application/json": {
          schema: borrowingResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error (invalid or missing fields)",
    },
    404: {
      description: "Borrower or book not found",
    },
    409: {
      description: "No copies of the book available to borrow",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.post("/", validate(borrowBookSchema), borrowBook);

// -----------------------------------------
registry.registerPath({
  method: "get",
  path: "/borrowings/overdue",
  tags: ["Borrowings"],
  summary: "List overdue books",
  description:
    "Returns each book that has at least one copy overdue (not returned and past due date), with book id, name, and number of overdue copies.",
  responses: {
    200: {
      description: "List of overdue books with counts",
      content: {
        "application/json": {
          schema: overdueBooksResponseSchema,
        },
      },
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.get("/overdue", listOverdueBooks);

// -----------------------------------------
registry.registerPath({
  method: "post",
  path: "/borrowings/return",
  tags: ["Borrowings"],
  summary: "Return a book",
  description:
    "Marks a borrowing record as returned for the given borrower and book. The book's available quantity is incremented.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: returnBookSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Book returned successfully",
      content: {
        "application/json": {
          schema: borrowingResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error (invalid or missing fields)",
    },
    404: {
      description: "No (unreturned) borrowing found for the borrower and book",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.post("/return", validate(returnBookSchema), returnBook);
// -----------------------------------------
export default router;
