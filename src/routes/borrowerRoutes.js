import express from "express";
import { z } from "zod";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  registerBorrowerSchema,
  updateBorrowerSchema,
  deleteBorrowerSchema,
  borrowerResponseSchema,
} from "../schemas/borrowerSchema.js";
import {
  listBorrowers,
  registerBorrower,
  updateBorrower,
  deleteBorrower,
} from "../controllers/borrowerController.js";

const router = express.Router();

// -----------------------------------------
registry.registerPath({
  method: "get",
  path: "/api/borrowers",
  tags: ["Borrowers"],
  summary: "List all borrowers",
  description:
    "Returns all borrowers. No pagination or search. Ordered by ID ascending.",
  responses: {
    200: {
      description: "List of all borrowers",
      content: {
        "application/json": {
          schema: z.array(borrowerResponseSchema).openapi("BorrowerList"),
        },
      },
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.get("/", listBorrowers);
// -----------------------------------------
registry.registerPath({
  method: "post",
  path: "/api/borrowers",
  tags: ["Borrowers"],
  summary: "Register a borrower",
  description:
    "Creates a new borrower with name, email, and password. Email must be unique. Password is stored hashed.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: registerBorrowerSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Borrower registered successfully",
      content: {
        "application/json": {
          schema: borrowerResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error (invalid or missing fields)",
    },
    409: {
      description: "Conflict - email already registered",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.post("/", validate(registerBorrowerSchema), registerBorrower);
// -----------------------------------------
registry.registerPath({
  method: "patch",
  path: "/api/borrowers/{id}",
  tags: ["Borrowers"],
  summary: "Update borrower's details",
  description:
    "Updates an existing borrower by ID. Provide any subset of name and email. Email must remain unique. Password is not updatable via this endpoint.",
  request: {
    params: updateBorrowerSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: updateBorrowerSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Borrower updated successfully",
      content: {
        "application/json": {
          schema: borrowerResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error (invalid or missing fields)",
    },
    404: {
      description: "Borrower not found",
    },
    409: {
      description: "Conflict - email already registered",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.patch("/:id", validate(updateBorrowerSchema), updateBorrower);
// -----------------------------------------
registry.registerPath({
  method: "delete",
  path: "/api/borrowers/{id}",
  tags: ["Borrowers"],
  summary: "Delete a borrower",
  description:
    "Deletes a borrower by ID. Associated borrowing records are removed (cascade).",
  request: {
    params: deleteBorrowerSchema.shape.params,
  },
  responses: {
    204: {
      description: "Borrower deleted successfully",
    },
    400: {
      description: "Validation error (invalid id format)",
    },
    404: {
      description: "Borrower not found",
    },
    500: {
      description: "Internal server error",
    },
  },
});
router.delete("/:id", validate(deleteBorrowerSchema), deleteBorrower);
// -----------------------------------------
export default router;
