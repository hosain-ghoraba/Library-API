import express from "express";
import bookRoutes from "./bookRoutes.js";
import borrowerRoutes from "./borrowerRoutes.js";
import borrowingRoutes from "./borrowingRoutes.js";

const router = express.Router();

router.use("/books", bookRoutes);
router.use("/borrowers", borrowerRoutes);
router.use("/borrowings", borrowingRoutes);

export default router;
