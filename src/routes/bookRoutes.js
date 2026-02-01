import express from "express";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  addBookSchema,
  bookResponseSchema,
  deleteBookSchema,
  updateBookSchema,
} from "../schemas/bookSchema.js";
import {
  addBook,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";

const router = express.Router();

registry.registerPath({
  method: "post",
  path: "/api/books",
  tags: ["Books"],
  summary: "Add a new book",
  description:
    "Creates a new book with title, author, ISBN, base quantity, and shelf location. ISBN and shelf location must not exist in the database for other books before making this request",
  request: {
    body: {
      content: {
        "application/json": {
          schema: addBookSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Book added successfully",
      content: {
        "application/json": {
          schema: bookResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error (invalid or missing fields)",
    },
    409: {
      description: "Conflict - ISBN or shelf location already exists",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.post("/", validate(addBookSchema), addBook);
// -----------------------------------------
registry.registerPath({
  method: "patch",
  path: "/api/books/{id}",
  tags: ["Books"],
  summary: "Update a book",
  description:
    "Updates an existing book by ID. Provide any subset of title, author, ISBN, base quantity, and shelf location. ISBN and shelf location must not exist for other books. Base quantity cannot be set below the number of copies currently borrowed.",
  request: {
    params: updateBookSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updateBookSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Book updated successfully",
      content: {
        "application/json": {
          schema: bookResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error (invalid or missing fields)",
    },
    404: {
      description: "Book not found",
    },
    409: {
      description:
        "Conflict - ISBN or shelf location already exists, or base quantity less than the number of copies currently borrowed",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.patch("/:id", validate(updateBookSchema), updateBook);
// -----------------------------------------
registry.registerPath({
  method: "delete",
  path: "/api/books/{id}",
  tags: ["Books"],
  summary: "Delete a book",
  request: {
    params: deleteBookSchema.shape.params,
  },
  responses: {
    204: {
      description: "Book deleted successfully",
    },
    400: {
      description: "Validation error (invalid parameter)",
    },
    404: {
      description: "Book not found",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.delete("/:id", validate(deleteBookSchema), deleteBook);
// -----------------------------------------
export default router;
