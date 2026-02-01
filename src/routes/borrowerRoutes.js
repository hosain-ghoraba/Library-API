import express from "express";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  registerBorrowerSchema,
  updateBorrowerSchema,
  borrowerResponseSchema,
} from "../schemas/borrowerSchema.js";
import {
  registerBorrower,
  updateBorrower,
} from "../controllers/borrowerController.js";

const router = express.Router();

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
export default router;
