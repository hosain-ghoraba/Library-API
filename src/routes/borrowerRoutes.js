import express from "express";
import validate from "../middlewares/validateRequest.js";
import { registry } from "../config/openapi.js";
import {
  registerBorrowerSchema,
  borrowerResponseSchema,
} from "../schemas/borrowerSchema.js";
import { registerBorrower } from "../controllers/borrowerController.js";

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
export default router;
