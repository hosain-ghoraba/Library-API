import express from "express";
import validate from "../middlewares/validateRequest.js";
import { testApiSchema } from "../schemas/testSchema.js";
import bookRoutes from "./bookRoutes.js";
import borrowerRoutes from "./borrowerRoutes.js";
import borrowingRoutes from "./borrowingRoutes.js";

const router = express.Router();

router.use("/books", bookRoutes);
router.use("/borrowers", borrowerRoutes);
router.use("/borrowings", borrowingRoutes);

router.post("/test", validate(testApiSchema), (req, res) => {
  res.status(200).json({ message: "Validation passed", data: req.body });
});

export default router;
