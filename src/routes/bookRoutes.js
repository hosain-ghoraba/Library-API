import express from "express";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  addBookSchema,
  addBookBodySchema,
  addBookSuccessSchema,
} from "../schemas/bookSchema.js";
import { addBook } from "../controllers/bookController.js";

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
          schema: addBookBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Book added successfully",
      content: {
        "application/json": {
          schema: addBookSuccessSchema,
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
// --------------------------------

const router = express.Router();

router.post("/", validate(addBookSchema), addBook);

export default router;
