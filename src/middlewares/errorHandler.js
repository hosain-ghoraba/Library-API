import { ZodError } from "zod";
import UniqueConstraintError from "../errors/uniqueConstraintError.js";
import EntityNotFoundError from "../errors/entityNotFoundError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: err.issues,
    });
  }
  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      message: err.message,
    });
  }
  if (err instanceof EntityNotFoundError) {
    return res.status(404).json({
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
