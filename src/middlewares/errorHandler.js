import { ZodError } from "zod";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: err.issues,
    });
  }

  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
};

export default errorHandler;
