import { ZodError } from "zod";
import UniqueConstraintException from "../../errors/uniqueConstraintError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: err.issues,
    });
  }
  if (err instanceof UniqueConstraintException) {
    return res.status(409).json({
      message: err.message,
    });
  }

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
