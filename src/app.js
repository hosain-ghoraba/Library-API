import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler.js";
import validate from "./middlewares/validateRequest.js";
import { testApiSchema } from "./schemas/testSchema.js";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/test", validate(testApiSchema), (req, res) => {
  res.status(200).json({ message: "Validation passed", data: req.body });
});

app.use(errorHandler);
export default app;
