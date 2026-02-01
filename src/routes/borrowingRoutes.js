import express from "express";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  borrowBookSchema,
  borrowingResponseSchema,
} from "../schemas/borrowingSchema.js";
import { borrowBook } from "../controllers/borrowingController.js";

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
export default router;
